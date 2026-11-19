import mongoose from 'mongoose';

const emailVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ['subscribe', 'guest_checkout', 'course_enquiry'],
      default: 'subscribe',
    },
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 5,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    resendCooldownUntil: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 1000), // 60s cooldown
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: '10m' }, // Auto-expire after 10 mins
    },
  },
  {
    timestamps: true,
  }
);

emailVerificationSchema.index({ email: 1, purpose: 1 });

const EmailVerification = mongoose.model('EmailVerification', emailVerificationSchema);
export default EmailVerification;
