import Stripe from 'stripe';
import Transaction from '../models/Transaction.js';
import { STRIPE_SECRET_KEY } from '../config/config.js';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const processPayment = async (amount, currency, paymentMethodId, orderId, customerEmail, customerPhone) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, 
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      return_url: 'http://localhost:3000',
    });

    // Log transaction
    await Transaction.create({
      orderId,
      paymentIntentId: paymentIntent.id,
      amount,
      currency,
      status: paymentIntent.status,
      type: 'payment',
      customerEmail,
      customerPhone,
    });

    return paymentIntent;
  } catch (error) {
    throw error;
  }
};

export const getTransaction = async (orderId) => {
  try {
    const transactions = await Transaction.find({ orderId });
    return transactions;
  } catch (error) {
    throw error;
  }
};