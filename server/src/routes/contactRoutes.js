import express from 'express';
import {
  submitContact,
  getContactMessages,
  updateContactStatus,
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.post('/', submitContact);
router.get('/', protect, authorize(ROLES.SUPER_ADMIN), getContactMessages);
router.put('/:id/status', protect, authorize(ROLES.SUPER_ADMIN), updateContactStatus);

export default router;
