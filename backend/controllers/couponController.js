import { Coupon } from '../models/Coupon.js';

// @desc    Validate a promo coupon code
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal = 0 } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    if (coupon.validUntil && new Date() > coupon.validUntil) {
      return res.status(400).json({ success: false, message: 'Coupon code has expired' });
    }

    if (cartTotal < coupon.minCartValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minCartValue} required for this coupon`
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    res.json({
      success: true,
      data: {
        code: coupon.code,
        title: coupon.title,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Math.round(discountAmount)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all active coupons
// @route   GET /api/coupons
// @access  Public
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true });
    res.json({ success: true, count: coupons.length, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

