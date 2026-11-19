import crypto from 'crypto';
import EmailSubscriber from '../models/EmailSubscriber.js';
import EmailVerification from '../models/EmailVerification.js';
import PlatformSetting from '../models/PlatformSetting.js';
import { SUBSCRIPTION_STATUS } from '../config/constants.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { sendOtpEmail, sendCampaignEmail } from '../utils/emailService.js';

// Helper to hash OTP
const hashOtp = (otp) => {
  return crypto.createHash('sha256').update(String(otp)).digest('hex');
};

/**
 * @desc Public email subscription (anonymous visitors)
 * @route POST /api/v1/email-subscriptions/subscribe
 * @access Public
 */
export const subscribeEmail = async (req, res, next) => {
  try {
    const { email, basicNotifications = true, specialOffers = false, source = 'homepage_popup' } = req.body;

    if (!email) {
      return sendError(res, 400, 'Email address is required.');
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, 400, 'Please provide a valid email address.');
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if subscriber already exists
    let subscriber = await EmailSubscriber.findOne({ email: normalizedEmail });

    if (subscriber) {
      // Update existing subscriber preferences
      subscriber.basicNotifications = Boolean(basicNotifications);
      subscriber.specialOffers = Boolean(specialOffers);
      subscriber.subscriptionStatus = SUBSCRIPTION_STATUS.ACTIVE;
      subscriber.consentDate = new Date();
      await subscriber.save();

      return sendSuccess(res, 200, 'Subscription preferences updated successfully!', {
        email: subscriber.email,
        basicNotifications: subscriber.basicNotifications,
        specialOffers: subscriber.specialOffers,
        status: subscriber.subscriptionStatus,
      });
    }

    // Create new subscriber
    subscriber = await EmailSubscriber.create({
      email: normalizedEmail,
      verified: false,
      basicNotifications: Boolean(basicNotifications),
      specialOffers: Boolean(specialOffers),
      subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
      consentDate: new Date(),
      source,
    });

    return sendSuccess(res, 201, 'Thank you for subscribing to Implex Edu updates!', {
      email: subscriber.email,
      basicNotifications: subscriber.basicNotifications,
      specialOffers: subscriber.specialOffers,
      status: subscriber.subscriptionStatus,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Generate and send OTP to visitor's email
 * @route POST /api/v1/email-verification/send-otp
 * @access Public
 */
export const sendVerificationOtp = async (req, res, next) => {
  try {
    const { email, purpose = 'subscribe' } = req.body;

    if (!email) {
      return sendError(res, 400, 'Email address is required.');
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check recent pending verification for cooldown
    const existing = await EmailVerification.findOne({
      email: normalizedEmail,
      purpose,
      resendCooldownUntil: { $gt: new Date() },
    });

    if (existing) {
      const waitSeconds = Math.ceil((existing.resendCooldownUntil - new Date()) / 1000);
      return sendError(res, 429, `Please wait ${waitSeconds} seconds before requesting a new code.`);
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = hashOtp(otp);

    // Save or update verification record
    await EmailVerification.deleteMany({ email: normalizedEmail, purpose });
    await EmailVerification.create({
      email: normalizedEmail,
      otpHash,
      purpose,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      resendCooldownUntil: new Date(Date.now() + 60 * 1000), // 60 seconds
    });

    // Send email
    await sendOtpEmail({
      to: normalizedEmail,
      otp,
      purpose: purpose === 'guest_checkout' ? 'Course Checkout' : 'Subscription Verification',
    });

    return sendSuccess(res, 200, 'Verification code sent to your email.');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Verify OTP
 * @route POST /api/v1/email-verification/verify-otp
 * @access Public
 */
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp, purpose = 'subscribe' } = req.body;

    if (!email || !otp) {
      return sendError(res, 400, 'Email and verification code are required.');
    }

    const normalizedEmail = email.toLowerCase().trim();
    const verification = await EmailVerification.findOne({
      email: normalizedEmail,
      purpose,
      expiresAt: { $gt: new Date() },
    });

    if (!verification) {
      return sendError(res, 400, 'Verification code has expired or is invalid. Please request a new code.');
    }

    if (verification.attempts >= verification.maxAttempts) {
      await EmailVerification.deleteOne({ _id: verification._id });
      return sendError(res, 429, 'Maximum verification attempts exceeded. Please request a new code.');
    }

    const providedHash = hashOtp(otp);
    if (providedHash !== verification.otpHash) {
      verification.attempts += 1;
      await verification.save();
      return sendError(res, 400, `Incorrect verification code. Attempts left: ${verification.maxAttempts - verification.attempts}`);
    }

    verification.verified = true;
    verification.verifiedAt = new Date();
    await verification.save();

    // Mark subscriber verified if exists
    await EmailSubscriber.updateOne(
      { email: normalizedEmail },
      { $set: { verified: true, verificationDate: new Date() } }
    );

    return sendSuccess(res, 200, 'Email verified successfully!', {
      verified: true,
      email: normalizedEmail,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Unsubscribe from marketing / notification emails
 * @route POST /api/v1/email-subscriptions/unsubscribe
 * @access Public
 */
export const unsubscribeEmail = async (req, res, next) => {
  try {
    const { token, email } = req.body;

    if (!token && !email) {
      return sendError(res, 400, 'Unsubscribe token or email is required.');
    }

    const filter = token ? { unsubscribeToken: token } : { email: email.toLowerCase().trim() };
    const subscriber = await EmailSubscriber.findOne(filter);

    if (!subscriber) {
      return sendError(res, 404, 'Subscription record not found.');
    }

    subscriber.subscriptionStatus = SUBSCRIPTION_STATUS.UNSUBSCRIBED;
    subscriber.basicNotifications = false;
    subscriber.specialOffers = false;
    await subscriber.save();

    return sendSuccess(res, 200, 'You have been unsubscribed from promotional and notification emails.');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get subscribers list for Super Admin
 * @route GET /api/v1/admin/email-subscribers
 * @access Private (Super Admin)
 */
export const getAdminSubscribers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.status && req.query.status !== 'all') {
      filter.subscriptionStatus = req.query.status;
    }

    if (req.query.verified === 'true') {
      filter.verified = true;
    } else if (req.query.verified === 'false') {
      filter.verified = false;
    }

    if (req.query.category === 'basic') {
      filter.basicNotifications = true;
    } else if (req.query.category === 'offers') {
      filter.specialOffers = true;
    }

    if (req.query.search) {
      filter.email = { $regex: req.query.search.trim(), $options: 'i' };
    }

    const [subscribers, total, stats] = await Promise.all([
      EmailSubscriber.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      EmailSubscriber.countDocuments(filter),
      EmailSubscriber.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: {
              $sum: { $cond: [{ $eq: ['$subscriptionStatus', SUBSCRIPTION_STATUS.ACTIVE] }, 1, 0] },
            },
            verified: {
              $sum: { $cond: [{ $eq: ['$verified', true] }, 1, 0] },
            },
            basicNotifications: {
              $sum: { $cond: [{ $eq: ['$basicNotifications', true] }, 1, 0] },
            },
            specialOffers: {
              $sum: { $cond: [{ $eq: ['$specialOffers', true] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    const formattedStats = stats[0] || {
      total: 0,
      active: 0,
      verified: 0,
      basicNotifications: 0,
      specialOffers: 0,
    };

    return sendSuccess(res, 200, 'Subscribers list retrieved.', {
      subscribers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
      stats: formattedStats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete or deactivate a subscriber
 * @route DELETE /api/v1/admin/email-subscribers/:id
 * @access Private (Super Admin)
 */
export const deleteAdminSubscriber = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subscriber = await EmailSubscriber.findByIdAndDelete(id);

    if (!subscriber) {
      return sendError(res, 404, 'Subscriber not found.');
    }

    return sendSuccess(res, 200, 'Subscriber removed successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Broadcast campaign to subscribers based on consent category
 * @route POST /api/v1/admin/email-campaigns/send
 * @access Private (Super Admin)
 */
export const sendAdminCampaign = async (req, res, next) => {
  try {
    const { targetCategory, subject, htmlContent } = req.body;

    if (!targetCategory || !subject || !htmlContent) {
      return sendError(res, 400, 'Target category, subject, and content are required.');
    }

    const filter = {
      subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
    };

    if (targetCategory === 'basic') {
      filter.basicNotifications = true;
    } else if (targetCategory === 'special_offers') {
      filter.specialOffers = true;
    }

    const recipients = await EmailSubscriber.find(filter).select('email unsubscribeToken');

    if (!recipients.length) {
      return sendSuccess(res, 200, 'No active subscribers found for the selected category.', { sentCount: 0 });
    }

    // Dispatch emails (parallel in background)
    let sentCount = 0;
    for (const r of recipients) {
      try {
        await sendCampaignEmail({
          to: r.email,
          subject,
          htmlContent,
          unsubscribeToken: r.unsubscribeToken,
        });
        sentCount++;
      } catch (err) {
        console.error(`[Campaign Dispatch Error] for ${r.email}:`, err.message);
      }
    }

    return sendSuccess(res, 200, `Campaign sent successfully to ${sentCount} recipient(s).`, {
      sentCount,
      targetCategory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get Homepage Popup Configuration Settings
 * @route GET /api/v1/admin/popup-settings
 * @access Public / Private
 */
export const getPopupSettings = async (req, res, next) => {
  try {
    let setting = await PlatformSetting.findOne({ key: 'homepageNewsletterPopup' });
    if (!setting) {
      setting = {
        value: {
          enabled: true,
          delaySeconds: 5,
          frequencyDays: 3,
          heading: 'Stay Connected with Implex Edu!',
          description:
            'Get the latest academic updates, new course announcements, important notifications and exclusive learning offers directly in your inbox.',
        },
      };
    }
    return sendSuccess(res, 200, 'Popup settings retrieved.', setting.value);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update Homepage Popup Configuration Settings
 * @route PUT /api/v1/admin/popup-settings
 * @access Private (Super Admin)
 */
export const updatePopupSettings = async (req, res, next) => {
  try {
    const { enabled, delaySeconds, frequencyDays, heading, description } = req.body;

    const value = {
      enabled: typeof enabled === 'boolean' ? enabled : true,
      delaySeconds: Number(delaySeconds) || 5,
      frequencyDays: Number(frequencyDays) || 3,
      heading: heading || 'Stay Connected with Implex Edu!',
      description:
        description ||
        'Get the latest academic updates, new course announcements, important notifications and exclusive learning offers directly in your inbox.',
    };

    const setting = await PlatformSetting.findOneAndUpdate(
      { key: 'homepageNewsletterPopup' },
      { value, description: 'Homepage Newsletter Subscription Popup configuration' },
      { new: true, upsert: true }
    );

    return sendSuccess(res, 200, 'Popup settings updated successfully.', setting.value);
  } catch (error) {
    next(error);
  }
};
