import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { execute, queryOne, query } from '../../database/db.js';
import { AuthenticatedRequest } from '../../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'driverondemand_jwt_secret_default_key_123';

export async function registerCustomer(req: Request, res: Response) {
  try {
    const { name, email, phone, password, address, emergencyContactName, emergencyContactPhone } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Name, email, phone, and password are required.' });
    }

    const existing = await queryOne('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userRes = await execute(
      `INSERT INTO users (role, name, email, phone, password_hash, account_status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['CUSTOMER', name.trim(), email.toLowerCase().trim(), phone.trim(), passwordHash, 'ACTIVE']
    );

    const userId = userRes.insertId!;

    await execute(
      `INSERT INTO customer_profiles (user_id, address, emergency_contact_name, emergency_contact_phone)
       VALUES (?, ?, ?, ?)`,
      [userId, address || '', emergencyContactName || '', emergencyContactPhone || '']
    );

    const token = jwt.sign({ id: userId, role: 'CUSTOMER', email: email.toLowerCase().trim() }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Customer registration successful',
      token,
      user: {
        id: userId,
        role: 'CUSTOMER',
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
      }
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during customer registration.' });
  }
}

export async function registerDriver(req: Request, res: Response) {
  try {
    const { name, email, phone, password, experienceYears, serviceArea, bio, hourlyRatePaise } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Name, email, phone, and password are required.' });
    }

    const existing = await queryOne('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userRes = await execute(
      `INSERT INTO users (role, name, email, phone, password_hash, account_status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['DRIVER', name.trim(), email.toLowerCase().trim(), phone.trim(), passwordHash, 'ACTIVE']
    );

    const userId = userRes.insertId!;

    await execute(
      `INSERT INTO driver_profiles (user_id, experience_years, service_area, approval_status, availability, rating_avg, rating_count, hourly_rate_paise, bio)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        Number(experienceYears) || 3,
        serviceArea || 'Metropolitan Core',
        'PENDING',
        'OFFLINE',
        5.0,
        0,
        Number(hourlyRatePaise) || 25000,
        bio || 'Professional personal driver applicant.'
      ]
    );

    const token = jwt.sign({ id: userId, role: 'DRIVER', email: email.toLowerCase().trim() }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Driver registration submitted. Your application is in PENDING review.',
      token,
      user: {
        id: userId,
        role: 'DRIVER',
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        approvalStatus: 'PENDING',
      }
    });
  } catch (err: any) {
    console.error('Driver registration error:', err);
    res.status(500).json({ error: 'Server error during driver registration.' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await queryOne<any>(
      `SELECT u.id, u.role, u.name, u.email, u.phone, u.password_hash, u.account_status,
              dp.approval_status, dp.availability, dp.rating_avg, dp.rating_count, dp.experience_years
       FROM users u
       LEFT JOIN driver_profiles dp ON u.id = dp.user_id
       WHERE u.email = ?`,
      [email.toLowerCase().trim()]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password credentials.' });
    }

    if (user.account_status === 'SUSPENDED') {
      return res.status(403).json({ error: 'Your account is suspended. Please contact platform support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password credentials.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone,
        approvalStatus: user.approval_status,
        availability: user.availability,
        ratingAvg: user.rating_avg,
        experienceYears: user.experience_years,
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login authentication.' });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const user = await queryOne<any>(
      `SELECT u.id, u.role, u.name, u.email, u.phone, u.account_status, u.created_at,
              cp.address, cp.emergency_contact_name, cp.emergency_contact_phone,
              dp.experience_years, dp.service_area, dp.approval_status, dp.availability, dp.rating_avg, dp.rating_count, dp.hourly_rate_paise, dp.bio
       FROM users u
       LEFT JOIN customer_profiles cp ON u.id = cp.user_id
       LEFT JOIN driver_profiles dp ON u.id = dp.user_id
       WHERE u.id = ?`,
      [userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    res.json({ user });
  } catch (err: any) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Server error retrieving current profile.' });
  }
}

