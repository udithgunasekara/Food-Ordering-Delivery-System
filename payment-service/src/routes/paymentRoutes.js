import express from 'express';
import { processPayment, refundPayment, getTransactions } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/process', authenticate, processPayment);
router.post('/refund', authenticate, refundPayment);
router.get('/', authenticate, getTransactions);

export default router;