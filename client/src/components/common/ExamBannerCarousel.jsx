import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Award,
  CheckCircle2,
  Tag,
  Landmark,
  ShieldCheck,
  Code,
  School,
  Building,
  Target,
  Clock,
  Compass,
  FileText,
  Zap,
  Users,
  Calendar,
} from 'lucide-react';

const bannerSlides = [
  {
    id: 'upsc',
    category: 'UPSC',
    title: 'UPSC Civil Services Examination (IAS / IPS / IFS)',
    subtitle: 'Comprehensive GS Prelims + Mains, CSAT & National Mock League',
    description:
      'Rigorous multi-stage curriculum curated by civil service mentors. Master Indian Polity, History, Economy, and Current Affairs with daily answer writing drills.',
    badge: 'National Civil Services Wing',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
    gradient: 'from-slate-950 via-indigo-950 to-slate-900',
    accentColor: 'text-amber-400',
    glowColor: 'rgba(99, 102, 241, 0.25)',
    icon: Landmark,
    target: 'Graduates & Final-Year College Scholars',
    duration: '12-Month Foundation Track • 600+ Hours',
    curriculum: 'GS (Prelims + Mains) • CSAT • Daily Current Affairs',
    testSeries: 'Weekly Mains Evaluation + 40 All-India CBT Mocks',
    originalFee: '₹14,999',
    discountedFee: '₹10,499',
    offerTag: 'Special 30% OFF • Code: IMPLEX30',
    ctaLink: '/services?category=competitive&search=upsc',
  },
  {
    id: 'ssc',
    category: 'SSC',
    title: 'SSC CGL, CHSL, MTS & CPO Comprehensive Masterclass',
    subtitle: 'Tier-1 & Tier-2 Quantitative Aptitude, Reasoning, English & General Awareness',
    description:
      'Targeted preparation for Staff Selection Commission appointments. Focus on fast arithmetic shortcuts, high-frequency reasoning questions, and full computerized mock tests.',
    badge: 'Central Govt Career Wing',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
    gradient: 'from-slate-950 via-sky-950 to-slate-900',
    accentColor: 'text-sky-300',
    glowColor: 'rgba(14, 165, 233, 0.25)',
    icon: Target,
    target: '10th / 12th Pass & Graduates',
    duration: '6-Month Target Intensive • 400+ Hours',
    curriculum: 'Quantitative Aptitude, Logical Reasoning, English & Static GK',
    testSeries: '60 Full-Length CBT Speed Tests + Negative Marking Analytics',
    originalFee: '₹6,999',
    discountedFee: '₹4,899',
    offerTag: 'Flat 30% OFF • Code: IMPLEX30',
    ctaLink: '/services?category=competitive&search=ssc',
  },
  {
    id: 'school',
    category: 'School',
    title: 'School Education Foundation (Classes 5th to 10th)',
    subtitle: 'Concept-First Mathematics, Science, English & Olympiad Problem Solving',
    description:
      'Build lifelong intellectual curiosity and conceptual mastery. Structured 6-day academic timetable with 45-minute focused classes, homework sheets, and weekly Olympiad diagnostic tests.',
    badge: 'K-10 Academic Foundations',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    gradient: 'from-slate-950 via-emerald-950 to-slate-900',
    accentColor: 'text-emerald-300',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    icon: School,
    target: 'Class 5th to 10th (CBSE / ICSE / State Boards)',
    duration: 'Annual Academic Batch • 6 Days / Week',
    curriculum: '100% NCERT Complete Curricula, Science Practical Concepts & Mental Math',
    testSeries: 'Weekly Chapter Diagnostics + Tamper-Proof Verified Certificates',
    originalFee: '₹1,500',
    discountedFee: '₹1,000 / mo',
    offerTag: 'Academic Session 30% OFF',
    ctaLink: '/services?category=base',
  },
  {
    id: 'college',
    category: 'College',
    title: 'College & University Degree Nourishment',
    subtitle: 'Undergraduate Sciences, Commerce, Arts & Campus Placement Aptitude',
    description:
      'Bridge university coursework with competitive aptitude. Advanced theoretical foundations, previous years university solutions, and industry-oriented analytical aptitude modules.',
    badge: 'Undergraduate Excellence Hub',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    gradient: 'from-slate-950 via-cyan-950 to-slate-900',
    accentColor: 'text-cyan-300',
    glowColor: 'rgba(6, 182, 212, 0.25)',
    icon: GraduationCap,
    target: 'B.Sc / B.Com / B.A Degree Scholars (All Semesters)',
    duration: 'Semester-Wise Comprehensive Track • 250+ Hours',
    curriculum: 'Higher Physics, Chemistry, Math, Financial Accounting & Humanities',
    testSeries: 'University Exam Mock Papers + Placement Aptitude Tests',
    originalFee: '₹4,999',
    discountedFee: '₹3,499',
    offerTag: 'Student Special 30% OFF',
    ctaLink: '/services?category=professional',
  },
  {
    id: 'competition',
    category: 'Competition',
    title: 'Edu-Competition & State PCS (BPSC / State Public Service)',
    subtitle: 'State Civil Services, Teacher Eligibility (TET) & Central Govt Vacancies',
    description:
      'Dedicated preparation for state administrative examinations. Deep dive into state history, geography, economy, budget, objective question banks, and mains answer formulation.',
    badge: 'State Administration & Govt Jobs',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    gradient: 'from-slate-950 via-amber-950 to-slate-900',
    accentColor: 'text-amber-300',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    icon: Award,
    target: 'Graduates, Teachers & Competitive Candidates',
    duration: '8-Month Comprehensive Batch • 500+ Hours',
    curriculum: 'State Special GK, Indian Polity, General Science & Mental Aptitude',
    testSeries: 'State Blueprint Mocks + Previous 15 Years Solved Question Papers',
    originalFee: '₹8,999',
    discountedFee: '₹6,299',
    offerTag: 'Flat 30% OFF with IMPLEX30',
    ctaLink: '/services?category=competitive',
  },
  {
    id: 'iit',
    category: 'IIT',
    title: 'IIT-JEE (Main & Advanced Integrated)',
    subtitle: 'Premier Engineering Entrance Coaching & Multi-Concept Problem Solving',
    description:
      'Master high-level mechanics, electrodynamics, calculus, and physical chemistry. Solve multi-concept problems with timed NTA-pattern computerized mock testing.',
    badge: 'Elite Engineering Wing',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
    gradient: 'from-slate-950 via-blue-950 to-slate-900',
    accentColor: 'text-amber-400',
    glowColor: 'rgba(59, 130, 246, 0.25)',
    icon: Sparkles,
    target: 'Class 11th, 12th & Dropper PCM Aspirants',
    duration: '2-Year Integrated / 1-Year Fastrack • 750+ Hours',
    curriculum: 'Physics, Chemistry & Mathematics (Deep Problem Solving Sets)',
    testSeries: 'NTA Computerized CBT Mocks + Percentile & Rank Predictor',
    originalFee: '₹18,000',
    discountedFee: '₹12,600',
    offerTag: 'Admissions Open • 30% OFF',
    ctaLink: '/services?category=integrated&search=iit',
  },
  {
    id: 'neet',
    category: 'NEET',
    title: 'NEET-UG Medical Entrance Preparation',
    subtitle: '100% NCERT Line-by-Line Biology, High-Yield Chemistry & Physics Shortcuts',
    description:
      'Every line of NCERT Biology mastered. High-yield diagrams, assertion-reason drills, and full 720-mark mock examinations to secure top government medical college seats.',
    badge: 'National Medical Wing',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    gradient: 'from-slate-950 via-rose-950 to-slate-900',
    accentColor: 'text-rose-300',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    icon: ShieldCheck,
    target: 'Class 11th, 12th & Dropper PCB Aspirants',
    duration: '1-Year Target & 2-Year Integrated • 800+ Hours',
    curriculum: 'Botany, Zoology, Organic/Inorganic Chemistry & Numerical Physics',
    testSeries: '720-Mark Simulation Exams + Daily Assertion-Reason Quizzes',
    originalFee: '₹18,000',
    discountedFee: '₹12,600',
    offerTag: 'Flat 30% OFF • Code: IMPLEX30',
    ctaLink: '/services?category=integrated&search=neet',
  },
  {
    id: 'banking',
    category: 'Banking',
    title: 'Banking Sector Examinations (IBPS PO/Clerk, SBI & RBI)',
    subtitle: 'Vedic Math Speed Drills, High-Level Reasoning & Financial Awareness',
    description:
      'Crack Bank PO, Clerk, and Specialist Officer examinations. Learn speed calculation tricks, complex seating arrangements, financial awareness, and computerized tests.',
    badge: 'Banking & Finance Wing',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40',
    gradient: 'from-slate-950 via-yellow-950 to-slate-900',
    accentColor: 'text-yellow-300',
    glowColor: 'rgba(234, 179, 8, 0.25)',
    icon: Landmark,
    target: 'Graduates in Any Discipline',
    duration: '4-Month Speed Bootcamp • 300+ Hours',
    curriculum: 'Vedic Math, Seating Arrangements, Data Interpretation & Banking GK',
    testSeries: 'Sectional Speed Tests with Millisecond Timers + Mock Interviews',
    originalFee: '₹5,999',
    discountedFee: '₹4,199',
    offerTag: 'Flat 30% OFF • Code: IMPLEX30',
    ctaLink: '/services?category=competitive&search=banking',
  },
  {
    id: 'boards',
    category: 'State Boards',
    title: 'State Boards (Bihar Board BSEB & MP Board MPBSE)',
    subtitle: '10th Matric & 12th Inter Blueprint Modules (Hindi & English Medium)',
    description:
      'Aligned with state board syllabi and NCERT patterns. Thorough chapter-wise objective question banks, 50-mark model papers, and board exam simulation.',
    badge: 'State Board Topper Track',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
    gradient: 'from-slate-950 via-purple-950 to-slate-900',
    accentColor: 'text-purple-300',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    icon: BookOpen,
    target: 'Class 10th & 12th Board Candidates (Hindi & English)',
    duration: 'Full Academic Session • Dedicated Faculty',
    curriculum: '100% Board Blueprint, Objective Question Bank & Subjective Solutions',
    testSeries: 'Model Question Papers + Board Simulation Tests',
    originalFee: '₹2,000',
    discountedFee: '₹1,400 / course',
    offerTag: 'Save 30% with IMPLEX30',
    ctaLink: '/services?category=special_intermediate',
  },
  {
    id: 'tech',
    category: 'Tech & Skills',
    title: 'Technology, Software Development & AI Skills',
    subtitle: 'Full-Stack Web Development, Python Programming & Verified Credentials',
    description:
      'Equip yourself with practical market skills. Build real-world web apps, master data structures, learn database architecture, and earn industry-verifiable certifications.',
    badge: 'Technology & Skills Hub',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-400/40',
    gradient: 'from-slate-950 via-violet-950 to-slate-900',
    accentColor: 'text-fuchsia-300',
    glowColor: 'rgba(139, 92, 246, 0.25)',
    icon: Code,
    target: 'Students, College Scholars & Career Starters',
    duration: '6-Month Career Acceleration Track • 200+ Lab Hours',
    curriculum: 'JavaScript, React, Node.js, Python, Databases & AI Tool Integration',
    testSeries: 'Capstone Portfolio Projects + Cryptographically Verified Certificates',
    originalFee: '₹9,999',
    discountedFee: '₹6,999',
    offerTag: 'Career Accelerator 30% OFF',
    ctaLink: '/services?category=tech_skills',
  },
];

export default function ExamBannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const slideCount = bannerSlides.length;
  const SLIDE_DURATION = 5500; // 5.5s per slide

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, slideCount, currentIndex]);

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slideCount);
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const currentSlide = bannerSlides[currentIndex];
  const SlideIcon = currentSlide.icon;

  const handleCardClick = () => {
    navigate(currentSlide.ctaLink);
  };

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.28,
        ease: 'easeInOut',
      },
    }),
  };

  return (
    <section
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none"
      aria-label="Competitive Exam Programs Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Category Pills Navigation (Scrollable with modern pills) */}
      <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {bannerSlides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={slide.id}
              onClick={() => goToSlide(idx)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md shadow-brand-500/25 scale-102 ring-2 ring-brand-500/50'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/90'
              }`}
            >
              <span>{slide.category}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-ping inline-block" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Animated Carousel Card (Whole Card is Clickable to Redirect) */}
      <div
        onClick={handleCardClick}
        className="group relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 min-h-[460px] sm:min-h-[420px] lg:min-h-[380px] flex items-center cursor-pointer transition-all duration-300 hover:shadow-brand-500/20 hover:border-brand-500/60"
        title={`Click to view full course syllabus for ${currentSlide.title}`}
      >
        {/* Animated Slide Duration Progress Bar (Autoplay Indicator) */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-30">
          <motion.div
            key={currentIndex}
            initial={{ width: '0%' }}
            animate={{ width: isPaused ? '100%' : '100%' }}
            transition={{
              duration: isPaused ? 0 : SLIDE_DURATION / 1000,
              ease: 'linear',
            }}
            className="h-full bg-gradient-to-r from-brand-400 via-amber-300 to-emerald-400 shadow-sm"
          />
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className={`w-full h-full bg-gradient-to-br ${currentSlide.gradient} text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden`}
          >
            {/* Ambient Background Decorative Glow Orbs */}
            <div
              className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-40"
              style={{ backgroundColor: currentSlide.glowColor }}
            />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-brand-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left Slide Info & Basic Details */}
              <div className="space-y-4 max-w-2xl">
                {/* Header Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border backdrop-blur-md ${currentSlide.badgeColor}`}
                  >
                    <SlideIcon className="w-3.5 h-3.5" />
                    <span>{currentSlide.badge}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-extrabold text-[11px] tracking-wide animate-pulse">
                    <Tag className="w-3 h-3" />
                    <span>{currentSlide.offerTag}</span>
                  </span>

                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-[11px] font-semibold">
                    <Calendar className="w-3 h-3 text-brand-300" />
                    <span>Session 2026-27</span>
                  </span>
                </div>

                {/* Main Heading */}
                <div>
                  <motion.h3
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.35 }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight group-hover:text-amber-100 transition-colors"
                  >
                    {currentSlide.title}
                  </motion.h3>
                  <p className={`text-xs sm:text-sm font-semibold mt-1 ${currentSlide.accentColor}`}>
                    {currentSlide.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal line-clamp-2">
                  {currentSlide.description}
                </p>

                {/* BASIC DETAILS GRID (Requested by user) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="flex items-start gap-2 p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
                    <Target className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Target / Eligibility
                      </span>
                      <span className="font-semibold text-slate-100 leading-snug">
                        {currentSlide.target}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
                    <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Batch Duration & Hours
                      </span>
                      <span className="font-semibold text-slate-100 leading-snug">
                        {currentSlide.duration}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
                    <BookOpen className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Core Syllabus Covered
                      </span>
                      <span className="font-semibold text-slate-100 leading-snug">
                        {currentSlide.curriculum}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
                    <Award className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Diagnostics & Honors
                      </span>
                      <span className="font-semibold text-slate-100 leading-snug">
                        {currentSlide.testSeries}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Slide CTA Showcase Box */}
              <div className="shrink-0 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 text-center min-w-[230px] shadow-2xl relative group-hover:scale-102 transition-transform">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-2 shadow-inner">
                  <SlideIcon className="w-6 h-6 text-amber-300" />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200">
                  Flat Discount Fee
                </span>
                
                <div className="flex items-baseline justify-center gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {currentSlide.discountedFee}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    {currentSlide.originalFee}
                  </span>
                </div>

                <div className="mt-1 px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-[10px] font-mono font-bold text-emerald-300">
                  Code: IMPLEX30
                </div>

                <div className="btn-shine mt-4 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs shadow-lg transition-all group-hover:scale-105 active:scale-95">
                  <span>Explore Course Page</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>

                <span className="text-[10px] text-slate-400 mt-2 block">
                  Click banner to view syllabus
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Prev & Next Controls (stopPropagation so they don't navigate) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous examination category"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white/90 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next examination category"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white/90 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Pagination Dot Indicators & Pause Notice */}
      <div className="mt-3.5 flex items-center justify-between px-1">
        <div className="text-[11px] font-medium text-slate-500 hidden sm:flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Auto-rotating catalog • Hover anywhere to pause</span>
        </div>

        <div className="flex items-center justify-center gap-1.5 mx-auto sm:mx-0">
          {bannerSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-8 bg-brand-600 shadow-sm'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        <div className="text-[11px] font-semibold text-slate-500 hidden sm:block">
          <span className="font-mono text-slate-800 font-bold">{currentIndex + 1}</span> of {slideCount} Batches
        </div>
      </div>
    </section>
  );
}
