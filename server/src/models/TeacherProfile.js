import mongoose from 'mongoose';

const teacherProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    institutions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
      },
    ],
    department: {
      type: String,
      trim: true,
      default: '',
    },
    designation: {
      type: String,
      trim: true,
      default: '',
    },
    qualification: {
      type: String,
      trim: true,
      default: '',
    },
    specializationSubjects: [
      {
        type: String,
        trim: true,
      },
    ],
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    canCreateQuizzes: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

teacherProfileSchema.index({ institutions: 1 });

export default mongoose.model('TeacherProfile', teacherProfileSchema);
