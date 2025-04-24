import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customerId: { type: String, required: true },
  paymentId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'LKR' },
  status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'], required: true },
  paymentMethod: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Transaction', transactionSchema);