import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  author: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  verifiedBuyer: { type: Boolean, default: true },
  childAge: { type: String }
}, { _id: true });

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  customId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  categoryId: { type: String, required: true },
  categoryName: { type: String, required: true },
  subCategory: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, required: true, min: 0 },
  discountPercent: { type: Number, default: 0 },
  clubPrice: { type: Number, required: true, min: 0 },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  ageGroup: [{ type: String }],
  gender: { type: String, enum: ['all', 'boy', 'girl', 'unisex'], default: 'all' },
  inStock: { type: Boolean, default: true },
  sizes: [{ type: String }],
  colors: [colorSchema],
  tag: { type: String, enum: ['Best Seller', 'Club Choice', 'Organic', 'New Arrival', 'Trending', ''] },
  badgeColor: { type: String },
  badgeBg: { type: String },
  description: { type: String, default: '' },
  highlights: [{ type: String }],
  fabricOrMaterial: { type: String, default: '' },
  safetyCertifications: [{ type: String }],
  imageIllustration: { type: String, default: 'casual-apparel' },
  imageUrl: { type: String, default: '' },
  reviews: [reviewSchema]
}, {
  timestamps: true
});

productSchema.index({ name: 'text', brand: 'text', description: 'text', subCategory: 'text' });

export const Product = mongoose.model('Product', productSchema);

