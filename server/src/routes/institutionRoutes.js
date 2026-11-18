import express from 'express';
import {
  getInstitutions,
  getInstitutionById,
  createInstitution,
  updateInstitution,
  deleteInstitution,
} from '../controllers/institutionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.get('/', getInstitutions);
router.get('/:id', getInstitutionById);

// Protected routes (Admin only for creation/modifications)
router.post('/', protect, authorize(ROLES.SUPER_ADMIN), createInstitution);
router.put('/:id', protect, authorize(ROLES.SUPER_ADMIN), updateInstitution);
router.delete('/:id', protect, authorize(ROLES.SUPER_ADMIN), deleteInstitution);

export default router;
