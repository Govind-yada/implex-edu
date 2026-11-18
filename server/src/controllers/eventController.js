import Event from '../models/Event.js';
import { ROLES } from '../config/constants.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// @desc    Get calendar events based on visibility and user role
// @route   GET /api/v1/events
export const getEvents = async (req, res, next) => {
  try {
    if (global.__MOCK_MODE__) {
      const { mockEvents } = await import('../data/mockStore.js');
      return sendSuccess(res, 200, 'Events retrieved.', mockEvents);
    }

    const { start, end, category } = req.query;

    const query = {};

    // Filter by visibility: public is always included
    if (!req.user) {
      query.visibility = 'public';
    } else if (req.user.role === ROLES.SUPER_ADMIN) {
      // Admin sees everything
    } else {
      query.visibility = { $in: ['public', req.user.role] };
    }

    if (category) query.category = category;
    if (start && end) {
      query.startDate = { $gte: new Date(start) };
      query.endDate = { $lte: new Date(end) };
    }

    const events = await Event.find(query).sort({ startDate: 1 });

    return sendSuccess(res, 200, 'Events retrieved.', events);
  } catch (error) {
    next(error);
  }
};

// @desc    Create event (Teacher or Admin)
// @route   POST /api/v1/events
export const createEvent = async (req, res, next) => {
  try {
    const { title, description, startDate, endDate, allDay, category, visibility, location, externalLink } =
      req.body;

    const event = await Event.create({
      title,
      description,
      startDate,
      endDate: endDate || startDate,
      allDay: allDay || false,
      category: category || 'quiz',
      visibility: visibility || 'public',
      location: location || 'Online',
      externalLink: externalLink || '',
      createdBy: req.user._id,
    });

    return sendSuccess(res, 201, 'Event created successfully.', event);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/v1/events/:id
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return sendError(res, 404, 'Event not found.');
    }

    // Only creator or admin can delete
    if (
      req.user.role !== ROLES.SUPER_ADMIN &&
      event.createdBy.toString() !== req.user._id.toString()
    ) {
      return sendError(res, 403, 'Unauthorized to delete this event.');
    }

    await Event.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 200, 'Event removed.');
  } catch (error) {
    next(error);
  }
};
