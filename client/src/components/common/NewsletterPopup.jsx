import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, X, Sparkles, Bell, Tag } from 'lucide-react';
import api from '../../api/axios.js';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [basicNotifications, setBasicNotifications] = useState(true);
  const [specialOffers, setSpecialOffers] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [popupConfig, setPopupConfig] = useState({
    enabled: true,
    delaySeconds: 5,
    frequencyDays: 3,
    heading: 'Stay Connected with Implex Edu!',
    description:
      'Get the latest academic updates, new course announcements, important notifications and exclusive learning offers directly in your inbox.',
  });

  useEffect(() => {
    let timer;

    const checkAndShow = async () => {
      try {
        const res = await api.get('/email-subscriptions/popup-settings');
        if (res.data?.success && res.data.data) {
          setPopupConfig((prev) => ({ ...prev, ...res.data.data }));
          if (res.data.data.enabled === false) return;
        }
      } catch (err) {
        // Fallback to default config
      }

      const dismissedAt = localStorage.getItem('implex_popup_dismissed_at');
      if (dismissedAt) {
        const elapsedDays = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
        if (elapsedDays < (popupConfig.frequencyDays || 3)) {
          return;
        }
      }

      timer = setTimeout(() => {
        setIsOpen(true);
      }, (popupConfig.delaySeconds || 5) * 1000);
    };

    checkAndShow();

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('implex_popup_dismissed_at', Date.now().toString());
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    if (!basicNotifications && !specialOffers) {
      setError('Please choose at least one notification option.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/email-subscriptions/subscribe', {
        email,
        basicNotifications,
        specialOffers,
        source: 'homepage_popup',
      });
      setSubmitted(true);
      localStorage.setItem('implex_popup_dismissed_at', (Date.now() + 30 * 24 * 60 * 60 * 1000).toString());
      setTimeout(() => {
        setIsOpen(false);
      }, 3500);
    } catch (err) {
      setError(err.response?.data?.message || 'Subscription failed. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform animate-in zoom-in-95 duration-200">
        {/* Decorative Header Banner */}
        <div className="relative bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-600 p-6 sm:p-8 text-white text-center">
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Close popup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 mx-auto rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            {popupConfig.heading}
          </h3>
          <p className="text-xs sm:text-sm text-brand-100 mt-2 max-w-md mx-auto leading-relaxed">
            {popupConfig.description}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">You're Subscribed!</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Thank you for connecting with Implex Edu. We have registered your subscription preferences.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Your Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
                  />
                </div>
              </div>

              {/* Preferences Checkboxes */}
              <div className="space-y-2.5 pt-1">
                <label className="text-xs font-bold text-slate-700 uppercase block">
                  Subscription Options
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50/70 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={basicNotifications}
                    onChange={(e) => setBasicNotifications(e.target.checked)}
                    className="mt-0.5 rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-brand-600" /> Basic Educational Notifications
                    </span>
                    <span className="text-slate-500 block mt-0.5">
                      Academic schedules, batch updates, weekly test alerts & exam announcements.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50/70 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={specialOffers}
                    onChange={(e) => setSpecialOffers(e.target.checked)}
                    className="mt-0.5 rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" /> Special Offers and Promotions
                    </span>
                    <span className="text-slate-500 block mt-0.5">
                      Scholarship alerts, early-bird fee discounts & competition fee waivers.
                    </span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
              >
                {loading ? 'Subscribing...' : 'Subscribe Now'}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Continue browsing without subscribing
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
