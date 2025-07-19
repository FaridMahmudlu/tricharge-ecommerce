import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Order, IOrder } from '../models/Order';
import { Document, Types } from 'mongoose';

interface OrderDocument extends IOrder, Document {
  _id: Types.ObjectId;
}

interface PaymentError extends Error {
  type?: string;
  code?: string;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

// Create payment intent
export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Order ID is required' 
      });
    }

    const order = await Order.findById(orderId) as OrderDocument;
    if (!order) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Order not found' 
      });
    }

    // Check if order is already paid
    if (order.isPaid) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Order has already been paid' 
      });
    }

    // Check if user is authorized to pay for this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        status: 'error',
        message: 'Not authorized to pay for this order' 
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return res.json({
      status: 'success',
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    const stripeError = error as PaymentError;
    if (stripeError.type?.startsWith('Stripe')) {
      return res.status(400).json({ 
        status: 'error',
        message: stripeError.message 
      });
    }
    return res.status(500).json({ 
      status: 'error',
      message: 'Error creating payment intent' 
    });
  }
};

// Handle Stripe webhook
export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(400).json({ 
      status: 'error',
      message: 'Missing stripe signature or webhook secret' 
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const error = err as Error;
    return res.status(400).json({ 
      status: 'error',
      message: `Webhook Error: ${error.message}` 
    });
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        if (!orderId) {
          throw new Error('Order ID not found in payment intent metadata');
        }

        // Update order status
        const order = await Order.findById(orderId);
        if (order) {
          order.isPaid = true;
          order.paidAt = new Date();
          order.status = 'processing';
          order.paymentResult = {
            id: paymentIntent.id,
            status: paymentIntent.status,
            update_time: new Date().toISOString(),
            email_address: paymentIntent.receipt_email || '',
          };
          await order.save();
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        const failedOrderId = failedPayment.metadata.orderId;

        if (!failedOrderId) {
          throw new Error('Order ID not found in failed payment intent metadata');
        }

        // Update order status to cancelled
        const failedOrder = await Order.findById(failedOrderId);
        if (failedOrder) {
          failedOrder.status = 'cancelled';
          await failedOrder.save();
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.json({ 
      status: 'success',
      received: true 
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ 
      status: 'error',
      message: 'Error processing webhook' 
    });
  }
}; 