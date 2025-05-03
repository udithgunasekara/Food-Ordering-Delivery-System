import { Kafka } from 'kafkajs';
import { KAFKA_BROKER, KAFKA_TOPICS } from './config/config.js';

// Initialize Kafka client
const kafka = new Kafka({
  clientId: 'test-producer',
  brokers: [KAFKA_BROKER],
});

const producer = kafka.producer();

const sendTestMessage = async () => {
  try {
    await producer.connect();
    console.log('Connected to Kafka broker');

    // Sample order-published message
    const message = {
      orderId: 'ORD12345',
      orderDetails: {
        restaurant: 'Tasty Bites',
        items: ['Pizza', 'Soda'],
        total: 25.99,
        deliveryAddress: '123 Main St, City',
      },
      drivers: [
        { driverId: 'DRIVER001', name: 'John Doe', phone: '+1234567890' },
        { driverId: 'DRIVER002', name: 'Jane Smith', phone: '+0987654321' },
      ],
    };

    await producer.send({
      topic: KAFKA_TOPICS.ORDER_PUBLISHED,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });

    console.log('Test message sent to order-published topic:', message);
  } catch (error) {
    console.error('Error sending test message:', error);
  } finally {
    await producer.disconnect();
    console.log('Disconnected from Kafka broker');
  }
};

// Run the producer
sendTestMessage();