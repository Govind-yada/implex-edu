import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Zap,
  Flame,
} from 'lucide-react';

const promoSlides = [
  {
    id: 'bihar-tre',
    category: 'Bihar TRE',
    shortCategory: 'TRE 4.0',
    title: 'Bihar TRE 4.0 Teacher Recruitment Master Batch',
    subtitle: 'Primary (PRT 1–5), Middle (6–8) & Secondary (9–12) Complete Prep',
    badge: 'BPSC TRE 4.0 Batch',
    badgeColor: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
    gradient: 'from-slate-950 via-[#06241a] to-[#0c3124]',
    accentColor: 'text-emerald-300',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    image: '/images/banners/bihar-tre.jpg',
    icon: Award,
    target: 'CTET / STET Passed Candidates',
    duration: '6-Mo Track • 400+ Hrs',
    curriculum: 'GS, Language & Core Specializations',
    originalFee: '₹4,999',
    discountedFee: '₹1,999',
    savings: 'Save ₹3,000 (60% OFF)',
    code: 'IMPLEX60',
    ctaLink: '/services?category=competitive&search=bihar+tre',
  },
  {
    id: 'bpsc-72',
    category: 'BPSC 72',
    shortCategory: 'BPSC 72nd',
    title: '72nd BPSC (CCE) Prelims + Mains Foundation Batch',
    subtitle: 'Bihar Special History, Economy, Current Affairs & Mains Answer Writing',
    badge: '72nd BPSC Civil Services',
    badgeColor: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40',
    gradient: 'from-slate-950 via-[#0a1b42] to-[#12194c]',
    accentColor: 'text-amber-300',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    image: '/images/banners/bpsc-72.jpg',
    icon: Landmark,
    target: 'Graduates & Final-Year Candidates',
    duration: '8-Mo Track • 500+ Hrs',
    curriculum: 'Bihar Special GK, GS I & II, Essay & CSAT',
    originalFee: '₹9,999',
    discountedFee: '₹3,999',
    savings: 'Save ₹6,000 (60% OFF)',
    code: 'IMPLEX60',
    ctaLink: '/services?category=competitive&search=bpsc',
  },
  {
    id: 'upsc',
    category: 'UPSC',
    shortCategory: 'UPSC CSE',
    title: 'UPSC Civil Services (IAS / IPS / IFS) Premier Track',
    subtitle: 'Comprehensive GS Prelims + Mains (I–IV), CSAT, Essay & PTS',
    badge: 'National Civil Services',
    badgeColor: 'bg-sky-500/20 text-sky-200 border-sky-400/40',
    gradient: 'from-slate-950 via-[#081f38] to-[#131a3a]',
    accentColor: 'text-sky-300',
    glowColor: 'rgba(14, 165, 233, 0.4)',
    image: '/images/banners/upsc-60.jpg',
    icon: ShieldCheck,
    target: 'Graduates & Serious IAS Aspirants',
    duration: '12-Mo Complete Track • 750+ Hrs',
    curriculum: 'GS Paper I-IV, CSAT & Answer Drills',
    originalFee: '₹14,999',
    discountedFee: '₹5,999',
    savings: 'Save ₹9,000 (60% OFF)',
    code: 'IMPLEX60',
    ctaLink: '/services?category=competitive&search=upsc',
  },
  {
    id: 'uppsc',
    category: 'UPPSC',
    shortCategory: 'UP PCS',
    title: 'UPPSC Combined State PCS Prelims + Mains Target Batch',
    subtitle: 'Complete In-Depth Coverage of UP Special (Paper 5 & 6) + Test Series',
    badge: 'UP State Admin Wing',
    badgeColor: 'bg-purple-500/20 text-purple-200 border-purple-400/40',
    gradient: 'from-slate-950 via-[#1f0d38] to-[#280d44]',
    accentColor: 'text-purple-300',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    image: '/images/banners/uppsc.jpg',
    icon: BookOpen,
    target: 'UP PCS & State Admin Candidates',
    duration: '7-Mo Fastrack • 450+ Hrs',
    curriculum: 'UP Special (Paper 5 & 6), GS & Essay',
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

  // Continuous auto-scrolling engine
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

  // Keep category pills centered in container without page scroll interference
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
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 320, damping: 30 },
        opacity: { duration: 0.22 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      transition: { duration: 0.16, ease: 'easeInOut' },
    }),
  };

  return (
    <section
      aria-label="Premier Competitive Exam 60% OFF Banners"
      className="w-full bg-slate-950/95 border-b border-slate-800/90 py-2 sm:py-3 px-2 sm:px-4 relative select-none overflow-x-clip"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decreased Max Width Container (Compact max-w-3xl / max 768px on desktop) */}
      <div className="max-w-3xl mx-auto">
        {/* Top Header Strip: Compact 60% OFF Tag + Category Pills */}
        <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
          {/* Left Badge */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 text-slate-950 font-black text-[10px] sm:text-[11px] tracking-wide shadow-xs uppercase">
              <Flame className="w-3 h-3 fill-slate-950" />
              <span>FLAT 60% OFF</span>
            </span>

            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-amber-300/90">
              <Tag className="w-2.5 h-2.5 text-amber-400" />
              <span>Code: <strong className="font-mono bg-white/10 px-1 py-0.2 rounded text-white text-[10px]">IMPLEX60</strong></span>
            </span>
          </div>

          {/* Right Category Pills (Bihar TRE, BPSC 72, UPSC, UPPSC) */}
          <div
            ref={pillsContainerRef}
            className="flex items-center justify-end gap-1 overflow-x-auto pb-0.5 scrollbar-none scroll-smooth px-0.5"
          >
            {promoSlides.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  ref={(el) => (pillRefs.current[idx] = el)}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1 shrink-0 ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-black shadow-xs ring-1 ring-white/40'
                      : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{slide.category}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact Banner Card Viewport */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous 60% OFF Exam Banner"
            className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-30 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-900/95 hover:bg-slate-850 text-white shadow-lg border border-white/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer pointer-events-auto"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 pointer-events-none" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next 60% OFF Exam Banner"
            className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-30 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-900/95 hover:bg-slate-850 text-white shadow-lg border border-white/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer pointer-events-auto"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 pointer-events-none" />
          </button>

          {/* Animated Banner Card (Compact Length & Width on both Desktop and Mobile) */}
          <div
            onClick={handleCardClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="group relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-slate-700/70 cursor-pointer transition-all duration-300 hover:shadow-brand-500/20 hover:border-brand-500/50"
            title={`Click to enroll in ${currentSlide.title} with 60% OFF discount`}
          >
            {/* Top Auto-Scroll Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10 z-30 overflow-hidden">
              <motion.div
                key={currentIndex}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{
                  duration: SLIDE_DURATION / 1000,
                  ease: 'linear',
                }}
                className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-400 shadow-xs"
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
                {/* Ambient Glow */}
                <div
                  className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-30"
                  style={{ backgroundColor: currentSlide.glowColor }}
                />

                {/* Compact Side-by-Side Content Layout on BOTH Mobile and Desktop */}
                <div className="relative z-10 flex items-stretch min-h-[96px] sm:min-h-[120px] md:min-h-[125px]">
                  {/* LEFT: Compact Image Thumbnail (Only 85px on mobile, 140px on sm, 160px on md) */}
                  <div className="w-[85px] sm:w-[130px] md:w-[155px] relative overflow-hidden flex items-center justify-center shrink-0 bg-slate-950">
                    <img
                      src={currentSlide.image}
                      alt={`${currentSlide.title} Banner`}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />

                    {/* Gradient Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-950/85 pointer-events-none" />

                    {/* Small 60% OFF Overlaid Badge */}
                    <div className="absolute top-1.5 left-1.5 z-10">
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-rose-500 text-white font-black text-[8px] sm:text-[9px] shadow-xs">
                        60% OFF
                      </span>
                    </div>

                    {/* Subtle Neon Line */}
                    <div className="absolute top-0 bottom-0 right-0 w-[1.5px] bg-gradient-to-b from-transparent via-amber-300/80 to-transparent pointer-events-none z-20" />
                  </div>

                  {/* RIGHT: Course Details + Pricing + Compact CTA */}
                  <div className="flex-1 p-2 sm:p-2.5 md:p-3 flex flex-col justify-between min-w-0">
                    <div className="space-y-0.5 min-w-0">
                      {/* Top Wing Badge & Session */}
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[8px] sm:text-[9px] font-bold border backdrop-blur-md ${currentSlide.badgeColor}`}
                        >
                          <SlideIcon className="w-2.5 h-2.5" />
                          <span>{currentSlide.badge}</span>
                        </span>

                        <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-white/10 text-slate-300 text-[8px] font-medium">
                          <Zap className="w-2 h-2 text-amber-300" />
                          <span>Session 2025–26</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xs sm:text-sm font-black text-white tracking-tight leading-tight group-hover:text-amber-200 transition-colors truncate">
                        {currentSlide.title}
                      </h3>

                      {/* Subtitle */}
                      <p className={`text-[10px] sm:text-[11px] font-semibold ${currentSlide.accentColor} truncate leading-tight`}>
                        {currentSlide.subtitle}
                      </p>

                      {/* Desktop Spec Pills (Target & Duration) */}
                      <div className="hidden sm:flex items-center gap-2 pt-0.5 text-[9px] text-slate-300">
                        <span className="flex items-center gap-1 truncate">
                          <Target className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                          <strong className="text-slate-400 font-bold">Target:</strong> {currentSlide.target}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="flex items-center gap-1 shrink-0">
                          <Clock className="w-2.5 h-2.5 text-emerald-300 shrink-0" />
                          {currentSlide.duration}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Fee & Compact CTA Button */}
                    <div className="mt-1 pt-1 border-t border-white/10 flex items-center justify-between gap-1.5">
                      <div className="flex items-baseline gap-1.5 min-w-0">
                        <span className="text-[11px] sm:text-xs md:text-sm font-black text-white">
                          {currentSlide.discountedFee}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-slate-400 line-through">
                          {currentSlide.originalFee}
                        </span>
                        <span className="hidden md:inline px-1 py-0.2 rounded bg-emerald-500/20 text-[8px] font-bold text-emerald-300">
                          {currentSlide.savings}
                        </span>
                      </div>

                      <div className="btn-shine inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-extrabold text-[10px] sm:text-[11px] shadow-xs transition-all group-hover:scale-103 active:scale-95 shrink-0">
                        <span>Enroll 60% Off</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Micro Indicator Dots */}
        <div className="mt-1 flex items-center justify-between px-1">
          <div className="text-[9px] font-medium text-slate-400 hidden sm:flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-spin-slow" />
            <span>Auto-rotating continuously • Click tabs or arrows to switch</span>
          </div>

          <div className="flex items-center justify-center gap-1 mx-auto sm:mx-0">
            {promoSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-5 bg-amber-400 shadow-xs'
                    : 'w-1.5 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <div className="text-[9px] font-mono font-bold text-slate-400 hidden sm:block">
            <span className="text-amber-300">{currentIndex + 1}</span> / {slideCount}
          </div>
        </div>
      </div>
    </section>
  );
}
