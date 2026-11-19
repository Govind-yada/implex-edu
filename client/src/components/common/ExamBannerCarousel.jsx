import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Award,
  Tag,
  Landmark,
  ShieldCheck,
  Code,
  School,
  Target,
  Clock,
  Zap,
  Calendar,
} from 'lucide-react';

const bannerSlides = [
  {
    id: 'upsc',
    category: 'UPSC',
    title: 'UPSC Civil Services Examination (IAS / IPS / IFS)',
    subtitle: 'Comprehensive GS Prelims + Mains, CSAT & National Mock League',
    description:
      'Rigorous multi-stage curriculum curated by civil service mentors with daily answer writing drills and structured test series.',
    badge: 'National Civil Services Wing',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
    gradient: 'from-slate-950 via-indigo-950 to-slate-900',
    accentColor: 'text-amber-400',
    glowColor: 'rgba(99, 102, 241, 0.25)',
    icon: Landmark,
    target: 'Graduates & Final-Year College',
    duration: '12-Month Foundation • 600+ Hrs',
    curriculum: 'GS (Pre+Mains) • CSAT • Daily Current Affairs',
    testSeries: 'Weekly Mains + 40 All-India Mocks',
    originalFee: '₹14,999',
    discountedFee: '₹10,499',
    offerTag: 'Flat 30% OFF • Code: IMPLEX30',
    ctaLink: '/services?category=competitive&search=upsc',
  },
  {
    id: 'ssc',
    category: 'SSC',
    title: 'SSC CGL, CHSL, MTS & CPO Comprehensive Masterclass',
    subtitle: 'Tier-1 & Tier-2 Quantitative Aptitude, Reasoning, English & General Awareness',
    description:
      'Fast arithmetic shortcuts, high-frequency reasoning questions, and full computerized speed tests for central appointments.',
    badge: 'Central Govt Career Wing',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
    gradient: 'from-slate-950 via-sky-950 to-slate-900',
    accentColor: 'text-sky-300',
    glowColor: 'rgba(14, 165, 233, 0.25)',
    icon: Target,
    target: '10th / 12th Pass & Graduates',
    duration: '6-Month Target • 400+ Hours',
    curriculum: 'Quant Aptitude, Reasoning, English & GK',
    testSeries: '60 CBT Tests + Speed Analytics',
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
      'Structured 6-day academic timetable with 45-minute focused classes, homework sheets, and regular diagnostic testing.',
    badge: 'K-10 Academic Foundations',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    gradient: 'from-slate-950 via-emerald-950 to-slate-900',
    accentColor: 'text-emerald-300',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    icon: School,
    target: 'Classes 5th–10th (CBSE/ICSE/State)',
    duration: 'Annual Academic Batch • 6 Days/Wk',
    curriculum: 'NCERT Complete Curricula & Mental Math',
    testSeries: 'Weekly Diagnostics + Verified Certs',
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
      'Advanced theoretical foundations, previous years university solutions, and industry-oriented analytical aptitude modules.',
    badge: 'Undergraduate Excellence Hub',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    gradient: 'from-slate-950 via-cyan-950 to-slate-900',
    accentColor: 'text-cyan-300',
    glowColor: 'rgba(6, 182, 212, 0.25)',
    icon: GraduationCap,
    target: 'B.Sc / B.Com / B.A Degree Scholars',
    duration: 'Semester-Wise Track • 250+ Hours',
    curriculum: 'Higher Sciences, Accounting & Aptitude',
    testSeries: 'University Mocks + Placement Prep',
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
      'Comprehensive coverage of state history, economy, budget, objective question banks, and mains answer formulation.',
    badge: 'State Administration & Govt Jobs',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    gradient: 'from-slate-950 via-amber-950 to-slate-900',
    accentColor: 'text-amber-300',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    icon: Award,
    target: 'Graduates, Teachers & Candidates',
    duration: '8-Month Comprehensive • 500+ Hrs',
    curriculum: 'State Special GK, Polity, Science & Mental',
    testSeries: 'State Blueprint Mocks + 15 Yrs PYQ',
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
      'Master high-level mechanics, calculus, and physical chemistry with timed NTA-pattern computerized mock testing.',
    badge: 'Elite Engineering Wing',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
    gradient: 'from-slate-950 via-blue-950 to-slate-900',
    accentColor: 'text-amber-400',
    glowColor: 'rgba(59, 130, 246, 0.25)',
    icon: Sparkles,
    target: 'Class 11th, 12th & Dropper PCM',
    duration: '2-Yr Integrated / 1-Yr Fastrack • 750+ Hrs',
    curriculum: 'Physics, Chemistry & Math Problem Sets',
    testSeries: 'NTA CBT Mocks + Rank Predictor',
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
      'Every line of NCERT Biology mastered with high-yield diagrams and full 720-mark simulation examinations.',
    badge: 'National Medical Wing',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    gradient: 'from-slate-950 via-rose-950 to-slate-900',
    accentColor: 'text-rose-300',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    icon: ShieldCheck,
    target: 'Class 11th, 12th & Dropper PCB',
    duration: '1-Yr Target & 2-Yr Integrated • 800+ Hrs',
    curriculum: 'Botany, Zoology, Chemistry & Physics',
    testSeries: '720-Mark Simulation Exams + Daily Drills',
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
      'Speed calculation tricks, complex seating arrangements, financial awareness, and computerized sectional tests.',
    badge: 'Banking & Finance Wing',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40',
    gradient: 'from-slate-950 via-yellow-950 to-slate-900',
    accentColor: 'text-yellow-300',
    glowColor: 'rgba(234, 179, 8, 0.25)',
    icon: Landmark,
    target: 'Graduates in Any Discipline',
    duration: '4-Month Speed Bootcamp • 300+ Hours',
    curriculum: 'Vedic Math, Reasoning, DI & Banking GK',
    testSeries: 'Sectional Speed Tests + Mock Interviews',
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
      'Chapter-wise objective question banks, 50-mark model papers, and board exam simulation.',
    badge: 'State Board Topper Track',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
    gradient: 'from-slate-950 via-purple-950 to-slate-900',
    accentColor: 'text-purple-300',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    icon: BookOpen,
    target: 'Class 10th & 12th Board Candidates',
    duration: 'Full Academic Session • Faculty Experts',
    curriculum: 'Board Blueprint & Objective Question Bank',
    testSeries: 'Model Papers + Board Simulation Tests',
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
      'Build real-world web apps, master data structures, learn database architecture, and earn verified certificates.',
    badge: 'Technology & Skills Hub',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-400/40',
    gradient: 'from-slate-950 via-violet-950 to-slate-900',
    accentColor: 'text-fuchsia-300',
    glowColor: 'rgba(139, 92, 246, 0.25)',
    icon: Code,
    target: 'Students & Career Starters',
    duration: '6-Month Career Track • 200+ Lab Hours',
    curriculum: 'Web Dev, Python, Databases & AI Tooling',
    testSeries: 'Capstone Projects + Verified Credentials',
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
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28 },
        opacity: { duration: 0.3 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      transition: {
        duration: 0.22,
        ease: 'easeInOut',
      },
    }),
  };

  return (
    <section
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 select-none"
      aria-label="Competitive Exam Programs Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Category Pills Navigation (Compact, sleek, horizontal scroll) */}
      <div className="mb-3 flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
        {bannerSlides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={slide.id}
              onClick={() => goToSlide(idx)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
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

      {/* Main Animated Carousel Card (Compact height, clean margins, NO text overlap with arrows) */}
      <div
        onClick={handleCardClick}
        className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-700/80 cursor-pointer transition-all duration-300 hover:shadow-brand-500/20 hover:border-brand-500/60"
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
            className={`w-full bg-gradient-to-br ${currentSlide.gradient} text-white px-12 sm:px-14 lg:px-16 py-5 sm:py-6 relative overflow-hidden`}
          >
            {/* Ambient Background Decorative Glow Orbs */}
            <div
              className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-40"
              style={{ backgroundColor: currentSlide.glowColor }}
            />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-brand-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              {/* Left Slide Info & Basic Details */}
              <div className="space-y-2.5 max-w-2xl min-w-0">
                {/* Header Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-md ${currentSlide.badgeColor}`}
                  >
                    <SlideIcon className="w-3 h-3" />
                    <span>{currentSlide.badge}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-extrabold text-[10px] tracking-wide animate-pulse">
                    <Tag className="w-3 h-3" />
                    <span>{currentSlide.offerTag}</span>
                  </span>

                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px] font-medium">
                    <Calendar className="w-3 h-3 text-brand-300" />
                    <span>Session 2026–27</span>
                  </span>
                </div>

                {/* Main Heading & Subtitle */}
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white tracking-tight leading-snug group-hover:text-amber-100 transition-colors">
                    {currentSlide.title}
                  </h3>
                  <p className={`text-xs sm:text-sm font-semibold mt-0.5 ${currentSlide.accentColor}`}>
                    {currentSlide.subtitle}
                  </p>
                </div>

                {/* Compact Description */}
                <p className="text-xs text-slate-300 leading-relaxed font-normal line-clamp-2">
                  {currentSlide.description}
                </p>

                {/* Compact Basic Details Grid (4 Sleek Chips) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
                    <Target className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <div className="min-w-0 truncate">
                      <span className="text-[9px] uppercase font-bold text-slate-400 mr-1.5">Target:</span>
                      <span className="font-semibold text-slate-100">{currentSlide.target}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
                    <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <div className="min-w-0 truncate">
                      <span className="text-[9px] uppercase font-bold text-slate-400 mr-1.5">Duration:</span>
                      <span className="font-semibold text-slate-100">{currentSlide.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
                    <BookOpen className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <div className="min-w-0 truncate">
                      <span className="text-[9px] uppercase font-bold text-slate-400 mr-1.5">Syllabus:</span>
                      <span className="font-semibold text-slate-100">{currentSlide.curriculum}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
                    <Award className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                    <div className="min-w-0 truncate">
                      <span className="text-[9px] uppercase font-bold text-slate-400 mr-1.5">Diagnostics:</span>
                      <span className="font-semibold text-slate-100">{currentSlide.testSeries}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Slide Compact CTA Showcase Box */}
              <div className="shrink-0 flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 text-center min-w-[200px] sm:min-w-[220px] shadow-lg group-hover:scale-102 transition-transform self-center lg:self-auto">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-1.5 shadow-inner">
                  <SlideIcon className="w-5 h-5 text-amber-300" />
                </div>

                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-200">
                  Flat Discount Fee
                </span>

                <div className="flex items-baseline justify-center gap-2 mt-0.5">
                  <span className="text-2xl font-black text-white">
                    {currentSlide.discountedFee}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    {currentSlide.originalFee}
                  </span>
                </div>

                <div className="mt-1 px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-[10px] font-mono font-bold text-emerald-300">
                  Code: IMPLEX30
                </div>

                <div className="btn-shine mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs shadow-md transition-all group-hover:scale-105 active:scale-95">
                  <span>Explore Course Page</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>

                <span className="text-[9px] text-slate-400 mt-1.5 block">
                  Click banner to view syllabus
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Prev & Next Controls (Positioned left & right with zero content collision) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous examination category"
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white/90 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next examination category"
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white/90 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Pagination Dot Indicators & Status */}
      <div className="mt-2.5 flex items-center justify-between px-1">
        <div className="text-[10px] font-medium text-slate-500 hidden sm:flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-500" />
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
                  ? 'w-7 bg-brand-600 shadow-sm'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        <div className="text-[10px] font-semibold text-slate-500 hidden sm:block">
          <span className="font-mono text-slate-800 font-bold">{currentIndex + 1}</span> of {slideCount} Batches
        </div>
      </div>
    </section>
  );
}
