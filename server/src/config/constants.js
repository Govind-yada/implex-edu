export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  ASSOCIATE: 'associate',
};

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
};

export const INSTITUTION_TYPES = {
  SCHOOL: 'school',
  COLLEGE: 'college',
  UNIVERSITY: 'university',
};

export const QUIZ_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

export const ATTEMPT_STATUS = {
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  TIMEOUT: 'timeout',
  EVALUATED: 'evaluated',
};

export const COMPETITION_MODES = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  HYBRID: 'hybrid',
};

export const COMPETITION_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const REGISTRATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  REJECTED: 'rejected',
};

export const CONTACT_STATUS = {
  PENDING: 'pending',
  IN_REVIEW: 'in_review',
  RESOLVED: 'resolved',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  UNSUBSCRIBED: 'unsubscribed',
};

export const ENROLLMENT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  REVOKED: 'revoked',
};
