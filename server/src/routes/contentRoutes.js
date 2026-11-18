import express from 'express';
import {
  getContentBySection,
  getAllSections,
  updateContentSection,
  getActiveAnnouncements,
} from '../controllers/contentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.get('/announcements/active', getActiveAnnouncements);
router.get('/', getAllSections);
router.get('/:sectionKey', getContentBySection);
router.put('/:sectionKey', protect, authorize(ROLES.SUPER_ADMIN), updateContentSection);

export default router;
