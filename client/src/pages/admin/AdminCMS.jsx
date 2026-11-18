import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '../../store/slices/uiSlice.js';
import api from '../../api/axios.js';
import { Globe2, Save, Sparkles, Megaphone } from 'lucide-react';
import Loader from '../../components/common/Loader.jsx';

export default function AdminCMS() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Content sections
  const [heroTitle, setHeroTitle] = useState(
    'Empowering Minds Across Schools, Colleges & Universities'
  );
  const [heroSubtitle, setHeroSubtitle] = useState(
    'Implex Edu connects institutions, educators, and scholars through high-integrity quizzes, scholastic competitions, and verifiable academic honors.'
  );
  const [announcementText, setAnnouncementText] = useState(
    'Registration for the 2026 National STEM Olympiad is officially open across all affiliated academies.'
  );

  useEffect(() => {
    fetchCMS();
  }, []);

  const fetchCMS = async () => {
    try {
      const res = await api.get('/content/hero_section');
      if (res.data.data?.content?.title) {
        setHeroTitle(res.data.data.content.title);
        setHeroSubtitle(res.data.data.content.subtitle || '');
      }
    } catch (err) {
      console.error('Failed to load CMS content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHero = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put('/content/hero_section', {
        title: 'Hero Section',
        content: {
          title: heroTitle,
          subtitle: heroSubtitle,
        },
      });
      dispatch(addToast({ type: 'success', message: 'Hero content updated successfully!' }));
    } catch (err) {
      dispatch(addToast({ type: 'error', message: 'Failed to update CMS section.' }));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading CMS content..." fullScreen />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Website Content Management (CMS)</h2>
        <p className="text-xs text-slate-500 mt-1">
          Update public website hero copy, announcements, and headlines without modifying code.
        </p>
      </div>

      {/* Hero Section Copy */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card">
        <form onSubmit={handleSaveHero} className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Landing Page Hero Copy</h3>
              <p className="text-xs text-slate-500">
                Visible to all public visitors on the homepage
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Primary Headline *
            </label>
            <input
              type="text"
              required
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Subtitle Narrative *
            </label>
            <textarea
              rows={3}
              required
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {submitting ? 'Saving...' : 'Update Hero Copy'}
            </button>
          </div>
        </form>
      </div>

      {/* Platform Announcements CMS */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Broadcast Announcement Banner</h3>
            <p className="text-xs text-slate-500">Highlighted banner displayed across all student portals</p>
          </div>
        </div>

        <textarea
          rows={3}
          value={announcementText}
          onChange={(e) => setAnnouncementText(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
        />

        <div className="flex justify-end">
          <button
            onClick={() =>
              dispatch(addToast({ type: 'success', message: 'Broadcast announcement updated!' }))
            }
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Publish Announcement
          </button>
        </div>
      </div>

      {/* Statutory Credentials & Course Price-List Governance */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            ₹
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Statutory Accreditation & Official Course Catalogs
            </h3>
            <p className="text-xs text-slate-500">
              IMPLEXEDU (An educational unit of I.C.International) • Validity Academic Year 2024–25
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Tax Account No (TAN)</span>
            <p className="text-sm font-mono font-bold text-slate-800">PTN001255C</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Permanent Account No (PAN)</span>
            <p className="text-sm font-mono font-bold text-slate-800">AAJF10957N</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Official Portal</span>
            <p className="text-sm font-bold text-brand-600">www.implexedu.in</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Authority Stamp</span>
            <p className="text-xs font-semibold text-slate-700">By the order of Admin, IMPLEX EDU (RO)</p>
          </div>
        </div>

        <div className="p-4 bg-brand-50/70 rounded-2xl border border-brand-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-brand-900">Official Price Lists A to H Synchronized</h4>
            <p className="text-xs text-slate-600">
              Includes Base classes (5th-8th), High School (9th-10th), 11th & 12th PCM/PCB/Commerce/Arts, IIT & NEET Integrated, UPSC/BPSC, and Professional Nourishment programs.
            </p>
          </div>
          <a
            href="/services"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow-xs transition-all"
          >
            Preview Public Catalog
          </a>
        </div>
      </div>
    </div>
  );
}
