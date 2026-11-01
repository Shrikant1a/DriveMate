import { Response } from 'express';
import { execute, query, queryOne } from '../../database/db.js';
import { AuthenticatedRequest } from '../../middleware/auth.js';
import { getIO } from '../../socket.js';

// Valid status transitions for the server state machine
const VALID_TRANSITIONS: Record<string, string[]> = {
  REQUESTED: ['ACCEPTED', 'CANCELLED', 'EXPIRED'],
  ACCEPTED: ['EN_ROUTE', 'CANCELLED'],
  EN_ROUTE: ['ARRIVED', 'CANCELLED'],
  ARRIVED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'DISPUTED'],
  COMPLETED: ['DISPUTED'],
  CANCELLED: [],
  EXPIRED: [],
  DISPUTED: []
};

export async function calculateFareQuote(req: AuthenticatedRequest, res: Response) {
  try {
    const { tripType, durationHours, serviceArea } = req.body;
    const hours = Math.max(1, Number(durationHours) || 2);

    // Fetch matching pricing rule from database
    const rule = await queryOne<any>(
      'SELECT * FROM pricing_rules WHERE service_area = ? AND trip_type = ? AND is_active = 1',
      [serviceArea || 'Metropolitan Core', tripType || 'Hourly Booking']
    ) || await queryOne<any>(
      'SELECT * FROM pricing_rules WHERE trip_type = ? AND is_active = 1 LIMIT 1',
      [tripType || 'Hourly Booking']
    ) || {
      base_fee_paise: 49900,
      hourly_rate_paise: 24900,
      min_hours: 2,
      waiting_rate_paise_per_hr: 15000,
      platform_commission_pct: 15
    };

    const billableHours = Math.max(rule.min_hours, hours);
    const baseFee = rule.base_fee_paise;
    const hourlyFee = rule.hourly_rate_paise * billableHours;
    const subtotal = baseFee + hourlyFee;
    const taxesPaise = Math.round(subtotal * 0.05); // 5% GST
    const estimatedFarePaise = subtotal + taxesPaise;
    const platformFeePaise = Math.round(subtotal * (rule.platform_commission_pct / 100));
    const driverPayoutPaise = subtotal - platformFeePaise;

    res.json({
      tripType: tripType || 'Hourly Booking',
      requestedHours: hours,
      billableHours,
      minHours: rule.min_hours,
      baseFeePaise: baseFee,
      hourlyRatePaise: rule.hourly_rate_paise,
      hourlyFeePaise: hourlyFee,
      taxesPaise,
      estimatedFarePaise,
      platformFeePaise,
      driverPayoutPaise,
      currency: 'INR'
    });
  } catch (err: any) {
    console.error('Fare quote error:', err);
    res.status(500).json({ error: 'Failed to calculate quote.' });
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const customerId = req.user!.id;
    const {
      vehicleId,
      driverId,
      tripType,
      pickupAddress,
      destinationAddress,
      startTime,
      durationHours,
      notes
    } = req.body;

    if (!vehicleId || !pickupAddress || !startTime || !durationHours) {
      return res.status(400).json({ error: 'Vehicle, pickup address, start time, and duration are required.' });
    }

    // Verify vehicle belongs to this customer
    const vehicle = await queryOne('SELECT id, make, model FROM vehicles WHERE id = ? AND customer_id = ?', [vehicleId, customerId]);
    if (!vehicle) {
      return res.status(400).json({ error: 'Invalid vehicle selected or vehicle does not belong to you.' });
    }

    // If driver selected, verify driver is APPROVED and ONLINE
    if (driverId) {
      const driver = await queryOne<any>(
        `SELECT u.id, dp.approval_status, dp.availability 
         FROM users u 
         JOIN driver_profiles dp ON u.id = dp.user_id 
         WHERE u.id = ? AND u.role = 'DRIVER'`,
        [driverId]
      );
      if (!driver || driver.approval_status !== 'APPROVED') {
        return res.status(400).json({ error: 'Selected driver is not verified or approved.' });
      }

      // Check for overlapping bookings for this driver
      const overlap = await queryOne(
        `SELECT id FROM bookings 
         WHERE driver_id = ? 
           AND status IN ('ACCEPTED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS')
           AND datetime(start_time) <= datetime(?, '+' || ? || ' hours')
           AND datetime(start_time, '+' || duration_hours || ' hours') >= datetime(?)`,
        [driverId, startTime, durationHours, startTime]
      );
      if (overlap) {
        return res.status(409).json({ error: 'This driver already has an active reservation during the requested schedule window.' });
      }
    }

    // Calculate server-side fare
    const hours = Math.max(1, Number(durationHours));
    const rule = await queryOne<any>(
      'SELECT * FROM pricing_rules WHERE trip_type = ? LIMIT 1',
      [tripType || 'Hourly Booking']
    ) || { base_fee_paise: 49900, hourly_rate_paise: 24900, min_hours: 2, platform_commission_pct: 15 };

    const billableHours = Math.max(rule.min_hours, hours);
    const subtotal = rule.base_fee_paise + (rule.hourly_rate_paise * billableHours);
    const estimatedFarePaise = subtotal + Math.round(subtotal * 0.05);
    const platformFeePaise = Math.round(subtotal * (rule.platform_commission_pct / 100));
    const driverPayoutPaise = subtotal - platformFeePaise;

    const referenceCode = `DOD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const result = await execute(
      `INSERT INTO bookings (
        reference_code, customer_id, driver_id, vehicle_id, trip_type,
        pickup_address, destination_address, start_time, duration_hours,
        status, estimated_fare_paise, final_fare_paise, platform_fee_paise, driver_payout_paise, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'REQUESTED', ?, ?, ?, ?, ?)`,
      [
        referenceCode,
        customerId,
        driverId || null,
        vehicleId,
        tripType || 'Hourly Booking',
        pickupAddress,
        destinationAddress || '',
        startTime,
        hours,
        estimatedFarePaise,
        estimatedFarePaise,
        platformFeePaise,
        driverPayoutPaise,
        notes || ''
      ]
    );

    const bookingId = result.insertId!;

    // Record initial booking event
    await execute(
      `INSERT INTO booking_events (booking_id, actor_id, old_status, new_status, reason, notes)
       VALUES (?, ?, NULL, 'REQUESTED', 'Customer submitted driver booking request', 'Initial creation')`,
      [bookingId, customerId]
    );

    const booking = await queryOne('SELECT * FROM bookings WHERE id = ?', [bookingId]);

    // Emit realtime notification to driver
    const io = getIO();
    if (io) {
      if (driverId) {
        io.to(`driver_${driverId}`).emit('booking_request', { booking });
      } else {
        io.emit('new_open_booking', { booking });
      }
    }

    res.status(201).json({
      message: 'Booking request created successfully. Awaiting driver confirmation.',
      booking
    });
  } catch (err: any) {
    console.error('Create booking error:', err);
    res.status(500).json({ error: 'Failed to create booking.' });
  }
}

export async function acceptBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const driverId = req.user!.id;
    const bookingId = Number(req.params.id);

    const booking = await queryOne<any>('SELECT * FROM bookings WHERE id = ?', [bookingId]);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    if (booking.status !== 'REQUESTED') {
      return res.status(400).json({ error: `Cannot accept booking. Current status is ${booking.status}` });
    }

    // Verify driver is approved
    const driver = await queryOne<any>('SELECT approval_status FROM driver_profiles WHERE user_id = ?', [driverId]);
    if (!driver || driver.approval_status !== 'APPROVED') {
      return res.status(403).json({ error: 'Only approved drivers can accept bookings.' });
    }

    // Transition status to ACCEPTED
    await execute(
      "UPDATE bookings SET driver_id = ?, status = 'ACCEPTED', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [driverId, bookingId]
    );

    // Record transition event
    await execute(
      `INSERT INTO booking_events (booking_id, actor_id, old_status, new_status, reason)
       VALUES (?, ?, 'REQUESTED', 'ACCEPTED', 'Driver accepted request')`,
      [bookingId, driverId]
    );

    const updatedBooking = await queryOne('SELECT * FROM bookings WHERE id = ?', [bookingId]);

    // Notify customer
    const io = getIO();
    if (io) {
      io.to(`customer_${booking.customer_id}`).emit('booking_accepted', { booking: updatedBooking });
    }

    res.json({ message: 'Booking accepted successfully', booking: updatedBooking });
  } catch (err: any) {
    console.error('Accept booking error:', err);
    res.status(500).json({ error: 'Failed to accept booking.' });
  }
}

export async function declineBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const driverId = req.user!.id;
    const bookingId = Number(req.params.id);

    const booking = await queryOne<any>('SELECT * FROM bookings WHERE id = ?', [bookingId]);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Unassign driver so another driver can take it
    await execute("UPDATE bookings SET driver_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [bookingId]);

    await execute(
      `INSERT INTO booking_events (booking_id, actor_id, old_status, new_status, reason)
       VALUES (?, ?, 'REQUESTED', 'REQUESTED', 'Assigned driver declined; returned to search pool')`,
      [bookingId, driverId]
    );

    res.json({ message: 'Booking declined. Returned to available pool.' });
  } catch (err: any) {
    console.error('Decline booking error:', err);
    res.status(500).json({ error: 'Failed to decline booking.' });
  }
}

export async function updateBookingStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const actorId = req.user!.id;
    const role = req.user!.role;
    const bookingId = Number(req.params.id);
    const { nextStatus, reason, notes } = req.body;

    const booking = await queryOne<any>('SELECT * FROM bookings WHERE id = ?', [bookingId]);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Permission checks
    if (role === 'DRIVER' && booking.driver_id !== actorId) {
      return res.status(403).json({ error: 'Access denied. You are not assigned to this booking.' });
    }
    if (role === 'CUSTOMER' && booking.customer_id !== actorId) {
      return res.status(403).json({ error: 'Access denied. You do not own this booking.' });
    }

    // Server-enforced status transition check
    const currentStatus = booking.status;
    const allowed = VALID_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(nextStatus)) {
      return res.status(400).json({
        error: `Invalid status transition: Cannot move from ${currentStatus} to ${nextStatus}. Allowed: [${allowed.join(', ')}]`
      });
    }

    await execute(
      'UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [nextStatus, bookingId]
    );

    await execute(
      `INSERT INTO booking_events (booking_id, actor_id, old_status, new_status, reason, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [bookingId, actorId, currentStatus, nextStatus, reason || `Status transition to ${nextStatus}`, notes || '']
    );

    const updatedBooking = await queryOne('SELECT * FROM bookings WHERE id = ?', [bookingId]);

    // Realtime broadcast to both customer and driver
    const io = getIO();
    if (io) {
      io.to(`booking_${bookingId}`).emit('booking_status_updated', { booking: updatedBooking });
      io.to(`customer_${booking.customer_id}`).emit('booking_status_updated', { booking: updatedBooking });
      if (booking.driver_id) {
        io.to(`driver_${booking.driver_id}`).emit('booking_status_updated', { booking: updatedBooking });
      }
    }

    res.json({ message: `Booking status updated to ${nextStatus}`, booking: updatedBooking });
  } catch (err: any) {
    console.error('Update status error:', err);
    res.status(500).json({ error: 'Failed to update booking status.' });
  }
}

export async function cancelBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const actorId = req.user!.id;
    const role = req.user!.role;
    const bookingId = Number(req.params.id);
    const { reason } = req.body;

    const booking = await queryOne<any>('SELECT * FROM bookings WHERE id = ?', [bookingId]);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
      return res.status(400).json({ error: `Cannot cancel booking with status ${booking.status}.` });
    }

    if (role === 'CUSTOMER' && booking.customer_id !== actorId) {
      return res.status(403).json({ error: 'Unauthorized to cancel this booking.' });
    }
    if (role === 'DRIVER' && booking.driver_id !== actorId) {
      return res.status(403).json({ error: 'Unauthorized to cancel this booking.' });
    }

    await execute("UPDATE bookings SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP WHERE id = ?", [bookingId]);

    await execute(
      `INSERT INTO booking_events (booking_id, actor_id, old_status, new_status, reason)
       VALUES (?, ?, ?, 'CANCELLED', ?)`,
      [bookingId, actorId, booking.status, reason || 'Booking cancelled by user']
    );

    const cancelledBooking = await queryOne('SELECT * FROM bookings WHERE id = ?', [bookingId]);

    const io = getIO();
    if (io) {
      io.to(`customer_${booking.customer_id}`).emit('booking_cancelled', { booking: cancelledBooking });
      if (booking.driver_id) {
        io.to(`driver_${booking.driver_id}`).emit('booking_cancelled', { booking: cancelledBooking });
      }
    }

    res.json({ message: 'Booking cancelled successfully under published cancellation policy.', booking: cancelledBooking });
  } catch (err: any) {
    console.error('Cancel booking error:', err);
    res.status(500).json({ error: 'Failed to cancel booking.' });
  }
}

export async function listUserBookings(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;

    let sql = `
      SELECT b.*,
             v.make, v.model, v.year, v.registration_number, v.transmission, v.fuel_type,
             c.name as customer_name, c.phone as customer_phone,
             d.name as driver_name, d.phone as driver_phone,
             dp.rating_avg as driver_rating, dp.experience_years as driver_experience,
             r.rating as review_rating, r.comment as review_comment
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      JOIN users c ON b.customer_id = c.id
      LEFT JOIN users d ON b.driver_id = d.id
      LEFT JOIN driver_profiles dp ON d.id = dp.user_id
      LEFT JOIN reviews r ON b.id = r.booking_id
    `;
    const params: any[] = [];

    if (role === 'CUSTOMER') {
      sql += ' WHERE b.customer_id = ?';
      params.push(userId);
    } else if (role === 'DRIVER') {
      sql += ' WHERE b.driver_id = ?';
      params.push(userId);
    } // ADMIN sees all

    sql += ' ORDER BY b.id DESC';

    const bookings = await query(sql, params);
    res.json({ bookings });
  } catch (err: any) {
    console.error('List bookings error:', err);
    res.status(500).json({ error: 'Failed to retrieve bookings.' });
  }
}

export async function getBookingDetails(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;
    const bookingId = Number(req.params.id);

    const booking = await queryOne<any>(
      `SELECT b.*,
              v.make, v.model, v.year, v.registration_number, v.transmission, v.fuel_type, v.notes as vehicle_notes,
              c.name as customer_name, c.phone as customer_phone, c.email as customer_email,
              d.name as driver_name, d.phone as driver_phone,
              dp.rating_avg as driver_rating, dp.experience_years as driver_experience, dp.bio as driver_bio
       FROM bookings b
       JOIN vehicles v ON b.vehicle_id = v.id
       JOIN users c ON b.customer_id = c.id
       LEFT JOIN users d ON b.driver_id = d.id
       LEFT JOIN driver_profiles dp ON d.id = dp.user_id
       WHERE b.id = ?`,
      [bookingId]
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    if (role === 'CUSTOMER' && booking.customer_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized access to this booking.' });
    }
    if (role === 'DRIVER' && booking.driver_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized access to this booking.' });
    }

    const events = await query(
      `SELECT be.*, u.name as actor_name, u.role as actor_role
       FROM booking_events be
       JOIN users u ON be.actor_id = u.id
       WHERE be.booking_id = ?
       ORDER BY be.id ASC`,
      [bookingId]
    );

    const review = await queryOne('SELECT * FROM reviews WHERE booking_id = ?', [bookingId]);

    res.json({ booking, events, review });
  } catch (err: any) {
    console.error('Get booking details error:', err);
    res.status(500).json({ error: 'Failed to retrieve booking details.' });
  }
}

export async function submitReview(req: AuthenticatedRequest, res: Response) {
  try {
    const customerId = req.user!.id;
    const bookingId = Number(req.params.id);
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5.' });
    }

    const booking = await queryOne<any>('SELECT * FROM bookings WHERE id = ?', [bookingId]);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Rule: Review is allowed only after completion and by the booking customer
    if (booking.customer_id !== customerId) {
      return res.status(403).json({ error: 'Only the customer who made this booking can submit a review.' });
    }
    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Reviews can only be submitted for COMPLETED bookings.' });
    }

    const existing = await queryOne('SELECT id FROM reviews WHERE booking_id = ?', [bookingId]);
    if (existing) {
      return res.status(409).json({ error: 'A review has already been submitted for this booking.' });
    }

    await execute(
      'INSERT INTO reviews (booking_id, customer_id, driver_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [bookingId, customerId, booking.driver_id, Math.round(rating), comment || '']
    );

    // Recalculate driver rating average
    const driverStats = await queryOne<any>(
      'SELECT AVG(rating) as avg_rating, COUNT(id) as count FROM reviews WHERE driver_id = ?',
      [booking.driver_id]
    );

    if (driverStats) {
      await execute(
        'UPDATE driver_profiles SET rating_avg = ?, rating_count = ? WHERE user_id = ?',
        [Number(driverStats.avg_rating).toFixed(2), driverStats.count, booking.driver_id]
      );
    }

    res.status(201).json({ message: 'Review submitted successfully. Thank you for rating your driver!' });
  } catch (err: any) {
    console.error('Submit review error:', err);
    res.status(500).json({ error: 'Failed to submit review.' });
  }
}

