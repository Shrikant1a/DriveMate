import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { queryOne } from '../database/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'driverondemand_jwt_secret_default_key_123';

export interface AuthUser {
  id: number;
  role: 'CUSTOMER' | 'DRIVER' | 'ADMIN';
  email: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    
    // Verify user exists and is active in database
    const user = await queryOne<{ id: number; role: string; email: string; name: string; account_status: string }>(
      'SELECT id, role, email, name, account_status FROM users WHERE id = ?',
      [payload.id]
    );

    if (!user || user.account_status === 'SUSPENDED') {
      return res.status(403).json({ error: 'User account is suspended or inactive.' });
    }

    req.user = {
      id: user.id,
      role: user.role as any,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (err: any) {
    return res.status(403).json({ error: 'Invalid or expired session token.' });
  }
}

export function requireRole(...allowedRoles: Array<'CUSTOMER' | 'DRIVER' | 'ADMIN'>) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}` 
      });
    }
    next();
  };
}

