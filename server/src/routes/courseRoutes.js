import express from 'express';
import {
  getCourses,
  getCourseByIdentifier,
  getOrgInfo,
  createCourse,
  updateCourse,
} from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/org/info', getOrgInfo);
router.get('/:identifier', getCourseByIdentifier);

// Admin-only management
router.post('/', protect, authorize(ROLES.SUPER_ADMIN), createCourse);
router.put('/:id', protect, authorize(ROLES.SUPER_ADMIN), updateCourse);

export default router;
