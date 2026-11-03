import mongoose from 'mongoose';
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
    const { id } = req.params;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id) && id.length === 24;
    const lead = await FranchiseLead.findOneAndUpdate(
      {
        $or: [
          { leadId: id },
          ...(isValidObjectId ? [{ _id: new mongoose.Types.ObjectId(id) }] : [])
        ]
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!lead) {
      console.warn(`[MongoDB Lead Update]: Matched: 0, Modified: 0 | id: "${id}"`);
      return res.status(404).json({ success: false, matchedCount: 0, modifiedCount: 0, message: 'Lead not found' });
    }
    console.log(`[MongoDB Lead Update]: Matched: 1, Modified: 1 | Lead: ${lead.leadId || lead._id} | Status: ${lead.status}`);
    res.json({ success: true, matchedCount: 1, modifiedCount: 1, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

