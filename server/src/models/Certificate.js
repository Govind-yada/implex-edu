import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipientName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['quiz_merit', 'competition_winner', 'competition_participation', 'special_achievement'],
      default: 'competition_participation',
    },
    relatedQuiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
    },
    relatedCompetition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    verificationToken: {
      type: String,
      unique: true,
      required: true,
    },
    qrCodeUrl: String,
    metadata: {
      score: Number,
      rank: Number,
      institutionName: String,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

certificateSchema.index({ user: 1 });

export default mongoose.model('Certificate', certificateSchema);
