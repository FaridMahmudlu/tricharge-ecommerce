import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();

// All order routes require authentication
router.use(protect);

// User routes
router.post('/', createOrder);
router.get('/myorders', getMyOrders);
router.get('/:id', getOrderById);
router.post('/:id/cancel', cancelOrder);

// Admin routes
router.get('/', restrictTo('admin'), getAllOrders);
router.put('/:id/status', restrictTo('admin'), updateOrderStatus);

export default router; 