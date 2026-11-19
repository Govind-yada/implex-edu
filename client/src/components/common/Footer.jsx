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
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <Link to="/services" className="hover:text-white transition-colors">
                  School Curriculum Hub
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Collegiate STEM Programs
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  University Research Challenges
                </Link>
              </li>
              <li>
                <Link to="/quiz-awards" className="hover:text-white transition-colors">
                  Educational Competitions
                </Link>
              </li>
              <li>
                <Link to="/quiz-awards" className="hover:text-white transition-colors">
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
                <Link to="/about" className="hover:text-white transition-colors">
                  About Implex Edu
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="hover:text-white transition-colors">
                  Academic Calendar
                </Link>
              </li>
              <li>
                <Link to="/quiz-awards" className="hover:text-white transition-colors">
                  Awards & Laurels
                </Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Verify Certificate
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
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
                <Link to="/login" className="hover:text-white transition-colors">
                  Teacher Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Associate Network
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors text-brand-400 font-medium">
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
    </footer>
  );
}
