import express from 'express';
import {
  getMyCertificates,
  verifyCertificate,
  issueCertificate,
} from '../controllers/certificateController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

// Public certificate verification
router.get('/verify/:identifier', verifyCertificate);

// User certificates
router.get('/my-certificates', protect, getMyCertificates);

// Issue certificate (Admin)
router.post('/issue', protect, authorize(ROLES.SUPER_ADMIN), issueCertificate);

export default router;
