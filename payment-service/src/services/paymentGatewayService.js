import axios from 'axios';
import crypto from 'crypto';

const PAYHERE_API_URL = process.env.PAYHERE_SANDBOX === 'true' ? 'https://sandbox.payhere.lk/pay' : 'https://www.payhere.lk/pay';

export async function initiatePayment({ orderId, amount, customerId, currency }) {
  try {
    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_SECRET;
    const formattedAmount = amount.toFixed(2); // Ensure amount is in X.XX format
    const hash = crypto
      .createHash('md5')
      .update(merchantId + orderId + formattedAmount + currency + merchantSecret)
      .digest('hex')
      .toUpperCase();

    const response = await axios.post(`${PAYHERE_API_URL}/checkout`, {
      merchant_id: merchantId,
      return_url: process.env.RETURN_URL || 'http://localhost:3003/api/payments/return',
      cancel_url: process.env.CANCEL_URL || 'http://localhost:3003/api/payments/cancel',
      notify_url: process.env.NOTIFY_URL || 'http://localhost:3003/api/payments/notify',
      order_id: orderId,
      items: `Order ${orderId}`,
      currency,
      amount: formattedAmount,
      hash,
      first_name: 'Customer',
      last_name: customerId,
      email: `${customerId}@example.com`,
      phone: '0771234567',
      address: 'No. 1, Galle Road',
      city: 'Colombo',
      country: 'Sri Lanka',
    });

    return {
      paymentId: response.data.payment_id || response.data.order_id,
      status: response.data.status === 2 ? 'SUCCESS' : 'FAILED',
      paymentMethod: response.data.method || 'unknown',
      redirectUrl: response.data.url,
    };
  } catch (error) {
    console.error('PayHere payment initiation error:', error.message);
    throw new Error(`Failed to initiate payment: ${error.message}`);
  }
}

export async function processRefund({ paymentId, amount }) {
  try {
    const response = await axios.post(`${PAYHERE_API_URL}/refund`, {
      merchant_id: process.env.PAYHERE_MERCHANT_ID,
      payment_id: paymentId,
      amount: amount.toFixed(2),
      reason: 'Order canceled',
    });

    return {
      paymentId,
      status: response.data.status === 1 ? 'REFUNDED' : 'FAILED',
    };
  } catch (error) {
    console.error('PayHere refund error:', error.message);
    throw new Error(`Failed to process refund: ${error.message}`);
  }
}