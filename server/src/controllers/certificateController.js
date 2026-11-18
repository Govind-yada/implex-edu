import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import { ROLES } from '../config/constants.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// @desc    Get certificates for current logged in user
// @route   GET /api/v1/certificates/my-certificates
export const getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({
      user: req.user._id,
      isRevoked: false,
    }).sort({ issueDate: -1 });

    return sendSuccess(res, 200, 'User certificates.', certificates);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify certificate authenticity (Public endpoint)
// @route   GET /api/v1/certificates/verify/:identifier
export const verifyCertificate = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    if (global.__MOCK_MODE__) {
      const { mockCertificates } = await import('../data/mockStore.js');
      const cert = mockCertificates.find(
        (c) =>
          c.certificateNumber.toUpperCase() === identifier.toUpperCase() ||
          c.verificationToken.toUpperCase() === identifier.toUpperCase()
      );
      if (cert) {
        return sendSuccess(res, 200, 'Certificate verification verified successfully.', {
          isValid: true,
          certificateNumber: cert.certificateNumber,
          recipientName: cert.recipientName,
          title: cert.title,
          category: cert.category,
          issueDate: cert.issueDate,
          metadata: cert.metadata,
        });
      }
    }

    const cert = await Certificate.findOne({
      $or: [
        { certificateNumber: identifier.toUpperCase() },
        { verificationToken: identifier.toUpperCase() },
      ],
    }).populate('user', 'name email avatar');

    if (!cert) {
      return sendError(res, 404, 'Certificate not found or invalid identifier.');
    }

    if (cert.isRevoked) {
      return sendError(res, 410, 'This certificate has been officially revoked by the issuing authority.');
    }

    return sendSuccess(res, 200, 'Certificate verification verified successfully.', {
      isValid: true,
      certificateNumber: cert.certificateNumber,
      recipientName: cert.recipientName,
      title: cert.title,
      category: cert.category,
      issueDate: cert.issueDate,
      metadata: cert.metadata,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Issue a new certificate manually (Admin)
// @route   POST /api/v1/certificates/issue
export const issueCertificate = async (req, res, next) => {
  try {
    const { userId, title, category, metadata } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, 404, 'Recipient user not found.');
    }

    const certNumber = `CERT-IMP-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const verificationToken = `VERIFY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const cert = await Certificate.create({
      certificateNumber: certNumber,
      user: user._id,
      recipientName: user.name,
      title,
      category: category || 'special_achievement',
      verificationToken,
      metadata: metadata || {},
    });

    return sendSuccess(res, 201, 'Certificate issued successfully.', cert);
  } catch (error) {
    next(error);
  }
};
