import express from 'express';
import paymentRoutes from './routes/paymentRoutes.js';
import { connectDB } from './config/db.js';
import cors from 'cors';
import helmet from 'helmet';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/payments', paymentRoutes);

// Initialize database
async function startServer() {
  try {
    await connectDB();
    console.log('Payment Microservice initialized');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Payment Microservice running on port ${PORT}`);
  startServer();
});

export default app;