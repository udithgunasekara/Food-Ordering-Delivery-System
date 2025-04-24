import { Kafka } from 'kafkajs';
import { initiatePayment, processRefund } from './paymentGatewayService.js';
import { produceKafkaEvent } from './kafkaProducer.js';
import Transaction from '../models/Transaction.js';

const kafka = new Kafka({
  clientId: 'payment-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'payment-group' });

export async function startKafkaConsumer() {
  try {
    await consumer.connect();
    await consumer.subscribe({ topics: ['order-confirmed', 'order-canceled'], fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const event = JSON.parse(message.value.toString());
        console.log(`Received ${topic} event:`, event);

        if (topic === 'order-confirmed') {
          try {
            const paymentResult = await initiatePayment({
              orderId: event.orderId,
              amount: event.amount,
              customerId: event.customerId,
              currency: event.currency || 'LKR',
            });

            const transaction = new Transaction({
              orderId: event.orderId,
              customerId: event.customerId,
              amount: event.amount,
              currency: event.currency || 'LKR',
              paymentId: paymentResult.paymentId,
              status: paymentResult.status,
              paymentMethod: paymentResult.paymentMethod || 'unknown',
            });
            await transaction.save();

            await produceKafkaEvent('payment-processed', {
              orderId: event.orderId,
              paymentId: paymentResult.paymentId,
              status: paymentResult.status,
              amount: event.amount,
              customerId: event.customerId,
            });

            await produceKafkaEvent('payment-notification', {
              orderId: event.orderId,
              customerId: event.customerId,
              amount: event.amount,
              status: paymentResult.status,
              message: `Payment of ${event.currency || 'LKR'} ${event.amount} for order #${event.orderId} was ${paymentResult.status.toLowerCase()}.`,
            });
          } catch (error) {
            console.error('Error processing payment:', error);
          }
        } else if (topic === 'order-canceled') {
          try {
            const refundResult = await processRefund({
              paymentId: event.paymentId,
              amount: event.amount,
            });

            const transaction = new Transaction({
              orderId: event.orderId,
              paymentId: event.paymentId,
              amount: event.amount,
              currency: event.currency || 'LKR',
              status: 'REFUNDED',
              paymentMethod: 'unknown',
            });
            await transaction.save();

            await produceKafkaEvent('payment-processed', {
              orderId: event.orderId,
              paymentId: event.paymentId,
              status: 'REFUNDED',
              amount: event.amount,
            });

            await produceKafkaEvent('payment-notification', {
              orderId: event.orderId,
              amount: event.amount,
              status: 'REFUNDED',
              message: `Refund of ${event.currency || 'LKR'} ${event.amount} for order #${event.orderId} has been processed.`,
            });
          } catch (error) {
            console.error('Error processing refund:', error);
          }
        }
      },
    });
    console.log('Kafka consumer started');
  } catch (error) {
    console.error('Kafka consumer error:', error);
    throw error;
  }
}