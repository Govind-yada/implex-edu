import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import InstitutionMembership from '../models/InstitutionMembership.js';
import AssociateProfile from '../models/AssociateProfile.js';
import { ROLES, USER_STATUS } from '../config/constants.js';
import { sendError } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Check cookies first, then Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 401, 'Authentication token missing. Please log in.');
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'implex_edu_fallback_secret_key_32_chars_long'
    );

    let user = null;
    if (global.__MOCK_MODE__) {
      const { findMockUserById } = await import('../data/mockStore.js');
      user = findMockUserById(decoded.id);
    } else {
      user = await User.findById(decoded.id);
    }

    if (!user) {
      return sendError(res, 401, 'User account no longer exists.');
    }

    if (user.status === USER_STATUS.SUSPENDED) {
      return sendError(res, 403, 'Your account has been suspended. Please contact support.');
    }

    if (user.status === USER_STATUS.INACTIVE) {
      return sendError(res, 403, 'Your account is deactivated. Please contact support.');
    }

    if (user.status === USER_STATUS.PENDING) {
      return sendError(res, 403, 'Your account is pending administrative approval.');
    }

    req.user = user;
    next();
  } catch (err) {
    return sendError(res, 401, 'Invalid or expired session. Please log in again.');
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Forbidden: Role '${req.user ? req.user.role : 'anonymous'}' is not authorized to access this resource.`
      );
    }
    next();
  };
};

export const requireInstitutionAccess = async (req, res, next) => {
  const institutionId = req.params.institutionId || req.body.institutionId || req.query.institutionId;

  if (!institutionId) {
    return sendError(res, 400, 'Institution ID parameter is required.');
  }

  // Super Admins have universal platform access
  if (req.user.role === ROLES.SUPER_ADMIN) {
    return next();
  }

  // Associates check assignedInstitutions
  if (req.user.role === ROLES.ASSOCIATE) {
    const associateProfile = await AssociateProfile.findOne({ user: req.user._id });
    if (
      associateProfile &&
      associateProfile.assignedInstitutions.some(
        (id) => id.toString() === institutionId.toString()
      )
    ) {
      return next();
    }
  }

  // Teachers and Students check active membership
  const membership = await InstitutionMembership.findOne({
    institution: institutionId,
    user: req.user._id,
    status: 'active',
  });

  if (!membership) {
    return sendError(
      res,
      403,
      'Access denied: You do not have active affiliation with this institution.'
    );
  }

  req.membership = membership;
  next();
};
