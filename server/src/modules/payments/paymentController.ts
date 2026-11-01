import { Request, Response } from 'express';
import crypto from 'crypto';
import { execute, queryOne } from '../../database/db.js';
import { AuthenticatedRequest } from '../../middleware/auth.js';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_sample_key_12345';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'sample_secret_key_67890';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'sample_webhook_secret_abcde';

export async function createPaymentOrder(req: AuthenticatedRequest, res: Response) {
  try {
    const customerId = req.user!.id;
    const { bookingId } = req.body;

    const booking = await queryOne<any>('SELECT * FROM bookings WHERE id = ?', [bookingId]);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    if (booking.customer_id !== customerId && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized payment attempt for this booking.' });
    }

    const amountPaise = booking.final_fare_paise || booking.estimated_fare_paise;
    const providerOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const result = await execute(
      `INSERT INTO payments (booking_id, provider_order_id, amount_paise, currency, status)
       VALUES (?, ?, ?, 'INR', 'CREATED')`,
      [bookingId, providerOrderId, amountPaise]
    );

    res.json({
      orderId: providerOrderId,
      paymentId: result.insertId,
      amountPaise,
      currency: 'INR',
      keyId: RAZORPAY_KEY_ID,
      customer: {
        name: req.user!.name,
        email: req.user!.email,
      },
      bookingReference: booking.reference_code,
    });
  } catch (err: any) {
    console.error('Create payment order error:', err);
    res.status(500).json({ error: 'Failed to create payment order.' });
  }
}

export async function verifyPayment(req: AuthenticatedRequest, res: Response) {
  try {
    const { orderId, paymentId, signature } = req.body;

    // Check signature if secret configured
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const isValid = signature === expectedSignature || process.env.NODE_ENV === 'development';

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid payment signature verification failed.' });
    }

    await execute(
      "UPDATE payments SET status = 'SUCCESS', provider_payment_id = ? WHERE provider_order_id = ?",
      [paymentId, orderId]
    );

    res.json({ message: 'Payment verified successfully', verified: true, paymentId });
  } catch (err: any) {
    console.error('Verify payment error:', err);
    res.status(500).json({ error: 'Failed to verify payment.' });
  }
}

export async function handleWebhook(req: Request, res: Response) {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const bodyStr = JSON.stringify(req.body);

    const expected = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(bodyStr)
      .digest('hex');

    if (signature && signature !== expected) {
      return res.status(400).json({ error: 'Invalid webhook signature.' });
    }

    const event = req.body.event;
    if (event === 'payment.captured') {
      const orderId = req.body.payload?.payment?.entity?.order_id;
      const paymentId = req.body.payload?.payment?.entity?.id;

      if (orderId) {
        await execute(
          "UPDATE payments SET status = 'SUCCESS', provider_payment_id = ?, webhook_payload = ? WHERE provider_order_id = ?",
          [paymentId, bodyStr, orderId]
        );
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (err: any) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Webhook processing error.' });
  }
}

