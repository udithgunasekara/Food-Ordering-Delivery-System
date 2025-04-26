import express from 'express';
import { createCharge, createRefund, getTransactions } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Protected routes with API key authentication
router.post('/charge', authenticate, createCharge);
router.post('/refund', authenticate, createRefund);
router.get('/transactions', authenticate, getTransactions);

export default router;