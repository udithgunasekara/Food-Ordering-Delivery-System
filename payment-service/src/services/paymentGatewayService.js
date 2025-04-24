import axios from 'axios';
import crypto from 'crypto';

const PAYHERE_API_URL = process.env.PAYHERE_SANDBOX ? 'https://sandbox.payhere.lk/pay' : 'https://www.payhere.lk/pay';

export async function initiatePayment({ orderId, amount, customerId, currency }) {
  try {
    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_SECRET;
    const hash = crypto
      .createHash('md5')
      .update(merchantId + orderId + amount.toFixed(2) + currency + merchantSecret)
      .digest('hex')
      .toUpperCase();

    const response = await axios.post(`${PAYHERE_API_URL}/checkout`, {
      merchant_id: merchantId,
      return_url: 'http://localhost:3003/api/payments/return',
      cancel_url: 'http://localhost:3003/api/payments/cancel',
      notify_url: 'http://localhost:3003/api/payments/notify',
      order_id: orderId,
      items: `Order ${orderId}`,
      currency,
      amount: amount.toFixed(2),
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
      paymentId: response.data.payment_id,
      status: response.data.status === 2 ? 'SUCCESS' : 'FAILED',
      paymentMethod: response.data.method,
      redirectUrl: response.data.url,
    };
  } catch (error) {
    console.error('PayHere payment error:', error);
    throw new Error('Failed to initiate payment');
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
    console.error('PayHere refund error:', error);
    throw new Error('Failed to process refund');
  }
}