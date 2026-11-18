import mongoose from 'mongoose';
import { QUIZ_STATUS } from '../config/constants.js';

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide quiz title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    instructions: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      trim: true,
    },
    targetAudience: {
      type: String,
      enum: ['all', 'school', 'college', 'university'],
      default: 'all',
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Please provide quiz duration in minutes'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    passingMarks: {
      type: Number,
      default: 0,
    },
    passingPercentage: {
      type: Number,
      default: 50,
    },
    allowNegativeMarking: {
      type: Boolean,
      default: false,
    },
    negativeMarkValue: {
      type: Number,
      default: 0.25,
    },
    shuffleQuestions: {
      type: Boolean,
      default: false,
    },
    maxAttempts: {
      type: Number,
      default: 1,
    },
    instantResultRelease: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: Object.values(QUIZ_STATUS),
      default: QUIZ_STATUS.DRAFT,
    },
    scheduledStart: Date,
    scheduledEnd: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
    },
    questionsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

quizSchema.index({ status: 1 });
quizSchema.index({ createdBy: 1 });
quizSchema.index({ category: 1 });

quizSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString(36);
  }
  next();
});

export default mongoose.model('Quiz', quizSchema);
