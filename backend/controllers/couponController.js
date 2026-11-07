import { Coupon } from '../models/Coupon.js';
import { isDbConnected } from '../config/db.js';

const defaultCoupons = [
  {
    code: 'FIRST10',
    title: '10% Off First Order',
    description: 'Get 10% instant discount on your first order above ₹499',
    discountType: 'percentage',
    discountValue: 10,
    minCartValue: 499,
    maxDiscount: 200,
    isActive: true
  },
  {
    code: 'FLAT100',
    title: 'Flat ₹100 Off',
    description: 'Flat ₹100 discount on orders above ₹999',
    discountType: 'flat',
    discountValue: 100,
    minCartValue: 999,
    isActive: true
  },
  {
    code: 'VORAECLAT',
    title: 'Special Festive 15% Off',
    description: 'Exclusive 15% discount on cart value above ₹1299',
    discountType: 'percentage',
    discountValue: 15,
    minCartValue: 1299,
    maxDiscount: 500,
    isActive: true
  }
];

let inMemoryCoupons = [...defaultCoupons];

// @desc    Validate a promo coupon code
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal = 0 } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const cleanCode = code.trim().toUpperCase();
    let coupon = null;

    if (isDbConnected) {
      try {
        coupon = await Coupon.findOne({
          code: cleanCode,
          isActive: true
        });
      } catch (err) {
        // fallback to memory
      }
    }

    if (!coupon) {
      coupon = inMemoryCoupons.find(c => c.code.toUpperCase() === cleanCode && c.isActive);
    }

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    if (coupon.validUntil && new Date() > new Date(coupon.validUntil)) {
      return res.status(400).json({ success: false, message: 'Coupon code has expired' });
    }

    if (cartTotal < (coupon.minCartValue || 0)) {
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
    if (isDbConnected) {
      try {
        const coupons = await Coupon.find({ isActive: true });
        if (coupons && coupons.length > 0) {
          return res.json({ success: true, count: coupons.length, data: coupons });
        }
      } catch (err) {
        // fallback to memory
      }
    }

    res.json({
      success: true,
      count: inMemoryCoupons.length,
      data: inMemoryCoupons,
      source: isDbConnected ? 'mongodb' : 'in-memory-fallback'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
