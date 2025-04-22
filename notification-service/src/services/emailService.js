import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL } from '../config/config.js';

sgMail.setApiKey(SENDGRID_API_KEY);

export const sendEmail = async (to, subject, text) => {
  const msg = {
    to,
    from: SENDGRID_SENDER_EMAIL,
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};