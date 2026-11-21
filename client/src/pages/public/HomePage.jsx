import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axios.js';
import {
  GraduationCap,
  Sparkles,
  Trophy,
  Award,
  BookOpen,
  Building,
  Users,
  ShieldCheck,
  Calendar,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  School,
  Landmark,
  BrainCircuit,
  Star,
  Mail,
  Tag,
  Quote,
  Send,
  Zap,
} from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';
import ExamBannerCarousel from '../../components/common/ExamBannerCarousel.jsx';
import TestimonialCarousel from '../../components/common/TestimonialCarousel.jsx';
import { fadeUp, staggerContainer, staggerItem } from '../../animations/motionVariants.js';

export default function HomePage() {
  const [quizzes, setQuizzes] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Guest Gmail collection state (without login/signup)
  const [guestEmail, setGuestEmail] = useState('');
  const [guestEmailLoading, setGuestEmailLoading] = useState(false);
  const [guestEmailSuccess, setGuestEmailSuccess] = useState(false);
  const [guestEmailError, setGuestEmailError] = useState('');

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [quizRes, compRes, eventRes] = await Promise.all([
        api.get('/quizzes?limit=3'),
        api.get('/competitions?limit=2'),
        api.get('/events?limit=3'),
      ]);
      setQuizzes(quizRes.data.data || []);
      setCompetitions(compRes.data.data || []);
      setEvents(eventRes.data.data || []);
    } catch (err) {
      console.error('Failed to fetch home preview data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestEmailSubmit = async (e) => {
    e.preventDefault();
    if (!guestEmail || !guestEmail.includes('@')) {
      setGuestEmailError('Please enter a valid Gmail address (e.g. yourname@gmail.com).');
      return;
    }
    setGuestEmailLoading(true);
    setGuestEmailError('');
    try {
      await api.post('/email-subscriptions/subscribe', {
        email: guestEmail.trim(),
        basicNotifications: true,
        specialOffers: true,
        source: 'homepage_guest_capture',
      });
      setGuestEmailSuccess(true);
      setGuestEmail('');
    } catch (err) {
      if (err.response?.status === 400 || err.response?.data?.message?.toLowerCase().includes('already')) {
        setGuestEmailSuccess(true);
      } else {
        setGuestEmailError(err.response?.data?.message || 'Could not save email. Please try again.');
      }
    } finally {
      setGuestEmailLoading(false);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-24 pb-16 sm:pb-24 overflow-x-clip">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 pb-12 sm:pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-slate-50 via-brand-50/40 to-white overflow-hidden">
        {/* Decorative background ambient glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[760px] h-[300px] sm:h-[460px] bg-gradient-to-tr from-brand-400/15 via-indigo-400/10 to-amber-300/10 blur-[110px] sm:blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-4 sm:right-10 w-[200px] sm:w-[320px] h-[200px] sm:h-[320px] bg-indigo-500/10 blur-[80px] sm:blur-[110px] rounded-full pointer-events-none" />
        <div className="absolute -top-12 left-10 w-72 h-72 bg-brand-500/5 blur-[90px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-brand-200/80 shadow-xs text-[11px] sm:text-xs font-bold text-brand-700 hover:border-brand-300 transition-colors"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
              <span>IMPLEX EDU • Premier Academic & Competitive Foundation</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.14]"
            >
              Learn Today. <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-800">Lead Tomorrow.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-base lg:text-lg font-medium text-slate-600 max-w-2xl mx-auto leading-relaxed px-2"
            >
              Discover new academic opportunities, prepare for premier competitive examinations, and achieve verifiable excellence with Implex Edu.
            </motion.p>

            {/* DYNAMIC ACADEMIC & COMPETITIVE EXAM BANNERS (Half-Pic + Half-Text Style) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="my-3 sm:my-5 w-full"
            >
              <ExamBannerCarousel />
            </motion.div>

            {/* CTAs (Enhanced with Rich Visuals & Smooth Micro-Animations) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-3"
            >
              {/* Button 1: Explore Courses & Syllabus */}
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/services"
                  className="btn-shine group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 via-brand-600 to-indigo-600 hover:from-blue-700 hover:via-brand-700 hover:to-indigo-700 shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4),0_0_20px_-3px_rgba(99,102,241,0.25)] hover:shadow-[0_16px_35px_-4px_rgba(37,99,235,0.55),0_0_30px_-2px_rgba(99,102,241,0.4)] border border-white/20 transition-all duration-300 text-xs sm:text-sm cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-white/30 transition-all duration-300 shadow-inner">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-extrabold tracking-tight">Explore Courses & Syllabus</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-xs group-hover:scale-105 transition-transform">
                    60% OFF
                  </span>
                </Link>
              </motion.div>

              {/* Button 2: Start Learning Free */}
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/register"
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-slate-800 bg-white/95 hover:bg-white border-2 border-slate-200/90 hover:border-brand-500 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.06)] hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.18)] transition-all duration-300 text-xs sm:text-sm cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                    <span className="flex h-1.5 w-1.5 relative shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    <span>FREE</span>
                  </div>
                  <span className="font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">Start Learning Free</span>
                  <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
                  </div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Supporting Highlights (4 Cards - Enhanced UI with Ambient Glows, Duotone Badges & Smooth Lift) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="pt-6 sm:pt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto"
            >
              {/* Card 1: Academic Learning */}
              <motion.div
                whileHover={{ y: -6, scale: 1.025 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative overflow-hidden bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(37,99,235,0.08)] hover:shadow-[0_14px_30px_-6px_rgba(37,99,235,0.22)] hover:border-brand-400/80 text-center transition-all duration-300 group cursor-default"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-brand-500 to-indigo-500 opacity-90 group-hover:h-1.5 transition-all duration-300" />
                <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-brand-500/10 blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div className="relative mx-auto mb-2.5 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-brand-500/25 ring-4 ring-brand-50/80 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-brand-500/40 transition-all duration-300">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200/70 mb-1.5">
                  Class 5th–12th
                </span>
                <p className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-brand-600 transition-colors leading-tight">
                  Academic Learning
                </p>
                <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-1 leading-tight">
                  5th to Senior Secondary
                </p>
              </motion.div>

              {/* Card 2: Competitive Prep */}
              <motion.div
                whileHover={{ y: -6, scale: 1.025 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative overflow-hidden bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.08)] hover:shadow-[0_14px_30px_-6px_rgba(16,185,129,0.22)] hover:border-emerald-400/80 text-center transition-all duration-300 group cursor-default"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 opacity-90 group-hover:h-1.5 transition-all duration-300" />
                <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-emerald-500/10 blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div className="relative mx-auto mb-2.5 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 ring-4 ring-emerald-50/80 group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-emerald-500/40 transition-all duration-300">
                  <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
                </div>
                <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/70 mb-1.5">
                  National Exams
                </span>
                <p className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">
                  Competitive Prep
                </p>
                <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-1 leading-tight">
                  UPSC, SSC, IIT & NEET
                </p>
              </motion.div>

              {/* Card 3: Skill Development */}
              <motion.div
                whileHover={{ y: -6, scale: 1.025 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative overflow-hidden bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.08)] hover:shadow-[0_14px_30px_-6px_rgba(99,102,241,0.22)] hover:border-indigo-400/80 text-center transition-all duration-300 group cursor-default"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 opacity-90 group-hover:h-1.5 transition-all duration-300" />
                <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-indigo-500/10 blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div className="relative mx-auto mb-2.5 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 ring-4 ring-indigo-50/80 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-indigo-500/40 transition-all duration-300">
                  <BrainCircuit className="w-5 h-5 text-white" />
                </div>
                <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/70 mb-1.5">
                  Future Ready
                </span>
                <p className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                  Skill Development
                </p>
                <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-1 leading-tight">
                  Full-Stack, Python & AI
                </p>
              </motion.div>

              {/* Card 4: Verified Honors */}
              <motion.div
                whileHover={{ y: -6, scale: 1.025 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative overflow-hidden bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(245,158,11,0.08)] hover:shadow-[0_14px_30px_-6px_rgba(245,158,11,0.22)] hover:border-amber-400/80 text-center transition-all duration-300 group cursor-default"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 opacity-90 group-hover:h-1.5 transition-all duration-300" />
                <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-amber-500/10 blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div className="relative mx-auto mb-2.5 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25 ring-4 ring-amber-50/80 group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-amber-500/40 transition-all duration-300">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/70 mb-1.5">
                  ISO / QR Verified
                </span>
                <p className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-amber-600 transition-colors leading-tight">
                  Verified Honors
                </p>
                <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-1 leading-tight">
                  Tamper-Proof Certs
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. INSTITUTIONAL TIERS (Schools, Colleges, Universities) */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <Badge variant="blue" className="mb-2.5">Multi-Tier Integration</Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tailored Educational Solutions
          </h2>
          <p className="text-slate-600 text-xs sm:text-base mt-2.5 max-w-lg mx-auto">
            Structured platforms customized for every phase of scholarly development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Schools */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] hover-lift transition-all duration-300 relative overflow-hidden flex flex-col justify-between group hover:border-brand-400">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-brand-600" />
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300 shadow-xs">
                <School className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2.5 group-hover:text-brand-600 transition-colors">Schools & Academies</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Foundational science, mathematics, logic, and general knowledge quizzes tailored for
                grades 6 through 12, encouraging curiosity and early STEM interest.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Inter-school science & math leagues</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Curriculum-aligned practice exams</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Verified merit certificates</span>
                </li>
              </ul>
            </div>
            <Link
              to="/services"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1.5 pt-4 border-t border-slate-100 group-hover:gap-2 transition-all"
            >
              <span>Learn about School Services</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Colleges */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-brand-500 shadow-[0_8px_30px_-6px_rgba(37,99,235,0.12)] hover-lift transition-all duration-300 relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600" />
            <div className="absolute top-4 right-5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
              Popular Choice
            </div>
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-xs">
                <Building className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2.5 group-hover:text-indigo-600 transition-colors">Colleges & Institutes</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Departmental quizzes, technical Olympiads, and competitive aptitude assessments for
                undergraduates preparing for professional and technical careers.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Engineering & Computer Science tracks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Automated negative marking & passing criteria</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Detailed percentile ranking reports</span>
                </li>
              </ul>
            </div>
            <Link
              to="/services"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1.5 pt-4 border-t border-slate-100 group-hover:gap-2 transition-all"
            >
              <span>Learn about College Services</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Universities */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] hover-lift transition-all duration-300 relative overflow-hidden flex flex-col justify-between group hover:border-amber-400">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-rose-500" />
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-xs">
                <Landmark className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2.5 group-hover:text-amber-600 transition-colors">Universities & Research</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Inter-university research hackathons, symposiums, innovation tournaments, and
                multi-disciplinary scholarly award programs.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Hybrid online & on-campus hackathons</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Team-based registrations & submissions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Institutional sponsorship & grant awards</span>
                </li>
              </ul>
            </div>
            <Link
              to="/services"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1.5 pt-4 border-t border-slate-100 group-hover:gap-2 transition-all"
            >
              <span>Learn about University Services</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* 3. FEATURED QUIZZES & LIVE CHALLENGES */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-16 sm:py-24 border-y border-slate-800/80 relative overflow-hidden"
      >
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-900/60 border border-brand-700/60 text-xs font-bold tracking-wider text-brand-300 uppercase mb-2">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Scholastic Challenges</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 tracking-tight">Available Quizzes & Tests</h2>
              <p className="text-slate-400 text-xs sm:text-base mt-2 max-w-xl leading-relaxed">
                Test your knowledge in real-time. Secure timer engines with automated result
                tabulation and instant merit recognition.
              </p>
            </div>
            <Link
              to="/quiz-awards"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10"
            >
              <span>View Full Directory</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-800/90 flex flex-col justify-between hover:border-brand-500/50 hover-lift transition-all duration-300 shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-950 text-brand-300 border border-brand-700/60 uppercase tracking-wide">
                      {quiz.level?.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {quiz.durationMinutes} mins
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-brand-300 transition-colors leading-snug">{quiz.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-5 leading-relaxed">
                    {quiz.description}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-black text-amber-400 tracking-wide">
                    {quiz.isFree ? 'FREE ACCESS' : `₹${quiz.price}`}
                  </span>
                  <Link
                    to="/quiz-awards"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-brand-300 transition-colors"
                  >
                    <span>Enter Room</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* GUEST GMAIL CAPTURE (Zero Login/Signup Required) */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-[#0a193b] to-slate-950 p-6 sm:p-10 lg:p-14 text-white shadow-2xl hover-lift transition-all border border-slate-800">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-bold text-amber-300">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>GUEST INSTANT ACCESS • NO REGISTRATION REQUIRED</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Get Free Academic Syllabus Pack & 30% Discount Code
            </h2>

            <p className="text-xs sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Enter your Gmail to receive instant access to weekly timetable blueprints, sample test papers, and your exclusive <span className="text-amber-300 font-bold">30% OFF coupon code</span> directly in your inbox.
            </p>

            {guestEmailSuccess ? (
              <div className="p-4 sm:p-6 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 backdrop-blur-md text-emerald-200 max-w-xl mx-auto text-center space-y-2 animate-in fade-in zoom-in-95 shadow-lg">
                <div className="flex items-center justify-center gap-2 font-bold text-white text-sm sm:text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Success! Your 30% OFF Code is Ready</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200">
                  We have registered your Gmail for updates. Use coupon code{' '}
                  <strong className="font-mono bg-white/20 px-2 py-0.5 rounded text-amber-300 text-sm">IMPLEX30</strong>{' '}
                  at checkout for an instant 30% discount on any course!
                </p>
                <div className="pt-2">
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all shadow-sm"
                  >
                    <span>Browse Courses Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGuestEmailSubmit} className="max-w-xl mx-auto space-y-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="Enter your Gmail (e.g. name@gmail.com)"
                      required
                      className="w-full pl-10 pr-4 py-3 sm:py-3.5 rounded-xl bg-white/95 text-slate-900 placeholder:text-slate-500 font-medium text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400 transition-all shadow-inner"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={guestEmailLoading}
                    className="btn-shine inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all hover:scale-102 active:scale-95 disabled:opacity-60 shrink-0 cursor-pointer"
                  >
                    {guestEmailLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <>
                        <span>Get 30% Off Code</span>
                        <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </>
                    )}
                  </button>
                </div>

                {guestEmailError && (
                  <p className="text-xs text-rose-300 font-medium text-left px-1">{guestEmailError}</p>
                )}

                <p className="text-[10px] sm:text-[11px] text-slate-400 text-center">
                  🔒 100% spam-free. We only send verified syllabus guides, test announcements, and student discounts.
                </p>
              </form>
            )}
          </div>
        </div>
      </motion.section>

      {/* TESTIMONIALS SECTION (With Smooth Testimonial Carousel) */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/90 text-amber-800 text-[11px] sm:text-xs font-bold shadow-2xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>STUDENT & EDUCATOR VOICES</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trusted by 15,000+ Students, Toppers & Partner Schools
          </h2>

          <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Real feedback from learners who accelerated their academic marks and cracked competitive milestones with Implex Edu.
          </p>
        </div>

        {/* Interactive Animated Carousel */}
        <TestimonialCarousel />
      </motion.section>

      {/* 5. AWARDS, CERTIFICATES & VERIFICATION BANNER */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8"
      >
        <div className="bg-gradient-to-r from-brand-950 via-[#0a1e4a] to-slate-950 rounded-3xl p-6 sm:p-10 lg:p-14 text-white relative overflow-hidden shadow-2xl hover-lift transition-all border border-brand-900/60">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-800/60 border border-brand-600/40 text-[11px] sm:text-xs font-bold text-brand-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Cryptographically Verified Honors
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Verifiable Certificates & Academic Laurels
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every certificate issued through Implex Edu carries a unique tamper-proof identifier.
              Institutions, admissions boards, and employers can verify academic authenticity
              instantly.
            </p>
            <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row gap-2.5 sm:gap-4">
              <Link
                to="/verify"
                className="btn-shine px-5 py-2.5 sm:px-6 sm:py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verify a Certificate Now</span>
              </Link>
              <Link
                to="/quiz-awards"
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-brand-700/60 hover:bg-brand-700 text-white border border-brand-500/40 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center hover:scale-105 active:scale-95"
              >
                <span>View Award Categories</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 6. CALL TO ACTION FOR INSTITUTIONS */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8"
      >
        <div className="bg-gradient-to-b from-white to-slate-50/80 rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] text-center max-w-4xl mx-auto space-y-4 sm:space-y-6 hover-lift transition-all">
          <Badge variant="blue">Partner With Us</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ready to Connect Your Institution?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Join secondary schools, engineering colleges, and universities already organizing
            inter-institutional challenges and evaluating academic progress on Implex Edu.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 pt-2">
            <Link
              to="/contact"
              className="btn-shine w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-brand-500/20 transition-all hover:scale-105 active:scale-95"
            >
              Contact Educational Liaison
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition-all hover:scale-105 active:scale-95 shadow-2xs"
            >
              Institutional Signup
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
