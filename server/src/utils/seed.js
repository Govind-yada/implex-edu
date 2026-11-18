import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import TeacherProfile from '../models/TeacherProfile.js';
import AssociateProfile from '../models/AssociateProfile.js';
import Institution from '../models/Institution.js';
import InstitutionMembership from '../models/InstitutionMembership.js';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import Competition from '../models/Competition.js';
import Event from '../models/Event.js';
import Certificate from '../models/Certificate.js';
import WebsiteContent from '../models/WebsiteContent.js';
import PlatformSetting from '../models/PlatformSetting.js';
import Course from '../models/Course.js';
import { OFFICIAL_COURSES } from '../data/coursesData.js';
import { ROLES, USER_STATUS, INSTITUTION_TYPES, QUIZ_STATUS, COMPETITION_STATUS } from '../config/constants.js';
import { connectDB, closeDB } from '../config/db.js';

export const seedDatabase = async () => {
  if (global.__MOCK_MODE__) {
    console.log('[Seed] In-Memory Demo Mode active. Demo users, courses, and sample data initialized.');
    return;
  }

  try {
    console.log('[Seed] Checking database seeding state...');

    // 1. Platform Settings
    const existingSettings = await PlatformSetting.findOne({ key: 'registrationApproval' });
    if (!existingSettings) {
      await PlatformSetting.create([
        {
          key: 'registrationApproval',
          value: {
            requireTeacherApproval: false,
            requireAssociateApproval: true,
            requireStudentApproval: false,
          },
          description: 'Registration approval requirement per role',
        },
        {
          key: 'generalSettings',
          value: {
            siteName: 'IMPLEXEDU',
            tagline: 'An educational unit of I.C.International',
            tanNo: 'PTN001255C',
            panNo: 'AAJF10957N',
            supportEmail: 'student@implexedu.in',
            contactEmail: 'contact@implexedu.in',
            website: 'www.implexedu.in',
            registrationUrl: 'implexedu.in/student-registration',
            validityYear: '2024-25',
            maintenanceMode: false,
          },
          description: 'Official organization legal credentials and global site configuration',
        },
      ]);
      console.log('[Seed] Platform settings seeded.');
    }

    // 2. Super Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@implexedu.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: process.env.ADMIN_NAME || 'Super Administrator',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@Implex2026!',
        role: ROLES.SUPER_ADMIN,
        status: USER_STATUS.ACTIVE,
        phone: '+1 (800) 555-0199',
        isEmailVerified: true,
      });
      console.log(`[Seed] Super Admin user created: ${adminEmail}`);
    }

    // 3. Demo Institutions
    let school = await Institution.findOne({ code: 'SCH-OAK-01' });
    if (!school) {
      school = await Institution.create({
        name: 'Oakridge International Academy',
        code: 'SCH-OAK-01',
        type: INSTITUTION_TYPES.SCHOOL,
        description: 'Leading secondary education institution recognized for STEM excellence.',
        email: 'info@oakridge-edu.org',
        phone: '+1 (555) 234-5678',
        website: 'https://oakridge-edu.org',
        address: {
          street: '100 Academic Blvd',
          city: 'Boston',
          state: 'MA',
          country: 'USA',
          zipCode: '02108',
        },
      });

      const college = await Institution.create({
        name: 'Apex Engineering & Technology College',
        code: 'COL-APX-02',
        type: INSTITUTION_TYPES.COLLEGE,
        description: 'Premier collegiate academy offering accredited engineering and computer science programs.',
        email: 'admissions@apex-tech.edu',
        phone: '+1 (555) 345-6789',
        website: 'https://apex-tech.edu',
        address: {
          street: '500 Innovation Way',
          city: 'San Jose',
          state: 'CA',
          country: 'USA',
          zipCode: '95112',
        },
      });

      const university = await Institution.create({
        name: 'Grandview Metropolitan University',
        code: 'UNI-GVM-03',
        type: INSTITUTION_TYPES.UNIVERSITY,
        description: 'World-renowned research university fostering interdisciplinary scholarship.',
        email: 'chancellor@grandview-metro.edu',
        phone: '+1 (555) 456-7890',
        website: 'https://grandview-metro.edu',
        address: {
          street: '1000 University Heights',
          city: 'Austin',
          state: 'TX',
          country: 'USA',
          zipCode: '78712',
        },
      });
      console.log('[Seed] Sample institutions created (School, College, University).');
    }

    // 4. Demo Teacher
    let teacher = await User.findOne({ email: 'teacher@implexedu.com' });
    if (!teacher) {
      teacher = await User.create({
        name: 'Prof. Marcus Vance',
        email: 'teacher@implexedu.com',
        password: 'Password123!',
        role: ROLES.TEACHER,
        status: USER_STATUS.ACTIVE,
        phone: '+1 (555) 888-2341',
        isEmailVerified: true,
      });

      await TeacherProfile.create({
        user: teacher._id,
        institutions: school ? [school._id] : [],
        department: 'Science & Computing',
        designation: 'Senior Faculty Lead',
        qualification: 'M.Sc. Computer Science',
        specializationSubjects: ['Web Technologies', 'Physics', 'Robotics'],
        bio: 'Passionate computer science and STEM educator with 12+ years of educational curriculum development experience.',
      });

      if (school) {
        await InstitutionMembership.create({
          institution: school._id,
          user: teacher._id,
          role: ROLES.TEACHER,
          status: 'active',
        });
      }
      console.log('[Seed] Demo Teacher account created: teacher@implexedu.com (Pass: Password123!)');
    }

    // 5. Demo Student
    let student = await User.findOne({ email: 'student@implexedu.com' });
    if (!student) {
      student = await User.create({
        name: 'Sophia Reynolds',
        email: 'student@implexedu.com',
        password: 'Password123!',
        role: ROLES.STUDENT,
        status: USER_STATUS.ACTIVE,
        phone: '+1 (555) 777-1234',
        isEmailVerified: true,
      });

      await StudentProfile.create({
        user: student._id,
        institution: school ? school._id : null,
        gradeLevel: 'Grade 11 - STEM Track',
        rollNumber: 'OAK-2026-042',
        academicInterests: ['Computer Science', 'Mathematics', 'Astronomy'],
        totalQuizzesAttempted: 3,
        averageScore: 88.5,
      });

      if (school) {
        await InstitutionMembership.create({
          institution: school._id,
          user: student._id,
          role: ROLES.STUDENT,
          status: 'active',
        });
      }
      console.log('[Seed] Demo Student account created: student@implexedu.com (Pass: Password123!)');
    }

    // 6. Demo Associate
    let associate = await User.findOne({ email: 'associate@implexedu.com' });
    if (!associate) {
      associate = await User.create({
        name: 'Elena Rostova',
        email: 'associate@implexedu.com',
        password: 'Password123!',
        role: ROLES.ASSOCIATE,
        status: USER_STATUS.ACTIVE,
        phone: '+1 (555) 666-9900',
        isEmailVerified: true,
      });

      await AssociateProfile.create({
        user: associate._id,
        organizationName: 'Global EduLink Foundation',
        designation: 'Regional Educational Liaison',
        assignedInstitutions: school ? [school._id] : [],
        territoryOrRegion: 'North American East Region',
        partnershipNotes: 'Direct coordinator for secondary school quiz leagues and Olympiads.',
      });
      console.log('[Seed] Demo Associate account created: associate@implexedu.com (Pass: Password123!)');
    }

    // 7. Seed Quizzes & Questions
    const existingQuiz = await Quiz.findOne({ title: 'National Science & Technology Quiz 2026' });
    if (!existingQuiz && teacher) {
      const quiz1 = await Quiz.create({
        title: 'National Science & Technology Quiz 2026',
        description: 'A comprehensive quiz evaluating fundamentals of physics, computing, and emerging scientific developments.',
        instructions: 'Read each question carefully. Select the most accurate answer. 1 point per correct answer.',
        category: 'Science & Technology',
        targetAudience: 'school',
        durationMinutes: 15,
        totalMarks: 5,
        passingMarks: 3,
        passingPercentage: 60,
        allowNegativeMarking: true,
        negativeMarkValue: 0.25,
        status: QUIZ_STATUS.PUBLISHED,
        createdBy: teacher._id,
        institution: school ? school._id : null,
        questionsCount: 5,
      });

      await Question.create([
        {
          quiz: quiz1._id,
          questionText: 'What fundamental phenomenon allows fiber optic cables to transmit data across long distances with minimal loss?',
          questionType: 'mcq',
          options: [
            { text: 'Total Internal Reflection' },
            { text: 'Diffraction of Light' },
            { text: 'Photoelectric Effect' },
            { text: 'Quantum Entanglement' },
          ],
          correctOptionIndex: 0,
          marks: 1,
          explanation: 'Total internal reflection occurs when the light traveling in a denser medium strikes the boundary at an angle greater than the critical angle.',
          order: 1,
        },
        {
          quiz: quiz1._id,
          questionText: 'Which protocol is responsible for securely encrypting communications between a client browser and a web server?',
          questionType: 'mcq',
          options: [
            { text: 'FTP' },
            { text: 'HTTPS / TLS' },
            { text: 'SNMP' },
            { text: 'Telnet' },
          ],
          correctOptionIndex: 1,
          marks: 1,
          explanation: 'HTTPS operates over Transport Layer Security (TLS) to encrypt and authenticate web traffic.',
          order: 2,
        },
        {
          quiz: quiz1._id,
          questionText: 'In computer science, what is the average time complexity of searching an element in a balanced binary search tree?',
          questionType: 'mcq',
          options: [
            { text: 'O(1)' },
            { text: 'O(log n)' },
            { text: 'O(n)' },
            { text: 'O(n^2)' },
          ],
          correctOptionIndex: 1,
          marks: 1,
          explanation: 'Because half the remaining search space is discarded at each step, balanced BST lookup is logarithmic O(log n).',
          order: 3,
        },
        {
          quiz: quiz1._id,
          questionText: 'Which planet in our solar system has the most extensive and visible ring system?',
          questionType: 'mcq',
          options: [
            { text: 'Jupiter' },
            { text: 'Mars' },
            { text: 'Saturn' },
            { text: 'Neptune' },
          ],
          correctOptionIndex: 2,
          marks: 1,
          explanation: 'Saturn has by far the largest and most prominent ring system, composed primarily of water ice and rock fragments.',
          order: 4,
        },
        {
          quiz: quiz1._id,
          questionText: 'What does DNA stand for in biological sciences?',
          questionType: 'mcq',
          options: [
            { text: 'Deoxyribonucleic Acid' },
            { text: 'Dinucleotide Acid' },
            { text: 'Dual Nuclear Amine' },
            { text: 'Deoxyribose Nitrogen Acetate' },
          ],
          correctOptionIndex: 0,
          marks: 1,
          explanation: 'DNA stands for Deoxyribonucleic Acid, the molecule carrying genetic instructions for living organisms.',
          order: 5,
        },
      ]);

      const quiz2 = await Quiz.create({
        title: 'Modern Mathematics & Logic Olympiad Practice',
        description: 'Test your problem-solving prowess across algebraic patterns, probability, and spatial reasoning.',
        instructions: 'Duration is 20 minutes. Negative marking is disabled. Passing score is 50%.',
        category: 'Mathematics',
        targetAudience: 'college',
        durationMinutes: 20,
        totalMarks: 3,
        passingMarks: 2,
        passingPercentage: 50,
        allowNegativeMarking: false,
        status: QUIZ_STATUS.PUBLISHED,
        createdBy: teacher._id,
        questionsCount: 3,
      });

      await Question.create([
        {
          quiz: quiz2._id,
          questionText: 'If a coin is tossed 3 times, what is the exact probability of getting at least two heads?',
          questionType: 'mcq',
          options: [
            { text: '1/4 (25%)' },
            { text: '1/2 (50%)' },
            { text: '3/8 (37.5%)' },
            { text: '5/8 (62.5%)' },
          ],
          correctOptionIndex: 1,
          marks: 1,
          explanation: 'The outcomes with at least two heads are HHH, HHT, HTH, THH (4 outcomes out of 8 total = 4/8 = 1/2).',
          order: 1,
        },
        {
          quiz: quiz2._id,
          questionText: 'What is the value of the hypotenuse of a right-angled triangle with legs of length 9 and 12?',
          questionType: 'mcq',
          options: [
            { text: '14' },
            { text: '15' },
            { text: '16' },
            { text: '18' },
          ],
          correctOptionIndex: 1,
          marks: 1,
          explanation: 'Using the Pythagorean theorem: sqrt(9^2 + 12^2) = sqrt(81 + 144) = sqrt(225) = 15.',
          order: 2,
        },
        {
          quiz: quiz2._id,
          questionText: 'What is the sum of interior angles of a convex hexagon?',
          questionType: 'mcq',
          options: [
            { text: '540 degrees' },
            { text: '720 degrees' },
            { text: '900 degrees' },
            { text: '1080 degrees' },
          ],
          correctOptionIndex: 1,
          marks: 1,
          explanation: 'Formula is (n - 2) * 180 = (6 - 2) * 180 = 720 degrees.',
          order: 3,
        },
      ]);

      console.log('[Seed] Quizzes and question banks seeded.');
    }

    // 8. Seed Competitions
    const existingComp = await Competition.findOne({ title: 'Global Inter-School STEM Challenge 2026' });
    if (!existingComp && admin) {
      await Competition.create([
        {
          title: 'Global Inter-School STEM Challenge 2026',
          tagline: 'Inspiring young innovators across schools and academies worldwide',
          description: 'A multi-round science, engineering, and coding competition designed to spark innovation and problem solving among school learners.',
          guidelines: 'Students in grades 8-12 can participate as individuals or teams of up to 3. Preliminary rounds are conducted online.',
          eligibilityCriteria: 'Enrolled students aged 13-18 representing registered secondary institutions.',
          targetAudience: 'school',
          mode: 'online',
          status: COMPETITION_STATUS.UPCOMING,
          registrationStartDate: new Date(),
          registrationEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          competitionStartDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
          competitionEndDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000),
          maxParticipants: 1000,
          totalRegistered: 142,
          awardsAndPrizes: [
            { rank: '1st Place', title: 'Grand Gold Trophy & \$3,000 STEM Grant', prize: 'Gold Medal + Institution Laboratory Equipment Grant' },
            { rank: '2nd Place', title: 'Silver Laurels & \$1,500 Grant', prize: 'Silver Medal + Tech Scholar Subscriptions' },
            { rank: '3rd Place', title: 'Bronze Honor & \$750 Grant', prize: 'Bronze Medal + Robotics Kits' },
          ],
          createdBy: admin._id,
        },
        {
          title: 'University Innovation Hackathon & Research Summit',
          tagline: 'Transforming collegiate research into high-impact digital solutions',
          description: 'A 48-hour competitive innovation summit challenging university undergraduates and graduates to prototype applications in Artificial Intelligence, HealthTech, and Sustainability.',
          guidelines: 'Open to teams of 2 to 4 university students. Code repositories and prototype demonstrations submitted via platform.',
          eligibilityCriteria: 'Undergraduate and postgraduate students with valid university enrollment.',
          targetAudience: 'university',
          mode: 'hybrid',
          venueDetails: 'Main Auditorium, Grandview Metro Campus & Online Live Stream',
          status: COMPETITION_STATUS.UPCOMING,
          registrationStartDate: new Date(),
          registrationEndDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          competitionStartDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          competitionEndDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
          maxParticipants: 250,
          totalRegistered: 86,
          awardsAndPrizes: [
            { rank: 'Grand Champion', title: '\$5,000 Seed Funding & Incubator Fast-Track', prize: 'Cash grant + Seed Accelerator Sponsorship' },
            { rank: 'Runner Up', title: '\$2,500 Innovation Prize', prize: 'Cash prize + Cloud Computing Credits' },
          ],
          createdBy: admin._id,
        },
      ]);
      console.log('[Seed] Sample competitions seeded.');
    }

    // 9. Seed Events
    const existingEvents = await Event.countDocuments();
    if (existingEvents === 0 && admin) {
      const now = new Date();
      await Event.create([
        {
          title: 'National Science Quiz — Round 1 Kickoff',
          description: 'Online examination portal opens for all registered secondary students.',
          startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 10, 0),
          endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 12, 0),
          category: 'quiz',
          visibility: 'public',
          location: 'Implex Online Portal',
          createdBy: admin._id,
        },
        {
          title: 'Registration Deadline: Inter-School STEM Challenge',
          description: 'Last day for institutions to submit team rosters and registrations.',
          startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14, 23, 59),
          endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14, 23, 59),
          category: 'registration_deadline',
          visibility: 'public',
          location: 'Online Registration Gateway',
          createdBy: admin._id,
        },
        {
          title: 'Educator & Associate Coordination Summit',
          description: 'Virtual session sharing institutional best practices, student mentoring, and quiz tournament logistics.',
          startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 15, 0),
          endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 17, 0),
          category: 'workshop',
          visibility: 'teacher',
          location: 'Interactive Video Conference',
          createdBy: admin._id,
        },
      ]);
      console.log('[Seed] Sample events created.');
    }

    // 10. Sample Certificate for Student
    if (student) {
      const existingCert = await Certificate.findOne({ user: student._id });
      if (!existingCert) {
        await Certificate.create({
          certificateNumber: 'CERT-IMP-DEMO-2026',
          user: student._id,
          recipientName: student.name,
          title: 'National Science & Technology Quiz — First Class Honors',
          category: 'quiz_merit',
          issueDate: new Date(),
          verificationToken: 'VERIFY-STEM-2026',
          metadata: {
            score: 95,
            rank: 1,
            institutionName: 'Oakridge International Academy',
          },
        });
        console.log('[Seed] Sample verifiable certificate seeded.');
      }
    }

    // 11. Official Implex Edu Course Catalog
    const existingCoursesCount = await Course.countDocuments();
    if (existingCoursesCount === 0) {
      console.log(`[Seed] Seeding ${OFFICIAL_COURSES.length} official courses across List-A to List-H...`);
      await Course.insertMany(
        OFFICIAL_COURSES.map((course, idx) => ({
          ...course,
          order: idx + 1,
        }))
      );
      console.log('[Seed] Official course catalog seeded successfully.');
    }

    console.log('[Seed] Database initialization completed successfully.');
  } catch (error) {
    console.error('[Seed] Database seeding failed:', error);
  }
};

// Standalone execution support
if (process.argv[1]?.endsWith('seed.js')) {
  connectDB().then(async () => {
    await seedDatabase();
    await closeDB();
    process.exit(0);
  });
}
