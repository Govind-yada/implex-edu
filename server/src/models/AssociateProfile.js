import mongoose from 'mongoose';

const associateProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    organizationName: {
      type: String,
      trim: true,
      default: '',
    },
    designation: {
      type: String,
      trim: true,
      default: '',
    },
    assignedInstitutions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
      },
    ],
    officialEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    officialPhone: {
      type: String,
      trim: true,
      default: '',
    },
    territoryOrRegion: {
      type: String,
      trim: true,
      default: '',
    },
    partnershipNotes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

associateProfileSchema.index({ assignedInstitutions: 1 });

export default mongoose.model('AssociateProfile', associateProfileSchema);
