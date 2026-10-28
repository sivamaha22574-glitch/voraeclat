import express from 'express';
import {
  createOrder,
  getOrderById,
  getCustomerOrders,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createOrder)
  .get(protect, adminOnly, getAllOrders);

router.route('/customer/:identifier')
  .get(getCustomerOrders);

router.route('/:id')
  .get(getOrderById);

router.route('/:id/status')
  .put(protect, adminOnly, updateOrderStatus);

export default router;

