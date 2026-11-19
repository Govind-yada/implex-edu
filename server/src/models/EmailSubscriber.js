import mongoose from 'mongoose';
import crypto from 'crypto';
import { SUBSCRIPTION_STATUS } from '../config/constants.js';

const emailSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    verified: {
      type: Boolean,
      default: false,
      index: true,
    },
    basicNotifications: {
      type: Boolean,
      default: true,
      index: true,
    },
    specialOffers: {
      type: Boolean,
      default: false,
      index: true,
    },
    subscriptionStatus: {
      type: String,
      enum: Object.values(SUBSCRIPTION_STATUS),
      default: SUBSCRIPTION_STATUS.ACTIVE,
      index: true,
    },
    consentDate: {
      type: Date,
      default: Date.now,
    },
    verificationDate: {
      type: Date,
      default: null,
    },
    unsubscribeToken: {
      type: String,
      unique: true,
      index: true,
      default: () => crypto.randomBytes(24).toString('hex'),
    },
    source: {
      type: String,
      default: 'homepage_popup',
    },
  },
  {
    timestamps: true,
  }
);

const EmailSubscriber = mongoose.model('EmailSubscriber', emailSubscriberSchema);
export default EmailSubscriber;
