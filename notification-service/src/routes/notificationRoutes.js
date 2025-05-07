import express from 'express';
import { sendNotification, getNotifications, acceptOrder } from '../controllers/notificationController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/send', auth, sendNotification);
router.get('/', auth, getNotifications);
router.post('/accept-order', acceptOrder);

export default router;