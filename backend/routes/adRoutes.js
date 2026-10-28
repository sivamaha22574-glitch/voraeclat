import express from 'express';
import { getAdCampaigns, createAdCampaign } from '../controllers/adCampaignController.js';

const router = express.Router();

router.route('/')
  .get(getAdCampaigns)
  .post(createAdCampaign);

export default router;
