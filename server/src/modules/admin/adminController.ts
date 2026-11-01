import { Response } from 'express';
import { execute, query, queryOne } from '../../database/db.js';
import { AuthenticatedRequest } from '../../middleware/auth.js';

export async function getAdminSummary(req: AuthenticatedRequest, res: Response) {
  try {
    const totalCustomers = await queryOne<any>("SELECT COUNT(id) as count FROM users WHERE role = 'CUSTOMER'");
    const totalDrivers = await queryOne<any>("SELECT COUNT(id) as count FROM users WHERE role = 'DRIVER'");
    const approvedDrivers = await queryOne<any>("SELECT COUNT(user_id) as count FROM driver_profiles WHERE approval_status = 'APPROVED'");
    const pendingDrivers = await queryOne<any>("SELECT COUNT(user_id) as count FROM driver_profiles WHERE approval_status IN ('PENDING', 'UNDER_REVIEW')");

    const totalBookings = await queryOne<any>("SELECT COUNT(id) as count FROM bookings");
    const activeBookings = await queryOne<any>("SELECT COUNT(id) as count FROM bookings WHERE status IN ('ACCEPTED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS')");
    const completedBookings = await queryOne<any>("SELECT COUNT(id) as count FROM bookings WHERE status = 'COMPLETED'");
    const cancelledBookings = await queryOne<any>("SELECT COUNT(id) as count FROM bookings WHERE status = 'CANCELLED'");

    const revenue = await queryOne<any>(
      `SELECT COALESCE(SUM(final_fare_paise), 0) as gross_booking_value,
              COALESCE(SUM(platform_fee_paise), 0) as total_commission,
              COALESCE(SUM(driver_payout_paise), 0) as total_driver_payouts
       FROM bookings WHERE status = 'COMPLETED'`
    );

    const openCases = await queryOne<any>("SELECT COUNT(id) as count FROM support_cases WHERE status != 'RESOLVED'");

    res.json({
      metrics: {
        totalCustomers: totalCustomers?.count || 0,
        totalDrivers: totalDrivers?.count || 0,
        approvedDrivers: approvedDrivers?.count || 0,
        pendingDrivers: pendingDrivers?.count || 0,
        totalBookings: totalBookings?.count || 0,
        activeBookings: activeBookings?.count || 0,
        completedBookings: completedBookings?.count || 0,
        cancelledBookings: cancelledBookings?.count || 0,
        grossBookingValuePaise: revenue?.gross_booking_value || 0,
        totalCommissionPaise: revenue?.total_commission || 0,
        totalDriverPayoutsPaise: revenue?.total_driver_payouts || 0,
        openCases: openCases?.count || 0,
      }
    });
  } catch (err: any) {
    console.error('Admin summary error:', err);
    res.status(500).json({ error: 'Failed to retrieve admin dashboard metrics.' });
  }
}

export async function listDriverApplications(req: AuthenticatedRequest, res: Response) {
  try {
    const { status } = req.query;
    let sql = `
      SELECT u.id, u.name, u.email, u.phone, u.account_status, u.created_at,
             dp.experience_years, dp.service_area, dp.approval_status, dp.availability,
             dp.rating_avg, dp.rating_count, dp.hourly_rate_paise, dp.bio
      FROM users u
      JOIN driver_profiles dp ON u.id = dp.user_id
      WHERE u.role = 'DRIVER'
    `;
    const params: any[] = [];

    if (status) {
      sql += ' AND dp.approval_status = ?';
      params.push(status);
    }

    sql += ' ORDER BY u.id DESC';

    const drivers = await query(sql, params);

    // Fetch documents for each driver
    const driverDocs = await query('SELECT * FROM driver_documents');
    const enriched = drivers.map((d: any) => ({
      ...d,
      documents: driverDocs.filter((doc: any) => doc.driver_id === d.id)
    }));

    res.json({ drivers: enriched });
  } catch (err: any) {
    console.error('List driver applications error:', err);
    res.status(500).json({ error: 'Failed to list driver applications.' });
  }
}

export async function reviewDriverDecision(req: AuthenticatedRequest, res: Response) {
  try {
    const adminId = req.user!.id;
    const driverId = Number(req.params.id);
    const { decision, reason } = req.body; // 'APPROVED' | 'REJECTED' | 'SUSPENDED'

    const validDecisions = ['APPROVED', 'REJECTED', 'SUSPENDED', 'UNDER_REVIEW'];
    if (!validDecisions.includes(decision)) {
      return res.status(400).json({ error: `Invalid decision. Must be one of: [${validDecisions.join(', ')}]` });
    }

    const driver = await queryOne('SELECT id, name FROM users WHERE id = ? AND role = "DRIVER"', [driverId]);
    if (!driver) {
      return res.status(404).json({ error: 'Driver account not found.' });
    }

    // Update driver approval status
    await execute(
      'UPDATE driver_profiles SET approval_status = ? WHERE user_id = ?',
      [decision, driverId]
    );

    // Update document review statuses
    const docStatus = decision === 'APPROVED' ? 'VERIFIED' : decision === 'REJECTED' ? 'REJECTED' : 'PENDING';
    await execute(
      'UPDATE driver_documents SET review_status = ?, reviewer_admin_id = ?, rejection_reason = ? WHERE driver_id = ?',
      [docStatus, adminId, reason || '', driverId]
    );

    // Record audit log
    await execute(
      `INSERT INTO audit_logs (actor_id, action, target_type, target_id, metadata)
       VALUES (?, ?, 'DRIVER', ?, ?)`,
      [adminId, `DRIVER_VERIFICATION_${decision}`, driverId, JSON.stringify({ reason: reason || 'Admin review' })]
    );

    res.json({ message: `Driver status successfully set to ${decision}`, driverId, decision });
  } catch (err: any) {
    console.error('Review driver decision error:', err);
    res.status(500).json({ error: 'Failed to apply driver verification decision.' });
  }
}

export async function listAllUsers(req: AuthenticatedRequest, res: Response) {
  try {
    const { role } = req.query;
    let sql = 'SELECT id, role, name, email, phone, account_status, created_at FROM users';
    const params: any[] = [];

    if (role) {
      sql += ' WHERE role = ?';
      params.push(role);
    }

    sql += ' ORDER BY id DESC';

    const users = await query(sql, params);
    res.json({ users });
  } catch (err: any) {
    console.error('List users error:', err);
    res.status(500).json({ error: 'Failed to list users.' });
  }
}

export async function updateUserAccountStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const adminId = req.user!.id;
    const targetUserId = Number(req.params.id);
    const { accountStatus, reason } = req.body; // 'ACTIVE' | 'SUSPENDED'

    if (!['ACTIVE', 'SUSPENDED'].includes(accountStatus)) {
      return res.status(400).json({ error: 'accountStatus must be ACTIVE or SUSPENDED.' });
    }

    await execute('UPDATE users SET account_status = ? WHERE id = ?', [accountStatus, targetUserId]);

    await execute(
      `INSERT INTO audit_logs (actor_id, action, target_type, target_id, metadata)
       VALUES (?, ?, 'USER', ?, ?)`,
      [adminId, `USER_STATUS_${accountStatus}`, targetUserId, JSON.stringify({ reason: reason || 'Admin action' })]
    );

    res.json({ message: `User status updated to ${accountStatus}`, userId: targetUserId, accountStatus });
  } catch (err: any) {
    console.error('Update user account status error:', err);
    res.status(500).json({ error: 'Failed to update account status.' });
  }
}

export async function listPricingRules(req: AuthenticatedRequest, res: Response) {
  try {
    const rules = await query('SELECT * FROM pricing_rules ORDER BY id ASC');
    res.json({ rules });
  } catch (err: any) {
    console.error('List pricing rules error:', err);
    res.status(500).json({ error: 'Failed to list pricing rules.' });
  }
}

export async function updatePricingRule(req: AuthenticatedRequest, res: Response) {
  try {
    const adminId = req.user!.id;
    const ruleId = Number(req.params.id);
    const { baseFeePaise, hourlyRatePaise, minHours, waitingRatePaisePerHr, platformCommissionPct } = req.body;

    await execute(
      `UPDATE pricing_rules 
       SET base_fee_paise = ?, hourly_rate_paise = ?, min_hours = ?, waiting_rate_paise_per_hr = ?, platform_commission_pct = ?
       WHERE id = ?`,
      [
        Number(baseFeePaise),
        Number(hourlyRatePaise),
        Number(minHours),
        Number(waitingRatePaisePerHr),
        Number(platformCommissionPct),
        ruleId
      ]
    );

    await execute(
      `INSERT INTO audit_logs (actor_id, action, target_type, target_id, metadata)
       VALUES (?, 'UPDATE_PRICING_RULE', 'PRICING_RULE', ?, ?)`,
      [adminId, ruleId, JSON.stringify(req.body)]
    );

    const updated = await queryOne('SELECT * FROM pricing_rules WHERE id = ?', [ruleId]);
    res.json({ message: 'Pricing rule updated successfully', rule: updated });
  } catch (err: any) {
    console.error('Update pricing rule error:', err);
    res.status(500).json({ error: 'Failed to update pricing rule.' });
  }
}

export async function listAuditLogs(req: AuthenticatedRequest, res: Response) {
  try {
    const logs = await query(
      `SELECT a.*, u.name as actor_name, u.email as actor_email
       FROM audit_logs a
       LEFT JOIN users u ON a.actor_id = u.id
       ORDER BY a.id DESC LIMIT 50`
    );
    res.json({ logs });
  } catch (err: any) {
    console.error('List audit logs error:', err);
    res.status(500).json({ error: 'Failed to list audit logs.' });
  }
}

