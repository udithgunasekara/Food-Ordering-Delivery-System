import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  paymentIntentId: { type: String },
  refundId: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  type: { type: String, enum: ['payment', 'refund'], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Transaction', transactionSchema);