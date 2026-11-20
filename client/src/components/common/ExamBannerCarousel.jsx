import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
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
  Sparkles,
} from 'lucide-react';

const bannerSlides = [
  {
    id: 'upsc',
    category: 'UPSC',
    image: '/images/banners/upsc.jpg',
    title: 'UPSC Civil Services (IAS / IPS / IFS)',
    subtitle: 'Comprehensive GS Prelims + Mains, CSAT & Mock League',
    description:
      'Rigorous multi-stage curriculum curated by civil service mentors with daily answer writing drills.',
    badge: 'National Civil Services',
    badgeColor: 'bg-indigo-500/25 text-indigo-200 border-indigo-400/40',
    gradient: 'from-slate-950 via-[#0d1435] to-[#12102e]',
    accentColor: 'text-amber-300',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    icon: Landmark,
    target: 'Graduates & Final-Year',
    duration: '12-Mo Track • 600+ Hrs',
    curriculum: 'GS (Pre+Mains) • CSAT',
    testSeries: 'Weekly Mains + 40 CBT Mocks',
    originalFee: '₹14,999',
    discountedFee: '₹10,499',
    offerTag: 'Flat 30% OFF • IMPLEX30',
    ctaLink: '/services?category=competitive&search=upsc',
  },
  {
    id: 'ssc',
    category: 'SSC',
    image: '/images/banners/ssc.jpg',
    title: 'SSC CGL, CHSL, MTS & CPO Masterclass',
    subtitle: 'Tier-1 & Tier-2 Quant, Reasoning, English & General Awareness',
    description:
      'Fast arithmetic shortcuts, high-frequency reasoning questions, and full computerized speed tests.',
    badge: 'Central Govt Careers',
    badgeColor: 'bg-sky-500/25 text-sky-200 border-sky-400/40',
    gradient: 'from-slate-950 via-[#081e36] to-[#0a2540]',
    accentColor: 'text-sky-300',
    glowColor: 'rgba(14, 165, 233, 0.4)',
    icon: Target,
    target: '10th / 12th & Graduates',
    duration: '6-Mo Target • 400+ Hrs',
    curriculum: 'Quant, Reasoning, English, GK',
    testSeries: '60 Speed Tests + Analytics',
    originalFee: '₹6,999',
    discountedFee: '₹4,899',
    offerTag: 'Flat 30% OFF • IMPLEX30',
    ctaLink: '/services?category=competitive&search=ssc',
  },
  {
    id: 'school',
    category: 'School',
    image: '/images/banners/school.jpg',
    title: 'School Education Foundation (5th–10th)',
    subtitle: 'Concept-First Mathematics, Science & Olympiad Problem Solving',
    description:
      'Structured 6-day academic timetable with 45-minute focused classes and weekly Olympiad diagnostics.',
    badge: 'K-10 Academic Foundations',
    badgeColor: 'bg-emerald-500/25 text-emerald-200 border-emerald-400/40',
    gradient: 'from-slate-950 via-[#082619] to-[#0a2e1e]',
    accentColor: 'text-emerald-300',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    icon: School,
    target: 'Class 5th to 10th (CBSE/ICSE)',
    duration: 'Annual Batch • 6 Days/Wk',
    curriculum: 'NCERT Core & Mental Math',
    testSeries: 'Weekly Tests + Verified Certs',
    originalFee: '₹1,500',
    discountedFee: '₹1,000 / mo',
    offerTag: 'Academic 30% OFF',
    ctaLink: '/services?category=base',
  },
  {
    id: 'college',
    category: 'College',
    image: '/images/banners/college.jpg',
    title: 'College & University Degree Nourishment',
    subtitle: 'Undergraduate Sciences, Commerce, Arts & Placement Aptitude',
    description:
      'Advanced theoretical foundations, previous years university solutions, and career aptitude modules.',
    badge: 'Undergraduate Excellence',
    badgeColor: 'bg-cyan-500/25 text-cyan-200 border-cyan-400/40',
    gradient: 'from-slate-950 via-[#0a232b] to-[#0e2c36]',
    accentColor: 'text-cyan-300',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    icon: GraduationCap,
    target: 'B.Sc / B.Com / B.A Scholars',
    duration: 'Semester Track • 250+ Hrs',
    curriculum: 'Higher Sciences & Accounting',
    testSeries: 'University Mocks + Aptitude',
    originalFee: '₹4,999',
    discountedFee: '₹3,499',
    offerTag: 'Student 30% OFF',
    ctaLink: '/services?category=professional',
  },
  {
    id: 'competition',
    category: 'Competition',
    image: '/images/banners/competition.jpg',
    title: 'Edu-Competition & State PCS (BPSC)',
    subtitle: 'State Civil Services, Teacher Eligibility & Central Vacancies',
    description:
      'Comprehensive coverage of state history, economy, budget, objective question banks, and mains writing.',
    badge: 'State Administration Wing',
    badgeColor: 'bg-amber-500/25 text-amber-200 border-amber-400/40',
    gradient: 'from-slate-950 via-[#26190a] to-[#2e1d0c]',
    accentColor: 'text-amber-300',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    icon: Award,
    target: 'Graduates & TET Candidates',
    duration: '8-Mo Batch • 500+ Hours',
    curriculum: 'State GK, Polity & Science',
    testSeries: 'State Mocks + 15 Yrs PYQ',
    originalFee: '₹8,999',
    discountedFee: '₹6,299',
    offerTag: 'Flat 30% OFF with IMPLEX30',
    ctaLink: '/services?category=competitive',
  },
  {
    id: 'iit',
    category: 'IIT',
    image: '/images/banners/iit.jpg',
    title: 'IIT-JEE (Main & Advanced Integrated)',
    subtitle: 'Premier Engineering Coaching & Multi-Concept Problem Solving',
    description:
      'Master mechanics, calculus, and physical chemistry with timed NTA-pattern computerized mock testing.',
    badge: 'Elite Engineering Track',
    badgeColor: 'bg-blue-500/25 text-blue-200 border-blue-400/40',
    gradient: 'from-slate-950 via-[#0a183d] to-[#0d1f4d]',
    accentColor: 'text-amber-400',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    icon: Sparkles,
    target: '11th, 12th & Dropper PCM',
    duration: '2-Yr / 1-Yr Fastrack • 750+ Hrs',
    curriculum: 'Physics, Chemistry & Math',
    testSeries: 'NTA CBT Mocks + Rank Predictor',
    originalFee: '₹18,000',
    discountedFee: '₹12,600',
    offerTag: 'Admissions Open • 30% OFF',
    ctaLink: '/services?category=integrated&search=iit',
  },
  {
    id: 'neet',
    category: 'NEET',
    image: '/images/banners/neet.jpg',
    title: 'NEET-UG Medical Entrance Preparation',
    subtitle: '100% NCERT Line-by-Line Biology, High-Yield Chemistry & Physics',
    description:
      'Every line of NCERT Biology mastered with high-yield diagrams and full 720-mark simulation examinations.',
    badge: 'National Medical Wing',
    badgeColor: 'bg-rose-500/25 text-rose-200 border-rose-400/40',
    gradient: 'from-slate-950 via-[#2d0c15] to-[#380e1a]',
    accentColor: 'text-rose-300',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    icon: ShieldCheck,
    target: '11th, 12th & Dropper PCB',
    duration: '1-Yr / 2-Yr Track • 800+ Hrs',
    curriculum: 'Botany, Zoology, Chem & Physics',
    testSeries: '720-Mark Simulation + Drills',
    originalFee: '₹18,000',
    discountedFee: '₹12,600',
    offerTag: 'Flat 30% OFF • IMPLEX30',
    ctaLink: '/services?category=integrated&search=neet',
  },
  {
    id: 'banking',
    category: 'Banking',
    image: '/images/banners/banking.jpg',
    title: 'Banking Sector (IBPS PO/Clerk, SBI & RBI)',
    subtitle: 'Vedic Math Speed Drills, Reasoning & Financial Awareness',
    description:
      'Speed calculation tricks, complex seating arrangements, financial awareness, and computerized tests.',
    badge: 'Banking & Finance Wing',
    badgeColor: 'bg-yellow-500/25 text-yellow-200 border-yellow-400/40',
    gradient: 'from-slate-950 via-[#281c08] to-[#33220a]',
    accentColor: 'text-yellow-300',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    icon: Landmark,
    target: 'Graduates in Any Discipline',
    duration: '4-Mo Speed Track • 300+ Hrs',
    curriculum: 'Vedic Math, DI & Banking GK',
    testSeries: 'Sectional Speed Tests + Mocks',
    originalFee: '₹5,999',
    discountedFee: '₹4,199',
    offerTag: 'Flat 30% OFF • IMPLEX30',
    ctaLink: '/services?category=competitive&search=banking',
  },
  {
    id: 'boards',
    category: 'State Boards',
    image: '/images/banners/boards.jpg',
    title: 'State Boards (Bihar BSEB & MP MPBSE)',
    subtitle: '10th Matric & 12th Inter Blueprint Modules (Hi/En Medium)',
    description:
      'Chapter-wise objective question banks, 50-mark model papers, and board exam simulation.',
    badge: 'State Board Topper Track',
    badgeColor: 'bg-purple-500/25 text-purple-200 border-purple-400/40',
    gradient: 'from-slate-950 via-[#240c36] to-[#2c0e42]',
    accentColor: 'text-purple-300',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    icon: BookOpen,
    target: '10th & 12th Board Candidates',
    duration: 'Full Academic Year Batch',
    curriculum: 'Board Blueprint & Objective Bank',
    testSeries: 'Model Papers + Board Tests',
    originalFee: '₹2,000',
    discountedFee: '₹1,400 / course',
    offerTag: 'Save 30% with IMPLEX30',
    ctaLink: '/services?category=special_intermediate',
  },
  {
    id: 'tech',
    category: 'Tech & Skills',
    image: '/images/banners/tech.jpg',
    title: 'Technology, Full-Stack & AI Skills',
    subtitle: 'Web Development, Python Programming & Verified Credentials',
    description:
      'Build real-world web apps, master data structures, learn database architecture, and earn verified credentials.',
    badge: 'Tech & Career Hub',
    badgeColor: 'bg-violet-500/25 text-violet-200 border-violet-400/40',
    gradient: 'from-slate-950 via-[#1e0d3b] to-[#27104d]',
    accentColor: 'text-fuchsia-300',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    icon: Code,
    target: 'Students & Career Starters',
    duration: '6-Mo Career Track • 200+ Hrs',
    curriculum: 'React, Node, Python & AI Tools',
    testSeries: 'Portfolio Projects + Verified Certs',
    originalFee: '₹9,999',
    discountedFee: '₹6,999',
    offerTag: 'Career Accelerator 30% OFF',
    ctaLink: '/services?category=tech_skills',
  },
];

export default function ExamBannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);
  const touchStartX = useRef(null);
  const pillRefs = useRef([]);
  const navigate = useNavigate();

  const slideCount = bannerSlides.length;
  const SLIDE_DURATION = 4500; // Continuous 4.5s auto-scroll cycle

  // 1. Continuous Auto-Scrolling Engine
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slideCount, currentIndex]);

  // 2. Auto-scroll category pills bar so the active pill stays centered
  useEffect(() => {
    if (pillRefs.current[currentIndex]) {
      pillRefs.current[currentIndex].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [currentIndex]);

  const resetAutoTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, SLIDE_DURATION);
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    resetAutoTimer();
  };

  const handleNext = (e) => {
    if (e) {
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
      if (typeof e.preventDefault === 'function') e.preventDefault();
    }
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slideCount);
    resetAutoTimer();
  };

  const handlePrev = (e) => {
    if (e) {
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
      if (typeof e.preventDefault === 'function') e.preventDefault();
    }
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
    resetAutoTimer();
  };

  // Touch Swipe Support for mobile devices
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const currentSlide = bannerSlides[currentIndex];
  const SlideIcon = currentSlide.icon;

  const handleCardClick = () => {
    navigate(currentSlide.ctaLink);
  };

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28 },
        opacity: { duration: 0.28 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    }),
  };

  return (
    <div
      className="relative w-full max-w-4xl mx-auto px-5 sm:px-6 md:px-8 select-none"
      aria-label="Competitive Exam Programs Carousel"
    >
      {/* Category Pills Navigation (Auto-scrolls with the active category) */}
      <div className="mb-2.5 flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-1 scrollbar-none px-1 scroll-smooth">
        {bannerSlides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={slide.id}
              ref={(el) => (pillRefs.current[idx] = el)}
              onClick={() => goToSlide(idx)}
              className={`px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md scale-102 ring-2 ring-brand-500/60'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/90 shadow-2xs'
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

      {/* Main Relative Container for Navigation Buttons + Card */}
      <div className="relative">
        {/* Left Move Arrow Button (Placed outside card with z-50 to ensure clean click without navigation bubble) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous examination category"
          className="absolute -left-3.5 sm:-left-4 md:-left-5 top-1/2 -translate-y-1/2 z-50 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-slate-900/90 hover:bg-slate-950 text-white shadow-xl border border-white/25 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer pointer-events-auto"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
        </button>

        {/* Right Move Arrow Button (Placed outside card with z-50 to ensure clean click without navigation bubble) */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next examination category"
          className="absolute -right-3.5 sm:-right-4 md:-right-5 top-1/2 -translate-y-1/2 z-50 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-slate-900/90 hover:bg-slate-950 text-white shadow-xl border border-white/25 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer pointer-events-auto"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
        </button>

        {/* Main Animated Carousel Card (Compact desktop image size + responsive mobile view) */}
        <div
          onClick={handleCardClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 cursor-pointer transition-all duration-300 hover:shadow-brand-500/25 hover:border-brand-500/60"
          title={`Click to view full course syllabus for ${currentSlide.title}`}
        >
          {/* Animated Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-30 overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: SLIDE_DURATION / 1000,
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
              className={`w-full bg-gradient-to-br ${currentSlide.gradient} text-white relative overflow-hidden`}
            >
              {/* Ambient Background Glow */}
              <div
                className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-40"
                style={{ backgroundColor: currentSlide.glowColor }}
              />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-brand-500/20 rounded-full blur-2xl pointer-events-none" />

              {/* Split Grid: Compact Image on Desktop + Formatted Details on Right */}
              <div className="relative z-10 flex flex-col md:flex-row items-stretch min-h-[300px] sm:min-h-[290px] md:min-h-[210px] lg:min-h-[200px]">
                {/* LEFT: Compact Desktop Image Size (Decreased width on desktop: 28% max ~240px, full height on mobile) */}
                <div className="w-full md:w-[28%] lg:w-[26%] md:max-w-[240px] relative overflow-hidden flex items-center justify-center shrink-0 min-h-[170px] sm:min-h-[200px] md:min-h-0 bg-slate-950">
                  <img
                    src={currentSlide.image}
                    alt={`${currentSlide.title} Educational Photo`}
                    className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Subtle Right Gradient Vignette on Desktop */}
                  <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-950/90 pointer-events-none" />
                  {/* Subtle Bottom Gradient Vignette on Mobile */}
                  <div className="block md:hidden absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />

                  {/* Mobile Top Overlaid Badges */}
                  <div className="md:hidden absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 z-10">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md shadow-sm ${currentSlide.badgeColor}`}
                    >
                      <SlideIcon className="w-3 h-3" />
                      <span>{currentSlide.badge}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] tracking-wide shadow-xs animate-pulse">
                      <Tag className="w-2.5 h-2.5" />
                      <span>30% OFF</span>
                    </span>
                  </div>

                  {/* Diagonal / Vertical Luminous Neon Light Beam */}
                  <div className="hidden md:block absolute -top-8 -bottom-8 right-0 w-[2px] bg-gradient-to-b from-transparent via-white/80 to-transparent shadow-[0_0_16px_rgba(255,255,255,0.7)] pointer-events-none z-20" />
                </div>

                {/* RIGHT: Course Title, Subtitle, Description & 4 Spec Badges */}
                <div className="w-full md:w-[72%] lg:w-[74%] p-3.5 sm:p-4 lg:p-4.5 flex flex-col justify-between relative z-10">
                  <div className="space-y-1.5">
                    {/* Desktop Header Badges */}
                    <div className="hidden md:flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${currentSlide.badgeColor}`}
                      >
                        <SlideIcon className="w-3 h-3" />
                        <span>{currentSlide.badge}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-extrabold text-[9px] tracking-wide animate-pulse">
                        <Tag className="w-2.5 h-2.5" />
                        <span>{currentSlide.offerTag}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-slate-300 text-[9px] font-medium">
                        <Calendar className="w-2.5 h-2.5 text-brand-300" />
                        <span>Session 2026–27</span>
                      </span>
                    </div>

                    {/* Main Course Title */}
                    <div>
                      <h3 className="text-sm sm:text-base lg:text-lg font-black text-white tracking-tight leading-snug group-hover:text-amber-100 transition-colors">
                        {currentSlide.title}
                      </h3>
                      <p className={`text-[11px] sm:text-xs font-bold mt-0.5 ${currentSlide.accentColor}`}>
                        {currentSlide.subtitle}
                      </p>
                    </div>

                    {/* Overview Description */}
                    <p className="text-[10px] sm:text-[11px] text-slate-300 leading-snug font-normal line-clamp-1">
                      {currentSlide.description}
                    </p>

                    {/* 4 Spec Badges (2x2 Grid) */}
                    <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                      {/* Badge 1: Target */}
                      <div className="flex items-center gap-1.5 p-1.5 sm:p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/12 text-xs">
                        <div className="w-5 h-5 rounded-md bg-amber-400/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                          <Target className="w-3 h-3 text-amber-300" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider leading-none">
                            TARGET
                          </span>
                          <span className="font-bold text-slate-100 text-[10px] sm:text-[11px] truncate block leading-tight mt-0.5">
                            {currentSlide.target}
                          </span>
                        </div>
                      </div>

                      {/* Badge 2: Duration */}
                      <div className="flex items-center gap-1.5 p-1.5 sm:p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/12 text-xs">
                        <div className="w-5 h-5 rounded-md bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                          <Clock className="w-3 h-3 text-emerald-300" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider leading-none">
                            DURATION
                          </span>
                          <span className="font-bold text-slate-100 text-[10px] sm:text-[11px] truncate block leading-tight mt-0.5">
                            {currentSlide.duration}
                          </span>
                        </div>
                      </div>

                      {/* Badge 3: Syllabus */}
                      <div className="flex items-center gap-1.5 p-1.5 sm:p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/12 text-xs">
                        <div className="w-5 h-5 rounded-md bg-sky-400/20 border border-sky-400/30 flex items-center justify-center shrink-0">
                          <BookOpen className="w-3 h-3 text-sky-300" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider leading-none">
                            SYLLABUS
                          </span>
                          <span className="font-bold text-slate-100 text-[10px] sm:text-[11px] truncate block leading-tight mt-0.5">
                            {currentSlide.curriculum}
                          </span>
                        </div>
                      </div>

                      {/* Badge 4: Mocks */}
                      <div className="flex items-center gap-1.5 p-1.5 sm:p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/12 text-xs">
                        <div className="w-5 h-5 rounded-md bg-fuchsia-400/20 border border-fuchsia-400/30 flex items-center justify-center shrink-0">
                          <Award className="w-3 h-3 text-fuchsia-300" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider leading-none">
                            MOCKS
                          </span>
                          <span className="font-bold text-slate-100 text-[10px] sm:text-[11px] truncate block leading-tight mt-0.5">
                            {currentSlide.testSeries}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Bar: Fee Display & Quick Explore CTA */}
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs sm:text-sm font-black text-white">
                        {currentSlide.discountedFee}
                      </span>
                      <span className="text-[10px] text-slate-400 line-through">
                        {currentSlide.originalFee}
                      </span>
                      <span className="hidden sm:inline px-1.5 py-0.2 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-[8px] font-mono font-bold text-emerald-300">
                        Code: IMPLEX30
                      </span>
                    </div>

                    <div className="btn-shine inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-[11px] shadow-sm transition-all group-hover:scale-105 active:scale-95 shrink-0">
                      <span>Explore Course</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination Dot Indicators & Status */}
      <div className="mt-2 flex items-center justify-between px-1">
        <div className="text-[10px] font-medium text-slate-500 hidden sm:flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-amber-500 animate-pulse" />
          <span>Auto-rotating continuously • Click arrows or swipe to explore</span>
        </div>

        <div className="flex items-center justify-center gap-1 mx-auto sm:mx-0">
          {bannerSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-7 bg-brand-600 shadow-xs'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        <div className="text-[10px] font-semibold text-slate-500 hidden sm:block">
          <span className="font-mono text-slate-800 font-bold">{currentIndex + 1}</span> / {slideCount}
        </div>
      </div>
    </div>
  );
}
