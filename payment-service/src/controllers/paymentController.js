import Transaction from '../models/Transaction.js';
import { initiatePayment, processRefund } from '../services/paymentGatewayService.js';
import { produceKafkaEvent } from '../services/kafkaProducer.js';

export async function processPayment(req, res) {
  const { orderId, amount, customerId, currency = 'LKR' } = req.body;
  try {
    const paymentResult = await initiatePayment({ orderId, amount, customerId, currency });
    const transaction = new Transaction({
      orderId,
      customerId,
      amount,
      currency,
      paymentId: paymentResult.paymentId,
      status: paymentResult.status,
      paymentMethod: paymentResult.paymentMethod || 'unknown',
    });
    await transaction.save();

    await produceKafkaEvent('payment-processed', {
      orderId,
      paymentId: paymentResult.paymentId,
      status: paymentResult.status,
      amount,
      customerId,
    });

    if (paymentResult.status === 'SUCCESS') {
      await produceKafkaEvent('payment-notification', {
        orderId,
        customerId,
        amount,
        status: 'SUCCESS',
        message: `Payment of ${currency} ${amount} for order #${orderId} was successful.`,
      });
    } else {
      await produceKafkaEvent('payment-notification', {
        orderId,
        customerId,
        amount,
        status: 'FAILED',
        message: `Payment of ${currency} ${amount} for order #${orderId} failed.`,
      });
    }

    res.status(200).json(paymentResult);
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
}

export async function refundPayment(req, res) {
  const { orderId, paymentId, amount } = req.body;
  try {
    const refundResult = await processRefund({ paymentId, amount });
    const transaction = new Transaction({
      orderId,
      paymentId,
      amount,
      currency: 'LKR',
      status: 'REFUNDED',
      paymentMethod: 'unknown',
    });
    await transaction.save();

    await produceKafkaEvent('payment-processed', {
      orderId,
      paymentId,
      status: 'REFUNDED',
      amount,
    });

    await produceKafkaEvent('payment-notification', {
      orderId,
      amount,
      status: 'REFUNDED',
      message: `Refund of LKR ${amount} for order #${orderId} has been processed.`,
    });

    res.status(200).json(refundResult);
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ error: 'Refund processing failed' });
  }
}

export async function getTransactions(req, res) {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Transaction query error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
}