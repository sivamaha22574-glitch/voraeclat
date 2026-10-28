import { Order } from '../models/Order.js';
import { User } from '../models/User.js';

// @desc    Create new order with full billing and customer data
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const {
      customerMobile,
      customerName,
      customerEmail,
      deliveryAddress,
      billingAddress,
      items,
      subTotal,
      discountAmount = 0,
      couponApplied = '',
      gstAmount = 0,
      shippingFee = 0,
      totalAmount,
      paymentMethod = 'COD',
      customerNotes
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4);
    const expectedDelivery = deliveryDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const computedSubTotal = subTotal || items.reduce((acc, it) => acc + (it.price * (it.quantity || 1)), 0);
    const computedTotal = totalAmount || (computedSubTotal - discountAmount + gstAmount + shippingFee);

    const order = await Order.create({
      orderId,
      invoiceNumber,
      user: req.user ? req.user._id : undefined,
      customerMobile,
      customerName,
      customerEmail,
      deliveryAddress,
      billingAddress: billingAddress || deliveryAddress,
      items,
      subTotal: computedSubTotal,
      discountAmount,
      couponApplied,
      gstAmount,
      shippingFee,
      totalAmount: computedTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      isPaid: paymentMethod !== 'COD',
      paidAt: paymentMethod !== 'COD' ? new Date() : undefined,
      status: 'Confirmed',
      expectedDelivery,
      trackingNumber,
      courierPartner: 'BlueDart Express',
      customerNotes
    });

    // Update customer spend stats if user exists
    if (customerMobile) {
      await User.findOneAndUpdate(
        { mobile: customerMobile },
        {
          $inc: { totalOrders: 1, totalSpent: computedTotal },
          $setOnInsert: { name: customerName, email: customerEmail }
        },
        { upsert: true }
      );
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get order by orderId, invoiceNumber, or mongo ID
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      $or: [
        { orderId: id },
        { invoiceNumber: id },
        { trackingNumber: id },
        ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])
      ]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get orders by customer mobile or email
// @route   GET /api/orders/customer/:identifier
// @access  Public
export const getCustomerOrders = async (req, res) => {
  try {
    const { identifier } = req.params;
    const orders = await Order.find({
      $or: [
        { customerMobile: identifier },
        { customerEmail: identifier }
      ]
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders with billing summary (Admin)
// @route   GET /api/orders
// @access  Public / Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

    res.json({
      success: true,
      count: orders.length,
      totalRevenue,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status / tracking
// @route   PUT /api/orders/:id/status
// @access  Public / Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, courierPartner } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (trackingNumber) updateFields.trackingNumber = trackingNumber;
    if (courierPartner) updateFields.courierPartner = courierPartner;

    const order = await Order.findOneAndUpdate(
      {
        $or: [
          { orderId: id },
          ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])
        ]
      },
      updateFields,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
