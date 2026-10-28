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
  alternatePhone: { type: String },
  email: { type: String },
  address: { type: String, required: true },
  locality: { type: String },
  city: { type: String, required: true },
  state: { type: String, default: 'Maharashtra' },
  pincode: { type: String, required: true },
  landmark: { type: String },
  addressType: { type: String, enum: ['Home', 'Office', 'Other'], default: 'Home' },
  gstin: { type: String },
  companyName: { type: String }
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
  invoiceDate: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // 1. Customer Data
  customerName: { type: String, required: true },
  customerMobile: { type: String, required: true },
  customerEmail: { type: String },
  customerAlternateMobile: { type: String },

  // Addresses (Shipping & Billing)
  deliveryAddress: { type: addressSchema, required: true },
  billingAddress: { type: addressSchema },

  // Items
  items: [orderItemSchema],

  // 2. Billing & Financial Breakdown
  subTotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  couponApplied: { type: String },
  gstAmount: { type: Number, default: 0 },
  cgst: { type: Number, default: 0 },
  sgst: { type: Number, default: 0 },
  igst: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  codFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },

  // 3. Payment Mode & Details
  paymentMode: {
    type: String,
    enum: ['COD', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet', 'EMI'],
    default: 'COD'
  },
  paymentMethod: { type: String, default: 'COD' },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'COD Pending Collection', 'COD Collected', 'Refunded'],
    default: 'Pending'
  },
  transactionId: { type: String },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  codAmountToCollect: { type: Number, default: 0 },
  codCollectionStatus: {
    type: String,
    enum: ['Not Applicable', 'Pending Collection', 'Collected by Delivery Agent', 'Remitted to Bank'],
    default: 'Not Applicable'
  },

  // 4. Courier & Logistics
  courierPartner: {
    type: String,
    enum: ['Delhivery', 'BlueDart Express', 'DTDC', 'XpressBees', 'Shadowfax', 'Ekart Logistics', 'Self Delivery / Local Courier'],
    default: 'Delhivery'
  },
  awbNumber: { type: String },
  trackingNumber: { type: String },
  trackingUrl: { type: String },
  dispatchedAt: { type: Date },
  courierContact: { type: String },
  shippingWeightKg: { type: Number, default: 0.5 },
  expectedDelivery: { type: String },

  // 5. Order & Doorstep Delivery Statuses
  status: {
    type: String,
    enum: [
      'Confirmed',
      'Packed',
      'Dispatched',
      'In Transit',
      'Out for Delivery',
      'Delivery Pending',
      'Delivered',
      'Cancelled',
      'Returned',
      'RTO'
    ],
    default: 'Confirmed'
  },

  // Out for Delivery Telemetry
  outForDeliveryAt: { type: Date },
  deliveryAgentName: { type: String },
  deliveryAgentPhone: { type: String },
  deliveryOtp: { type: String },

  // Delivery Pending Telemetry
  deliveryPendingReason: {
    type: String,
    enum: [
      'Customer Unavailable',
      'Incomplete Address / Wrong Address',
      'Customer Requested Reschedule',
      'Door / Gate Locked',
      'Cash Not Ready',
      'Customer Phone Unreachable',
      'Bad Weather / Area Restriction',
      'Entry Restricted by Society / Security',
      'Package Refused by Customer',
      'Other'
    ]
  },
  deliveryAttemptsCount: { type: Number, default: 0 },
  lastAttemptAt: { type: Date },
  rescheduledDeliveryDate: { type: Date },
  deliveredAt: { type: Date },

  // 6. Ad & Marketing Campaign Attribution
  adCampaignId: { type: String },
  adCampaignName: { type: String },
  adPlatform: {
    type: String,
    enum: ['Meta Ads', 'Instagram Reels', 'Google Search', 'Facebook', 'Influencer Collab', 'Organic', 'Direct', 'WhatsApp', 'Other'],
    default: 'Organic'
  },
  utmSource: { type: String },
  utmMedium: { type: String },
  utmCampaign: { type: String },
  utmContent: { type: String },
  utmTerm: { type: String },

  // Customer Notes
  customerNotes: { type: String }
}, {
  timestamps: true
});

export const Order = mongoose.model('Order', orderSchema);
