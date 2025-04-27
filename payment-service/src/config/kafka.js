import { Kafka } from 'kafkajs';
import { KAFKA_BROKER } from './config.js';

const kafka = new Kafka({
  clientId: 'payment-service',
  brokers: [KAFKA_BROKER],
});

let producer;

export const connectKafkaProducer = async () => {
  try {
    producer = kafka.producer();
    await producer.connect();
    console.log('Kafka Producer connected');
  } catch (error) {
    console.error('Kafka Producer connection error:', error);
    throw error;
  }
};

export const sendKafkaMessage = async (topic, message) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log(`Message sent to topic ${topic}:`, message);
  } catch (error) {
    console.error(`Error sending message to topic ${topic}:`, error);
    throw error;
  }
};