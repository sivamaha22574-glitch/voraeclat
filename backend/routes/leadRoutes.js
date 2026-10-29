import express from 'express';
import {
  submitLead,
  getLeads,
  updateLeadStatus
} from '../controllers/leadController.js';

const router = express.Router();

router.route('/')
  .post(submitLead)
  .get(getLeads);

router.route('/:id')
  .put(updateLeadStatus);

export default router;
