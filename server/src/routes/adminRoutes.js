import express from 'express';
import {
  getAdminOverview,
  getUsers,
  updateUserStatus,
  getPlatformSettings,
  updatePlatformSetting,
  getAuditLogs,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(protect);
router.use(authorize(ROLES.SUPER_ADMIN));

router.get('/overview', getAdminOverview);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/settings', getPlatformSettings);
router.put('/settings', updatePlatformSetting);
router.get('/audit-logs', getAuditLogs);

export default router;
