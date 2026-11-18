import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    attempt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuizAttempt',
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    selectedOptionIndex: {
      type: Number,
      default: -1,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
    marksAwarded: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

submissionSchema.index({ attempt: 1, question: 1 }, { unique: true });

export default mongoose.model('Submission', submissionSchema);
