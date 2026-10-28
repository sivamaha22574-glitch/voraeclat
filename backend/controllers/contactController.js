import { ContactMessage } from '../models/ContactMessage.js';

// @desc    Submit a contact inquiry message
// @route   POST /api/contact
// @access  Public
export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const contact = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message
    });

    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
export const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

