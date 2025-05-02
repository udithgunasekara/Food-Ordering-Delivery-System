import dotenv from 'dotenv';
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI || 'mongodb://external-mongo:27017/notification_db';
export const SERVER_PORT = process.env.SERVER_PORT || 3002;
export const KAFKA_BROKER = process.env.KAFKA_BROKER || 'kafka:9092';
export const API_KEY = process.env.API_KEY;
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export const SENDGRID_SENDER_EMAIL = process.env.SENDGRID_SENDER_EMAIL;
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
export const EUREKA = {
  host: process.env.EUREKA_HOST || 'service-registry',
  port: process.env.SERVICE_REGISTRY_PORT || 8761,
  servicePath: '/eureka/apps',
  appName: 'notification-service',
  instanceHost: 'notification-service',
  instancePort: process.env.SERVER_PORT || 3002,
  healthCheckUrl: `http://notification-service:${process.env.SERVER_PORT || 3002}/health`,
};
export const KAFKA_TOPICS = {
  ORDER_PUBLISHED: 'order-published',
  DRIVER_SELECTED: 'driver-selected',
  ORDER_PLACED: 'order-placed',
  DELIVERY_ASSIGNED: 'delivery-assigned',
  PAYMENT_EVENTS: 'payment-events',
};