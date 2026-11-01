import { Router } from 'express';
import { createPaymentOrder, verifyPayment, handleWebhook } from './paymentController.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

router.post('/order', authenticateToken, createPaymentOrder);
router.post('/verify', authenticateToken, verifyPayment);
router.post('/webhook', handleWebhook);

export default router;

