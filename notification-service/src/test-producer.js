import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'test-producer',
  brokers: ['172.19.0.3:9092'],
});

const producer = kafka.producer();

const sendMessage = async () => {
  await producer.connect();
  await producer.send({
    topic: 'order-placed',
    messages: [
      {
        value: JSON.stringify({
          orderId: '12345',
          customerEmail: 'chathuradayananda1@gmail.com',
          customerPhone: '+94772213025',
        }),
      },
    ],
  });
  await producer.send({
    topic: 'delivery-assigned',
    messages: [
      {
        value: JSON.stringify({
          orderId: '12345',
          driverPhone: '+1234567890',
        }),
      },
    ],
  });
  await producer.disconnect();
};

sendMessage().catch(console.error);