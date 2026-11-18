import Competition from '../models/Competition.js';
import CompetitionRegistration from '../models/CompetitionRegistration.js';
import Certificate from '../models/Certificate.js';
import Result from '../models/Result.js';
import { ROLES, COMPETITION_STATUS, REGISTRATION_STATUS } from '../config/constants.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// @desc    Get all competitions
// @route   GET /api/v1/competitions
export const getCompetitions = async (req, res, next) => {
  try {
    if (global.__MOCK_MODE__) {
      const { mockCompetitions } = await import('../data/mockStore.js');
      return sendSuccess(res, 200, 'Competitions retrieved successfully.', mockCompetitions, {
        total: mockCompetitions.length,
        page: 1,
        pages: 1,
      });
    }

    const { status, mode, targetAudience, search, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (mode) query.mode = mode;
    if (targetAudience && targetAudience !== 'all') {
      query.targetAudience = { $in: ['all', targetAudience] };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Competition.countDocuments(query);
    const competitions = await Competition.find(query)
      .populate('createdBy', 'name email')
      .sort({ competitionStartDate: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return sendSuccess(res, 200, 'Competitions retrieved successfully.', competitions, {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      limit: Number(limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single competition with details
// @route   GET /api/v1/competitions/:id
export const getCompetitionById = async (req, res, next) => {
  try {
    const competition = await Competition.findById(req.params.id).populate('createdBy', 'name email');

    if (!competition) {
      return sendError(res, 404, 'Competition not found.');
    }

    let userRegistration = null;
    if (req.user) {
      userRegistration = await CompetitionRegistration.findOne({
        competition: competition._id,
        user: req.user._id,
      });
    }

    const results = await Result.find({ competition: competition._id })
      .populate('user', 'name avatar')
      .sort({ rank: 1 })
      .limit(10);

    return sendSuccess(res, 200, 'Competition details retrieved.', {
      competition,
      userRegistration,
      topRankers: results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create competition (Super Admin)
// @route   POST /api/v1/competitions
export const createCompetition = async (req, res, next) => {
  try {
    const {
      title,
      tagline,
      description,
      guidelines,
      eligibilityCriteria,
      targetAudience,
      mode,
      venueDetails,
      registrationStartDate,
      registrationEndDate,
      competitionStartDate,
      competitionEndDate,
      maxParticipants,
      awardsAndPrizes,
      bannerUrl,
      status,
    } = req.body;

    const competition = await Competition.create({
      title,
      tagline,
      description,
      guidelines,
      eligibilityCriteria,
      targetAudience,
      mode,
      venueDetails,
      registrationStartDate: registrationStartDate || new Date(),
      registrationEndDate,
      competitionStartDate,
      competitionEndDate,
      maxParticipants: maxParticipants || 500,
      awardsAndPrizes: awardsAndPrizes || [],
      bannerUrl,
      status: status || COMPETITION_STATUS.UPCOMING,
      createdBy: req.user._id,
    });

    return sendSuccess(res, 201, 'Competition created successfully.', competition);
  } catch (error) {
    next(error);
  }
};

// @desc    Register for competition (Student, Teacher, Associate)
// @route   POST /api/v1/competitions/:id/register
export const registerForCompetition = async (req, res, next) => {
  try {
    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      return sendError(res, 404, 'Competition not found.');
    }

    if (new Date() > new Date(competition.registrationEndDate)) {
      return sendError(res, 400, 'Registration for this competition has closed.');
    }

    const existingReg = await CompetitionRegistration.findOne({
      competition: competition._id,
      user: req.user._id,
    });

    if (existingReg) {
      return sendError(res, 409, 'You are already registered for this competition.');
    }

    const regNumber = `COMP-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const registration = await CompetitionRegistration.create({
      competition: competition._id,
      user: req.user._id,
      institution: req.body.institutionId || null,
      registrationNumber: regNumber,
      teamName: req.body.teamName || '',
      teamMembers: req.body.teamMembers || [],
      status: REGISTRATION_STATUS.CONFIRMED,
    });

    competition.totalRegistered += 1;
    await competition.save();

    return sendSuccess(res, 201, 'Registered for competition successfully!', registration);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's registrations
// @route   GET /api/v1/competitions/my-registrations
export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await CompetitionRegistration.find({ user: req.user._id })
      .populate('competition')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'User registrations.', registrations);
  } catch (error) {
    next(error);
  }
};
