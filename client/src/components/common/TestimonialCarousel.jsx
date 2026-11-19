import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

const testimonialsData = [
  {
    name: 'Aarav Sharma',
    role: 'Class 12th PCM & JEE Aspirant',
    badge: 'JEE Main 98.7%ile',
    avatar: 'AS',
    avatarBg: 'bg-brand-600',
    quote:
      'Implex Edu completely changed my approach to physics and calculus. The weekly chapter test series and step-by-step doubt resolution helped me score 96% in pre-boards and boosted my JEE mock percentiles above 98.7.',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    role: 'State PSC & GS Foundation Batch',
    badge: 'Rank #4 State Mock League',
    avatar: 'PP',
    avatarBg: 'bg-emerald-600',
    quote:
      'The depth of study materials, current affairs analysis, and mentorship from experienced faculty make Implex Edu unbeatable. Having cryptographically verified certificates for competitive milestones is an incredible advantage.',
    rating: 5,
  },
  {
    name: 'Rohan Verma',
    role: '10th Board Topper',
    badge: 'CBSE 95.4% Aggregate',
    avatar: 'RV',
    avatarBg: 'bg-amber-600',
    quote:
      'The interactive live tests and video summaries made revision so fast before finals. I never felt stressed because every topic was thoroughly practiced with instant automated scoring.',
    rating: 5,
  },
  {
    name: 'Dr. Sunita Mishra',
    role: 'Academic Director, Partner School',
    badge: 'Institutional Partner',
    avatar: 'SM',
    avatarBg: 'bg-indigo-600',
    quote:
      'We partnered with Implex Edu for our inter-school quiz Olympiad and academic diagnostics. The cryptographic verification system for certificates gives both parents and admissions boards 100% trust in the scores.',
    rating: 5,
  },
  {
    name: 'Ananya Gupta',
    role: 'NEET-UG Integrated Scholar',
    badge: 'Scored 685/720 in Mock Grand Test',
    avatar: 'AG',
    avatarBg: 'bg-rose-600',
    quote:
      'The NCERT line-by-line question tests and assertion-reasoning explanations gave me absolute confidence in Biology and Chemistry. It feels like real exam day every single week.',
    rating: 5,
  },
  {
    name: 'Vikramaditya Rao',
    role: 'Banking PO Batch Scholar',
    badge: 'Cleared IBPS PO Prelims',
    avatar: 'VR',
    avatarBg: 'bg-cyan-600',
    quote:
      'Speed math calculation shortcuts and weekly sectional timer tests increased my attempts from 52 to 78 with 95% accuracy. Truly top-notch faculty support.',
    rating: 5,
  },
];

export default function TestimonialCarousel() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  // Group into pairs of 2 on medium screens, 3 on large screens, or 1 on mobile
  // We'll show an active index with a sliding window
  const total = testimonialsData.length;

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setPage((prev) => (prev + 1) % total);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, total]);

  const handleNext = () => {
    setDirection(1);
    setPage((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setDirection(-1);
    setPage((prev) => (prev - 1 + total) % total);
  };

  // Get current active items (show 3 on desktop, 2 on tablet, 1 on mobile)
  const getVisibleItems = () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push(testimonialsData[(page + i) % total]);
    }
    return items;
  };

  const visibleItems = getVisibleItems();

  return (
    <div
      className="space-y-8 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">
            Showing verified reviews ({page + 1} of {total})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next testimonial"
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Testimonials Grid / Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: direction * 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -20 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {visibleItems.map((t, idx) => (
            <motion.div
              key={`${t.name}-${idx}`}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card hover:shadow-xl hover:border-brand-300 flex flex-col justify-between transition-all duration-300 relative group"
            >
              <div>
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-slate-300 group-hover:text-brand-500 transition-colors" />
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${t.avatarBg} text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                >
                  {t.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <h4 className="text-xs font-extrabold text-slate-900 truncate">{t.name}</h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" title="Verified Scholar" />
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{t.role}</p>
                  <span className="inline-block mt-0.5 text-[10px] font-bold text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded">
                    {t.badge}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Pagination Dot Indicators */}
      <div className="flex items-center justify-center gap-1.5 pt-2">
        {testimonialsData.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setDirection(idx > page ? 1 : -1);
              setPage(idx);
            }}
            aria-label={`Go to testimonial ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === page ? 'w-6 bg-brand-600 shadow-sm' : 'w-2 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
