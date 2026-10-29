import express from 'express';
import { getAdCampaigns, createAdCampaign, deleteAdCampaign } from '../controllers/adCampaignController.js';

const router = express.Router();

router.route('/')
  .get(getAdCampaigns)
  .post(createAdCampaign);

router.route('/:id')
  .delete(deleteAdCampaign);

export default router;
