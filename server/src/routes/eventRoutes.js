import express from 'express';
import { getEvents, createEvent, deleteEvent } from '../controllers/eventController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

// Public can view events (or optionally enriched if logged in)
router.get('/', (req, res, next) => {
  // Optional auth
  if (req.cookies?.token || req.headers.authorization) {
    return protect(req, res, () => getEvents(req, res, next));
  }
  return getEvents(req, res, next);
});

router.post('/', protect, authorize(ROLES.SUPER_ADMIN, ROLES.TEACHER), createEvent);
router.delete('/:id', protect, authorize(ROLES.SUPER_ADMIN, ROLES.TEACHER), deleteEvent);

export default router;
