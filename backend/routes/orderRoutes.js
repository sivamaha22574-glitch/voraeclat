import express from 'express';
import {
  createOrder,
  getOrderById,
  getCustomerOrders,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';

const router = express.Router();

router.route('/')
  .post(createOrder)
  .get(getAllOrders);

router.route('/customer/:identifier')
  .get(getCustomerOrders);

router.route('/:id')
  .get(getOrderById);

router.route('/:id/status')
  .put(updateOrderStatus);

export default router;
