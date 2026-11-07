import mongoose from 'mongoose';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { isDbConnected } from '../config/db.js';

let inMemoryOrders = [];

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

    let existing = null;
    if (isDbConnected) {
      try {
        existing = await Order.findOne({ orderId });
      } catch (e) {
        // fallback
      }
    }
    if (!existing) {
      existing = inMemoryOrders.find(o => o.orderId === orderId);
    }

    const invoiceNumber = existing?.invoiceNumber || req.body.invoiceNumber || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalMobile = customerMobile || req.body.customerPhone || (deliveryAddress && deliveryAddress.phone) || existing?.customerMobile || '+91 9999999999';
    const finalName = customerName || (deliveryAddress && deliveryAddress.name) || existing?.customerName || 'Customer';
    const finalEmail = customerEmail || req.body.customerEmail || (deliveryAddress && deliveryAddress.email) || existing?.customerEmail || '';

    const finalDeliveryAddress = deliveryAddress || existing?.deliveryAddress || {
      name: finalName,
      phone: finalMobile,
      address: req.body.customerAddress || 'Address not provided',
      city: req.body.customerCity || 'Mumbai',
      pincode: req.body.customerPincode || '400001'
    };
    const finalTracking = trackingNumber || req.body.tracking || existing?.trackingNumber || `DELHIVERY-${orderId}IN`;
    const finalAwb = awbNumber || req.body.awb || existing?.awbNumber || `DELHIVERY-${orderId}IN`;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const expectedDelivery = req.body.expectedDelivery || existing?.expectedDelivery || deliveryDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const normalizedItems = (items || []).map((it) => ({
      productId: it.productId || it.id || 'PRD-DEFAULT',
      productName: it.productName || it.name || 'Voraeclat Product',
      imageUrl: it.imageUrl || '/voraeclat-mark.png',
      price: Number(it.price) || 449,
      quantity: Number(it.quantity) || 1,
      size: it.size || 'Standard',
      color: it.color || 'Standard',
      originalPrice: it.originalPrice || it.price
    }));

    const computedSubTotal = Number(subTotal) || (normalizedItems.length > 0 ? normalizedItems.reduce((acc, it) => acc + (it.price * (it.quantity || 1)), 0) : existing?.subTotal || 449);
    const computedTotal = Number(totalAmount) || (computedSubTotal - discountAmount + gstAmount + shippingFee + codFee) || existing?.totalAmount || 498;
    let rawPaymentMode = paymentMode || paymentMethod || existing?.paymentMode || 'COD';
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

    const orderPayload = {
      orderId,
      invoiceNumber,
      invoiceDate: existing?.invoiceDate || new Date(),
      user: req.user ? req.user._id : undefined,
      customerMobile: finalMobile,
      customerName: finalName,
      customerEmail: finalEmail,
      customerAlternateMobile,
      deliveryAddress: finalDeliveryAddress,
      billingAddress: billingAddress || finalDeliveryAddress,
      items: normalizedItems.length > 0 ? normalizedItems : (existing?.items || []),
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
      paymentStatus: paymentStatus || existing?.paymentStatus || (isPrepaid ? 'Paid' : 'COD Pending Collection'),
      codAmountToCollect: isPrepaid ? 0 : computedTotal,
      codCollectionStatus: isPrepaid ? 'Not Applicable' : 'Pending Collection',
      transactionId: transactionId || existing?.transactionId || (isPrepaid ? `TXN-${Date.now()}` : undefined),
      isPaid: isPrepaid,
      paidAt: isPrepaid ? (existing?.paidAt || new Date()) : undefined,
      // Courier & Logistics
      courierPartner: courierPartner || existing?.courierPartner || 'Delhivery',
      awbNumber: finalAwb,
      trackingNumber: finalTracking,
      trackingUrl: `https://www.delhivery.com/track/package/${finalAwb}`,
      status: req.body.status || existing?.status || 'Confirmed',
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
      customerNotes,
      createdAt: existing?.createdAt || new Date().toISOString()
    };

    let savedOrder = orderPayload;

    if (isDbConnected) {
      try {
        savedOrder = await Order.findOneAndUpdate(
          { orderId },
          { $set: orderPayload },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        if (customerMobile) {
          await User.findOneAndUpdate(
            { mobile: customerMobile },
            {
              $inc: { totalOrders: 1, totalSpent: computedTotal },
              $setOnInsert: { name: customerName, email: customerEmail }
            },
            { upsert: true }
          ).catch(() => {});
        }
      } catch (dbErr) {
        console.warn('DB createOrder warning:', dbErr.message);
      }
    }

    // Always maintain in-memory cache
    const memIdx = inMemoryOrders.findIndex(o => o.orderId === orderId);
    if (memIdx !== -1) {
      inMemoryOrders[memIdx] = { ...inMemoryOrders[memIdx], ...orderPayload };
    } else {
      inMemoryOrders.unshift(orderPayload);
    }

    res.status(201).json({ success: true, data: savedOrder });
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

    if (isDbConnected) {
      try {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id) && id.length === 24;
        const order = await Order.findOne({
          $or: [
            { orderId: id },
            { invoiceNumber: id },
            { trackingNumber: id },
            { awbNumber: id },
            ...(isValidObjectId ? [{ _id: new mongoose.Types.ObjectId(id) }] : [])
          ]
        });

        if (order) {
          return res.json({ success: true, data: order });
        }
      } catch (dbErr) {
        console.warn('DB getOrderById warning:', dbErr.message);
      }
    }

    const memOrder = inMemoryOrders.find(
      o => o.orderId === id || o.invoiceNumber === id || o.trackingNumber === id || o.awbNumber === id
    );

    if (!memOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: memOrder });
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

    if (isDbConnected) {
      try {
        const orders = await Order.find({
          $or: [
            { customerMobile: identifier },
            { customerEmail: identifier }
          ]
        }).sort({ createdAt: -1 });

        return res.json({ success: true, count: orders.length, data: orders });
      } catch (dbErr) {
        console.warn('DB getCustomerOrders warning:', dbErr.message);
      }
    }

    const filtered = inMemoryOrders.filter(
      o => o.customerMobile === identifier || o.customerEmail === identifier
    );

    res.json({ success: true, count: filtered.length, data: filtered });
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

    if (isDbConnected) {
      try {
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

        return res.json({
          success: true,
          count: orders.length,
          totalRevenue,
          data: orders,
          source: 'mongodb'
        });
      } catch (dbErr) {
        console.warn('DB getAllOrders warning, using in-memory store:', dbErr.message);
      }
    }

    // In-memory fallback
    let filtered = [...inMemoryOrders];
    if (status && status !== 'all') filtered = filtered.filter(o => o.status === status);
    if (courierPartner && courierPartner !== 'all') filtered = filtered.filter(o => o.courierPartner === courierPartner);
    if (paymentMode && paymentMode !== 'all') filtered = filtered.filter(o => o.paymentMode === paymentMode);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(o =>
        (o.orderId && o.orderId.toLowerCase().includes(q)) ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.customerMobile && o.customerMobile.includes(q))
      );
    }

    const totalRevenue = filtered.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

    res.json({
      success: true,
      count: filtered.length,
      totalRevenue,
      data: filtered,
      source: isDbConnected ? 'mongodb' : 'in-memory-fallback'
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
      outForDeliveryAt,
      deliveryAgentName,
      deliveryAgentPhone,
      deliveryOtp,
      deliveryPendingReason,
      rescheduledDeliveryDate,
      paymentStatus,
      codCollectionStatus
    } = req.body;

    const updateFields = {};
    const targetStatus = status || req.body.orderStatus;
    if (targetStatus) {
      updateFields.status = targetStatus;
      updateFields.orderStatus = targetStatus;
    }
    if (trackingNumber) updateFields.trackingNumber = trackingNumber;
    if (awbNumber) updateFields.awbNumber = awbNumber;
    if (courierPartner) updateFields.courierPartner = courierPartner;
    if (courierContact) updateFields.courierContact = courierContact;
    if (req.body.items && Array.isArray(req.body.items)) updateFields.items = req.body.items;
    if (req.body.deliveryAddress) updateFields.deliveryAddress = req.body.deliveryAddress;
    if (req.body.totalAmount !== undefined) updateFields.totalAmount = req.body.totalAmount;
    if (req.body.subTotal !== undefined) updateFields.subTotal = req.body.subTotal;
    if (req.body.customerName) updateFields.customerName = req.body.customerName;
    if (req.body.customerMobile) updateFields.customerMobile = req.body.customerMobile;

    if (status === 'Out for Delivery') {
      updateFields.outForDeliveryAt = outForDeliveryAt || new Date();
      if (deliveryAgentName) updateFields.deliveryAgentName = deliveryAgentName;
      if (deliveryAgentPhone) updateFields.deliveryAgentPhone = deliveryAgentPhone;
      if (deliveryOtp) updateFields.deliveryOtp = deliveryOtp;
    }

    const updateDoc = { $set: updateFields };

    if (status === 'Delivery Pending') {
      if (deliveryPendingReason) updateFields.deliveryPendingReason = deliveryPendingReason;
      updateFields.lastAttemptAt = new Date();
      if (rescheduledDeliveryDate) updateFields.rescheduledDeliveryDate = new Date(rescheduledDeliveryDate);
      updateDoc.$inc = { deliveryAttemptsCount: 1 };
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

    let updatedOrder = null;

    if (isDbConnected) {
      try {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(id) && id.length === 24;
        updatedOrder = await Order.findOneAndUpdate(
          {
            $or: [
              { orderId: id },
              ...(isValidObjectId ? [{ _id: new mongoose.Types.ObjectId(id) }] : [])
            ]
          },
          updateDoc,
          { new: true }
        );
      } catch (dbErr) {
        console.warn('DB updateOrderStatus warning:', dbErr.message);
      }
    }

    // Update in-memory
    const memIdx = inMemoryOrders.findIndex(o => o.orderId === id || o.id === id);
    if (memIdx !== -1) {
      inMemoryOrders[memIdx] = { ...inMemoryOrders[memIdx], ...updateFields };
      if (!updatedOrder) updatedOrder = inMemoryOrders[memIdx];
    }

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, matchedCount: 1, modifiedCount: 1, data: updatedOrder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
