import express from 'express';
import paymentRoutes from './routes/paymentRoutes.js';
import { connectDB } from './config/db.js';
import { connectKafkaProducer } from './config/kafka.js';
import { SERVER_PORT } from './config/config.js'; // Changed to SERVER_PORT
import { startEureka, stopEureka } from './config/eureka.js'; // Added Eureka imports
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

// Initialize DB, Kafka, and Eureka
(async () => {
  try {
    await connectDB();
    await connectKafkaProducer();
    app.listen(SERVER_PORT, () => {
      console.log(`Payment Microservice running on port ${SERVER_PORT}`);
      startEureka(); // Start Eureka registration
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down payment-service...');
  stopEureka(); // Deregister from Eureka
  process.exit(0);
});

export default app;