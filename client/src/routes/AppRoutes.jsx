import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

// Public Pages
import HomePage from '../pages/public/HomePage.jsx';
import AboutPage from '../pages/public/AboutPage.jsx';
import ServicesPage from '../pages/public/ServicesPage.jsx';
import QuizAwardsPage from '../pages/public/QuizAwardsPage.jsx';
import CalendarPage from '../pages/public/CalendarPage.jsx';
import ContactPage from '../pages/public/ContactPage.jsx';
import CertificateVerifyPage from '../pages/public/CertificateVerifyPage.jsx';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard.jsx';
import StudentQuizzes from '../pages/student/StudentQuizzes.jsx';
import StudentQuizRoom from '../pages/student/StudentQuizRoom.jsx';
import StudentCompetitions from '../pages/student/StudentCompetitions.jsx';
import StudentResults from '../pages/student/StudentResults.jsx';
import StudentProfilePage from '../pages/student/StudentProfilePage.jsx';

// Teacher Pages
import TeacherDashboard from '../pages/teacher/TeacherDashboard.jsx';
import TeacherStudents from '../pages/teacher/TeacherStudents.jsx';
import TeacherQuizManager from '../pages/teacher/TeacherQuizManager.jsx';
import TeacherCompetitions from '../pages/teacher/TeacherCompetitions.jsx';
import TeacherProfilePage from '../pages/teacher/TeacherProfilePage.jsx';

// Associate Pages
import AssociateDashboard from '../pages/associate/AssociateDashboard.jsx';
import AssociateInstitutions from '../pages/associate/AssociateInstitutions.jsx';
import AssociateStudents from '../pages/associate/AssociateStudents.jsx';
import AssociateReports from '../pages/associate/AssociateReports.jsx';
import AssociateProfilePage from '../pages/associate/AssociateProfilePage.jsx';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AdminUsers from '../pages/admin/AdminUsers.jsx';
import AdminInstitutions from '../pages/admin/AdminInstitutions.jsx';
import AdminQuizzes from '../pages/admin/AdminQuizzes.jsx';
import AdminCompetitions from '../pages/admin/AdminCompetitions.jsx';
import AdminCertificates from '../pages/admin/AdminCertificates.jsx';
import AdminEnquiries from '../pages/admin/AdminEnquiries.jsx';
import AdminCMS from '../pages/admin/AdminCMS.jsx';
import AdminSettings from '../pages/admin/AdminSettings.jsx';
import AdminPayments from '../pages/admin/AdminPayments.jsx';
import AdminSubscribers from '../pages/admin/AdminSubscribers.jsx';
import PaymentCheckoutPage from '../pages/public/PaymentCheckoutPage.jsx';
import PaymentStatusPage from '../pages/public/PaymentStatusPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/courses" element={<ServicesPage />} />
        <Route path="/quiz-awards" element={<QuizAwardsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/verify" element={<CertificateVerifyPage />} />
        <Route path="/checkout/:courseId" element={<PaymentCheckoutPage />} />
        <Route path="/payment/status/:orderId" element={<PaymentStatusPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      {/* Student Protected Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="quizzes" element={<StudentQuizzes />} />
        <Route path="quizzes/room/:quizId" element={<StudentQuizRoom />} />
        <Route path="competitions" element={<StudentCompetitions />} />
        <Route path="results" element={<StudentResults />} />
        <Route path="profile" element={<StudentProfilePage />} />
      </Route>

      {/* Teacher Protected Routes */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="students" element={<TeacherStudents />} />
        <Route path="quizzes" element={<TeacherQuizManager />} />
        <Route path="competitions" element={<TeacherCompetitions />} />
        <Route path="profile" element={<TeacherProfilePage />} />
      </Route>

      {/* Associate Protected Routes */}
      <Route
        path="/associate"
        element={
          <ProtectedRoute allowedRoles={['associate']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AssociateDashboard />} />
        <Route path="institutions" element={<AssociateInstitutions />} />
        <Route path="students" element={<AssociateStudents />} />
        <Route path="reports" element={<AssociateReports />} />
        <Route path="profile" element={<AssociateProfilePage />} />
      </Route>

      {/* Super Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="institutions" element={<AdminInstitutions />} />
        <Route path="quizzes" element={<AdminQuizzes />} />
        <Route path="competitions" element={<AdminCompetitions />} />
        <Route path="certificates" element={<AdminCertificates />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="subscribers" element={<AdminSubscribers />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="cms" element={<AdminCMS />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
