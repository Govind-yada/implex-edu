import React, { useState, useEffect, useRef } from 'react';
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
  const timerRef = useRef(null);

  const total = testimonialsData.length;
  const ROTATE_INTERVAL = 5000;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDirection(1);
      setPage((prev) => (prev + 1) % total);
    }, ROTATE_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, page]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setPage((prev) => (prev + 1) % total);
    }, ROTATE_INTERVAL);
  };

  const handleNext = () => {
    setDirection(1);
    setPage((prev) => (prev + 1) % total);
    resetTimer();
  };

  const handlePrev = () => {
    setDirection(-1);
    setPage((prev) => (prev - 1 + total) % total);
    resetTimer();
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
    <div className="space-y-6 select-none">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">
            Showing verified reviews ({page + 1} of {total})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            aria-label="Previous testimonials"
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next testimonials"
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleItems.map((item, idx) => (
            <motion.div
              key={`${item.name}-${page}-${idx}`}
              initial={{ opacity: 0, y: direction > 0 ? 20 : -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: direction > 0 ? -20 : 20 }}
              transition={{ duration: 0.35, ease: 'easeOut', delay: idx * 0.05 }}
              className={`bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-subtle flex flex-col justify-between hover-lift transition-all relative ${
                idx === 2 ? 'hidden lg:flex' : idx === 1 ? 'hidden md:flex' : 'flex'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-100">
                    <CheckCircle2 className="w-3 h-3 text-brand-600" />
                    {item.badge}
                  </span>
                </div>

                <Quote className="w-7 h-7 text-brand-200 mb-2 rotate-180" />

                <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${item.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}
                >
                  {item.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-none">{item.name}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-none">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-2">
        {testimonialsData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > page ? 1 : -1);
              setPage(idx);
              resetTimer();
            }}
            aria-label={`Go to testimonial ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === page ? 'w-6 bg-brand-600 shadow-xs' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
