import express from 'express';
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner
} from '../controllers/bannerController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBanners)
  .post(protect, adminOnly, createBanner);

router.route('/:id')
  .put(protect, adminOnly, updateBanner)
  .delete(protect, adminOnly, deleteBanner);

export default router;

