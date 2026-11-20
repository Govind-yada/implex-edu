import React from 'react';
import { Link } from 'react-router-dom';
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
    <footer className="bg-slate-950 text-slate-300 pt-10 pb-20 md:pb-12 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile View: 3 Important Action Buttons Inside Footer (Compact Size) */}
        <div className="block md:hidden mb-6 p-3 rounded-xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400 animate-spin-slow" />
              <span className="text-[11px] font-black uppercase tracking-wider text-white">
                Quick Action Links
              </span>
            </div>
            <span className="text-[9px] font-bold text-amber-300 px-1.5 py-0.2 rounded-full bg-amber-400/15 border border-amber-400/30">
              Mobile Shortcuts
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {/* Button 1: Explore Courses & Syllabus (60% OFF) */}
            <Link
              to="/services"
              className="btn-shine flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 text-white font-bold text-[11px] shadow-sm active:scale-98 transition-all"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                  <BookOpen className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-white text-[11px] truncate">Explore Courses & Syllabus</span>
                    <span className="text-[8px] font-black px-1 py-0.2 rounded bg-amber-400 text-slate-950 shrink-0">
                      60% OFF
                    </span>
                  </div>
                  <p className="text-[9px] text-brand-200 font-medium truncate">
                    Bihar TRE, BPSC, UPSC, UPPSC & School
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-white/80 shrink-0 ml-1.5" />
            </Link>

            {/* Button 2: Student & Teacher Portal Login */}
            <Link
              to="/login"
              className="flex items-center justify-between p-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-white font-bold text-[11px] border border-slate-700/80 shadow-sm active:scale-98 transition-all"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-md bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
                  <LogIn className="w-3.5 h-3.5 text-indigo-300" />
                </div>
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-white text-[11px] truncate">Student & Teacher Portal</span>
                    <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 shrink-0">
                      Login
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-medium truncate">
                    Access LMS, Online Mocks & Results
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1.5" />
            </Link>

            {/* Button 3: Admission Support & Contact */}
            <Link
              to="/contact"
              className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white font-bold text-[11px] shadow-sm active:scale-98 transition-all"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5 text-emerald-200" />
                </div>
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-white text-[11px] truncate">Admission Support & Queries</span>
                    <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-emerald-400 text-slate-950 shrink-0">
                      24/7 Help
                    </span>
                  </div>
                  <p className="text-[9px] text-emerald-200 font-medium truncate">
                    Instant WhatsApp & Phone Assistance
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-200 shrink-0 ml-1.5" />
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

      {/* Sticky Mobile Bottom Bar: 3 Important Action Buttons (Compact Size, Always pinned to bottom on mobile screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] px-2 py-1">
        <div className="grid grid-cols-3 gap-1.5 max-w-xs mx-auto">
          {/* Button 1: Courses (60% OFF) */}
          <Link
            to="/services"
            className="flex flex-col items-center justify-center py-1 px-1 rounded-lg bg-gradient-to-b from-brand-600/30 to-brand-700/20 border border-brand-500/40 text-white active:scale-95 transition-all text-center shadow-xs"
          >
            <div className="relative">
              <BookOpen className="w-3.5 h-3.5 text-brand-400 mb-0.5" />
              <span className="absolute -top-1 -right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            </div>
            <span className="text-[10px] font-bold leading-tight text-white">Courses</span>
            <span className="text-[8px] font-extrabold text-amber-300">60% OFF</span>
          </Link>

          {/* Button 2: Student & Teacher Portal Login */}
          <Link
            to="/login"
            className="flex flex-col items-center justify-center py-1 px-1 rounded-lg bg-slate-900 border border-slate-700 text-white active:scale-95 transition-all text-center shadow-xs"
          >
            <LogIn className="w-3.5 h-3.5 text-indigo-400 mb-0.5" />
            <span className="text-[10px] font-bold leading-tight text-white">Portal</span>
            <span className="text-[8px] font-semibold text-slate-400">Login</span>
          </Link>

          {/* Button 3: Admission Helpline / Contact */}
          <Link
            to="/contact"
            className="flex flex-col items-center justify-center py-1 px-1 rounded-lg bg-gradient-to-b from-emerald-600/30 to-teal-700/20 border border-emerald-500/40 text-white active:scale-95 transition-all text-center shadow-xs"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400 mb-0.5" />
            <span className="text-[10px] font-bold leading-tight text-white">Support</span>
            <span className="text-[8px] font-semibold text-emerald-300">Helpline</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
