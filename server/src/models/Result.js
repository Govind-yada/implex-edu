import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      enum: ['quiz', 'competition'],
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
    },
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    rank: {
      type: Number,
      default: 0,
    },
    awardTitle: {
      type: String,
      trim: true,
      default: '',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

resultSchema.index({ quiz: 1, user: 1 });
resultSchema.index({ competition: 1, user: 1 });
resultSchema.index({ user: 1 });

export default mongoose.model('Result', resultSchema);
