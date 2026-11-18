import mongoose from 'mongoose';
import { ATTEMPT_STATUS } from '../config/constants.js';

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    timeLimitExpiresAt: {
      type: Date,
      required: true,
    },
    submittedAt: Date,
    status: {
      type: String,
      enum: Object.values(ATTEMPT_STATUS),
      default: ATTEMPT_STATUS.IN_PROGRESS,
    },
    score: {
      type: Number,
      default: 0,
    },
    totalMarksPossible: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    isPassed: {
      type: Boolean,
      default: false,
    },
    correctAnswersCount: {
      type: Number,
      default: 0,
    },
    incorrectAnswersCount: {
      type: Number,
      default: 0,
    },
    unansweredCount: {
      type: Number,
      default: 0,
    },
    attemptNumber: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

quizAttemptSchema.index({ quiz: 1, student: 1 });
quizAttemptSchema.index({ student: 1 });
quizAttemptSchema.index({ status: 1 });

export default mongoose.model('QuizAttempt', quizAttemptSchema);
