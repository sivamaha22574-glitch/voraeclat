import mongoose from 'mongoose';

const franchiseLeadSchema = new mongoose.Schema({
  leadId: {
    type: String,
    unique: true,
    default: () => `FL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
  },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  currentBusiness: { type: String },
  commercialSpaceStatus: { type: String },
  carpetArea: { type: String },
  investmentBudget: { type: String },
  expectedTimeline: { type: String },
  message: { type: String },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'In Discussion', 'Approved', 'Rejected'],
    default: 'New'
  },
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

export const FranchiseLead = mongoose.model('FranchiseLead', franchiseLeadSchema);

