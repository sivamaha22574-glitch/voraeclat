import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  title: { type: String, required: true },
  description: { type: String },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  discountValue: { type: Number, required: true },
  minCartValue: { type: Number, default: 0 },
  maxDiscount: { type: Number },
  validFrom: { type: Date, default: Date.now },
  validUntil: { type: Date },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Coupon = mongoose.model('Coupon', couponSchema);

