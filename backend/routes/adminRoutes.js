import express from 'express';
import {
  verifyAdmin,
  resetAdmin,
  updateAdmin,
  getAdminUsers,
  createAdminUser,
  deleteAdminUser
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/verify', verifyAdmin);
router.post('/reset', resetAdmin);
router.post('/update', updateAdmin);
router.route('/users')
  .get(getAdminUsers)
  .post(createAdminUser);
router.delete('/users/:id', deleteAdminUser);

export default router;
