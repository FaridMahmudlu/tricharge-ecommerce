import express from 'express';
import { createPaymentIntent, handleStripeWebhook } from '../controllers/paymentController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Webhook route doesn't need authentication
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Protected routes
router.use(protect);
router.post('/create-payment-intent', createPaymentIntent);

export default router; 