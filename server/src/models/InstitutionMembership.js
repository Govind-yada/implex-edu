import mongoose from 'mongoose';
import { ROLES } from '../config/constants.js';

const institutionMembershipSchema = new mongoose.Schema(
  {
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: [ROLES.TEACHER, ROLES.STUDENT, ROLES.ASSOCIATE],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active',
    },
    joinedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

institutionMembershipSchema.index({ institution: 1, user: 1 }, { unique: true });
institutionMembershipSchema.index({ user: 1 });
institutionMembershipSchema.index({ institution: 1 });

export default mongoose.model('InstitutionMembership', institutionMembershipSchema);
