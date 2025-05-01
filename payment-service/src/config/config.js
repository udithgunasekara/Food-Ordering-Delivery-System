import dotenv from 'dotenv';
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI; // Changed to MONGODB_URI for consistency with Docker Compose
export const SERVER_PORT = process.env.SERVER_PORT || 3000; // Align with Docker Compose
export const KAFKA_BROKER = process.env.KAFKA_BROKER || 'kafka:9092';
export const API_KEY = process.env.API_KEY;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const EUREKA = {
  host: process.env.EUREKA_HOST || 'service-registry',
  port: process.env.SERVICE_REGISTRY_PORT || 8761,
  servicePath: '/eureka/apps',
  appName: 'payment-service',
  instanceHost: 'payment-service',
  instancePort: process.env.SERVER_PORT || 3000,
  healthCheckUrl: `http://payment-service:${process.env.SERVER_PORT || 3000}/health`,
};