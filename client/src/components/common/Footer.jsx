import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Award,
  Globe,
  ArrowRight,
  BookOpen,
  Sparkles,
  LogIn,
  Tag,
  Headphones,
} from 'lucide-react';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile View: 3 Important Action Buttons (Highlighted prominently for mobile visitors) */}
        <div className="block sm:hidden mb-10 p-4 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Important Quick Links
              </span>
            </div>
            <span className="text-[10px] font-bold text-amber-300 px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30">
              Mobile Actions
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {/* Button 1: Explore Courses & Syllabus (60% OFF) */}
            <Link
              to="/services"
              className="btn-shine flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 text-white font-black text-xs shadow-md shadow-brand-500/25 active:scale-98 transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-white text-xs truncate">Explore Courses & Syllabus</span>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 shrink-0">
                      60% OFF
                    </span>
                  </div>
                  <p className="text-[10px] text-brand-200 font-medium truncate mt-0.5">
                    Bihar TRE, BPSC, UPSC & School
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white/80 shrink-0 ml-2" />
            </Link>

            {/* Button 2: Student & Teacher Portal Login */}
            <Link
              to="/login"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700/80 shadow-md active:scale-98 transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
                  <LogIn className="w-4 h-4 text-indigo-300" />
                </div>
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-white text-xs truncate">Student & Teacher Portal</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 shrink-0">
                      Login
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                    Access LMS, Mocks & Test Results
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
            </Link>

            {/* Button 3: Admission Support & Contact */}
            <Link
              to="/contact"
              className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-98 transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
                  <Phone className="w-4 h-4 text-emerald-200" />
                </div>
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-white text-xs truncate">Admission Support & Queries</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-400 text-slate-950 shrink-0">
                      24/7 Help
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-200 font-medium truncate mt-0.5">
                    Instant WhatsApp & Phone Assistance
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-200 shrink-0 ml-2" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  IMPLEX<span className="text-brand-500">EDU</span>
                </span>
                <span className="text-[10px] uppercase font-semibold text-brand-400 tracking-wider">
                  An educational unit of I.C.International
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Premier educational platform providing structured academic curricula, competitive examination preparation, and comprehensive learning opportunities.
            </p>

            {/* Platform Motto */}
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs space-y-1">
              <p className="text-xs font-semibold text-brand-400">Learn Today. Lead Tomorrow.</p>
              <p className="text-[11px] text-slate-400">Empowering learners with structured knowledge and skills.</p>
            </div>

            <div className="pt-1 flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-500" />
                <span>student@implexedu.in | contact@implexedu.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-500" />
                <span>www.implexedu.in</span>
              </div>
            </div>
          </div>

          {/* Educational Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services" className="hover:text-white hover:translate-x-1.5 transition-all duration-200 inline-block">
                  School Curriculum Hub
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white hover:translate-x-1.5 transition-all duration-200 inline-block">
                  Collegiate STEM Programs
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white hover:translate-x-1.5 transition-all duration-200 inline-block">
                  University Research Challenges
                </Link>
              </li>
              <li>
                <Link to="/quiz-awards" className="hover:text-white hover:translate-x-1.5 transition-all duration-200 inline-block">
                  Educational Competitions
                </Link>
              </li>
              <li>
                <Link to="/quiz-awards" className="hover:text-white hover:translate-x-1.5 transition-all duration-200 inline-block">
                  Quiz & Olympiads
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-white hover:translate-x-1.5 transition-all duration-200 inline-block">
                  About Implex Edu
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="hover:text-white hover:translate-x-1.5 transition-all duration-200 inline-block">
                  Academic Calendar
                </Link>
              </li>
              <li>
                <Link to="/quiz-awards" className="hover:text-white hover:translate-x-1.5 transition-all duration-200 inline-block">
                  Awards & Laurels
                </Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-white hover:translate-x-1.5 transition-all duration-200 inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Verify Certificate
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white hover:translate-x-1.5 transition-all duration-200 inline-block">
                  Inquiries & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutional Access */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4">
              Portal Access
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/login" className="hover:text-white hover:translate-x-1.5 transition-all duration-200 inline-block">
                  Teacher Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white hover:translate-x-1.5 transition-all duration-200 inline-block">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white hover:translate-x-1.5 transition-all duration-200 inline-block">
                  Associate Network
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white hover:translate-x-1.5 transition-all duration-200 inline-block text-brand-400 font-medium">
                  Register Institution
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Implex Edu Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-500" /> Secure 256-Bit SSL
            </span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
