import { Order } from '../models/Order.js';
import { User } from '../models/User.js';

// @desc    Create new order with full billing, customer, ad, and courier data
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const {
      customerMobile,
      customerName,
      customerEmail,
      customerAlternateMobile,
      deliveryAddress,
      billingAddress,
      items,
      subTotal,
      discountAmount = 0,
      couponApplied = '',
      gstAmount = 0,
      cgst = 0,
      sgst = 0,
      igst = 0,
      shippingFee = 0,
      codFee = 0,
      totalAmount,
      paymentMode = 'COD',
      paymentMethod,
      paymentStatus,
      transactionId,
      courierPartner = 'Delhivery',
      awbNumber,
      trackingNumber,
      // Ad attribution
      adCampaignId,
      adCampaignName,
      adPlatform,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      customerNotes
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    const orderId = req.body.orderId || `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalMobile = customerMobile || req.body.customerPhone || (deliveryAddress && deliveryAddress.phone) || '+91 9999999999';
    const finalName = customerName || (deliveryAddress && deliveryAddress.name) || 'Customer';
    const finalEmail = customerEmail || req.body.customerEmail || (deliveryAddress && deliveryAddress.email) || '';

    const finalDeliveryAddress = deliveryAddress || {
      name: finalName,
      phone: finalMobile,
      address: req.body.customerAddress || 'Address not provided',
      city: req.body.customerCity || 'Mumbai',
      pincode: req.body.customerPincode || '400001'
    };
    const finalTracking = trackingNumber || `DLV-${Math.floor(100000000 + Math.random() * 900000000)}`;
    const finalAwb = awbNumber || `AWB-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const expectedDelivery = deliveryDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const normalizedItems = (items || []).map((it) => ({
      productId: it.productId || it.id || 'PRD-DEFAULT',
      productName: it.productName || it.name || 'Voraeclat Product',
      imageUrl: it.imageUrl || '/voraeclat-mark.png',
      price: Number(it.price) || 499,
      quantity: Number(it.quantity) || 1,
      size: it.size || 'Standard',
      color: it.color || 'Standard',
      originalPrice: it.originalPrice || it.price
    }));

    const computedSubTotal = subTotal || normalizedItems.reduce((acc, it) => acc + (it.price * (it.quantity || 1)), 0);
    const computedTotal = totalAmount || (computedSubTotal - discountAmount + gstAmount + shippingFee + codFee);
    let rawPaymentMode = paymentMode || paymentMethod || 'COD';
    let chosenPaymentMode = 'COD';
    if (rawPaymentMode.toUpperCase().includes('COD') || rawPaymentMode.toUpperCase().includes('CASH')) {
      chosenPaymentMode = 'COD';
    } else if (rawPaymentMode.toUpperCase().includes('UPI')) {
      chosenPaymentMode = 'UPI';
    } else if (rawPaymentMode.toUpperCase().includes('CARD')) {
      chosenPaymentMode = 'Credit Card';
    } else if (rawPaymentMode.toUpperCase().includes('NETBANKING') || rawPaymentMode.toUpperCase().includes('NET BANKING')) {
      chosenPaymentMode = 'Net Banking';
    } else if (rawPaymentMode.toUpperCase().includes('WALLET')) {
      chosenPaymentMode = 'Wallet';
    }

    const isPrepaid = chosenPaymentMode !== 'COD';

    const order = await Order.create({
      orderId,
      invoiceNumber,
      invoiceDate: new Date(),
      user: req.user ? req.user._id : undefined,
      customerMobile: finalMobile,
      customerName: finalName,
      customerEmail: finalEmail,
      customerAlternateMobile,
      deliveryAddress: finalDeliveryAddress,
      billingAddress: billingAddress || finalDeliveryAddress,
      items: normalizedItems,
      subTotal: computedSubTotal,
      discountAmount,
      couponApplied,
      gstAmount,
      cgst,
      sgst,
      igst,
      shippingFee,
      codFee,
      totalAmount: computedTotal,
      // Payment details
      paymentMode: chosenPaymentMode,
      paymentMethod: chosenPaymentMode,
      paymentStatus: paymentStatus || (isPrepaid ? 'Paid' : 'COD Pending Collection'),
      codAmountToCollect: isPrepaid ? 0 : computedTotal,
      codCollectionStatus: isPrepaid ? 'Not Applicable' : 'Pending Collection',
      transactionId: transactionId || (isPrepaid ? `TXN-${Date.now()}` : undefined),
      isPaid: isPrepaid,
      paidAt: isPrepaid ? new Date() : undefined,
      // Courier & Logistics
      courierPartner,
      awbNumber: finalAwb,
      trackingNumber: finalTracking,
      trackingUrl: `https://www.delhivery.com/track/package/${finalAwb}`,
      status: 'Confirmed',
      expectedDelivery,
      // Ad Attribution
      adCampaignId: adCampaignId || 'CAMP-DEFAULT',
      adCampaignName: adCampaignName || 'Direct Organic Storefront',
      adPlatform: adPlatform || 'Organic',
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
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

// @desc    Get order by orderId, invoiceNumber, trackingNumber, or AWB
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
        { awbNumber: id },
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

// @desc    Get all orders with full billing and courier telemetry
// @route   GET /api/orders
// @access  Public / Admin
export const getAllOrders = async (req, res) => {
  try {
    const { status, courierPartner, paymentMode, search } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (courierPartner && courierPartner !== 'all') filter.courierPartner = courierPartner;
    if (paymentMode && paymentMode !== 'all') filter.paymentMode = paymentMode;

    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerMobile: { $regex: search, $options: 'i' } },
        { trackingNumber: { $regex: search, $options: 'i' } },
        { awbNumber: { $regex: search, $options: 'i' } },
        { 'deliveryAddress.city': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
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

// @desc    Update order status, out-for-delivery, delivery-pending, and courier info
// @route   PUT /api/orders/:id/status
// @access  Public / Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      trackingNumber,
      awbNumber,
      courierPartner,
      courierContact,
      // Out for Delivery fields
      outForDeliveryAt,
      deliveryAgentName,
      deliveryAgentPhone,
      deliveryOtp,
      // Delivery Pending fields
      deliveryPendingReason,
      rescheduledDeliveryDate,
      // Payment & Settlement fields
      paymentStatus,
      codCollectionStatus
    } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (trackingNumber) updateFields.trackingNumber = trackingNumber;
    if (awbNumber) updateFields.awbNumber = awbNumber;
    if (courierPartner) updateFields.courierPartner = courierPartner;
    if (courierContact) updateFields.courierContact = courierContact;

    // Special status handlers
    if (status === 'Out for Delivery') {
      updateFields.outForDeliveryAt = outForDeliveryAt || new Date();
      if (deliveryAgentName) updateFields.deliveryAgentName = deliveryAgentName;
      if (deliveryAgentPhone) updateFields.deliveryAgentPhone = deliveryAgentPhone;
      if (deliveryOtp) updateFields.deliveryOtp = deliveryOtp;
    }

    if (status === 'Delivery Pending') {
      if (deliveryPendingReason) updateFields.deliveryPendingReason = deliveryPendingReason;
      updateFields.lastAttemptAt = new Date();
      if (rescheduledDeliveryDate) updateFields.rescheduledDeliveryDate = new Date(rescheduledDeliveryDate);
      updateFields.$inc = { deliveryAttemptsCount: 1 };
    }

    if (status === 'Delivered') {
      updateFields.deliveredAt = new Date();
      if (paymentStatus) {
        updateFields.paymentStatus = paymentStatus;
      } else {
        updateFields.paymentStatus = 'Paid';
        updateFields.isPaid = true;
        updateFields.paidAt = new Date();
        updateFields.codCollectionStatus = 'Collected by Delivery Agent';
      }
    }

    if (codCollectionStatus) updateFields.codCollectionStatus = codCollectionStatus;

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
