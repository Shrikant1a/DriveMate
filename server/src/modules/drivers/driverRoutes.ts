import { Router } from 'express';
import {
  listAvailableDrivers,
  getDriverProfile,
  getMyStatus,
  updateAvailability,
  uploadDocument,
  getDriverEarnings,
  getIncomingRequests,
} from './driverController.js';
import { authenticateToken, requireRole } from '../../middleware/auth.js';

const router = Router();

// Public / customer endpoints
router.get('/available', listAvailableDrivers);
router.get('/:id', getDriverProfile);

// Authenticated driver endpoints
router.get('/me/status', authenticateToken, requireRole('DRIVER'), getMyStatus);
router.patch('/me/availability', authenticateToken, requireRole('DRIVER'), updateAvailability);
router.post('/documents', authenticateToken, requireRole('DRIVER'), uploadDocument);
router.get('/me/earnings', authenticateToken, requireRole('DRIVER'), getDriverEarnings);
router.get('/me/incoming-requests', authenticateToken, requireRole('DRIVER'), getIncomingRequests);

export default router;

