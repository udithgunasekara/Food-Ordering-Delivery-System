import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['email', 'sms', 'websocket'] },
  recipient: { type: String, required: true },
  message: { type: String, required: true },
  orderId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  driverId: { type: String }, // For driver-related notifications
});

export default mongoose.model('Notification', notificationSchema);