import express from 'express';
import {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserByPhone,
  upsertCustomer,
  deleteUser,
  sendOtp,
  verifyOtp
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getUsers);

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/upsert', upsertCustomer);
router.get('/phone/:phone', getUserByPhone);
router.delete('/:id', deleteUser);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
