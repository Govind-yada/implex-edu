import mongoose from 'mongoose';
import { REGISTRATION_STATUS } from '../config/constants.js';

const competitionRegistrationSchema = new mongoose.Schema(
  {
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
    },
    registrationNumber: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(REGISTRATION_STATUS),
      default: REGISTRATION_STATUS.CONFIRMED,
    },
    teamName: {
      type: String,
      trim: true,
      default: '',
    },
    teamMembers: [
      {
        name: String,
        email: String,
        role: String,
      },
    ],
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

competitionRegistrationSchema.index({ competition: 1, user: 1 }, { unique: true });
competitionRegistrationSchema.index({ user: 1 });

export default mongoose.model('CompetitionRegistration', competitionRegistrationSchema);
