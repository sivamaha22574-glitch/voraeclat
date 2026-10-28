import express from 'express';
import { submitContactMessage, getContactMessages } from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(submitContactMessage)
  .get(protect, adminOnly, getContactMessages);

export default router;

