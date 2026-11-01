import { Response } from 'express';
import { execute, query, queryOne } from '../../database/db.js';
import { AuthenticatedRequest } from '../../middleware/auth.js';

export async function createSupportCase(req: AuthenticatedRequest, res: Response) {
  try {
    const creatorId = req.user!.id;
    const { bookingId, category, subject, description } = req.body;

    if (!category || !subject || !description) {
      return res.status(400).json({ error: 'Category, subject, and description are required.' });
    }

    const result = await execute(
      `INSERT INTO support_cases (booking_id, creator_id, category, subject, description, status)
       VALUES (?, ?, ?, ?, ?, 'OPEN')`,
      [bookingId || null, creatorId, category, subject.trim(), description.trim()]
    );

    const newCase = await queryOne('SELECT * FROM support_cases WHERE id = ?', [result.insertId]);
    res.status(201).json({ message: 'Support ticket submitted successfully. Our team will review shortly.', case: newCase });
  } catch (err: any) {
    console.error('Create support case error:', err);
    res.status(500).json({ error: 'Failed to create support ticket.' });
  }
}

export async function listSupportCases(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;

    let sql = `
      SELECT sc.*, u.name as creator_name, u.email as creator_email, u.role as creator_role,
             b.reference_code as booking_reference
      FROM support_cases sc
      JOIN users u ON sc.creator_id = u.id
      LEFT JOIN bookings b ON sc.booking_id = b.id
    `;
    const params: any[] = [];

    if (role !== 'ADMIN') {
      sql += ' WHERE sc.creator_id = ?';
      params.push(userId);
    }

    sql += ' ORDER BY sc.id DESC';

    const cases = await query(sql, params);
    res.json({ cases });
  } catch (err: any) {
    console.error('List support cases error:', err);
    res.status(500).json({ error: 'Failed to retrieve support cases.' });
  }
}

export async function resolveSupportCase(req: AuthenticatedRequest, res: Response) {
  try {
    const adminId = req.user!.id;
    const caseId = Number(req.params.id);
    const { status, resolutionNotes } = req.body; // 'INVESTIGATING' | 'RESOLVED'

    await execute(
      `UPDATE support_cases 
       SET status = ?, assigned_admin_id = ?, resolution_notes = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status || 'RESOLVED', adminId, resolutionNotes || 'Resolved by administrative review', caseId]
    );

    const updated = await queryOne('SELECT * FROM support_cases WHERE id = ?', [caseId]);
    res.json({ message: `Support case updated to ${status || 'RESOLVED'}`, case: updated });
  } catch (err: any) {
    console.error('Resolve support case error:', err);
    res.status(500).json({ error: 'Failed to resolve support case.' });
  }
}

