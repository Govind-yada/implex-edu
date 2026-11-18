import mongoose from 'mongoose';
import { INSTITUTION_TYPES } from '../config/constants.js';

const institutionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide institution name'],
      trim: true,
      maxlength: [150, 'Institution name cannot exceed 150 characters'],
    },
    code: {
      type: String,
      required: [true, 'Please provide unique institution code'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(INSTITUTION_TYPES),
      default: INSTITUTION_TYPES.SCHOOL,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    logoUrl: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    assignedAssociates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

institutionSchema.index({ type: 1 });
institutionSchema.index({ isActive: 1 });

export default mongoose.model('Institution', institutionSchema);
