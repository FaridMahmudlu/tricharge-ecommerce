import { Request, Response } from 'express';
import Stripe from 'stripe';
import { pgPool } from '../db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
});

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'User not authenticated' });
    }

    const { orderId } = req.body as { orderId?: string };

    if (!orderId) {
      return res.status(400).json({ status: 'error', message: 'Order ID is required' });
    }

    const orderResult = await pgPool.query(
      'select id, user_id, total_price, is_paid from public.orders where id = $1 limit 1',
      [orderId],
    );

    const order = orderResult.rows[0];

    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found' });
    }

    if (order.user_id !== req.user.id) {
      return res.status(403).json({ status: 'error', message: 'Not authorized to pay for this order' });
    }

    if (order.is_paid) {
      return res.status(400).json({ status: 'error', message: 'Order has already been paid' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.total_price) * 100),
      currency: 'usd',
      metadata: {
        orderId: order.id,
        userId: req.user.id,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return res.json({ status: 'success', clientSecret: paymentIntent.client_secret });
  } catch (error) {
    const stripeError = error as { type?: string; message?: string };
    if (stripeError.type?.startsWith('Stripe')) {
      return res.status(400).json({ status: 'error', message: stripeError.message || 'Stripe error' });
    }
    console.error('Error creating payment intent:', error);
    return res.status(500).json({ status: 'error', message: 'Error creating payment intent' });
  }
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string | undefined;

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(400).json({ status: 'error', message: 'Missing stripe signature or webhook secret' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const error = err as Error;
    return res.status(400).json({ status: 'error', message: `Webhook Error: ${error.message}` });
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      if (!orderId) {
        throw new Error('Order ID not found in payment intent metadata');
      }

      await pgPool.query(
        `update public.orders
            set is_paid = true,
                paid_at = timezone('utc', now()),
                status = 'processing',
                payment_result = $1,
                updated_at = timezone('utc', now())
          where id = $2`,
        [
          {
            id: paymentIntent.id,
            status: paymentIntent.status,
            update_time: new Date().toISOString(),
            email_address: paymentIntent.receipt_email || '',
          },
          orderId,
        ],
      );
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      if (!orderId) {
        throw new Error('Order ID not found in failed payment intent metadata');
      }

      await pgPool.query(
        "update public.orders set status = 'cancelled', updated_at = timezone('utc', now()) where id = $1",
        [orderId],
      );
    } else {
      console.log(`Unhandled event type ${event.type}`);
    }

    return res.json({ status: 'success', received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ status: 'error', message: 'Error processing webhook' });
  }
};
