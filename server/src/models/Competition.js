import mongoose from 'mongoose';
import { COMPETITION_MODES, COMPETITION_STATUS } from '../config/constants.js';

const competitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide competition title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    guidelines: {
      type: String,
      trim: true,
      default: '',
    },
    eligibilityCriteria: {
      type: String,
      trim: true,
      default: '',
    },
    targetAudience: {
      type: String,
      enum: ['all', 'school', 'college', 'university'],
      default: 'all',
    },
    mode: {
      type: String,
      enum: Object.values(COMPETITION_MODES),
      default: COMPETITION_MODES.ONLINE,
    },
    status: {
      type: String,
      enum: Object.values(COMPETITION_STATUS),
      default: COMPETITION_STATUS.UPCOMING,
    },
    venueDetails: {
      type: String,
      trim: true,
      default: '',
    },
    registrationStartDate: Date,
    registrationEndDate: {
      type: Date,
      required: true,
    },
    competitionStartDate: {
      type: Date,
      required: true,
    },
    competitionEndDate: Date,
    maxParticipants: {
      type: Number,
      default: 500,
    },
    totalRegistered: {
      type: Number,
      default: 0,
    },
    awardsAndPrizes: [
      {
        rank: String,
        title: String,
        prize: String,
        description: String,
      },
    ],
    bannerUrl: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

competitionSchema.index({ status: 1 });
competitionSchema.index({ competitionStartDate: 1 });

competitionSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString(36);
  }
  next();
});

export default mongoose.model('Competition', competitionSchema);
