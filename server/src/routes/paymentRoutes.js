import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  createPaymentOrder,
  submitPaymentReference,
  getPaymentStatus,
  getAdminPayments,
  verifyPayment,
  rejectPayment,
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { ROLES } from '../config/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.resolve(__dirname, '../../uploads/payments');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, `proof-${unique}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, PNG, WebP) are allowed as payment proof.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

const router = express.Router();

// Public Payment Endpoints
router.post('/create-order', createPaymentOrder);
router.post('/submit-reference', upload.single('proofImage'), submitPaymentReference);
router.get('/status/:orderId', getPaymentStatus);

// Super Admin Payment Management Endpoints
router.get('/admin', protect, authorize(ROLES.SUPER_ADMIN), getAdminPayments);
router.patch('/admin/:paymentId/verify', protect, authorize(ROLES.SUPER_ADMIN), verifyPayment);
router.patch('/admin/:paymentId/reject', protect, authorize(ROLES.SUPER_ADMIN), rejectPayment);

export default router;
