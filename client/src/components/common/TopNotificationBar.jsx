import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Tag, ArrowRight, X } from 'lucide-react';

export default function TopNotificationBar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('implex_promo_banner_dismissed');
    if (isDismissed === 'true') {
      setVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('implex_promo_banner_dismissed', 'true');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          aria-label="Promotional Announcement"
          className="relative z-50 bg-gradient-to-r from-brand-800 via-indigo-700 to-brand-700 text-white shadow-sm overflow-hidden"
        >
          {/* Subtle background animated glow */}
          <div className="absolute inset-0 bg-white/5 opacity-50 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
              {/* Offer Content */}
              <div className="flex-1 flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] tracking-wide uppercase shadow-xs animate-pulse">
                  <Tag className="w-3 h-3 text-slate-950" />
                  <span>30% OFF</span>
                </span>

                <span className="font-medium text-slate-100 text-center sm:text-left text-xs sm:text-sm">
                  <strong className="font-extrabold text-white">Special Academic Offer:</strong> Flat{' '}
                  <span className="text-amber-300 font-bold underline decoration-amber-400/50">30% OFF</span> on all school, board & competitive courses!
                  <span className="hidden md:inline text-slate-200">
                    {' '}Use Code: <span className="font-mono bg-white/15 px-1.5 py-0.5 rounded text-amber-200 font-bold">IMPLEX30</span>
                  </span>
                </span>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/services"
                    className="btn-shine inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white text-brand-800 hover:bg-brand-50 font-extrabold text-xs shadow-xs transition-all shrink-0"
                  >
                    <span>Claim 30% Off</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </motion.div>
              </div>

              {/* Dismiss button */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss 30% off promotion"
                className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                title="Dismiss announcement"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
