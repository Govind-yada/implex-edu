import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Submission from '../models/Submission.js';
import StudentProfile from '../models/StudentProfile.js';
import Certificate from '../models/Certificate.js';
import { ROLES, QUIZ_STATUS, ATTEMPT_STATUS } from '../config/constants.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// @desc    Get all published quizzes (or all if teacher/admin)
// @route   GET /api/v1/quizzes
export const getQuizzes = async (req, res, next) => {
  try {
    if (global.__MOCK_MODE__) {
      const { mockQuizzes } = await import('../data/mockStore.js');
      return sendSuccess(res, 200, 'Quizzes retrieved successfully.', mockQuizzes, {
        total: mockQuizzes.length,
        page: 1,
        pages: 1,
      });
    }

    const { category, targetAudience, search, page = 1, limit = 10, status } = req.query;

    const query = {};

    // Only Admin & Teachers can view non-published quizzes
    if (!req.user || (req.user.role !== ROLES.SUPER_ADMIN && req.user.role !== ROLES.TEACHER)) {
      query.status = QUIZ_STATUS.PUBLISHED;
    } else if (status) {
      query.status = status;
    }

    if (category) query.category = category;
    if (targetAudience && targetAudience !== 'all') query.targetAudience = { $in: ['all', targetAudience] };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Quiz.countDocuments(query);
    const quizzes = await Quiz.find(query)
      .populate('createdBy', 'name email role')
      .populate('institution', 'name code')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return sendSuccess(res, 200, 'Quizzes retrieved successfully.', quizzes, {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      limit: Number(limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz details & info (questions omitted for students until attempt starts)
// @route   GET /api/v1/quizzes/:id
export const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('institution', 'name code');

    if (!quiz) {
      return sendError(res, 404, 'Quiz not found.');
    }

    let questions = [];
    // Only author or Super Admin can see question keys directly
    if (
      req.user &&
      (req.user.role === ROLES.SUPER_ADMIN ||
        quiz.createdBy._id.toString() === req.user._id.toString())
    ) {
      questions = await Question.find({ quiz: quiz._id }).sort({ order: 1 });
    }

    return sendSuccess(res, 200, 'Quiz details retrieved.', {
      quiz,
      questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new quiz with questions (Teacher or Super Admin)
// @route   POST /api/v1/quizzes
export const createQuiz = async (req, res, next) => {
  try {
    const {
      title,
      description,
      instructions,
      category,
      targetAudience,
      durationMinutes,
      passingPercentage = 50,
      allowNegativeMarking = false,
      negativeMarkValue = 0.25,
      shuffleQuestions = false,
      maxAttempts = 1,
      instantResultRelease = true,
      institution,
      questions = [],
      status = QUIZ_STATUS.PUBLISHED,
    } = req.body;

    const quiz = await Quiz.create({
      title,
      description,
      instructions,
      category,
      targetAudience,
      durationMinutes,
      passingPercentage,
      allowNegativeMarking,
      negativeMarkValue,
      shuffleQuestions,
      maxAttempts,
      instantResultRelease,
      institution: institution || null,
      createdBy: req.user._id,
      status,
      questionsCount: questions.length,
    });

    let totalCalculatedMarks = 0;
    if (questions.length > 0) {
      const questionDocs = questions.map((q, idx) => {
        const marks = Number(q.marks) || 1;
        totalCalculatedMarks += marks;
        return {
          quiz: quiz._id,
          questionText: q.questionText,
          questionType: q.questionType || 'mcq',
          options: q.options || [],
          correctOptionIndex: Number(q.correctOptionIndex) || 0,
          marks,
          explanation: q.explanation || '',
          order: idx + 1,
        };
      });

      await Question.insertMany(questionDocs);
    }

    quiz.totalMarks = totalCalculatedMarks;
    quiz.passingMarks = Math.round((totalCalculatedMarks * passingPercentage) / 100);
    await quiz.save();

    return sendSuccess(res, 201, 'Quiz created successfully.', quiz);
  } catch (error) {
    next(error);
  }
};

// @desc    Start Quiz Attempt (Student)
// @route   POST /api/v1/quizzes/:id/start
export const startQuizAttempt = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return sendError(res, 404, 'Quiz not found.');
    }

    if (quiz.status !== QUIZ_STATUS.PUBLISHED) {
      return sendError(res, 400, 'This quiz is not currently available for attempts.');
    }

    // Check attempts already made by student
    const existingAttempts = await QuizAttempt.countDocuments({
      quiz: quiz._id,
      student: req.user._id,
      status: { $in: [ATTEMPT_STATUS.SUBMITTED, ATTEMPT_STATUS.TIMEOUT, ATTEMPT_STATUS.EVALUATED] },
    });

    if (existingAttempts >= quiz.maxAttempts) {
      return sendError(
        res,
        400,
        `Maximum attempts (${quiz.maxAttempts}) reached for this quiz.`
      );
    }

    // Check if an in-progress attempt exists
    let activeAttempt = await QuizAttempt.findOne({
      quiz: quiz._id,
      student: req.user._id,
      status: ATTEMPT_STATUS.IN_PROGRESS,
    });

    if (!activeAttempt) {
      const timeLimitExpiresAt = new Date(Date.now() + quiz.durationMinutes * 60 * 1000);
      activeAttempt = await QuizAttempt.create({
        quiz: quiz._id,
        student: req.user._id,
        startedAt: new Date(),
        timeLimitExpiresAt,
        status: ATTEMPT_STATUS.IN_PROGRESS,
        attemptNumber: existingAttempts + 1,
      });
    }

    // Retrieve questions for attempt - STRIP OUT correctOptionIndex and explanation!
    const rawQuestions = await Question.find({ quiz: quiz._id }).sort({ order: 1 });
    const sanitizedQuestions = rawQuestions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.options,
      marks: q.marks,
      order: q.order,
    }));

    return sendSuccess(res, 200, 'Quiz attempt started.', {
      attemptId: activeAttempt._id,
      startedAt: activeAttempt.startedAt,
      timeLimitExpiresAt: activeAttempt.timeLimitExpiresAt,
      durationMinutes: quiz.durationMinutes,
      quizTitle: quiz.title,
      totalMarks: quiz.totalMarks,
      allowNegativeMarking: quiz.allowNegativeMarking,
      negativeMarkValue: quiz.negativeMarkValue,
      questions: sanitizedQuestions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit Quiz Attempt (Server validates, scores, and records)
// @route   POST /api/v1/quizzes/:id/submit
export const submitQuizAttempt = async (req, res, next) => {
  try {
    const { attemptId, answers = {} } = req.body;

    const attempt = await QuizAttempt.findById(attemptId);
    if (!attempt) {
      return sendError(res, 404, 'Quiz attempt not found.');
    }

    if (attempt.student.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'Unauthorized attempt submission.');
    }

    if (attempt.status !== ATTEMPT_STATUS.IN_PROGRESS) {
      return sendError(res, 400, 'This attempt has already been submitted or expired.');
    }

    const quiz = await Quiz.findById(attempt.quiz);
    const questions = await Question.find({ quiz: quiz._id });

    // Allow 60 seconds grace window for network transmission delay
    const graceWindow = 60 * 1000;
    const isOverdue = Date.now() > new Date(attempt.timeLimitExpiresAt).getTime() + graceWindow;

    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    let totalMarksPossible = 0;

    const submissionRecords = [];

    for (const q of questions) {
      totalMarksPossible += q.marks;
      const selectedIndex = answers[q._id.toString()];

      if (selectedIndex === undefined || selectedIndex === null || selectedIndex === -1) {
        unansweredCount++;
        submissionRecords.push({
          attempt: attempt._id,
          question: q._id,
          selectedOptionIndex: -1,
          isCorrect: false,
          marksAwarded: 0,
        });
      } else if (Number(selectedIndex) === q.correctOptionIndex) {
        correctCount++;
        score += q.marks;
        submissionRecords.push({
          attempt: attempt._id,
          question: q._id,
          selectedOptionIndex: Number(selectedIndex),
          isCorrect: true,
          marksAwarded: q.marks,
        });
      } else {
        incorrectCount++;
        let penalty = 0;
        if (quiz.allowNegativeMarking) {
          penalty = quiz.negativeMarkValue * q.marks;
          score = Math.max(0, score - penalty);
        }
        submissionRecords.push({
          attempt: attempt._id,
          question: q._id,
          selectedOptionIndex: Number(selectedIndex),
          isCorrect: false,
          marksAwarded: -penalty,
        });
      }
    }

    // Save submissions
    await Submission.deleteMany({ attempt: attempt._id });
    await Submission.insertMany(submissionRecords);

    const percentage = totalMarksPossible > 0 ? (score / totalMarksPossible) * 100 : 0;
    const isPassed = percentage >= quiz.passingPercentage;

    attempt.submittedAt = new Date();
    attempt.status = isOverdue ? ATTEMPT_STATUS.TIMEOUT : ATTEMPT_STATUS.SUBMITTED;
    attempt.score = Number(score.toFixed(2));
    attempt.totalMarksPossible = totalMarksPossible;
    attempt.percentage = Number(percentage.toFixed(1));
    attempt.isPassed = isPassed;
    attempt.correctAnswersCount = correctCount;
    attempt.incorrectAnswersCount = incorrectCount;
    attempt.unansweredCount = unansweredCount;

    await attempt.save();

    // Update Student Profile Aggregate Metrics
    const studentProfile = await StudentProfile.findOne({ user: req.user._id });
    if (studentProfile) {
      const prevTotal = studentProfile.totalQuizzesAttempted || 0;
      const prevAvg = studentProfile.averageScore || 0;
      const newTotal = prevTotal + 1;
      const newAvg = (prevAvg * prevTotal + percentage) / newTotal;

      studentProfile.totalQuizzesAttempted = newTotal;
      studentProfile.averageScore = Number(newAvg.toFixed(1));
      await studentProfile.save();
    }

    // If passed with distinction (>= 75%), generate a merit certificate automatically
    let certificateIssued = null;
    if (isPassed && percentage >= 75) {
      const certNumber = `CERT-Q-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      certificateIssued = await Certificate.create({
        certificateNumber: certNumber,
        user: req.user._id,
        recipientName: req.user.name,
        title: `Certificate of Merit — ${quiz.title}`,
        category: 'quiz_merit',
        relatedQuiz: quiz._id,
        verificationToken: `VERIFY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        metadata: {
          score: attempt.score,
          institutionName: 'Implex Edu Academy',
        },
      });
    }

    return sendSuccess(res, 200, 'Quiz attempt submitted successfully!', {
      attemptId: attempt._id,
      score: attempt.score,
      totalMarksPossible: attempt.totalMarksPossible,
      percentage: attempt.percentage,
      isPassed: attempt.isPassed,
      correctAnswersCount: attempt.correctAnswersCount,
      incorrectAnswersCount: attempt.incorrectAnswersCount,
      unansweredCount: attempt.unansweredCount,
      certificate: certificateIssued,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed review of a completed attempt
// @route   GET /api/v1/quizzes/attempts/:attemptId
export const getAttemptResult = async (req, res, next) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.attemptId)
      .populate('quiz', 'title category durationMinutes passingPercentage instantResultRelease')
      .populate('student', 'name email');

    if (!attempt) {
      return sendError(res, 404, 'Attempt record not found.');
    }

    // Authorization check
    if (
      req.user.role === ROLES.STUDENT &&
      attempt.student._id.toString() !== req.user._id.toString()
    ) {
      return sendError(res, 403, 'Unauthorized access to this attempt.');
    }

    const submissions = await Submission.find({ attempt: attempt._id }).populate('question');

    return sendSuccess(res, 200, 'Attempt result details.', {
      attempt,
      submissions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all attempts for current user
// @route   GET /api/v1/quizzes/my-attempts
export const getMyAttempts = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ student: req.user._id })
      .populate('quiz', 'title category totalMarks durationMinutes')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'User quiz attempts.', attempts);
  } catch (error) {
    next(error);
  }
};
