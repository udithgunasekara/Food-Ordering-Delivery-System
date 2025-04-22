import express from 'express';
import { sendNotification, getNotifications } from '../controllers/notificationController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/send', auth, sendNotification);
router.get('/', auth, getNotifications);

export default router;