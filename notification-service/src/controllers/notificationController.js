import Notification from '../models/Notification.js';
import { sendEmail } from '../services/emailService.js'; 
import { sendSMS } from '../services/smsService.js';
import { publishDriverSelection } from '../services/kafkaConsumer.js';

export const sendNotification = async (req, res) => {
  const { type, recipient, message, orderId } = req.body;

  try {
    if (type === 'email') {
      await sendEmail(recipient, 'Order Confirmation', message);
    } else if (type === 'sms') {
      await sendSMS(recipient, message);
    } else {
      return res.status(400).json({ error: 'Invalid notification type' });
    }

    const notification = new Notification({ type, recipient, message, orderId });
    await notification.save();

    res.status(200).json({ message: 'Notification sent and logged' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send notification' });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const acceptOrder = async (req, res) => {
  const { driverId, orderId, deliveryId, driverDetails } = req.body;

  try {
    if (!driverId || !orderId || !deliveryId || !driverDetails) {
      return res.status(400).json({ error: 'Missing driverId, orderId, deliveryId, or driverDetails' });
    }

    // Publish driver selection to Kafka
    await publishDriverSelection(driverId, orderId, driverDetails);

    // Log notification
    const notification = new Notification({
      type: 'websocket',
      recipient: driverId,
      message: `Driver ${driverId} accepted order #${orderId}`,
      orderId,
      driverId,
      deliveryId,
    });
    await notification.save();

    res.status(200).json({ message: 'Order accepted and notified' });
  } catch (error) {
    console.error('Error in acceptOrder:', error);
    res.status(500).json({ error: 'Failed to accept order' });
  }
};