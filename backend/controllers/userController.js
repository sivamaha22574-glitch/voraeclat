import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'voraeclat_secret', {
    expiresIn: '30d'
  });
};

// @desc    Auth user / OTP login / Password login
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile) {
      return res.status(400).json({ success: false, message: 'Please provide mobile number' });
    }

    let user = await User.findOne({ mobile });

    // If user does not exist yet (OTP-style quick signup)
    if (!user) {
      user = await User.create({
        mobile,
        name: req.body.name || `User-${mobile.slice(-4)}`,
        email: req.body.email || ''
      });
    } else if (password && user.password) {
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        address: user.address,
        city: user.city,
        pincode: user.pincode,
        isClubMember: user.isClubMember,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password, address, city, pincode } = req.body;

    const userExists = await User.findOne({ mobile });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this mobile number' });
    }

    const user = await User.create({
      name,
      email,
      mobile,
      password,
      address,
      city,
      pincode
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        isClubMember: user.isClubMember,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.address = req.body.address || user.address;
    user.city = req.body.city || user.city;
    user.pincode = req.body.pincode || user.pincode;
    if (req.body.notifyOffers !== undefined) {
      user.notifyOffers = req.body.notifyOffers;
    }

    const updatedUser = await user.save();
    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        address: updatedUser.address,
        city: updatedUser.city,
        pincode: updatedUser.pincode,
        isClubMember: updatedUser.isClubMember
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all registered customers
// @route   GET /api/users
// @access  Public / Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      data: users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        mobile: u.mobile,
        address: u.addresses?.[0]?.address || u.address || '',
        city: u.addresses?.[0]?.city || u.city || '',
        pincode: u.addresses?.[0]?.pincode || u.pincode || '',
        isLoggedIn: true,
        notifyOffers: u.notifyOffers,
        joinedDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '',
        totalOrders: u.totalOrders || 0,
        totalSpent: u.totalSpent || 0,
        clubTier: u.clubTier || 'Standard',
        isClubMember: u.isClubMember || false
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get customer by phone
// @route   GET /api/users/phone/:phone
// @access  Public
export const getUserByPhone = async (req, res) => {
  try {
    const cleanPhone = decodeURIComponent(req.params.phone).trim();
    const user = await User.findOne({
      $or: [
        { mobile: cleanPhone },
        { mobile: cleanPhone.replace(/\s+/g, '') },
        { mobile: cleanPhone.startsWith('+91') ? cleanPhone.replace('+91', '').trim() : `+91 ${cleanPhone}` }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.addresses?.[0]?.address || user.address || '',
        city: user.addresses?.[0]?.city || user.city || '',
        pincode: user.addresses?.[0]?.pincode || user.pincode || '',
        isLoggedIn: true,
        notifyOffers: user.notifyOffers,
        joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '',
        totalOrders: user.totalOrders || 0,
        totalSpent: user.totalSpent || 0,
        clubTier: user.clubTier || 'Standard',
        isClubMember: user.isClubMember || false
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upsert customer details
// @route   POST /api/users/upsert
// @access  Public
export const upsertCustomer = async (req, res) => {
  try {
    const { mobile, name, email, address, city, pincode, notifyOffers } = req.body;
    if (!mobile) {
      return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }

    const cleanMobile = mobile.trim();
    const updateDoc = {
      $set: {
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
        ...(address ? { address } : {}),
        ...(city ? { city } : {}),
        ...(pincode ? { pincode } : {}),
        ...(notifyOffers !== undefined ? { notifyOffers } : {})
      }
    };

    const user = await User.findOneAndUpdate(
      { mobile: cleanMobile },
      updateDoc,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


