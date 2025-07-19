import express, { Request, Response } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from '../controllers/productController';
import { protect, restrictTo } from '../middleware/auth';
import upload from '../middleware/upload';

const router = express.Router();

// Multer setup
// Remove local multer setup and use shared upload middleware

// Image upload endpoint
router.post(
  '/upload',
  protect,
  restrictTo('admin'),
  upload.single('image'),
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    return res.status(201).json({ status: 'success', imageUrl });
  }
);

// Multi-image upload endpoint
router.post(
  '/upload-multiple',
  protect,
  restrictTo('admin'),
  upload.array('images', 10),
  (req: Request, res: Response) => {
    if (!req.files || !(req.files instanceof Array) || req.files.length === 0) {
      return res.status(400).json({ status: 'error', message: 'No files uploaded' });
    }
    const imageUrls = req.files.map((file: any) => `/uploads/${file.filename}`);
    return res.status(201).json({ status: 'success', imageUrls });
  }
);

// Public routes
router.get('/', getProducts);
router.get('/top', getTopProducts);
router.get('/:id', getProductById);

// Protected routes
router.post('/:id/reviews', protect, createProductReview);

// Admin routes
router.post('/', protect, restrictTo('admin'), createProduct);
router.put('/:id', protect, restrictTo('admin'), updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

export default router; 