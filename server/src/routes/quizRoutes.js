import express from 'express';
import {
  getQuizzes,
  getQuizById,
  createQuiz,
  startQuizAttempt,
  submitQuizAttempt,
  getAttemptResult,
  getMyAttempts,
} from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.get('/', getQuizzes);
router.get('/my-attempts', protect, getMyAttempts);
router.get('/attempts/:attemptId', protect, getAttemptResult);
router.get('/:id', getQuizById);

// Quiz creation (Teacher or Super Admin)
router.post('/', protect, authorize(ROLES.SUPER_ADMIN, ROLES.TEACHER), createQuiz);

// Student attempt endpoints
router.post('/:id/start', protect, authorize(ROLES.STUDENT), startQuizAttempt);
router.post('/:id/submit', protect, authorize(ROLES.STUDENT), submitQuizAttempt);

export default router;
