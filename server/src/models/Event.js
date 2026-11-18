import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide event title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    allDay: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: ['quiz', 'competition', 'registration_deadline', 'announcement', 'holiday', 'workshop'],
      default: 'quiz',
    },
    visibility: {
      type: String,
      enum: ['public', 'student', 'teacher', 'associate', 'institution_only'],
      default: 'public',
    },
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
    },
    location: {
      type: String,
      default: 'Online / Implex Platform',
    },
    externalLink: {
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

eventSchema.index({ startDate: 1 });
eventSchema.index({ visibility: 1 });

export default mongoose.model('Event', eventSchema);
