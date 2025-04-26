import express from 'express';
import notificationRoutes from './routes/notificationRoutes.js';
import connectDB from './config/db.js';
import { startKafkaConsumer } from './services/kafkaConsumer.js';
import { PORT } from './config/config.js';


const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/notifications', notificationRoutes);

// Start Kafka Consumer
startKafkaConsumer();

// Start Express Server
app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});