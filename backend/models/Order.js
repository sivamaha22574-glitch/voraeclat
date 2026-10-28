import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  imageUrl: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  size: { type: String, required: true },
  color: { type: String }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    default: () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  customerMobile: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  deliveryAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Confirmed'
  },
  paymentMethod: { type: String, default: 'COD' },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  expectedDelivery: { type: String },
  trackingNumber: { type: String }
}, {
  timestamps: true
});

export const Order = mongoose.model('Order', orderSchema);

