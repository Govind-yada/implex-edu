import bcrypt from 'bcryptjs';

const DEMO_PASSWORD_HASH = bcrypt.hashSync('Password123!', 10);
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('Admin@Implex2026!', 10);

export const mockUsers = [
  {
    _id: '6afc66dcd673465b14d88881',
    name: 'Super Administrator',
    email: 'admin@implexedu.com',
    password: ADMIN_PASSWORD_HASH,
    role: 'super_admin',
    status: 'active',
    phone: '+91 98765 00001',
    isEmailVerified: true,
    createdAt: new Date('2024-01-01'),
    comparePassword: async function (candidatePassword) {
      return candidatePassword === 'Admin@Implex2026!' || (await bcrypt.compare(candidatePassword, this.password));
    },
  },
  {
    _id: '6afc66dcd673465b14d88882',
    name: 'Prof. Ronald Davis',
    email: 'teacher@implexedu.com',
    password: DEMO_PASSWORD_HASH,
    role: 'teacher',
    status: 'active',
    phone: '+91 98765 00002',
    isEmailVerified: true,
    createdAt: new Date('2024-01-02'),
    comparePassword: async function (candidatePassword) {
      return candidatePassword === 'Password123!' || (await bcrypt.compare(candidatePassword, this.password));
    },
  },
  {
    _id: '6afc66dcd673465b14d88883',
    name: 'Aarav Sharma',
    email: 'student@implexedu.com',
    password: DEMO_PASSWORD_HASH,
    role: 'student',
    status: 'active',
    phone: '+91 98765 00003',
    isEmailVerified: true,
    createdAt: new Date('2024-01-03'),
    comparePassword: async function (candidatePassword) {
      return candidatePassword === 'Password123!' || (await bcrypt.compare(candidatePassword, this.password));
    },
  },
  {
    _id: '6afc66dcd673465b14d88884',
    name: 'Elena Rostova',
    email: 'associate@implexedu.com',
    password: DEMO_PASSWORD_HASH,
    role: 'associate',
    status: 'active',
    phone: '+91 98765 00004',
    isEmailVerified: true,
    createdAt: new Date('2024-01-04'),
    comparePassword: async function (candidatePassword) {
      return candidatePassword === 'Password123!' || (await bcrypt.compare(candidatePassword, this.password));
    },
  },
];

export const mockInstitutions = [
  {
    _id: '6afc66dcd673465b14d88885',
    name: 'Oakridge International Academy',
    code: 'SCH-OAK-01',
    type: 'school',
    description: 'Leading secondary education institution recognized for STEM excellence.',
    email: 'info@oakridge-edu.org',
    phone: '+91 98765 11111',
    isActive: true,
  },
  {
    _id: '6afc66dcd673465b14d88886',
    name: 'Apex Engineering & Technology College',
    code: 'COL-APX-02',
    type: 'college',
    description: 'Premier collegiate academy fostering engineering innovation and research.',
    email: 'contact@apex-tech.edu',
    phone: '+91 98765 22222',
    isActive: true,
  },
];

export const mockQuizzes = [
  {
    _id: '6afc66dcd673465b14d88887',
    title: 'National Science & Astronomy Talent Assessment',
    code: 'QZ-STEM-01',
    description: 'Competitive 30-minute objective evaluation covering physics, mechanics, planetary science, and experimental reasoning.',
    category: 'STEM',
    targetAudience: 'school',
    durationMinutes: 30,
    totalMarks: 20,
    passingPercentage: 60,
    negativeMarking: 0.25,
    status: 'published',
    questionsCount: 4,
    questions: [
      {
        _id: '6afc66dcd673465b14d88891',
        text: 'What fundamental particle carries electromagnetic force in quantum physics?',
        options: ['Electron', 'Photon', 'Gluon', 'Graviton'],
        marks: 5,
        order: 1,
      },
      {
        _id: '6afc66dcd673465b14d88892',
        text: 'Which celestial body possesses the largest volcanic feature in the solar system, Olympus Mons?',
        options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
        marks: 5,
        order: 2,
      },
      {
        _id: '6afc66dcd673465b14d88893',
        text: 'What is the SI unit of electric capacitance?',
        options: ['Henry', 'Farad', 'Tesla', 'Weber'],
        marks: 5,
        order: 3,
      },
      {
        _id: '6afc66dcd673465b14d88894',
        text: 'Which gas comprises approximately 78% of Earth’s atmosphere by volume?',
        options: ['Oxygen', 'Argon', 'Nitrogen', 'Carbon Dioxide'],
        marks: 5,
        order: 4,
      },
    ],
  },
];

export const mockCompetitions = [
  {
    _id: '6afc66dcd673465b14d88888',
    title: 'Global Inter-School STEM Challenge 2026',
    tagline: 'Inspiring young innovators across schools and academies worldwide',
    description: 'A multi-round science, engineering, and coding competition designed to spark innovation among school learners.',
    targetAudience: 'school',
    mode: 'online',
    status: 'upcoming',
    totalRegistered: 142,
    maxParticipants: 1000,
    registrationEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    competitionStartDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
  },
  {
    _id: '6afc66dcd673465b14d88889',
    title: 'University Innovation Hackathon & Research Summit',
    tagline: 'Transforming collegiate research into high-impact digital solutions',
    description: 'A 48-hour competitive innovation summit challenging university undergraduates to prototype solutions in AI and HealthTech.',
    targetAudience: 'university',
    mode: 'hybrid',
    status: 'upcoming',
    totalRegistered: 86,
    maxParticipants: 250,
    registrationEndDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    competitionStartDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
  },
];

export const mockEvents = [
  {
    _id: '6afc66dcd673465b14d88890',
    title: 'National Science Quiz — Round 1 Kickoff',
    description: 'Online examination portal opens for all registered secondary students.',
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    category: 'quiz',
    visibility: 'public',
    location: 'Implex Online Portal',
  },
  {
    _id: '6afc66dcd673465b14d88891',
    title: 'Registration Deadline: Inter-School STEM Challenge',
    description: 'Last day for institutions to submit team rosters and registrations.',
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    category: 'registration_deadline',
    visibility: 'public',
    location: 'Online Registration Gateway',
  },
];

export const mockCertificates = [
  {
    certificateNumber: 'CERT-IMP-DEMO-2026',
    recipientName: 'Aarav Sharma',
    title: 'National Science & Technology Quiz — First Class Honors',
    category: 'quiz_merit',
    issueDate: new Date('2026-01-15'),
    verificationToken: 'VERIFY-STEM-2026',
    metadata: {
      score: 95,
      rank: 1,
      institutionName: 'Oakridge International Academy',
    },
  },
];

export const findMockUserByEmail = (email) => {
  return mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
};

export const findMockUserById = (id) => {
  return mockUsers.find((u) => String(u._id) === String(id));
};

export const addMockUser = (user) => {
  const newUser = {
    ...user,
    _id: `mock_${Date.now()}`,
    comparePassword: async function (p) {
      return this.password === p || (await bcrypt.compare(p, this.password));
    },
  };
  mockUsers.push(newUser);
  return newUser;
};
