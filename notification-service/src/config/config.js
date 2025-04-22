import dotenv from 'dotenv';
dotenv.config();

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
export const PORT = process.env.PORT || 3003;
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export const SENDGRID_SENDER_EMAIL = process.env.SENDGRID_SENDER_EMAIL;
