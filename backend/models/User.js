import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: '' },
  email: { type: String, trim: true, lowercase: true, sparse: true },
  mobile: { type: String, required: true, unique: true, trim: true },
  password: { type: String },
  role: { type: String, enum: ['customer', 'admin', 'moderator'], default: 'customer' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  pincode: { type: String, default: '' },
  notifyOffers: { type: Boolean, default: true },
  isClubMember: { type: Boolean, default: false },
  clubExpiry: { type: Date }
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

