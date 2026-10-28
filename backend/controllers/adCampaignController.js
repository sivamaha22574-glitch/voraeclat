import { AdCampaign } from '../models/AdCampaign.js';

// @desc    Get all ad campaigns
// @route   GET /api/ads
// @access  Public
export const getAdCampaigns = async (req, res) => {
  try {
    const campaigns = await AdCampaign.find({}).sort({ createdAt: -1 });
    const totalSpend = campaigns.reduce((acc, c) => acc + (c.totalSpend || 0), 0);
    const totalRevenue = campaigns.reduce((acc, c) => acc + (c.revenueGenerated || 0), 0);
    const totalConversions = campaigns.reduce((acc, c) => acc + (c.conversions || 0), 0);

    res.json({
      success: true,
      count: campaigns.length,
      metrics: {
        totalSpend,
        totalRevenue,
        totalConversions,
        averageRoas: totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : 0
      },
      data: campaigns
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new ad campaign
// @route   POST /api/ads
// @access  Public / Admin
export const createAdCampaign = async (req, res) => {
  try {
    const campaignId = req.body.campaignId || `CAMP-${Date.now().toString().slice(-6)}`;
    const campaign = await AdCampaign.create({
      ...req.body,
      campaignId
    });

    res.status(201).json({ success: true, data: campaign });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
