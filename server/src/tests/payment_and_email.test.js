import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';
import { connectDB, closeDB } from '../config/db.js';
import Payment from '../models/Payment.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import EmailSubscriber from '../models/EmailSubscriber.js';
import EmailVerification from '../models/EmailVerification.js';
import User from '../models/User.js';
import { ROLES, PAYMENT_STATUS, ENROLLMENT_STATUS } from '../config/constants.js';
import { generateToken } from '../utils/tokenUtils.js';

describe('Payment & Email Collection Suite', () => {
  let adminToken = '';
  let adminUser = null;

  before(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();

    // Create or find admin user
    adminUser = await User.findOne({ role: ROLES.SUPER_ADMIN });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Super Admin Test',
        email: 'admintest@implexedu.com',
        password: 'Password123!',
        role: ROLES.SUPER_ADMIN,
        status: 'active',
      });
    }
    adminToken = generateToken(adminUser._id);
  });

  after(async () => {
    // Clean up test records
    await Payment.deleteMany({ customerEmail: 'teststudent@example.com' });
    await CourseEnrollment.deleteMany({ customerEmail: 'teststudent@example.com' });
    await EmailSubscriber.deleteMany({ email: 'teststudent@example.com' });
    await EmailVerification.deleteMany({ email: 'teststudent@example.com' });
    await closeDB();
  });

  it('1. POST /api/v1/payments/create-order creates pending payment with merchant UPI details', async () => {
    const res = await request(app)
      .post('/api/v1/payments/create-order')
      .send({
        courseCode: 'BASE-5-FUND-HI',
        customerEmail: 'teststudent@example.com',
        customerName: 'Test Student',
        customerPhone: '9876543210',
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.merchantName, 'Implex Cart International');
    assert.equal(res.body.data.merchantUpiId, '7859088239@okbizaxis');
    assert.equal(res.body.data.amount, 1000);
    assert.equal(res.body.data.status, PAYMENT_STATUS.PENDING);
    assert.match(res.body.data.orderId, /^IMP-/);
  });

  it('2. POST /api/v1/payments/submit-reference submits UTR and transitions to submitted status', async () => {
    // Create order first
    const orderRes = await request(app)
      .post('/api/v1/payments/create-order')
      .send({
        courseCode: 'BASE-5-FUND-HI',
        customerEmail: 'teststudent@example.com',
      });

    const orderId = orderRes.body.data.orderId;

    const res = await request(app)
      .post('/api/v1/payments/submit-reference')
      .field('orderId', orderId)
      .field('customerEmail', 'teststudent@example.com')
      .field('utr', 'UTR998877665544')
      .field('amount', 1000);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.status, PAYMENT_STATUS.SUBMITTED);
    assert.equal(res.body.data.utr, 'UTR998877665544');

    // Verify DB state
    const payment = await Payment.findOne({ orderId });
    assert.equal(payment.status, PAYMENT_STATUS.SUBMITTED);
  });

  it('3. POST /api/v1/payments/submit-reference rejects duplicate UTR', async () => {
    const orderRes2 = await request(app)
      .post('/api/v1/payments/create-order')
      .send({
        courseCode: 'BASE-5-FUND-HI',
        customerEmail: 'teststudent@example.com',
      });

    const orderId2 = orderRes2.body.data.orderId;

    const res = await request(app)
      .post('/api/v1/payments/submit-reference')
      .field('orderId', orderId2)
      .field('customerEmail', 'teststudent@example.com')
      .field('utr', 'UTR998877665544'); // Already used in previous test

    assert.equal(res.status, 409);
    assert.equal(res.body.success, false);
  });

  it('4. PATCH /api/v1/payments/admin/:paymentId/verify verifies payment and creates course enrollment', async () => {
    const payment = await Payment.findOne({ utr: 'UTR998877665544' });
    assert.ok(payment);

    const res = await request(app)
      .patch(`/api/v1/payments/admin/${payment._id}/verify`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ adminNotes: 'Bank settlement matched with Axis account.' });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.payment.status, PAYMENT_STATUS.VERIFIED);
    assert.equal(res.body.data.enrollment.status, ENROLLMENT_STATUS.ACTIVE);
    assert.ok(res.body.data.enrollment.accessKey);

    // Verify DB enrollment
    const enrollment = await CourseEnrollment.findOne({ orderId: payment.orderId });
    assert.ok(enrollment);
    assert.equal(enrollment.customerEmail, 'teststudent@example.com');
  });

  it('5. POST /api/v1/email-subscriptions/subscribe collects email without user login', async () => {
    const res = await request(app)
      .post('/api/v1/email-subscriptions/subscribe')
      .send({
        email: 'teststudent@example.com',
        basicNotifications: true,
        specialOffers: true,
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.basicNotifications, true);
    assert.equal(res.body.data.specialOffers, true);

    const sub = await EmailSubscriber.findOne({ email: 'teststudent@example.com' });
    assert.ok(sub);
    assert.ok(sub.unsubscribeToken);
  });

  it('6. POST /api/v1/email-subscriptions/unsubscribe unsubscribes via token', async () => {
    const sub = await EmailSubscriber.findOne({ email: 'teststudent@example.com' });
    assert.ok(sub);

    const res = await request(app)
      .post('/api/v1/email-subscriptions/unsubscribe')
      .send({ token: sub.unsubscribeToken });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);

    const updated = await EmailSubscriber.findOne({ email: 'teststudent@example.com' });
    assert.equal(updated.subscriptionStatus, 'unsubscribed');
  });
});
