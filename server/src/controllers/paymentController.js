import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Course from '../models/Course.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { PAYMENT_STATUS, ENROLLMENT_STATUS } from '../config/constants.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import {
  sendPaymentReceivedEmail,
  sendPaymentVerifiedEmail,
  sendPaymentRejectedEmail,
} from '../utils/emailService.js';
import { OFFICIAL_COURSES } from '../data/coursesData.js';

/**
 * Generate unique, human-readable Order ID
 */
const generateOrderId = () => {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `IMP-${stamp}-${rand}`;
};

/**
 * @desc Create a pending payment order for a course
 * @route POST /api/v1/payments/create-order
 * @access Public (Guest or Authenticated)
 */
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { courseCode, courseId, customerEmail, customerName, customerPhone } = req.body;

    if (!customerEmail) {
      return sendError(res, 400, 'Customer email address is required.');
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(customerEmail)) {
      return sendError(res, 400, 'Please provide a valid email address.');
    }

    if (!courseCode && !courseId) {
      return sendError(res, 400, 'Course identifier is required.');
    }

    // Lookup course in DB or static list
    let courseDoc = null;
    if (courseId && courseId.match(/^[0-9a-fA-F]{24}$/)) {
      courseDoc = await Course.findById(courseId);
    }
    if (!courseDoc && courseCode) {
      courseDoc = await Course.findOne({ courseCode: courseCode.toUpperCase() });
    }

    // Fallback to official course catalog if not yet seeded or in memory
    let title = '';
    let price = 0;
    let resolvedCode = courseCode ? courseCode.toUpperCase() : '';
    let courseDbId = null;

    if (courseDoc) {
      title = courseDoc.title;
      price = courseDoc.price;
      resolvedCode = courseDoc.courseCode;
      courseDbId = courseDoc._id;
    } else {
      const fallback = OFFICIAL_COURSES.find(
        (c) => c.courseCode.toUpperCase() === (courseCode || '').toUpperCase()
      );
      if (!fallback) {
        return sendError(res, 404, 'Course not found in official catalog.');
      }
      title = fallback.title;
      price = fallback.price;
      resolvedCode = fallback.courseCode;

      // Create on-the-fly course doc if needed
      let created = await Course.findOne({ courseCode: resolvedCode });
      if (!created) {
        created = await Course.create({
          ...fallback,
          stream: fallback.stream || 'General',
        });
      }
      courseDbId = created._id;
    }

    // Optional user association if logged in or user account already exists with that email
    let userDoc = req.user ? req.user : await User.findOne({ email: customerEmail.toLowerCase() });

    const orderId = generateOrderId();

    const payment = await Payment.create({
      orderId,
      user: userDoc ? userDoc._id : null,
      customerEmail: customerEmail.toLowerCase().trim(),
      customerName: (customerName || (userDoc ? userDoc.name : '')).trim(),
      customerPhone: (customerPhone || (userDoc ? userDoc.phone : '')).trim(),
      course: courseDbId,
      courseCode: resolvedCode,
      courseTitle: title,
      amount: price,
      originalPrice: price,
      discount: 0,
      currency: 'INR',
      merchantUpiId: '7859088239@okbizaxis',
      merchantName: 'Implex Cart International',
      paymentMethod: 'UPI_QR',
      status: PAYMENT_STATUS.PENDING,
    });

    return sendSuccess(res, 201, 'Payment order created successfully.', {
      orderId: payment.orderId,
      amount: payment.amount,
      originalPrice: payment.originalPrice,
      discount: payment.discount,
      currency: payment.currency,
      courseTitle: payment.courseTitle,
      courseCode: payment.courseCode,
      customerEmail: payment.customerEmail,
      merchantUpiId: payment.merchantUpiId,
      merchantName: payment.merchantName,
      qrImageUrl: '/images/upi-payment-qr.jpg',
      status: payment.status,
      instructions:
        'Scan the QR code using Google Pay, PhonePe, Paytm or any supported UPI application. Verify the merchant name and amount before completing your payment.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Submit UPI transaction reference (UTR) for an order
 * @route POST /api/v1/payments/submit-reference
 * @access Public
 */
export const submitPaymentReference = async (req, res, next) => {
  try {
    const { orderId, customerEmail, utr, amount } = req.body;

    if (!orderId || !customerEmail || !utr) {
      return sendError(res, 400, 'Order ID, customer email, and UPI reference (UTR) are required.');
    }

    const cleanUtr = String(utr).trim();
    if (cleanUtr.length < 6) {
      return sendError(res, 400, 'Please enter a valid UPI transaction reference / UTR number.');
    }

    // Find order
    const payment = await Payment.findOne({ orderId: orderId.toUpperCase().trim() });
    if (!payment) {
      return sendError(res, 404, 'No order found with the provided Order ID.');
    }

    // Validate email matches
    if (payment.customerEmail.toLowerCase() !== customerEmail.toLowerCase().trim()) {
      return sendError(res, 403, 'The submitted email does not match this Order ID.');
    }

    // Validate amount matches
    if (amount && Number(amount) !== payment.amount) {
      return sendError(res, 400, `Amount mismatch. Order requires exactly ₹${payment.amount}.`);
    }

    // Check if already verified
    if (payment.status === PAYMENT_STATUS.VERIFIED) {
      return sendError(res, 400, 'This payment order has already been verified and activated.');
    }

    // Check if UTR is already used by another verified or submitted payment
    const existingUtr = await Payment.findOne({
      utr: cleanUtr,
      _id: { $ne: payment._id },
      status: { $in: [PAYMENT_STATUS.VERIFIED, PAYMENT_STATUS.SUBMITTED, PAYMENT_STATUS.UNDER_REVIEW] },
    });
    if (existingUtr) {
      return sendError(
        res,
        409,
        'This UPI transaction reference has already been submitted for another order. Please check and provide the correct reference.'
      );
    }

    // Handle proof image if uploaded
    let proofImageUrl = payment.proofImageUrl;
    if (req.file) {
      proofImageUrl = `/uploads/payments/${req.file.filename}`;
    }

    // Update payment to submitted / under review
    payment.utr = cleanUtr;
    payment.proofImageUrl = proofImageUrl;
    payment.status = PAYMENT_STATUS.SUBMITTED;
    payment.submittedAt = new Date();
    await payment.save();

    // Trigger confirmation email
    sendPaymentReceivedEmail({
      to: payment.customerEmail,
      orderId: payment.orderId,
      courseTitle: payment.courseTitle,
      amount: payment.amount,
      utr: payment.utr,
    }).catch((err) => console.error('[Email Error] Failed to send payment submitted email:', err.message));

    return sendSuccess(res, 200, 'Payment details submitted successfully! Your payment is under review.', {
      orderId: payment.orderId,
      status: payment.status,
      utr: payment.utr,
      submittedAt: payment.submittedAt,
      message:
        'Your transaction reference has been logged. Our admissions team will verify it against merchant bank records and activate your course access.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Check payment order status
 * @route GET /api/v1/payments/status/:orderId
 * @access Public
 */
export const getPaymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const payment = await Payment.findOne({ orderId: orderId.toUpperCase().trim() }).select(
      'orderId courseCode courseTitle amount currency status utr submittedAt verifiedAt createdAt'
    );

    if (!payment) {
      return sendError(res, 404, 'Payment order not found.');
    }

    // If verified, fetch enrollment accessKey
    let accessKey = null;
    if (payment.status === PAYMENT_STATUS.VERIFIED) {
      const enrollment = await CourseEnrollment.findOne({ orderId: payment.orderId });
      if (enrollment) {
        accessKey = enrollment.accessKey;
      }
    }

    return sendSuccess(res, 200, 'Payment status retrieved.', {
      ...payment.toObject(),
      accessKey,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all payments for Super Admin management
 * @route GET /api/v1/admin/payments
 * @access Private (Super Admin)
 */
export const getAdminPayments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      const q = req.query.search.trim();
      filter.$or = [
        { orderId: { $regex: q, $options: 'i' } },
        { customerEmail: { $regex: q, $options: 'i' } },
        { utr: { $regex: q, $options: 'i' } },
        { courseCode: { $regex: q, $options: 'i' } },
        { courseTitle: { $regex: q, $options: 'i' } },
      ];
    }

    const [payments, total, stats] = await Promise.all([
      Payment.find(filter)
        .sort({ submittedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('verifiedBy', 'name email')
        .populate('rejectedBy', 'name email'),
      Payment.countDocuments(filter),
      Payment.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
          },
        },
      ]),
    ]);

    const formattedStats = {
      totalOrders: 0,
      totalRevenueVerified: 0,
      pendingCount: 0,
      submittedCount: 0,
      verifiedCount: 0,
      rejectedCount: 0,
    };

    stats.forEach((s) => {
      formattedStats.totalOrders += s.count;
      if (s._id === PAYMENT_STATUS.VERIFIED) {
        formattedStats.verifiedCount = s.count;
        formattedStats.totalRevenueVerified = s.totalAmount;
      } else if (s._id === PAYMENT_STATUS.SUBMITTED || s._id === PAYMENT_STATUS.UNDER_REVIEW) {
        formattedStats.submittedCount += s.count;
      } else if (s._id === PAYMENT_STATUS.PENDING) {
        formattedStats.pendingCount = s.count;
      } else if (s._id === PAYMENT_STATUS.REJECTED) {
        formattedStats.rejectedCount = s.count;
      }
    });

    return sendSuccess(res, 200, 'Payments list retrieved.', {
      payments,
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
 * @desc Verify a payment and automatically activate course enrollment
 * @route PATCH /api/v1/admin/payments/:paymentId/verify
 * @access Private (Super Admin)
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { adminNotes } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return sendError(res, 404, 'Payment not found.');
    }

    if (payment.status === PAYMENT_STATUS.VERIFIED) {
      return sendError(res, 400, 'This payment is already verified.');
    }

    payment.status = PAYMENT_STATUS.VERIFIED;
    payment.verifiedBy = req.user._id;
    payment.verifiedAt = new Date();
    if (adminNotes) {
      payment.adminNotes = adminNotes.trim();
    }
    await payment.save();

    // Check if user account already exists with that customerEmail
    let userDoc = payment.user
      ? await User.findById(payment.user)
      : await User.findOne({ email: payment.customerEmail });

    // Generate secure access key
    const accessKey = `ACC-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

    // Create or update CourseEnrollment
    let enrollment = await CourseEnrollment.findOne({
      customerEmail: payment.customerEmail,
      courseCode: payment.courseCode,
    });

    if (!enrollment) {
      enrollment = await CourseEnrollment.create({
        course: payment.course,
        courseCode: payment.courseCode,
        courseTitle: payment.courseTitle,
        user: userDoc ? userDoc._id : null,
        customerEmail: payment.customerEmail,
        customerName: payment.customerName,
        customerPhone: payment.customerPhone,
        payment: payment._id,
        orderId: payment.orderId,
        amountPaid: payment.amount,
        status: ENROLLMENT_STATUS.ACTIVE,
        accessKey,
        enrolledAt: new Date(),
      });
    } else {
      enrollment.status = ENROLLMENT_STATUS.ACTIVE;
      enrollment.payment = payment._id;
      enrollment.orderId = payment.orderId;
      enrollment.amountPaid = payment.amount;
      if (userDoc && !enrollment.user) {
        enrollment.user = userDoc._id;
      }
      await enrollment.save();
    }

    // Record audit log
    await AuditLog.create({
      actor: req.user._id,
      action: 'PAYMENT_VERIFIED',
      targetEntity: 'Payment',
      targetId: payment._id.toString(),
      details: {
        orderId: payment.orderId,
        customerEmail: payment.customerEmail,
        amount: payment.amount,
        utr: payment.utr,
        courseCode: payment.courseCode,
        adminNotes: payment.adminNotes,
      },
    });

    // Send confirmation email
    sendPaymentVerifiedEmail({
      to: payment.customerEmail,
      orderId: payment.orderId,
      courseTitle: payment.courseTitle,
      amount: payment.amount,
      utr: payment.utr,
      accessKey: enrollment.accessKey,
    }).catch((err) => console.error('[Email Error] Failed to send payment verified email:', err.message));

    return sendSuccess(res, 200, 'Payment verified successfully and course enrollment activated.', {
      payment,
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Reject a payment submission
 * @route PATCH /api/v1/admin/payments/:paymentId/reject
 * @access Private (Super Admin)
 */
export const rejectPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { reason, adminNotes } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return sendError(res, 404, 'Payment not found.');
    }

    payment.status = PAYMENT_STATUS.REJECTED;
    payment.rejectedBy = req.user._id;
    payment.rejectedAt = new Date();
    payment.rejectionReason = reason ? reason.trim() : 'Invalid or unverified transaction reference.';
    if (adminNotes) {
      payment.adminNotes = adminNotes.trim();
    }
    await payment.save();

    // If an enrollment was previously active for this order, revoke it
    await CourseEnrollment.updateMany(
      { orderId: payment.orderId },
      { $set: { status: ENROLLMENT_STATUS.REVOKED } }
    );

    // Record audit log
    await AuditLog.create({
      actor: req.user._id,
      action: 'PAYMENT_REJECTED',
      targetEntity: 'Payment',
      targetId: payment._id.toString(),
      details: {
        orderId: payment.orderId,
        customerEmail: payment.customerEmail,
        rejectionReason: payment.rejectionReason,
        adminNotes: payment.adminNotes,
      },
    });

    // Send rejection email
    sendPaymentRejectedEmail({
      to: payment.customerEmail,
      orderId: payment.orderId,
      courseTitle: payment.courseTitle,
      reason: payment.rejectionReason,
    }).catch((err) => console.error('[Email Error] Failed to send payment rejected email:', err.message));

    return sendSuccess(res, 200, 'Payment rejected successfully.', { payment });
  } catch (error) {
    next(error);
  }
};
