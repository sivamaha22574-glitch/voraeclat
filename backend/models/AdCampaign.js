import mongoose from 'mongoose';

const adCampaignSchema = new mongoose.Schema({
  campaignId: {
    type: String,
    required: true,
    unique: true
  },
  campaignName: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    enum: ['Meta Ads', 'Instagram Reels', 'Google Ads', 'Facebook', 'Influencer Collab', 'YouTube', 'WhatsApp'],
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Paused', 'Scheduled', 'Completed'],
    default: 'Active'
  },
  dailyBudget: {
    type: Number,
    required: true
  },
  totalSpend: {
    type: Number,
    default: 0
  },
  impressions: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  conversions: {
    type: Number,
    default: 0
  },
  revenueGenerated: {
    type: Number,
    default: 0
  },
  roas: {
    type: Number,
    default: 0
  },
  utmSource: {
    type: String
  },
  utmMedium: {
    type: String
  },
  utmCampaign: {
    type: String
  },
  targetAudience: {
    type: String,
    default: 'Parents with kids aged 0-8 years'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true
});

export const AdCampaign = mongoose.model('AdCampaign', adCampaignSchema);
