import Stripe from 'stripe';
import Transaction from '../models/Transaction.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


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
      amount: refund.amount / 100, // Convert from cents
      currency: refund.currency,
      status: refund.status,
      type: 'refund',
    });

    return refund;
  } catch (error) {
    throw error;
  }
};