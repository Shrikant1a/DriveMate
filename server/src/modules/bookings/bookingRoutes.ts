import { Router } from 'express';
import {
  calculateFareQuote,
  createBooking,
  acceptBooking,
  declineBooking,
  updateBookingStatus,
  cancelBooking,
  listUserBookings,
  getBookingDetails,
  submitReview,
} from './bookingController.js';
import { authenticateToken, requireRole } from '../../middleware/auth.js';

const router = Router();

// Calculate server-side quote (authenticated or public)
router.post('/quote', calculateFareQuote);

// Protected routes
router.use(authenticateToken);

router.get('/', listUserBookings);
router.post('/', requireRole('CUSTOMER', 'ADMIN'), createBooking);
router.get('/:id', getBookingDetails);
router.post('/:id/accept', requireRole('DRIVER'), acceptBooking);
router.post('/:id/decline', requireRole('DRIVER'), declineBooking);
router.post('/:id/status', updateBookingStatus);
router.post('/:id/cancel', cancelBooking);
router.post('/:id/reviews', requireRole('CUSTOMER'), submitReview);

export default router;

