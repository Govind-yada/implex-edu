# IMPLEXEDU — An Educational Unit of I.C.International

**IMPLEXEDU** is an enterprise-grade, full-stack educational technology platform engineered with the MERN stack (MongoDB, Express.js, React.js, Node.js). 

- **Legal Entity**: IMPLEXEDU (An educational unit of I.C.International)
- **Tax & Statutory Numbers**: TAN NO: `PTN001255C` | PAN NO: `AAJF10957N`
- **Official Domains & Portals**: `www.implexedu.in` | `implexedu.in/student-registration`
- **Official Inquiries**: `student@implexedu.in` | `contact@implexedu.in`
- **Academic Operational Framework**: 6 days in a week, 45-minute standard classes, daily 2-4 or 4-6 periods, weekly testing, notes, full syllabus revision, and syllabus extension for All-India level entrance examinations.

---

## 🚀 Key Platform Features

- **Standardized Course & Fee Catalog (Lists A to H)**:
  - **List-A: Base Classes (5th to 8th)**: Fundamental & Advance (Hindi & English Medium) with All-India entrance syllabus extensions.
  - **List-A: High School (9th & 10th)**: Advance Board preparation (Hindi & English Medium).
  - **List-B & List-C: Intermediate (11th & 12th)**: Regular & Special plans in PCM, PCB, Commerce, and Arts (Hindi & English Medium).
  - **List-B & List-C: Integrated Batches**: 11th & 12th PCM IIT Integrated, 11th & 12th PCB NEET Integrated, and 1-Year Flagship Edu plans.
  - **List-D & List-E: Edu-Competition**: C-TET/S-TET (0-5, 6-8, 9-10), BPSC Teacher (0-5, 6-8, 9-10, 11-12), Civil Services (UPSC CSP/Mains, BPSC Prelims/Mains, JPSC, Combined State PCS), Banking (PO & Clerk), Law (CLAT), Defence (NDA & CDS), and Management (CAT & MAT).
  - **List-F: Technical & Coding**: .NET, PHP, Java, C++, Advance Coding, WordPress CMS, Graphic Designing, and Spoken English.
  - **List-H: Professional Nourishment**: Executive HR, Marketing, and Corporate Secretary (CS) Nourishment programmes.

- **Public Educational Portal**: Modern, charming, responsive landing, about, services, dynamic calendar, public certificate verifier, and enquiry gateway.
- **Role-Based Workspaces**:
  - **Super Admin Dashboard**: Consolidated metrics, user approval/suspension, institution onboarding, quiz/competition governance, website CMS, and platform settings.
  - **Teacher Dashboard**: Assigned student cohorts, quiz creation wizard with dynamic question builder (MCQs, marks, negative marking, explanations), and competition tracking.
  - **Student Dashboard**: Live quiz examination room with countdown timers, anti-cheat question navigation, automatic submissions, instant server scoring, and verified certificates.
  - **Associate Dashboard**: Multi-school/college coordination, aggregate student rosters, and participation growth analytics.
- **Anti-Cheat Quiz Engine**: Questions and options are served to students without correct answers or explanations; server timestamp verification prevents clock tampering; scores and negative marks are evaluated strictly on the backend.
- **Verifiable Credentials**: Cryptographically unique certificate numbers and tokens queryable through the public verification portal.
- **Centralized Headless CMS**: Ordinary landing page copy, announcements, and headlines can be edited directly by Super Admins without code deployments.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Redux Toolkit, React Router DOM, Axios, Lucide Icons, FullCalendar, Recharts, Canvas Confetti |
| **Backend** | Node.js (ES6+ Modules), Express.js, MongoDB, Mongoose, JWT, bcryptjs, Zod, Helmet, CORS, Express Rate Limit, Cookie Parser |
| **Testing & Quality** | Native Node.js Test Runner (`node:test`, `node:assert`), Supertest |

---

## 📂 Project Architecture

```
implex-edu/
├── client/                     # Vite React Frontend
│   ├── src/
│   │   ├── api/                # Centralized Axios with Bearer & Cookie interceptors
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, Toast, Badge, Modal, Loader, EmptyState
│   │   │   └── dashboard/      # Sidebar, TopNav, StatCard
│   │   ├── layouts/            # PublicLayout, DashboardLayout
│   │   ├── pages/
│   │   │   ├── public/         # Home, About, Services, QuizAwards, Calendar, Contact, Verify
│   │   │   ├── auth/           # Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── student/        # Dashboard, Quizzes, QuizRoom, Competitions, Results, Profile
│   │   │   ├── teacher/        # Dashboard, Students, QuizManager, Competitions, Profile
│   │   │   ├── associate/      # Dashboard, Institutions, Students, Reports, Profile
│   │   │   └── admin/          # Dashboard, Users, Institutions, Quizzes, Competitions, CMS, Settings
│   │   ├── routes/             # AppRoutes, ProtectedRoute (role-guarded)
│   │   ├── store/              # Redux Toolkit (authSlice, uiSlice)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Express.js REST API
│   ├── src/
│   │   ├── config/             # MongoDB connection with In-Memory fallback, constants
│   │   ├── controllers/        # Auth, Institution, Quiz, Competition, Event, Certificate, Contact, CMS, Admin
│   │   ├── middleware/         # protect, authorize, requireInstitutionAccess, errorHandler
│   │   ├── models/             # 21 Mongoose Schemas (Users, Profiles, Quizzes, Attempts, etc.)
│   │   ├── routes/             # REST endpoints (/api/v1/*)
│   │   ├── utils/              # Token generation, seed script, API response formatters
│   │   ├── validators/         # Zod schemas for registration, login, and updates
│   │   ├── tests/              # End-to-end Supertest test suites
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── implex-edu.postman_collection.json # Ready-to-import Postman Collection
├── package.json                # Root concurrent runner
└── README.md
```

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- Node.js (v18+ or v20+)
- npm or pnpm
- Local MongoDB daemon or a free MongoDB Atlas connection URI

### 2. Installation
From the root directory:
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 3. Environment Configuration
Both `client` and `server` folders include sample `.env.example` configurations.

**Server (.env)**:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/implex_edu
JWT_SECRET=implex_edu_super_secure_jwt_secret_key_2026_dev_prod_hash
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
ADMIN_NAME="Super Administrator"
ADMIN_EMAIL=admin@implexedu.com
ADMIN_PASSWORD=Admin@Implex2026!
```

**Client (.env)**:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME="Implex Edu"
```

### 4. Running the Platform
You can run both client and server concurrently from the root directory:
```bash
npm run dev
```

Or run each service individually:
```bash
# Start backend API (Port 5000)
npm run server

# Start frontend application (Port 5173)
npm run client
```

---

## 🔑 Pre-Seeded Demo Credentials

The platform initializes default seed accounts across all four roles on first startup:

| Role | Email Address | Password | Workspace URL |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@implexedu.com` | `Admin@Implex2026!` | `/admin/dashboard` |
| **Teacher** | `teacher@implexedu.com` | `Password123!` | `/teacher/dashboard` |
| **Student** | `student@implexedu.com` | `Password123!` | `/student/dashboard` |
| **Associate** | `associate@implexedu.com` | `Password123!` | `/associate/dashboard` |

*(Note: The login page also features **1-Click Demo Fill** buttons for instantaneous testing).*

---

## 🧪 Automated Testing

Run the native integration test suite covering authentication, role authorization, anti-cheat question sanitization, and automated scoring:
```bash
cd server
npm test
```

---

## 🌐 Production Deployment Guide

### Frontend Deployment (Vercel or Hostinger Static)
1. In the `client` directory, build the production bundle:
   ```bash
   npm run build
   ```
2. The optimized output is written to `client/dist`.
3. Set your production environment variable:
   ```
   VITE_API_URL=https://api.yourdomain.com/api/v1
   ```
4. For single-page routing on Vercel, ensure rewrite rules route all paths to `/index.html`.

### Backend Deployment (Hostinger Node.js or VPS)
1. Upload the `server` directory.
2. In Hostinger Node.js Application Manager:
   - Application Root: `/server`
   - Startup File: `src/server.js`
   - Node.js Version: `18.x` or `20.x` or `22.x`
3. Configure environment variables in the host panel matching `server/.env.example`.
4. Point `MONGODB_URI` to your MongoDB Atlas cluster.
5. Configure reverse proxy / SSL certificates (Let's Encrypt).

---

## 🛡️ Security & Privacy Compliance

- **HTTP Security**: Helmet headers applied globally.
- **Brute-Force Mitigation**: API rate limiting enabled on all endpoints.
- **Credential Storage**: Passwords hashed using bcrypt (10 rounds).
- **Session Tokens**: JWT stored in `HttpOnly`, `SameSite`, and `Secure` cookies.
- **Server-Side Grading Integrity**: Answers and options weights are never transmitted to client browsers before completion.
