import Institution from '../models/Institution.js';
import InstitutionMembership from '../models/InstitutionMembership.js';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// @desc    Get all institutions with filtering and pagination
// @route   GET /api/v1/institutions
export const getInstitutions = async (req, res, next) => {
  try {
    const { type, search, page = 1, limit = 10, isActive } = req.query;

    const query = {};
    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Institution.countDocuments(query);
    const institutions = await Institution.find(query)
      .populate('assignedAssociates', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return sendSuccess(res, 200, 'Institutions retrieved successfully.', institutions, {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      limit: Number(limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single institution
// @route   GET /api/v1/institutions/:id
export const getInstitutionById = async (req, res, next) => {
  try {
    const institution = await Institution.findById(req.params.id).populate(
      'assignedAssociates',
      'name email phone'
    );

    if (!institution) {
      return sendError(res, 404, 'Institution not found.');
    }

    // Also get counts of students and teachers
    const studentCount = await InstitutionMembership.countDocuments({
      institution: institution._id,
      role: 'student',
      status: 'active',
    });
    const teacherCount = await InstitutionMembership.countDocuments({
      institution: institution._id,
      role: 'teacher',
      status: 'active',
    });

    return sendSuccess(res, 200, 'Institution details retrieved.', {
      institution,
      stats: {
        totalStudents: studentCount,
        totalTeachers: teacherCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new institution (Super Admin)
// @route   POST /api/v1/institutions
export const createInstitution = async (req, res, next) => {
  try {
    const { name, code, type, description, email, phone, website, address, assignedAssociates } =
      req.body;

    const existingCode = await Institution.findOne({ code: code.toUpperCase() });
    if (existingCode) {
      return sendError(res, 409, `Institution code '${code.toUpperCase()}' is already in use.`);
    }

    const institution = await Institution.create({
      name,
      code: code.toUpperCase(),
      type,
      description,
      email,
      phone,
      website,
      address,
      assignedAssociates: assignedAssociates || [],
    });

    return sendSuccess(res, 201, 'Institution created successfully.', institution);
  } catch (error) {
    next(error);
  }
};

// @desc    Update institution
// @route   PUT /api/v1/institutions/:id
export const updateInstitution = async (req, res, next) => {
  try {
    const institution = await Institution.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!institution) {
      return sendError(res, 404, 'Institution not found.');
    }

    return sendSuccess(res, 200, 'Institution updated successfully.', institution);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Deactivate institution
// @route   DELETE /api/v1/institutions/:id
export const deleteInstitution = async (req, res, next) => {
  try {
    const institution = await Institution.findById(req.params.id);
    if (!institution) {
      return sendError(res, 404, 'Institution not found.');
    }

    institution.isActive = false;
    await institution.save();

    return sendSuccess(res, 200, 'Institution deactivated successfully.');
  } catch (error) {
    next(error);
  }
};
