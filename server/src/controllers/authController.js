import crypto from 'crypto';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import TeacherProfile from '../models/TeacherProfile.js';
import AssociateProfile from '../models/AssociateProfile.js';
import Institution from '../models/Institution.js';
import InstitutionMembership from '../models/InstitutionMembership.js';
import PlatformSetting from '../models/PlatformSetting.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import { ROLES, USER_STATUS } from '../config/constants.js';
import { sendTokenResponse } from '../utils/tokenUtils.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// @desc    Register a new user (Student, Teacher, Associate)
// @route   POST /api/v1/auth/register
export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      institutionCode,
      gradeLevel,
      department,
      organizationName,
    } = req.body;

    // Reject registration if role is super_admin
    if (role === ROLES.SUPER_ADMIN) {
      return sendError(res, 403, 'Super Admin accounts cannot be publicly registered.');
    }

    if (global.__MOCK_MODE__) {
      const { addMockUser, findMockUserByEmail } = await import('../data/mockStore.js');
      if (findMockUserByEmail(email)) {
        return sendError(res, 409, 'An account with this email address already exists.');
      }
      const newUser = addMockUser({
        name,
        email,
        password,
        role,
        phone,
        status: USER_STATUS.ACTIVE,
      });
      return sendTokenResponse(newUser, 201, res, 'Registration successful.');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, 'An account with this email address already exists.');
    }

    // Check approval setting
    let initialStatus = USER_STATUS.ACTIVE;
    const approvalSetting = await PlatformSetting.findOne({ key: 'registrationApproval' });
    if (approvalSetting && approvalSetting.value) {
      if (role === ROLES.TEACHER && approvalSetting.value.requireTeacherApproval) {
        initialStatus = USER_STATUS.PENDING;
      } else if (role === ROLES.ASSOCIATE && approvalSetting.value.requireAssociateApproval) {
        initialStatus = USER_STATUS.PENDING;
      } else if (role === ROLES.STUDENT && approvalSetting.value.requireStudentApproval) {
        initialStatus = USER_STATUS.PENDING;
      }
    }

    // Verify institution if code provided
    let institutionDoc = null;
    if (institutionCode) {
      institutionDoc = await Institution.findOne({ code: institutionCode.toUpperCase(), isActive: true });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone: phone || '',
      status: initialStatus,
    });

    // Create corresponding profile
    if (role === ROLES.STUDENT) {
      await StudentProfile.create({
        user: user._id,
        institution: institutionDoc ? institutionDoc._id : null,
        gradeLevel: gradeLevel || '',
      });
    } else if (role === ROLES.TEACHER) {
      await TeacherProfile.create({
        user: user._id,
        institutions: institutionDoc ? [institutionDoc._id] : [],
        department: department || '',
      });
    } else if (role === ROLES.ASSOCIATE) {
      await AssociateProfile.create({
        user: user._id,
        organizationName: organizationName || '',
        assignedInstitutions: institutionDoc ? [institutionDoc._id] : [],
      });
    }

    // If institution matched, record membership
    if (institutionDoc) {
      await InstitutionMembership.create({
        institution: institutionDoc._id,
        user: user._id,
        role,
        status: 'active',
      });
    }

    // Auto-link any prior guest course enrollments matching this email
    try {
      await CourseEnrollment.updateMany(
        { customerEmail: email.toLowerCase().trim(), user: null },
        { $set: { user: user._id } }
      );
    } catch (enrollErr) {
      console.warn('[Enrollment Link Warning]', enrollErr.message);
    }

    if (initialStatus === USER_STATUS.PENDING) {
      return sendSuccess(
        res,
        201,
        'Registration submitted successfully! Your account is pending administrative approval.',
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        }
      );
    }

    return sendTokenResponse(user, 201, res, 'Registration successful! Welcome to Implex Edu.');
  } catch (error) {
    next(error);
  }
};

// @desc    Log in user
// @route   POST /api/v1/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (global.__MOCK_MODE__) {
      const { findMockUserByEmail } = await import('../data/mockStore.js');
      const mockUser = findMockUserByEmail(email);
      if (!mockUser) {
        return sendError(res, 401, 'Invalid email or password credentials.');
      }
      const isMatch = await mockUser.comparePassword(password);
      if (!isMatch) {
        return sendError(res, 401, 'Invalid email or password credentials.');
      }
      return sendTokenResponse(mockUser, 200, res, 'Login successful.');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 401, 'Invalid email or password credentials.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password credentials.');
    }

    if (user.status === USER_STATUS.SUSPENDED) {
      return sendError(res, 403, 'Your account has been suspended. Please contact platform support.');
    }

    if (user.status === USER_STATUS.INACTIVE) {
      return sendError(res, 403, 'Your account is currently inactive.');
    }

    if (user.status === USER_STATUS.PENDING) {
      return sendError(res, 403, 'Your account registration is still pending approval.');
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    return sendTokenResponse(user, 200, res, 'Login successful.');
  } catch (error) {
    next(error);
  }
};

// @desc    Log out user / Clear cookie
// @route   POST /api/v1/auth/logout
export const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  return sendSuccess(res, 200, 'Successfully logged out.');
};

// @desc    Get current logged in user & role profile
// @route   GET /api/v1/auth/me
export const getMe = async (req, res, next) => {
  try {
    if (global.__MOCK_MODE__) {
      const { findMockUserById } = await import('../data/mockStore.js');
      const mockUser = findMockUserById(req.user._id || req.user.id);
      return sendSuccess(res, 200, { user: mockUser || req.user, profile: null });
    }

    const user = await User.findById(req.user._id);
    let profile = null;

    if (user.role === ROLES.STUDENT) {
      profile = await StudentProfile.findOne({ user: user._id }).populate('institution', 'name code type');
    } else if (user.role === ROLES.TEACHER) {
      profile = await TeacherProfile.findOne({ user: user._id }).populate('institutions', 'name code type');
    } else if (user.role === ROLES.ASSOCIATE) {
      profile = await AssociateProfile.findOne({ user: user._id }).populate('assignedInstitutions', 'name code type');
    }

    return sendSuccess(res, 200, 'User profile fetched successfully.', {
      user,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & academic details
// @route   PUT /api/v1/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar, ...roleSpecificFields } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    let updatedProfile = null;
    if (user.role === ROLES.STUDENT) {
      updatedProfile = await StudentProfile.findOneAndUpdate(
        { user: user._id },
        { $set: roleSpecificFields },
        { new: true, upsert: true }
      ).populate('institution', 'name code type');
    } else if (user.role === ROLES.TEACHER) {
      updatedProfile = await TeacherProfile.findOneAndUpdate(
        { user: user._id },
        { $set: roleSpecificFields },
        { new: true, upsert: true }
      ).populate('institutions', 'name code type');
    } else if (user.role === ROLES.ASSOCIATE) {
      updatedProfile = await AssociateProfile.findOneAndUpdate(
        { user: user._id },
        { $set: roleSpecificFields },
        { new: true, upsert: true }
      ).populate('assignedInstitutions', 'name code type');
    }

    return sendSuccess(res, 200, 'Profile updated successfully.', {
      user,
      profile: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return sendError(res, 400, 'Incorrect current password entered.');
    }

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, 200, 'Password changed successfully.');
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password request
// @route   POST /api/v1/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Return 200 to prevent user enumeration
      return sendSuccess(
        res,
        200,
        'If an account exists with this email address, password reset instructions have been sent.'
      );
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    await user.save({ validateBeforeSave: false });

    // Note: In development, we return token in response for quick testing
    return sendSuccess(
      res,
      200,
      'Password reset instructions sent. Please check your inbox.',
      process.env.NODE_ENV !== 'production' ? { devResetToken: resetToken } : null
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password with token
// @route   PUT /api/v1/auth/reset-password/:token
export const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return sendError(res, 400, 'Invalid or expired password reset token.');
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return sendTokenResponse(user, 200, res, 'Password reset successful. You are now logged in.');
  } catch (error) {
    next(error);
  }
};
