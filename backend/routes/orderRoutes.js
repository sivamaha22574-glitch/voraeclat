import express from 'express';
import {
  createOrder,
  getOrderById,
  getCustomerOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController.js';

const router = express.Router();

router.route('/')
  .post(createOrder)
  .get(getAllOrders);

router.route('/customer/:identifier')
  .get(getCustomerOrders);

router.route('/:id')
  .get(getOrderById)
  .put(updateOrderStatus)
  .delete(deleteOrder);

router.route('/:id/status')
  .put(updateOrderStatus);

export default router;
