import express from 'express';
import { submitContactMessage, getContactMessages } from '../controllers/contactController.js';

const router = express.Router();

router.route('/')
  .post(submitContactMessage)
  .get(getContactMessages);

export default router;
