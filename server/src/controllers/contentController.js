import WebsiteContent from '../models/WebsiteContent.js';
import Announcement from '../models/Announcement.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// @desc    Get website CMS content by sectionKey
// @route   GET /api/v1/content/:sectionKey
export const getContentBySection = async (req, res, next) => {
  try {
    const { sectionKey } = req.params;
    const content = await WebsiteContent.findOne({ sectionKey });

    if (!content) {
      return sendSuccess(res, 200, 'Default section content.', {
        sectionKey,
        title: '',
        subtitle: '',
        content: {},
      });
    }

    return sendSuccess(res, 200, 'Section content retrieved.', content);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all website CMS sections
// @route   GET /api/v1/content
export const getAllSections = async (req, res, next) => {
  try {
    const sections = await WebsiteContent.find({});
    return sendSuccess(res, 200, 'Website sections.', sections);
  } catch (error) {
    next(error);
  }
};

// @desc    Update website CMS section (Admin)
// @route   PUT /api/v1/content/:sectionKey
export const updateContentSection = async (req, res, next) => {
  try {
    const { sectionKey } = req.params;
    const { title, subtitle, content } = req.body;

    const updated = await WebsiteContent.findOneAndUpdate(
      { sectionKey },
      {
        title,
        subtitle,
        content,
        updatedBy: req.user._id,
      },
      { new: true, upsert: true }
    );

    return sendSuccess(res, 200, 'Content section updated successfully.', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get active public announcements
// @route   GET /api/v1/content/announcements/active
export const getActiveAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find({
      isActive: true,
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
    }).sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Active announcements.', announcements);
  } catch (error) {
    next(error);
  }
};
