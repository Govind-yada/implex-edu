import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';

const bannerSlides = [
  {
    id: 'upsc',
    category: 'UPSC',
    title: 'UPSC Civil Services Examination (IAS / IPS / IFS)',
    subtitle: 'Comprehensive GS Foundations, CSAT & National Mock Test Series',
    description:
      'Rigorous multi-stage curriculum designed by civil service mentors. Master Indian Polity, History, Economy, and Current Affairs with weekly answer writing practice.',
    icon: Landmark,
    badge: 'National Competitive Wing',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    gradient: 'from-slate-900 via-indigo-950 to-slate-900',
    accentColor: 'text-amber-400',
    tags: ['General Studies (Prelims + Mains)', 'CSAT Logical Reasoning', 'Weekly Essay Mentorship', 'All-India Rank Diagnostics'],
    offerTag: 'Special 30% OFF • Code IMPLEX30',
    ctaLink: '/services',
  },
  {
    id: 'bpsc',
    category: 'BPSC',
    title: 'BPSC Combined Competitive Examination (State PCS)',
    subtitle: 'Bihar Administration, Special GS & State Officer Ranks',
    description:
      'Targeted preparation for Bihar Public Service Commission. Comprehensive coverage of Bihar history, geography, economy, state budget, and specialized mains writing.',
    icon: Award,
    badge: 'State Public Service',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    gradient: 'from-slate-900 via-amber-950 to-slate-900',
    accentColor: 'text-amber-300',
    tags: ['Bihar Special General Knowledge', 'State Budget & Schemes', 'Mains Answer Formulation', 'Full-Length State Mocks'],
    offerTag: 'Flat 30% OFF • Code IMPLEX30',
    ctaLink: '/services',
  },
  {
    id: 'school',
    category: 'School Education',
    title: 'School Education Foundation (Classes 5th to 8th)',
    subtitle: 'Strong Conceptual Clarity in Math, Science & Logical Reasoning',
    description:
      'Build lifelong intellectual curiosity. Structured 6-day academic timetable with 45-minute focused classes, homework sheets, and weekly Olympiad diagnostic tests.',
    icon: School,
    badge: 'Foundations Hub',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    gradient: 'from-slate-900 via-emerald-950 to-slate-900',
    accentColor: 'text-emerald-300',
    tags: ['CBSE & ICSE Core Standards', 'Mental Math & Logic', 'Science Practical Concepts', 'Weekly Progress Cards'],
    offerTag: 'Annual Batch 30% OFF',
    ctaLink: '/services',
  },
  {
    id: 'bihar-board',
    category: 'Bihar Board',
    title: 'Bihar Board (BSEB Matric 10th & Intermediate 12th)',
    subtitle: 'State Board Topper Series (Hindi & English Medium)',
    description:
      'Aligned with the official BSEB syllabus and NCERT patterns. Thorough chapter-wise objective question banks, 50-mark model papers, and board exam simulation.',
    icon: BookOpen,
    badge: 'BSEB State Board Track',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    gradient: 'from-slate-900 via-blue-950 to-slate-900',
    accentColor: 'text-sky-300',
    tags: ['Objective Question Banks', '100% NCERT Solutions', 'Model Practice Papers', 'Subjective Writing Guidance'],
    offerTag: 'Save 30% with IMPLEX30',
    ctaLink: '/services',
  },
  {
    id: 'mp-board',
    category: 'MP Board',
    title: 'MP Board (MPBSE High School & Higher Secondary)',
    subtitle: 'Madhya Pradesh State Board Excellence & Blueprint Tests',
    description:
      'Tailored for MP Board students. Comprehensive Hindi & English medium coverage of Physics, Chemistry, Math, Biology, Commerce, and Arts with previous years solved papers.',
    icon: Building,
    badge: 'MPBSE Specialized',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    gradient: 'from-slate-900 via-purple-950 to-slate-900',
    accentColor: 'text-purple-300',
    tags: ['MPBSE Blueprint Aligned', 'Previous 10 Years Q&A', 'Chapter Revision Notes', 'Rapid Doubt Clearing'],
    offerTag: 'Flat 30% OFF • Code IMPLEX30',
    ctaLink: '/services',
  },
  {
    id: 'college',
    category: 'College Education',
    title: 'College & University Degree Nourishment',
    subtitle: 'Undergraduate Sciences, Commerce, Arts & Semester Success',
    description:
      'Bridge the gap between college lectures and career aptitude. Advanced theoretical foundations, university exam solutions, and analytical aptitude modules.',
    icon: GraduationCap,
    badge: 'Undergraduate Wing',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    gradient: 'from-slate-900 via-cyan-950 to-slate-900',
    accentColor: 'text-cyan-300',
    tags: ['Semester Curriculum Support', 'B.Sc / B.Com / B.A Tracks', 'Career Aptitude Modules', 'Research Writing Basics'],
    offerTag: 'Student Special 30% OFF',
    ctaLink: '/services',
  },
  {
    id: 'iit',
    category: 'IIT',
    title: 'IIT-JEE (Main & Advanced Integrated)',
    subtitle: 'Premier Engineering Entrance Coaching & Problem Solving',
    description:
      'Master high-level mechanics, electrodynamics, calculus, and physical chemistry. Solve multi-concept problems with timed NTA-pattern computerized mock testing.',
    icon: Sparkles,
    badge: 'Elite Engineering Track',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    gradient: 'from-slate-900 via-blue-900 to-slate-900',
    accentColor: 'text-amber-400',
    tags: ['NTA Computerized CBT Mocks', 'Multi-Concept Problem Sets', 'Negative Marking Strategy', 'Percentile Analytics'],
    offerTag: 'Admissions Open • 30% OFF',
    ctaLink: '/services',
  },
  {
    id: 'neet',
    category: 'NEET',
    title: 'NEET-UG Medical Entrance Preparation',
    subtitle: 'Comprehensive Biology, NCERT Chemistry & Physics for Medical Aspirants',
    description:
      'Every line of NCERT Biology mastered. High-yield diagrams, assertion-reason drills, and full 720-mark mock examinations to secure top government medical college seats.',
    icon: ShieldCheck,
    badge: 'National Medical Wing',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    gradient: 'from-slate-900 via-rose-950 to-slate-900',
    accentColor: 'text-rose-300',
    tags: ['100% NCERT Line-by-Line Bio', 'High-Yield Chemistry Drills', 'Formula Booklets & Shortcuts', '720-Mark Simulation Exams'],
    offerTag: 'Flat 30% OFF • Code IMPLEX30',
    ctaLink: '/services',
  },
  {
    id: 'professional',
    category: 'Professional Courses',
    title: 'Tech, Coding & Professional Career Skills',
    subtitle: 'Modern Software Engineering, Python, Web Development & AI Tools',
    description:
      'Equip yourself with practical market skills. Build real-world web apps, master data structures, learn database architecture, and earn industry-verifiable certifications.',
    icon: Code,
    badge: 'Technology & Skills Hub',
    badgeColor: 'bg-violet-100 text-violet-800 border-violet-200',
    gradient: 'from-slate-900 via-violet-950 to-slate-900',
    accentColor: 'text-fuchsia-300',
    tags: ['Full-Stack MERN Development', 'Python Programming', 'Database & API Architecture', 'Portfolio Capstone Projects'],
    offerTag: 'Career Accelerator 30% OFF',
    ctaLink: '/services',
  },
  {
    id: 'banking',
    category: 'Banking',
    title: 'Banking & Financial Sector Exams (IBPS / SBI / RBI)',
    subtitle: 'Fast Calculations, Speed Math, Reasoning & Banking Awareness',
    description:
      'Crack Bank PO, Clerk, and Specialist Officer examinations. Learn speed calculation tricks, high-level seating arrangements, financial awareness, and computerized tests.',
    icon: Landmark,
    badge: 'Banking & Finance Wing',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    gradient: 'from-slate-900 via-amber-950 to-slate-900',
    accentColor: 'text-amber-400',
    tags: ['Vedic Math Speed Drills', 'Seating Arrangement & Puzzles', 'Financial & Banking Awareness', 'Sectional Timed Mocks'],
    offerTag: 'Flat 30% OFF with Code IMPLEX30',
    ctaLink: '/services',
  },
];

export default function ExamBannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const slideCount = bannerSlides.length;

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, slideCount]);

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slideCount);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const currentSlide = bannerSlides[currentIndex];
  const SlideIcon = currentSlide.icon;

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    }),
  };

  return (
    <section
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 select-none"
      aria-label="Competitive Exam Programs Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Category Pills Navigation (Scrollable on mobile) */}
      <div className="mb-4 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {bannerSlides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={slide.id}
              onClick={() => goToSlide(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md shadow-brand-500/20 scale-102 ring-2 ring-brand-500/40'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {slide.category}
            </button>
          );
        })}
      </div>

      {/* Main Animated Carousel Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 min-h-[380px] sm:min-h-[340px] flex items-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className={`w-full h-full bg-gradient-to-br ${currentSlide.gradient} text-white p-7 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden`}
          >
            {/* Ambient Background Decorative Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-72 h-72 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left Slide Info */}
              <div className="space-y-4 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${currentSlide.badgeColor}`}
                  >
                    <SlideIcon className="w-3.5 h-3.5" />
                    <span>{currentSlide.badge}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 font-extrabold text-[11px] tracking-wide animate-pulse">
                    <Tag className="w-3 h-3" />
                    <span>{currentSlide.offerTag}</span>
                  </span>
                </div>

                <motion.h3
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight"
                >
                  {currentSlide.title}
                </motion.h3>

                <p className={`text-sm sm:text-base font-semibold ${currentSlide.accentColor}`}>
                  {currentSlide.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {currentSlide.description}
                </p>

                {/* Key Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {currentSlide.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-slate-200 text-[11px] font-medium"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Slide CTA Box */}
              <div className="shrink-0 flex flex-col items-center justify-center p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[200px] shadow-lg">
                <span className="text-[11px] font-bold uppercase text-slate-300 tracking-wider">
                  Session 2026-27
                </span>
                <span className="text-3xl font-black text-white mt-0.5">30% OFF</span>
                <span className="text-[11px] text-amber-300 font-mono font-bold mt-0.5">
                  Code: IMPLEX30
                </span>

                <Link
                  to={currentSlide.ctaLink}
                  className="btn-shine mt-3 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  <span>Explore Batches</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Prev & Next Controls */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous examination category"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white/90 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next examination category"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white/90 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Pagination Dot Indicators */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
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
    </section>
  );
}
