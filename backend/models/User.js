import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userAddressSchema = new mongoose.Schema({
  title: { type: String, default: 'Home' }, // Home, Office, Other
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  locality: { type: String },
  city: { type: String, required: true },
  state: { type: String, default: 'Maharashtra' },
  pincode: { type: String, required: true },
  landmark: { type: String },
  isDefault: { type: Boolean, default: false }
}, { _id: true });

const childProfileSchema = new mongoose.Schema({
  name: { type: String },
  gender: { type: String, enum: ['boy', 'girl'] },
  birthDate: { type: Date },
  ageGroup: { type: String }
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: '' },
  email: { type: String, trim: true, lowercase: true, sparse: true },
  mobile: { type: String, required: true, unique: true, trim: true },
  password: { type: String },
  role: { type: String, enum: ['customer', 'admin', 'moderator'], default: 'customer' },
  
  // Billing & Shipping addresses
  addresses: [userAddressSchema],
  defaultBillingAddress: userAddressSchema,

  // Voraeclat Club Membership
  isClubMember: { type: Boolean, default: false },
  clubTier: { type: String, enum: ['Standard', 'Silver', 'Gold', 'VIP'], default: 'Standard' },
  clubExpiry: { type: Date },

  // Customer Shopping Analytics
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  walletBalance: { type: Number, default: 0 },

  // Parent Profile
  children: [childProfileSchema],
  notifyOffers: { type: Boolean, default: true }
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
