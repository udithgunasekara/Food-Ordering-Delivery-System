import { Kafka } from 'kafkajs';
import { sendEmail } from './emailService.js';
import { sendSMS } from './smsService.js';
import Notification from '../models/Notification.js';

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: [process.env.KAFKA_BROKER],
});

export const startKafkaConsumer = async () => {
  const consumer = kafka.consumer({ groupId: 'notification-group' });

  await consumer.connect();
  await consumer.subscribe({ topics: ['order-placed', 'delivery-assigned'], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value.toString());
      let notification;

      if (topic === 'order-placed') {
        // Customer email
        await sendEmail(
          data.customerEmail,
          'Order Confirmation',
          `Your order #${data.orderId} has been placed successfully.`
        );
        // Customer SMS
        await sendSMS(
          data.customerPhone,
          `Your order #${data.orderId} has been placed.`
        );
        notification = new Notification({
          type: 'email',
          recipient: data.customerEmail,
          message: `Order #${data.orderId} confirmed`,
          orderId: data.orderId,
        });
        await notification.save();
        notification = new Notification({
          type: 'sms',
          recipient: data.customerPhone,
          message: `Order #${data.orderId} confirmed`,
          orderId: data.orderId,
        });
        await notification.save();
      } else if (topic === 'delivery-assigned') {
        // Delivery personnel SMS
        await sendSMS(
          data.driverPhone,
          `New delivery assigned: Order #${data.orderId}.`
        );
        notification = new Notification({
          type: 'sms',
          recipient: data.driverPhone,
          message: `Delivery for order #${data.orderId} assigned`,
          orderId: data.orderId,
        });
        await notification.save();
      }
    },
  });
};