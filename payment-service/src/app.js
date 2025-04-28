import express from 'express';
import paymentRoutes from './routes/paymentRoutes.js';
import { connectDB } from './config/db.js';
import { connectKafkaProducer } from './config/kafka.js';
import { PORT } from './config/config.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api/payments', paymentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Initialize DB and Kafka
(async () => {
  try {
    await connectDB();
    await connectKafkaProducer();
    app.listen(PORT, () => {
      console.log(`Payment Microservice running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();

export default app;