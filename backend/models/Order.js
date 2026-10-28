import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  imageUrl: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  quantity: { type: Number, required: true, default: 1 },
  size: { type: String, required: true },
  color: { type: String }
}, { _id: false });

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String, required: true },
  locality: { type: String },
  city: { type: String, required: true },
  state: { type: String, default: 'Maharashtra' },
  pincode: { type: String, required: true },
  landmark: { type: String },
  gstin: { type: String }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    default: () => `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`
  },
  invoiceNumber: {
    type: String,
    unique: true,
    sparse: true,
    default: () => `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Customer Data
  customerName: { type: String, required: true },
  customerMobile: { type: String, required: true },
  customerEmail: { type: String },

  // Addresses (Shipping & Billing)
  deliveryAddress: { type: addressSchema, required: true },
  billingAddress: { type: addressSchema },

  // Items
  items: [orderItemSchema],

  // Billing & Financial Breakdown
  subTotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  couponApplied: { type: String },
  gstAmount: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },

  // Payment Details
  paymentMethod: { type: String, enum: ['COD', 'UPI', 'Credit/Debit Card', 'Net Banking', 'Wallet'], default: 'COD' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
  transactionId: { type: String },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },

  // Shipment & Logistics Status
  status: {
    type: String,
    enum: ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'],
    default: 'Confirmed'
  },
  expectedDelivery: { type: String },
  trackingNumber: { type: String },
  courierPartner: { type: String, default: 'BlueDart / Delhivery' },
  customerNotes: { type: String }
}, {
  timestamps: true
});

export const Order = mongoose.model('Order', orderSchema);
