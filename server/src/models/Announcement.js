import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    targetRoles: [
      {
        type: String,
        enum: ['all', 'teacher', 'student', 'associate', 'public'],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: Date,
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

announcementSchema.index({ isActive: 1, expiresAt: 1 });

export default mongoose.model('Announcement', announcementSchema);
