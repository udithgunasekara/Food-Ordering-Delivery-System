import Stripe from 'stripe';
import Transaction from '../models/Transaction.js';
import { STRIPE_SECRET_KEY } from '../config/config.js';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const processRefund = async (paymentIntentId, orderId) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    // Log refund transaction
    await Transaction.create({
      orderId,
      refundId: refund.id,
      paymentIntentId,
      amount: refund.amount ,
      currency: refund.currency,
      status: refund.status,
      type: 'refund',
    });

    return refund;
  } catch (error) {
    throw error;
  }
};