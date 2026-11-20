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
      <section className="relative pt-6 sm:pt-12 pb-12 sm:pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-brand-50/70 via-white to-slate-50">
        {/* Decorative background ambient glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[700px] h-[300px] sm:h-[400px] bg-brand-400/10 blur-[100px] sm:blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-4 sm:right-10 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-accent-indigo/10 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white border border-brand-200/80 shadow-xs text-[11px] sm:text-xs font-bold text-brand-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent-amber animate-spin-slow" />
              <span>IMPLEX EDU — Academic & Competitive Excellence</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.16]"
            >
              Learn Today. <span className="text-gradient">Lead Tomorrow.</span>
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

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 px-3"
            >
              <Link
                to="/services"
                className="btn-shine w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/25 transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                Explore Courses & Syllabus
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm cursor-pointer"
              >
                Start Learning Free
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </motion.div>

            {/* Supporting Highlights (Mobile Optimized 2x2 Grid) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="pt-6 sm:pt-10 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 max-w-4xl mx-auto"
            >
              <div className="bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-2xs text-center hover-lift hover:border-brand-300 transition-all">
                <div className="w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-1.5 sm:mb-2 font-bold text-sm shadow-2xs">
                  <BookOpen className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">Academic Learning</p>
                <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5">5th to Senior Secondary</p>
              </div>

              <div className="bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-2xs text-center hover-lift hover:border-brand-300 transition-all">
                <div className="w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 sm:mb-2 font-bold text-sm shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">Competitive Prep</p>
                <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5">UPSC, SSC, IIT & NEET</p>
              </div>

              <div className="bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-2xs text-center hover-lift hover:border-brand-300 transition-all">
                <div className="w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1.5 sm:mb-2 font-bold text-sm shadow-2xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">Skill Development</p>
                <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5">Full-Stack, Python & AI</p>
              </div>

              <div className="bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-2xs text-center hover-lift hover:border-brand-300 transition-all">
                <div className="w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5 sm:mb-2 font-bold text-sm shadow-2xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">Verified Honors</p>
                <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5">Tamper-Proof Certs</p>
              </div>
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
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <Badge variant="blue" className="mb-2">Multi-Tier Integration</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tailored Educational Solutions
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            Structured platforms customized for every phase of scholarly development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Schools */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card hover-lift transition-all duration-300">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 sm:mb-6">
              <School className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Schools & Academies</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 sm:mb-6">
              Foundational science, mathematics, logic, and general knowledge quizzes tailored for
              grades 6 through 12, encouraging curiosity and early STEM interest.
            </p>
            <ul className="space-y-2 text-xs text-slate-700 font-medium mb-5 sm:mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Inter-school science & math leagues
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Curriculum-aligned practice exams
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Verified merit certificates
              </li>
            </ul>
            <Link
              to="/services"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Learn about School Services <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Colleges */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card hover-lift transition-all duration-300 relative ring-2 ring-brand-500/20">
            <div className="absolute -top-3 right-6 sm:right-8 bg-brand-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm">
              Popular
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 sm:mb-6">
              <Building className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Colleges & Institutes</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 sm:mb-6">
              Departmental quizzes, technical Olympiads, and competitive aptitude assessments for
              undergraduates preparing for professional and technical careers.
            </p>
            <ul className="space-y-2 text-xs text-slate-700 font-medium mb-5 sm:mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Engineering & Computer Science tracks
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Automated negative marking & passing criteria
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Detailed percentile ranking reports
              </li>
            </ul>
            <Link
              to="/services"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Learn about College Services <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Universities */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card hover-lift transition-all duration-300">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 sm:mb-6">
              <Landmark className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Universities & Research</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 sm:mb-6">
              Inter-university research hackathons, symposiums, innovation tournaments, and
              multi-disciplinary scholarly award programs.
            </p>
            <ul className="space-y-2 text-xs text-slate-700 font-medium mb-5 sm:mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Hybrid online & on-campus hackathons
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Team-based registrations & submissions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Institutional sponsorship & grant awards
              </li>
            </ul>
            <Link
              to="/services"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Learn about University Services <ChevronRight className="w-4 h-4" />
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
        className="bg-slate-900 text-white py-14 sm:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider text-brand-400 uppercase">
                Scholastic Challenges
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Available Quizzes & Tests</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl">
                Test your knowledge in real-time. Secure timer engines with automated result
                tabulation and instant merit recognition.
              </p>
            </div>
            <Link
              to="/quiz-awards"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-400 hover:text-brand-300 transition-colors"
            >
              View Full Directory <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-slate-800/80 rounded-2xl p-5 sm:p-6 border border-slate-700/80 flex flex-col justify-between hover:border-brand-500/50 hover-lift transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-900/60 text-brand-300 border border-brand-700/50">
                      {quiz.level?.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {quiz.durationMinutes} mins
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">{quiz.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {quiz.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">
                    {quiz.isFree ? 'FREE ACCESS' : `₹${quiz.price}`}
                  </span>
                  <Link
                    to="/quiz-awards"
                    className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-brand-300 transition-colors"
                  >
                    Enter Room <ArrowRight className="w-3.5 h-3.5" />
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
        className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8"
      >
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 p-6 sm:p-10 lg:p-12 text-white shadow-xl hover-lift transition-all">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-bold text-amber-300">
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
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 backdrop-blur-md text-emerald-200 max-w-xl mx-auto text-center space-y-2 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-center gap-2 font-bold text-white text-sm sm:text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Success! Your 30% OFF Code is Ready</span>
                </div>
                <p className="text-xs text-slate-200">
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
                    className="btn-shine inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all hover:scale-102 active:scale-95 disabled:opacity-60 shrink-0 cursor-pointer"
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
        <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-amber-50 border border-amber-200/90 text-amber-800 text-[11px] sm:text-xs font-bold shadow-2xs">
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
        className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8"
      >
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 text-white relative overflow-hidden shadow-xl hover-lift transition-all">
          <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-700/60 border border-brand-500/30 text-[11px] sm:text-xs font-bold text-brand-200">
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
                Verify a Certificate Now
              </Link>
              <Link
                to="/quiz-awards"
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-brand-700/60 hover:bg-brand-700 text-white border border-brand-500/40 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center hover:scale-105 active:scale-95"
              >
                View Award Categories
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
        className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8"
      >
        <div className="bg-slate-100/90 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 text-center max-w-4xl mx-auto space-y-4 sm:space-y-6 hover-lift transition-all">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ready to Connect Your Institution?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Join secondary schools, engineering colleges, and universities already organizing
            inter-institutional challenges and evaluating academic progress on Implex Edu.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
            <Link
              to="/contact"
              className="btn-shine w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95"
            >
              Contact Educational Liaison
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              Institutional Signup
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
