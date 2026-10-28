import express from 'express';
import {
  submitLead,
  getLeads,
  updateLeadStatus
} from '../controllers/leadController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(submitLead)
  .get(protect, adminOnly, getLeads);

router.route('/:id')
  .put(protect, adminOnly, updateLeadStatus);

export default router;

