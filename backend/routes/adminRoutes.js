import express from 'express';
import { renderAdminConsole } from '../controllers/adminController.js';

const router = express.Router();

router.get('/', renderAdminConsole);

export default router;

