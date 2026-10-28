import { FranchiseLead } from '../models/FranchiseLead.js';

// @desc    Submit new franchise lead
// @route   POST /api/leads
// @access  Public
export const submitLead = async (req, res) => {
  try {
    const lead = await FranchiseLead.create(req.body);
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all franchise leads
// @route   GET /api/leads
// @access  Private/Admin
export const getLeads = async (req, res) => {
  try {
    const leads = await FranchiseLead.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: leads.length, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update franchise lead status
// @route   PUT /api/leads/:id
// @access  Private/Admin
export const updateLeadStatus = async (req, res) => {
  try {
    const lead = await FranchiseLead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

