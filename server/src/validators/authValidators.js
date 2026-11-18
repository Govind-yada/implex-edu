import { z } from 'zod';
import { ROLES } from '../config/constants.js';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum([ROLES.STUDENT, ROLES.TEACHER, ROLES.ASSOCIATE], {
    errorMap: () => ({ message: 'Role must be student, teacher, or associate' }),
  }),
  phone: z.string().optional(),
  // Optional profile details during signup
  institutionCode: z.string().optional(),
  gradeLevel: z.string().optional(),
  department: z.string().optional(),
  organizationName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  // Student specific
  gradeLevel: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  academicInterests: z.array(z.string()).optional(),
  // Teacher specific
  department: z.string().optional(),
  designation: z.string().optional(),
  qualification: z.string().optional(),
  bio: z.string().optional(),
  specializationSubjects: z.array(z.string()).optional(),
  // Associate specific
  organizationName: z.string().optional(),
  territoryOrRegion: z.string().optional(),
  partnershipNotes: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const validateRequest = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
