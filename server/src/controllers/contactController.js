import ContactMessage from '../models/ContactMessage.js';
import { CONTACT_STATUS } from '../config/constants.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// @desc    Submit public contact enquiry
// @route   POST /api/v1/contact
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return sendError(res, 400, 'Please complete all required fields.');
    }

    if (global.__MOCK_MODE__) {
      return sendSuccess(
        res,
        201,
        'Thank you! Your message has been received. Our educational team will respond shortly.',
        { id: `mock_contact_${Date.now()}` }
      );
    }

    const contactDoc = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      subject,
      message,
    });

    return sendSuccess(
      res,
      201,
      'Thank you! Your message has been received. Our educational team will respond shortly.',
      { id: contactDoc._id }
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get contact enquiries (Admin)
// @route   GET /api/v1/contact
export const getContactMessages = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await ContactMessage.countDocuments(query);
    const messages = await ContactMessage.find(query)
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return sendSuccess(res, 200, 'Contact enquiries retrieved.', messages, {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      limit: Number(limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update enquiry status and notes (Admin)
// @route   PUT /api/v1/contact/:id/status
export const updateContactStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) {
      return sendError(res, 404, 'Contact enquiry not found.');
    }

    if (status) msg.status = status;
    if (adminNotes !== undefined) msg.adminNotes = adminNotes;

    if (status === CONTACT_STATUS.RESOLVED) {
      msg.resolvedBy = req.user._id;
      msg.resolvedAt = new Date();
    }

    await msg.save();
    return sendSuccess(res, 200, 'Enquiry status updated successfully.', msg);
  } catch (error) {
    next(error);
  }
};
