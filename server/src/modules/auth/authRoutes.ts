import { Router } from 'express';
import { registerCustomer, registerDriver, login, getMe } from './authController.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

router.post('/register', registerCustomer);
router.post('/register-driver', registerDriver);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.post('/logout', (req, res) => {
  res.json({ message: 'Session logged out successfully' });
});

export default router;

