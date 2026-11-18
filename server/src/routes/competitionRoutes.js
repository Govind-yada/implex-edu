import express from 'express';
import {
  getCompetitions,
  getCompetitionById,
  createCompetition,
  registerForCompetition,
  getMyRegistrations,
} from '../controllers/competitionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.get('/', getCompetitions);
router.get('/my-registrations', protect, getMyRegistrations);
router.get('/:id', getCompetitionById);

// Admin endpoints
router.post('/', protect, authorize(ROLES.SUPER_ADMIN), createCompetition);

// Registration endpoint
router.post('/:id/register', protect, registerForCompetition);

export default router;
