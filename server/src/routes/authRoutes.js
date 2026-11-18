import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  validateRequest,
} from '../validators/authValidators.js';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, validateRequest(updateProfileSchema), updateProfile);
router.put('/change-password', protect, validateRequest(changePasswordSchema), changePassword);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword);
router.put('/reset-password/:token', validateRequest(resetPasswordSchema), resetPassword);

export default router;
