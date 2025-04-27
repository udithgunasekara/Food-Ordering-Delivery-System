import dotenv from 'dotenv';
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT || 3000;
export const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9092';
export const API_KEY = process.env.API_KEY;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
