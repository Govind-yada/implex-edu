import User from '../models/User.js';
import Institution from '../models/Institution.js';
import Quiz from '../models/Quiz.js';
import Competition from '../models/Competition.js';
import CompetitionRegistration from '../models/CompetitionRegistration.js';
import QuizAttempt from '../models/QuizAttempt.js';
import PlatformSetting from '../models/PlatformSetting.js';
import AuditLog from '../models/AuditLog.js';
import { ROLES, USER_STATUS } from '../config/constants.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// @desc    Get system-wide analytics & overview metrics
// @route   GET /api/v1/admin/overview
export const getAdminOverview = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalTeachers,
      totalAssociates,
      totalInstitutions,
      totalQuizzes,
      totalCompetitions,
      totalRegistrations,
      totalAttempts,
      recentUsers,
      recentAttempts,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: ROLES.STUDENT }),
      User.countDocuments({ role: ROLES.TEACHER }),
      User.countDocuments({ role: ROLES.ASSOCIATE }),
      Institution.countDocuments({ isActive: true }),
      Quiz.countDocuments(),
      Competition.countDocuments(),
      CompetitionRegistration.countDocuments(),
      QuizAttempt.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role status createdAt'),
      QuizAttempt.find().populate('quiz', 'title').populate('student', 'name').sort({ createdAt: -1 }).limit(5),
    ]);

    return sendSuccess(res, 200, 'Admin overview metrics.', {
      counts: {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalAssociates,
        totalInstitutions,
        totalQuizzes,
        totalCompetitions,
        totalRegistrations,
        totalAttempts,
      },
      recentUsers,
      recentAttempts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with advanced filtering
// @route   GET /api/v1/admin/users
export const getUsers = async (req, res, next) => {
  try {
    const { role, status, search, page = 1, limit = 10 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return sendSuccess(res, 200, 'Users retrieved.', users, {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      limit: Number(limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status / approve / reject / suspend
// @route   PUT /api/v1/admin/users/:id/status
export const updateUserStatus = async (req, res, next) => {
  try {
    const { status, role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 404, 'User not found.');
    }

    if (user.role === ROLES.SUPER_ADMIN && req.user._id.toString() !== user._id.toString()) {
      return sendError(res, 403, 'Cannot modify another Super Admin account status.');
    }

    if (status && Object.values(USER_STATUS).includes(status)) {
      user.status = status;
    }
    if (role && Object.values(ROLES).includes(role) && role !== ROLES.SUPER_ADMIN) {
      user.role = role;
    }

    await user.save();

    // Log action
    await AuditLog.create({
      actor: req.user._id,
      action: `UPDATE_USER_STATUS_${status}`,
      targetEntity: 'User',
      targetId: user._id.toString(),
      details: { newStatus: status, newRole: role },
    });

    return sendSuccess(res, 200, `User account updated to ${status}.`, user);
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform settings
// @route   GET /api/v1/admin/settings
export const getPlatformSettings = async (req, res, next) => {
  try {
    const settings = await PlatformSetting.find({});
    const settingsMap = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return sendSuccess(res, 200, 'Platform settings.', settingsMap);
  } catch (error) {
    next(error);
  }
};

// @desc    Update platform setting
// @route   PUT /api/v1/admin/settings
export const updatePlatformSetting = async (req, res, next) => {
  try {
    const { key, value, description } = req.body;

    const updated = await PlatformSetting.findOneAndUpdate(
      { key },
      { value, description: description || '' },
      { new: true, upsert: true }
    );

    return sendSuccess(res, 200, 'Setting saved successfully.', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get audit logs
// @route   GET /api/v1/admin/audit-logs
export const getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await AuditLog.countDocuments();
    const logs = await AuditLog.find()
      .populate('actor', 'name email role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return sendSuccess(res, 200, 'Audit logs.', logs, {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      limit: Number(limit),
    });
  } catch (error) {
    next(error);
  }
};
