import { Order } from '../models/Order.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (or Authenticated)
export const createOrder = async (req, res) => {
  try {
    const {
      customerMobile,
      customerName,
      customerEmail,
      deliveryAddress,
      items,
      totalAmount,
      paymentMethod
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const trackingNumber = `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4);
    const expectedDelivery = deliveryDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const order = await Order.create({
      orderId,
      user: req.user ? req.user._id : undefined,
      customerMobile,
      customerName,
      customerEmail,
      deliveryAddress,
      items,
      totalAmount,
      paymentMethod: paymentMethod || 'COD',
      status: 'Confirmed',
      expectedDelivery,
      trackingNumber
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get order by orderId or mongo ID
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      $or: [
        { orderId: id },
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

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findOneAndUpdate(
      {
        $or: [
          { orderId: id },
          ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])
        ]
      },
      { status },
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

