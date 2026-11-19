import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const isConfigured =
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

  if (isConfigured) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Development / fallback stub transporter
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('----------------------------------------------------');
        console.log(`[Email Service (Dev Mode)] To: ${mailOptions.to}`);
        console.log(`[Subject]: ${mailOptions.subject}`);
        if (mailOptions.text) console.log(`[Body]: ${mailOptions.text}`);
        console.log('----------------------------------------------------');
        return { messageId: `mock-${Date.now()}@implexedu.in` };
      },
    };
  }

  return transporter;
};

const FROM_ADDRESS = process.env.EMAIL_FROM || '"Implex Edu" <noreply@implexedu.in>';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

/**
 * Send OTP Verification Email
 */
export const sendOtpEmail = async ({ to, otp, purpose = 'Verification' }) => {
  const mailer = getTransporter();
  const subject = `Your Implex Edu Verification Code: ${otp}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #1e3a8a; margin: 0;">IMPLEX EDU</h2>
        <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Learn Today. Lead Tomorrow.</p>
      </div>
      <div style="padding: 20px; background: #f8fafc; border-radius: 8px; text-align: center;">
        <p style="color: #334155; font-size: 15px; margin-bottom: 12px;">Your One-Time Passcode (${purpose}) is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2563eb; margin: 16px 0;">${otp}</div>
        <p style="color: #64748b; font-size: 13px; margin: 0;">This code is valid for 10 minutes. Do not share this OTP with anyone.</p>
      </div>
      <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 24px;">
        If you did not request this verification code, please disregard this email.
      </p>
    </div>
  `;

  return mailer.sendMail({
    from: FROM_ADDRESS,
    to,
    subject,
    text: `Your Implex Edu OTP is ${otp}. Valid for 10 minutes.`,
    html,
  });
};

/**
 * Send Payment Reference Submitted (Pending Verification)
 */
export const sendPaymentReceivedEmail = async ({ to, orderId, courseTitle, amount, utr }) => {
  const mailer = getTransporter();
  const subject = `Payment Under Review: ${orderId} - Implex Edu`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <h2 style="color: #1e3a8a; margin-top: 0;">Payment Details Submitted</h2>
      <p style="color: #334155; font-size: 14px; line-height: 1.6;">
        Thank you for submitting your payment reference for <strong>${courseTitle}</strong>.
      </p>
      <div style="padding: 16px; background: #f8fafc; border-radius: 8px; margin: 16px 0; font-size: 14px; line-height: 1.8;">
        <div><strong>Order ID:</strong> ${orderId}</div>
        <div><strong>Course:</strong> ${courseTitle}</div>
        <div><strong>Amount Paid:</strong> ₹${amount}</div>
        <div><strong>UPI UTR / Reference:</strong> ${utr}</div>
        <div><strong>Status:</strong> <span style="color: #d97706; font-weight: bold;">Submitted for Verification</span></div>
      </div>
      <p style="color: #475569; font-size: 13px;">
        Our admissions administration team is verifying the transaction with our merchant records (Implex Cart International). Once verified, you will receive full course access details.
      </p>
    </div>
  `;

  return mailer.sendMail({
    from: FROM_ADDRESS,
    to,
    subject,
    html,
  });
};

/**
 * Send Payment Verified & Course Access Confirmation
 */
export const sendPaymentVerifiedEmail = async ({ to, orderId, courseTitle, amount, utr, accessKey }) => {
  const mailer = getTransporter();
  const accessUrl = `${CLIENT_URL}/services?accessKey=${accessKey}`;
  const subject = `Payment Verified & Course Enrolled: ${courseTitle} - Implex Edu`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #bbf7d0; border-radius: 12px; background: #ffffff;">
      <div style="background: #22c55e; color: white; padding: 12px 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 20px;">Payment Verified Successfully!</h2>
      </div>
      <p style="color: #334155; font-size: 14px; line-height: 1.6;">
        Your payment of <strong>₹${amount}</strong> for <strong>${courseTitle}</strong> (Order ID: <code>${orderId}</code>) has been verified.
      </p>
      <div style="padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; margin: 16px 0;">
        <h4 style="margin: 0 0 8px 0; color: #166534;">Your Course Access Details:</h4>
        <div style="font-size: 13px; color: #1e293b; line-height: 1.8;">
          <div><strong>Course:</strong> ${courseTitle}</div>
          <div><strong>Access Key:</strong> <code>${accessKey}</code></div>
          <div><strong>Batch Schedule:</strong> 6 days a week, 45-min classes, weekly tests included.</div>
        </div>
      </div>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${accessUrl}" style="background: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          Access Your Course Material
        </a>
      </div>
      <p style="color: #64748b; font-size: 12px;">
        Tip: If you register for a student account using this same email address (<code>${to}</code>), your enrolled courses will automatically appear on your student dashboard.
      </p>
    </div>
  `;

  return mailer.sendMail({
    from: FROM_ADDRESS,
    to,
    subject,
    html,
  });
};

/**
 * Send Payment Rejection Notice
 */
export const sendPaymentRejectedEmail = async ({ to, orderId, courseTitle, reason }) => {
  const mailer = getTransporter();
  const subject = `Payment Status Update: ${orderId} - Implex Edu`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #fecaca; border-radius: 12px; background: #ffffff;">
      <h2 style="color: #dc2626; margin-top: 0;">Payment Verification Unsuccessful</h2>
      <p style="color: #334155; font-size: 14px;">
        Regarding your order <strong>${orderId}</strong> for <strong>${courseTitle}</strong>:
      </p>
      <div style="padding: 16px; background: #fef2f2; border-radius: 8px; margin: 16px 0; color: #991b1b; font-size: 14px;">
        <strong>Reason from Admin:</strong> ${reason || 'The transaction reference could not be matched with bank merchant settlement records.'}
      </div>
      <p style="color: #475569; font-size: 13px;">
        If you believe this is in error, please reach out with your bank/UPI debit advice to: <a href="mailto:student@implexedu.in">student@implexedu.in</a>.
      </p>
    </div>
  `;

  return mailer.sendMail({
    from: FROM_ADDRESS,
    to,
    subject,
    html,
  });
};

/**
 * Send Campaign / Broadcast to Subscribers with Unsubscribe Link
 */
export const sendCampaignEmail = async ({ to, subject, htmlContent, unsubscribeToken }) => {
  const mailer = getTransporter();
  const unsubscribeUrl = `${CLIENT_URL}/unsubscribe?token=${unsubscribeToken}`;
  const fullHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <div style="margin-bottom: 20px;">
        <h2 style="color: #1e3a8a; margin: 0;">IMPLEX EDU</h2>
      </div>
      <div style="color: #334155; font-size: 14px; line-height: 1.6;">
        ${htmlContent}
      </div>
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8;">
        <p style="margin: 0 0 6px 0;">You received this email because you subscribed to updates from Implex Edu.</p>
        <a href="${unsubscribeUrl}" style="color: #64748b; text-decoration: underline;">Unsubscribe from these emails</a>
      </div>
    </div>
  `;

  return mailer.sendMail({
    from: FROM_ADDRESS,
    to,
    subject,
    html: fullHtml,
  });
};
