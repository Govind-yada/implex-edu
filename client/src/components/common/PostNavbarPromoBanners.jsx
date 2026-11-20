import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
  BookOpen,
  Award,
  Clock,
  Target,
  Landmark,
  CheckCircle2,
  Zap,
  Flame,
} from 'lucide-react';

const promoSlides = [
  {
    id: 'bihar-tre',
    category: 'Bihar TRE',
    shortName: 'TRE 4.0 / 3.0',
    title: 'Bihar TRE 4.0 Teacher Recruitment Master Batch',
    subtitle: 'Primary (PRT 1–5), Middle (6–8) & Secondary (9–12) Complete Prep',
    description:
      'Rigorous bilingual preparation aligned strictly with BPSC syllabus and SCERT/NCERT textbooks with high-yield chapter-wise practice tests.',
    badge: 'BPSC Shikshak Bharti (TRE 4.0)',
    badgeColor: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
    tag: 'FLAT 60% OFF • LIMITED TIME',
    gradient: 'from-slate-950 via-[#06241a] to-[#0d3326]',
    accentColor: 'text-emerald-300',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    image: '/images/banners/bihar-tre.jpg',
    icon: Award,
    target: 'CTET / STET Passed Candidates',
    duration: '6-Mo Target Batch • 400+ Hrs',
    curriculum: 'GS, Language & Core Specializations',
    testSeries: '50+ CBT Mock Tests & OMR Drills',
    originalFee: '₹4,999',
    discountedFee: '₹1,999',
    savings: 'Save ₹3,000 (60% OFF)',
    code: 'IMPLEX60',
    ctaLink: '/services?category=competitive&search=bihar+tre',
  },
  {
    id: 'bpsc-72',
    category: 'BPSC 72',
    shortName: '72nd CCE Prelims + Mains',
    title: '72nd BPSC (CCE) Prelims + Mains Foundation Batch',
    subtitle: 'Bihar Special History, Economy, Polity, Current Affairs & Mains Answer Writing',
    description:
      'Comprehensive foundation course taught by civil services mentors with daily answer writing drills, previous year question trends, and simulated exams.',
    badge: '72nd BPSC Civil Services Wing',
    badgeColor: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40',
    tag: 'MEGA ADMISSION • 60% OFF',
    gradient: 'from-slate-950 via-[#0a1b42] to-[#121a4f]',
    accentColor: 'text-amber-300',
    glowColor: 'rgba(99, 102, 241, 0.45)',
    image: '/images/banners/bpsc-72.jpg',
    icon: Landmark,
    target: 'Graduates & Final-Year Candidates',
    duration: '8-Mo Foundation Track • 500+ Hrs',
    curriculum: 'Bihar Special GK, GS I & II, Essay & CSAT',
    testSeries: '40 Full Mocks + Mains Evaluation',
    originalFee: '₹9,999',
    discountedFee: '₹3,999',
    savings: 'Save ₹6,000 (60% OFF)',
    code: 'IMPLEX60',
    ctaLink: '/services?category=competitive&search=bpsc',
  },
  {
    id: 'upsc',
    category: 'UPSC',
    shortName: 'IAS / IPS / IFS 2025–26',
    title: 'UPSC Civil Services (IAS / IPS / IFS) Premier Track',
    subtitle: 'Comprehensive GS Prelims + Mains (I–IV), CSAT, Essay & Prelims Test Series (PTS)',
    description:
      'Structured multi-tier pedagogy featuring daily newspaper editorial synthesis, ethics case study workshops, and 1-on-1 mentorship for top all-India ranks.',
    badge: 'National Civil Services Track',
    badgeColor: 'bg-sky-500/20 text-sky-200 border-sky-400/40',
    tag: 'FLAT 60% OFF • ADMISSIONS OPEN',
    gradient: 'from-slate-950 via-[#081f38] to-[#141b3d]',
    accentColor: 'text-sky-300',
    glowColor: 'rgba(14, 165, 233, 0.45)',
    image: '/images/banners/upsc-60.jpg',
    icon: ShieldCheck,
    target: 'Graduates & Serious IAS Aspirants',
    duration: '12-Mo Complete Track • 750+ Hrs',
    curriculum: 'GS Paper I-IV, CSAT & Answer Drills',
    testSeries: '60 CBT Tests + Mains Mock League',
    originalFee: '₹14,999',
    discountedFee: '₹5,999',
    savings: 'Save ₹9,000 (60% OFF)',
    code: 'IMPLEX60',
    ctaLink: '/services?category=competitive&search=upsc',
  },
  {
    id: 'uppsc',
    category: 'UPPSC',
    shortName: 'UP Combined State PCS',
    title: 'UPPSC Combined State PCS Prelims + Mains Target Batch',
    subtitle: 'Complete In-Depth Coverage of UP Special (Paper 5 & 6) + Test Series',
    description:
      'Tailored specifically for the updated UPPSC PCS examination pattern, emphasizing Uttar Pradesh art, culture, economy, geography, budget, and general studies.',
    badge: 'UP State Administration Wing',
    badgeColor: 'bg-purple-500/20 text-purple-200 border-purple-400/40',
    tag: '60% OFF • UP SPECIAL BATCH',
    gradient: 'from-slate-950 via-[#1f0d38] to-[#2b0f49]',
    accentColor: 'text-purple-300',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    image: '/images/banners/uppsc.jpg',
    icon: BookOpen,
    target: 'UP PCS & State Administration Candidates',
    duration: '7-Mo Target Batch • 450+ Hrs',
    curriculum: 'UP Special (Paper 5 & 6), GS & Essay',
    testSeries: '45 Speed Tests + Detailed PYQ Bank',
    originalFee: '₹8,999',
    discountedFee: '₹3,499',
    savings: 'Save ₹5,500 (60% OFF)',
    code: 'IMPLEX60',
    ctaLink: '/services?category=competitive&search=uppsc',
  },
];

export default function PostNavbarPromoBanners() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const touchStartX = useRef(null);
  const pillsContainerRef = useRef(null);
  const pillRefs = useRef([]);
  const navigate = useNavigate();

  const slideCount = promoSlides.length;
  const SLIDE_DURATION = 4200; // Auto-scrolls smoothly every 4.2 seconds

  // Auto-scrolling engine
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slideCount, isPaused, currentIndex]);

  // Keep category pills horizontally centered in their container without window scrolling
  useEffect(() => {
    const pill = pillRefs.current[currentIndex];
    const container = pillsContainerRef.current;
    if (pill && container) {
      const pillLeft = pill.offsetLeft;
      const pillWidth = pill.offsetWidth;
      const containerWidth = container.offsetWidth;
      const targetScroll = pillLeft - containerWidth / 2 + pillWidth / 2;
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  }, [currentIndex]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % slideCount);
      }, SLIDE_DURATION);
    }
  };

  const goToSlide = (idx) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
    resetTimer();
  };

  const handleNext = (e) => {
    if (e) {
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
      if (typeof e.preventDefault === 'function') e.preventDefault();
    }
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slideCount);
    resetTimer();
  };

  const handlePrev = (e) => {
    if (e) {
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
      if (typeof e.preventDefault === 'function') e.preventDefault();
    }
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
    resetTimer();
  };

  // Touch Swipe Support for Mobile Devices
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const currentSlide = promoSlides[currentIndex];
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
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      transition: { duration: 0.18, ease: 'easeInOut' },
    }),
  };

  return (
    <section
      aria-label="Premier Competitive Exam 60% OFF Banners"
      className="w-full bg-slate-950/95 border-b border-slate-800/90 py-2.5 sm:py-4 px-2.5 sm:px-4 md:px-6 relative select-none overflow-x-clip"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-5xl mx-auto">
        {/* Top Header Bar: 60% OFF Mega Tag + 4 Quick Switcher Pills */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-2 sm:mb-3">
          {/* Left: 60% OFF Festive Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 text-slate-950 font-black text-[11px] sm:text-xs tracking-wide shadow-md shadow-amber-500/20 uppercase animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-slate-950" />
              <span>FLAT 60% OFF ADMISSION FESTIVAL</span>
            </span>

            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold text-amber-300/90">
              <Tag className="w-3 h-3 text-amber-400" />
              <span>Code: <strong className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white">IMPLEX60</strong></span>
            </span>
          </div>

          {/* Right / Center: 4 Exam Category Pills (Bihar TRE, BPSC 72, UPSC, UPPSC) */}
          <div
            ref={pillsContainerRef}
            className="w-full sm:w-auto flex items-center justify-start sm:justify-end gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none scroll-smooth px-0.5"
          >
            {promoSlides.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  ref={(el) => (pillRefs.current[idx] = el)}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black tracking-tight whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-md shadow-amber-500/20 scale-102 ring-2 ring-white/30'
                      : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{slide.category}</span>
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-slate-950 text-amber-300' : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                    }`}
                  >
                    60% OFF
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Carousel Viewport Container */}
        <div className="relative">
          {/* Previous Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous 60% OFF Exam Banner"
            className="absolute -left-2 sm:-left-3 md:-left-4 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white shadow-xl border border-white/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer pointer-events-auto"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
          </button>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next 60% OFF Exam Banner"
            className="absolute -right-2 sm:-right-3 md:-right-4 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white shadow-xl border border-white/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer pointer-events-auto"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
          </button>

          {/* Main Animated Banner Card */}
          <div
            onClick={handleCardClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 cursor-pointer transition-all duration-300 hover:shadow-brand-500/20 hover:border-brand-500/60"
            title={`Click to enroll in ${currentSlide.title} with 60% OFF discount`}
          >
            {/* Top Auto-Scroll Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-30 overflow-hidden">
              <motion.div
                key={currentIndex}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{
                  duration: SLIDE_DURATION / 1000,
                  ease: 'linear',
                }}
                className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-400 shadow-sm"
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
                {/* Ambient Glows */}
                <div
                  className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-35"
                  style={{ backgroundColor: currentSlide.glowColor }}
                />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-60 h-60 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

                {/* Split Content: Compact Left Image + Formatted Details */}
                <div className="relative z-10 flex flex-col md:flex-row items-stretch min-h-[260px] sm:min-h-[250px] md:min-h-[195px] lg:min-h-[190px]">
                  {/* LEFT: Compact Desktop Image Size (25% on desktop, styled height on mobile) */}
                  <div className="w-full md:w-[26%] lg:w-[24%] md:max-w-[220px] relative overflow-hidden flex items-center justify-center shrink-0 min-h-[145px] sm:min-h-[165px] md:min-h-0 bg-slate-950">
                    <img
                      src={currentSlide.image}
                      alt={`${currentSlide.title} Official Course Photo`}
                      className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />

                    {/* Desktop Vignette */}
                    <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-950/90 pointer-events-none" />
                    {/* Mobile Vignette */}
                    <div className="block md:hidden absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />

                    {/* Mobile Overlaid Top Badges */}
                    <div className="md:hidden absolute top-2 left-2 right-2 flex items-center justify-between gap-1 z-10">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border backdrop-blur-md shadow-xs ${currentSlide.badgeColor}`}
                      >
                        <SlideIcon className="w-2.5 h-2.5" />
                        <span>{currentSlide.badge}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500 text-white font-black text-[9px] tracking-wide shadow-xs animate-pulse">
                        <Tag className="w-2.5 h-2.5" />
                        <span>60% OFF</span>
                      </span>
                    </div>

                    {/* Neon Separator Beam on Desktop */}
                    <div className="hidden md:block absolute -top-8 -bottom-8 right-0 w-[2px] bg-gradient-to-b from-transparent via-amber-300/80 to-transparent shadow-[0_0_12px_rgba(251,191,36,0.6)] pointer-events-none z-20" />
                  </div>

                  {/* RIGHT: Course Title, Highlights, 60% Price & Direct CTA */}
                  <div className="w-full md:w-[74%] lg:w-[76%] p-3 sm:p-3.5 lg:p-4 flex flex-col justify-between relative z-10">
                    <div className="space-y-1">
                      {/* Desktop Header Badges */}
                      <div className="hidden md:flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${currentSlide.badgeColor}`}
                        >
                          <SlideIcon className="w-3 h-3" />
                          <span>{currentSlide.badge}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/25 border border-rose-400/40 text-rose-300 font-black text-[9px] tracking-wide animate-pulse">
                          <Tag className="w-2.5 h-2.5" />
                          <span>{currentSlide.tag}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-slate-300 text-[9px] font-medium">
                          <Zap className="w-2.5 h-2.5 text-amber-300" />
                          <span>Session 2025–26</span>
                        </span>
                      </div>

                      {/* Main Course Title */}
                      <div>
                        <h3 className="text-sm sm:text-base lg:text-lg font-black text-white tracking-tight leading-snug group-hover:text-amber-200 transition-colors">
                          {currentSlide.title}
                        </h3>
                        <p className={`text-[11px] sm:text-xs font-bold ${currentSlide.accentColor} line-clamp-1`}>
                          {currentSlide.subtitle}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-[10px] sm:text-[11px] text-slate-300 leading-snug font-normal line-clamp-1">
                        {currentSlide.description}
                      </p>

                      {/* 4 Compact Spec Badges (2x2 Grid) */}
                      <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                        <div className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-xs">
                          <Target className="w-3 h-3 text-amber-300 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider leading-none">
                              TARGET
                            </span>
                            <span className="font-bold text-slate-100 text-[9px] sm:text-[10px] truncate block leading-tight mt-0.5">
                              {currentSlide.target}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-xs">
                          <Clock className="w-3 h-3 text-emerald-300 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider leading-none">
                              DURATION
                            </span>
                            <span className="font-bold text-slate-100 text-[9px] sm:text-[10px] truncate block leading-tight mt-0.5">
                              {currentSlide.duration}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-xs">
                          <BookOpen className="w-3 h-3 text-sky-300 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider leading-none">
                              SYLLABUS
                            </span>
                            <span className="font-bold text-slate-100 text-[9px] sm:text-[10px] truncate block leading-tight mt-0.5">
                              {currentSlide.curriculum}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-xs">
                          <CheckCircle2 className="w-3 h-3 text-fuchsia-300 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider leading-none">
                              MOCKS
                            </span>
                            <span className="font-bold text-slate-100 text-[9px] sm:text-[10px] truncate block leading-tight mt-0.5">
                              {currentSlide.testSeries}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Fee & Instant 60% OFF Enrollment Button */}
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between gap-2.5">
                      <div className="flex items-baseline gap-2 min-w-0">
                        <div className="flex flex-col">
                          <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-amber-300 font-extrabold leading-none">
                            FLAT 60% OFF FEE
                          </span>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-xs sm:text-base font-black text-white">
                              {currentSlide.discountedFee}
                            </span>
                            <span className="text-[10px] text-slate-400 line-through">
                              {currentSlide.originalFee}
                            </span>
                          </div>
                        </div>

                        <span className="hidden sm:inline px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30 text-[9px] font-bold text-emerald-300">
                          {currentSlide.savings}
                        </span>
                      </div>

                      <div className="btn-shine inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-[11px] sm:text-xs shadow-md transition-all group-hover:scale-103 active:scale-95 shrink-0">
                        <span>Enroll with 60% Off</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Carousel Dot Indicators & Status */}
        <div className="mt-2 flex items-center justify-between px-1">
          <div className="text-[10px] font-semibold text-slate-400 hidden sm:flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400 animate-spin-slow" />
            <span>Auto-scrolling every 4.2s • Click tabs or arrows to switch</span>
          </div>

          <div className="flex items-center justify-center gap-1 mx-auto sm:mx-0">
            {promoSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to ${promoSlides[idx].category} 60% off banner`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-7 bg-amber-400 shadow-sm'
                    : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <div className="text-[10px] font-mono font-bold text-slate-400 hidden sm:block">
            <span className="text-amber-300">{currentIndex + 1}</span> / {slideCount}
          </div>
        </div>
      </div>
    </section>
  );
}
