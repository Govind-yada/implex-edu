import Course from '../models/Course.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { OFFICIAL_COURSES, IMPLEX_ORGANIZATION_INFO } from '../data/coursesData.js';

// @desc    Get all courses with optional filters (category, medium, listCategory, search)
// @route   GET /api/v1/courses
// @access  Public
export const getCourses = async (req, res, next) => {
  try {
    const { category, medium, listCategory, search, classLevel } = req.query;

    const query = { isActive: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (medium && medium !== 'all') {
      query.medium = medium;
    }

    if (listCategory && listCategory !== 'all') {
      query.listCategory = listCategory;
    }

    if (classLevel && classLevel !== 'all') {
      query.classLevel = classLevel;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { courseCode: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let courses = [];
    try {
      courses = await Course.find(query).sort({ order: 1, createdAt: 1 });
    } catch (dbErr) {
      // In case DB is offline, filter from static OFFICIAL_COURSES
    }

    if (!courses || courses.length === 0) {
      // Filter in-memory fallback
      courses = OFFICIAL_COURSES.filter((c) => {
        if (category && category !== 'all' && c.category !== category) return false;
        if (medium && medium !== 'all' && c.medium !== medium) return false;
        if (listCategory && listCategory !== 'all' && c.listCategory !== listCategory) return false;
        if (classLevel && classLevel !== 'all' && c.classLevel !== classLevel) return false;
        if (search) {
          const s = search.toLowerCase();
          return (
            c.title.toLowerCase().includes(s) ||
            c.courseCode.toLowerCase().includes(s) ||
            c.description.toLowerCase().includes(s)
          );
        }
        return true;
      });
    }

    return sendSuccess(res, 200, 'Courses retrieved successfully.', {
      count: courses.length,
      organization: IMPLEX_ORGANIZATION_INFO,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by code or id
// @route   GET /api/v1/courses/:identifier
// @access  Public
export const getCourseByIdentifier = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    let course = null;
    try {
      if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        course = await Course.findById(identifier);
      } else {
        course = await Course.findOne({ courseCode: identifier.toUpperCase() });
      }
    } catch (e) {}

    if (!course) {
      course = OFFICIAL_COURSES.find(
        (c) => c.courseCode.toUpperCase() === identifier.toUpperCase()
      );
    }

    if (!course) {
      return sendError(res, 404, 'Course not found');
    }

    return sendSuccess(res, 200, 'Course details retrieved.', { course });
  } catch (error) {
    next(error);
  }
};

// @desc    Get organization legal & contact details (TAN, PAN, emails, address)
// @route   GET /api/v1/courses/org/info
// @access  Public
export const getOrgInfo = async (req, res) => {
  return sendSuccess(res, 200, 'Organization details retrieved.', { organization: IMPLEX_ORGANIZATION_INFO });
};

// @desc    Create course (Admin)
// @route   POST /api/v1/courses
// @access  Private (super_admin)
export const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    return sendSuccess(res, 201, 'Course created successfully.', { course });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course (Admin)
// @route   PUT /api/v1/courses/:id
// @access  Private (super_admin)
export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return sendError(res, 404, 'Course not found');
    }

    return sendSuccess(res, 200, 'Course updated successfully.', { course });
  } catch (error) {
    next(error);
  }
};
