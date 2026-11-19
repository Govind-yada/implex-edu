import mongoose from 'mongoose';
import { ENROLLMENT_STATUS } from '../config/constants.js';

const courseEnrollmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    courseTitle: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    customerName: {
      type: String,
      trim: true,
      default: '',
    },
    customerPhone: {
      type: String,
      trim: true,
      default: '',
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      trim: true,
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(ENROLLMENT_STATUS),
      default: ENROLLMENT_STATUS.ACTIVE,
      index: true,
    },
    accessKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    batchDetails: {
      daysPerWeek: { type: Number, default: 6 },
      classDurationMinutes: { type: Number, default: 45 },
      medium: { type: String, default: 'English' },
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

courseEnrollmentSchema.index({ customerEmail: 1, courseCode: 1 });

const CourseEnrollment = mongoose.model('CourseEnrollment', courseEnrollmentSchema);
export default CourseEnrollment;
