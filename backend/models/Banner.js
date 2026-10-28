import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  customId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  location: { type: String, default: 'homepage' },
  group: {
    type: String,
    enum: ['spotlight', 'promotional', 'shop_by_style', 'hero'],
    default: 'hero'
  },
  badge: { type: String, default: '' },
  title: { type: String, required: true },
  underText: { type: String, default: '' },
  imageUrl: { type: String, required: true },
  buttonText: { type: String, default: 'Shop Now' },
  buttonLink: { type: String, default: '#' },
  priceTag: { type: String },
  originalPriceTag: { type: String },
  discountTag: { type: String },
  couponCode: { type: String },
  styleHighlights: { type: String },
  accentColor: { type: String, default: '#F59E0B' },
  objectPosition: { type: String, enum: ['center', 'top', 'bottom'], default: 'center' },
  fitMode: { type: String, enum: ['cover', 'contain'], default: 'cover' },
  active: { type: Boolean, default: true },
  orderIndex: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const Banner = mongoose.model('Banner', bannerSchema);

