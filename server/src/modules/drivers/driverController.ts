import { Request, Response } from 'express';
import { execute, query, queryOne } from '../../database/db.js';
import { AuthenticatedRequest } from '../../middleware/auth.js';

export async function listAvailableDrivers(req: Request, res: Response) {
  try {
    const { serviceArea } = req.query;

    let sql = `
      SELECT u.id, u.name, u.email, u.phone,
             dp.experience_years, dp.service_area, dp.approval_status, dp.availability,
             dp.rating_avg, dp.rating_count, dp.hourly_rate_paise, dp.bio
      FROM users u
      JOIN driver_profiles dp ON u.id = dp.user_id
      WHERE u.role = 'DRIVER' 
        AND u.account_status = 'ACTIVE'
        AND dp.approval_status = 'APPROVED'
        AND dp.availability = 'ONLINE'
    `;
    const params: any[] = [];

    if (serviceArea && typeof serviceArea === 'string' && serviceArea.trim() !== '') {
      sql += ' AND (dp.service_area LIKE ? OR dp.service_area = "Metropolitan Core")';
      params.push(`%${serviceArea.trim()}%`);
    }

    sql += ' ORDER BY dp.rating_avg DESC, dp.experience_years DESC';

    const drivers = await query(sql, params);
    res.json({ drivers });
  } catch (err: any) {
    console.error('List available drivers error:', err);
    res.status(500).json({ error: 'Failed to retrieve available drivers.' });
  }
}

export async function getDriverProfile(req: Request, res: Response) {
  try {
    const driverId = Number(req.params.id);

    const driver = await queryOne<any>(
      `SELECT u.id, u.name,
              dp.experience_years, dp.service_area, dp.approval_status, dp.availability,
              dp.rating_avg, dp.rating_count, dp.hourly_rate_paise, dp.bio
       FROM users u
       JOIN driver_profiles dp ON u.id = dp.user_id
       WHERE u.id = ? AND u.role = 'DRIVER'`,
      [driverId]
    );

    if (!driver) {
      return res.status(404).json({ error: 'Driver profile not found.' });
    }

    const reviews = await query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.name as customer_name
       FROM reviews r
       JOIN users u ON r.customer_id = u.id
       WHERE r.driver_id = ?
       ORDER BY r.id DESC LIMIT 10`,
      [driverId]
    );

    res.json({ driver, reviews });
  } catch (err: any) {
    console.error('Get driver profile error:', err);
    res.status(500).json({ error: 'Failed to retrieve driver profile.' });
  }
}

export async function getMyStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const driverId = req.user!.id;
    const profile = await queryOne<any>(
      `SELECT dp.*, u.name, u.email, u.phone
       FROM driver_profiles dp
       JOIN users u ON dp.user_id = u.id
       WHERE dp.user_id = ?`,
      [driverId]
    );

    const documents = await query(
      'SELECT id, document_type, file_path, review_status, rejection_reason, created_at FROM driver_documents WHERE driver_id = ?',
      [driverId]
    );

    res.json({ profile, documents });
  } catch (err: any) {
    console.error('Get driver status error:', err);
    res.status(500).json({ error: 'Failed to retrieve driver status.' });
  }
}

export async function updateAvailability(req: AuthenticatedRequest, res: Response) {
  try {
    const driverId = req.user!.id;
    const { availability } = req.body; // 'ONLINE' | 'OFFLINE'

    const profile = await queryOne<any>('SELECT approval_status FROM driver_profiles WHERE user_id = ?', [driverId]);
    if (!profile) {
      return res.status(404).json({ error: 'Driver profile not found.' });
    }

    // Rule: DRV-04 Only approved drivers can set availability to ONLINE
    if (availability === 'ONLINE' && profile.approval_status !== 'APPROVED') {
      return res.status(403).json({
        error: `Cannot go ONLINE. Your account status is ${profile.approval_status}. Only APPROVED drivers can accept bookings.`
      });
    }

    const validStates = ['ONLINE', 'OFFLINE'];
    if (!validStates.includes(availability)) {
      return res.status(400).json({ error: 'Invalid availability status. Must be ONLINE or OFFLINE.' });
    }

    await execute('UPDATE driver_profiles SET availability = ? WHERE user_id = ?', [availability, driverId]);

    res.json({ message: `Availability status updated to ${availability}`, availability });
  } catch (err: any) {
    console.error('Update availability error:', err);
    res.status(500).json({ error: 'Failed to update availability.' });
  }
}

export async function uploadDocument(req: AuthenticatedRequest, res: Response) {
  try {
    const driverId = req.user!.id;
    const { documentType, filePath, expiryDate } = req.body;

    if (!documentType || !filePath) {
      return res.status(400).json({ error: 'documentType and filePath are required.' });
    }

    const result = await execute(
      `INSERT INTO driver_documents (driver_id, document_type, file_path, review_status, expiry_date)
       VALUES (?, ?, ?, 'PENDING', ?)`,
      [driverId, documentType.toUpperCase(), filePath, expiryDate || null]
    );

    // Update driver profile state to UNDER_REVIEW
    await execute("UPDATE driver_profiles SET approval_status = 'UNDER_REVIEW' WHERE user_id = ? AND approval_status = 'PENDING'", [driverId]);

    res.status(201).json({
      message: 'Document uploaded successfully. Verification is pending admin review.',
      documentId: result.insertId
    });
  } catch (err: any) {
    console.error('Upload document error:', err);
    res.status(500).json({ error: 'Failed to upload document.' });
  }
}

export async function getDriverEarnings(req: AuthenticatedRequest, res: Response) {
  try {
    const driverId = req.user!.id;

    const stats = await queryOne<any>(
      `SELECT COUNT(id) as total_trips,
              COALESCE(SUM(driver_payout_paise), 0) as total_earnings_paise,
              COALESCE(SUM(platform_fee_paise), 0) as total_platform_fee_paise
       FROM bookings
       WHERE driver_id = ? AND status = 'COMPLETED'`,
      [driverId]
    );

    const completedBookings = await query(
      `SELECT b.id, b.reference_code, b.trip_type, b.start_time, b.duration_hours,
              b.final_fare_paise, b.driver_payout_paise, b.platform_fee_paise,
              v.make, v.model, v.registration_number, u.name as customer_name
       FROM bookings b
       JOIN vehicles v ON b.vehicle_id = v.id
       JOIN users u ON b.customer_id = u.id
       WHERE b.driver_id = ? AND b.status = 'COMPLETED'
       ORDER BY b.id DESC LIMIT 20`,
      [driverId]
    );

    res.json({ stats, completedBookings });
  } catch (err: any) {
    console.error('Get earnings error:', err);
    res.status(500).json({ error: 'Failed to retrieve earnings.' });
  }
}

export async function getIncomingRequests(req: AuthenticatedRequest, res: Response) {
  try {
    const driverId = req.user!.id;

    // Retrieve bookings dispatched to this driver or pending open requests
    const requests = await query(
      `SELECT b.*, v.make, v.model, v.year, v.registration_number, v.transmission, v.fuel_type,
              u.name as customer_name, u.phone as customer_phone
       FROM bookings b
       JOIN vehicles v ON b.vehicle_id = v.id
       JOIN users u ON b.customer_id = u.id
       WHERE (b.driver_id = ? OR b.driver_id IS NULL)
         AND b.status = 'REQUESTED'
       ORDER BY b.id DESC`,
      [driverId]
    );

    res.json({ requests });
  } catch (err: any) {
    console.error('Get incoming requests error:', err);
    res.status(500).json({ error: 'Failed to retrieve requests.' });
  }
}

