import { processPayment, getTransaction } from '../services/paymentService.js';
import { processRefund } from '../services/refundService.js';
import { sendKafkaMessage } from '../services/kafkaProducer.js';

export const createCharge = async (req, res) => {
  try {
    const { amount, currency, paymentMethodId, orderId, customerEmail, customerPhone } = req.body;

    // Validate required fields
    if (!amount || !currency || !paymentMethodId || !orderId || !customerEmail) {
      return res.status(400).json({ 
        error: 'Missing required fields: amount, currency, paymentMethodId, orderId, customerEmail' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ error: 'Invalid customerEmail format' });
    }

    // Validate phone format if provided
    if (customerPhone) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(customerPhone)) {
        return res.status(400).json({ error: 'Invalid customerPhone format' });
      }
    }

    const charge = await processPayment(amount, currency, paymentMethodId, orderId, customerEmail, customerPhone);

    // Publish payment event
    await sendKafkaMessage('payment-events', {
      event: 'payment-processed',
      orderId,
      paymentId: charge.id,
      status: charge.status,
      amount,
      currency,
      customerEmail,
      customerPhone: customerPhone || null,
    });

    res.status(200).json({ success: true, charge });
  } catch (error) {
    await sendKafkaMessage('payment-events', {
      event: 'payment-failed',
      orderId: req.body.orderId || 'unknown',
      error: error.message,
      customerEmail: req.body.customerEmail || null,
      customerPhone: req.body.customerPhone || null,
    });
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ error: 'Card error', details: error.message });
    }
    res.status(500).json({ error: 'Payment processing failed', details: error.message });
  }
};

export const createRefund = async (req, res) => {
  try {
    const { paymentIntentId, orderId, customerEmail, customerPhone } = req.body;

    // Validate required fields
    if (!paymentIntentId || !orderId || !customerEmail) {
      return res.status(400).json({ 
        error: 'Missing required fields: paymentIntentId, orderId, customerEmail' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ error: 'Invalid customerEmail format' });
    }

    // Validate phone format if provided
    if (customerPhone) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(customerPhone)) {
        return res.status(400).json({ error: 'Invalid customerPhone format' });
      }
    }

    const refund = await processRefund(paymentIntentId, orderId, customerEmail, customerPhone);

    // Publish refund event
    await sendKafkaMessage('payment-events', {
      event: 'refund-processed',
      orderId,
      refundId: refund.id,
      status: refund.status,
      customerEmail,
      customerPhone: customerPhone || null,
    });

    res.status(200).json({ success: true, refund });
  } catch (error) {
    await sendKafkaMessage('payment-events', {
      event: 'refund-failed',
      orderId: req.body.orderId || 'unknown',
      error: error.message,
      customerEmail: req.body.customerEmail || null,
      customerPhone: req.body.customerPhone || null,
    });
    res.status(500).json({ error: 'Refund processing failed', details: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { orderId } = req.query;
    const transactions = await getTransaction(orderId);
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve transactions', details: error.message });
  }
};