import express from 'express';
import {
  subscribeEmail,
  sendVerificationOtp,
  verifyOtp,
  unsubscribeEmail,
  getAdminSubscribers,
  deleteAdminSubscriber,
  sendAdminCampaign,
  getPopupSettings,
  updatePopupSettings,
} from '../controllers/subscriptionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

// Public Subscription & Verification Endpoints
router.post('/subscribe', subscribeEmail);
router.post('/send-otp', sendVerificationOtp);
router.post('/verify-otp', verifyOtp);
router.post('/unsubscribe', unsubscribeEmail);
router.get('/popup-settings', getPopupSettings);

// Super Admin Subscriber Management Endpoints
router.get('/admin', protect, authorize(ROLES.SUPER_ADMIN), getAdminSubscribers);
router.delete('/admin/:id', protect, authorize(ROLES.SUPER_ADMIN), deleteAdminSubscriber);
router.post('/admin/campaign', protect, authorize(ROLES.SUPER_ADMIN), sendAdminCampaign);
router.put('/admin/popup-settings', protect, authorize(ROLES.SUPER_ADMIN), updatePopupSettings);

export default router;
