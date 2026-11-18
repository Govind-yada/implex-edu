import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';
import { connectDB, closeDB } from '../config/db.js';
import { seedDatabase } from '../utils/seed.js';

describe('Implex Edu Backend Integration Tests', () => {
  let studentToken = '';
  let teacherToken = '';
  let studentId = '';
  let createdQuizId = '';
  let issuedCertNumber = '';

  before(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
    await seedDatabase();
  });

  after(async () => {
    await closeDB();
  });

  describe('Authentication Suite', () => {
    it('should reject public registration attempting role "super_admin"', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Hacker Admin',
        email: 'hacker@implexedu.com',
        password: 'Password123!',
        role: 'super_admin',
      });
      assert.ok(res.status === 400 || res.status === 403, 'Should reject super_admin with 400 or 403');
      assert.equal(res.body.success, false);
    });

    it('should successfully register a student', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Test Student',
        email: `student_${Date.now()}@example.com`,
        password: 'Password123!',
        role: 'student',
        gradeLevel: 'Grade 10',
      });
      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.user.role, 'student');
      studentToken = res.body.token;
      studentId = res.body.user._id;
    });

    it('should reject duplicate email registration', async () => {
      const email = `dup_${Date.now()}@example.com`;
      await request(app).post('/api/v1/auth/register').send({
        name: 'First User',
        email,
        password: 'Password123!',
        role: 'student',
      });

      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Second User',
        email,
        password: 'Password123!',
        role: 'student',
      });
      assert.equal(res.status, 409);
      assert.equal(res.body.success, false);
    });

    it('should successfully register and login a teacher', async () => {
      const email = `teacher_${Date.now()}@example.com`;
      await request(app).post('/api/v1/auth/register').send({
        name: 'Prof. Isaac',
        email,
        password: 'Password123!',
        role: 'teacher',
        department: 'Mathematics',
      });

      const loginRes = await request(app).post('/api/v1/auth/login').send({
        email,
        password: 'Password123!',
      });
      assert.equal(loginRes.status, 200);
      assert.equal(loginRes.body.success, true);
      assert.equal(loginRes.body.user.role, 'teacher');
      teacherToken = loginRes.body.token;
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'teacher@implexedu.com',
        password: 'IncorrectPassword!',
      });
      assert.equal(res.status, 401);
      assert.equal(res.body.success, false);
    });
  });

  describe('Quiz Engine Suite', () => {
    it('should allow teacher to author a new quiz with questions', async () => {
      const res = await request(app)
        .post('/api/v1/quizzes')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          title: `Olympiad Test ${Date.now()}`,
          category: 'Mathematics',
          durationMinutes: 10,
          passingPercentage: 50,
          questions: [
            {
              questionText: 'What is 12 * 12?',
              options: [{ text: '124' }, { text: '144' }, { text: '164' }, { text: '140' }],
              correctOptionIndex: 1,
              marks: 2,
              explanation: '12 squared is 144.',
            },
            {
              questionText: 'Is 17 a prime number?',
              options: [{ text: 'Yes' }, { text: 'No' }],
              correctOptionIndex: 0,
              marks: 2,
              explanation: '17 is only divisible by 1 and 17.',
            },
          ],
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.totalMarks, 4);
      createdQuizId = res.body.data._id;
    });

    it('should reject unauthorized student from creating a quiz', async () => {
      const res = await request(app)
        .post('/api/v1/quizzes')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Illegal Student Quiz',
          category: 'Physics',
          durationMinutes: 10,
        });
      assert.equal(res.status, 403);
    });

    it('should start student attempt without leaking correctOptionIndex', async () => {
      const res = await request(app)
        .post(`/api/v1/quizzes/${createdQuizId}/start`)
        .set('Authorization', `Bearer ${studentToken}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      const questions = res.body.data.questions;
      assert.equal(questions.length, 2);

      // Verify no correctOptionIndex or explanation is leaked
      questions.forEach((q) => {
        assert.equal(q.correctOptionIndex, undefined);
        assert.equal(q.explanation, undefined);
      });
    });

    it('should submit quiz attempt and accurately compute server score', async () => {
      const startRes = await request(app)
        .post(`/api/v1/quizzes/${createdQuizId}/start`)
        .set('Authorization', `Bearer ${studentToken}`);

      const attemptId = startRes.body.data.attemptId;
      const questions = startRes.body.data.questions;

      const answers = {
        [questions[0]._id]: 1,
        [questions[1]._id]: 0,
      };

      const submitRes = await request(app)
        .post(`/api/v1/quizzes/${createdQuizId}/submit`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          attemptId,
          answers,
        });

      assert.equal(submitRes.status, 200);
      assert.equal(submitRes.body.success, true);
      assert.equal(submitRes.body.data.score, 4);
      assert.equal(submitRes.body.data.percentage, 100);
      assert.equal(submitRes.body.data.isPassed, true);
      assert.ok(submitRes.body.data.certificate);
      if (submitRes.body.data.certificate?.certificateNumber) {
        issuedCertNumber = submitRes.body.data.certificate.certificateNumber;
      }
    });
  });

  describe('Public Endpoints Suite', () => {
    it('should submit a public contact enquiry', async () => {
      const res = await request(app).post('/api/v1/contact').send({
        name: 'Parent Inquirer',
        email: 'parent@example.com',
        phone: '+1 555-1234',
        subject: 'Enrollment Interschool League',
        message: 'How can our academy register 20 students for the upcoming Olympiad?',
      });
      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
    });

    it('should verify sample certificate authenticity', async () => {
      const certToVerify = issuedCertNumber || 'CERT-IMP-DEMO-2026';
      const res = await request(app).get(`/api/v1/certificates/verify/${certToVerify}`);
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.isValid, true);
    });
  });
});
