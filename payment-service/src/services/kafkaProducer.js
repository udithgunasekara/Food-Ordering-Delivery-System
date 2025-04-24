import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'payment-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer = kafka.producer();

export async function initializeKafkaProducer() {
  try {
    await producer.connect();
    console.log('Kafka producer connected');
  } catch (error) {
    console.error('Kafka producer error:', error);
    throw error;
  }
}

export async function produceKafkaEvent(topic, message) {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log(`Produced event to ${topic}:`, message);
  } catch (error) {
    console.error(`Error producing event to ${topic}:`, error);
    throw error;
  }
}