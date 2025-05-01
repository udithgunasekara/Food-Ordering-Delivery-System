import express from 'express';
import notificationRoutes from './routes/notificationRoutes.js';
import connectDB from './config/db.js';
import { startKafkaConsumer } from './services/kafkaConsumer.js';
import { initWebSocketServer } from './services/websocketService.js';
import { SERVER_PORT } from './config/config.js';
import { startEureka, stopEureka } from './config/eureka.js';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(express.json());

// Initialize WebSocket server
initWebSocketServer(server);

// Health check endpoint for Eureka and Docker Compose
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Routes
app.use('/api/notifications', notificationRoutes);

// Initialize DB, Kafka, and Eureka
(async () => {
  try {
    await connectDB();
    await startKafkaConsumer();
    server.listen(SERVER_PORT, () => {
      console.log(`Notification Service running on port ${SERVER_PORT}`);
      startEureka(); // Start Eureka registration
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down notification-service...');
  stopEureka(); // Deregister from Eureka
  server.close(() => {
    process.exit(0);
  });
});

export default app;