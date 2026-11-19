import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logoutUser } from '../../store/slices/authSlice.js';
import {
  GraduationCap,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Sparkles,
  ArrowRight,
  Tag,
  Home,
  Info,
  BookOpen,
  Trophy,
  Calendar,
  Mail,
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Courses & Fees', path: '/services', icon: BookOpen },
    { name: 'Quiz & Awards', path: '/quiz-awards', icon: Trophy },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'super_admin':
        return '/admin/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      case 'student':
        return '/student/dashboard';
      case 'associate':
        return '/associate/dashboard';
      default:
        return '/';
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all duration-300 pt-2.5 sm:pt-0">
      {/* Subtle Top Brand Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-600 via-indigo-500 to-amber-400 opacity-90" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 group-hover:rotate-2 group-hover:shadow-brand-500/40 transition-all duration-300 ring-1 ring-white/30">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-float" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors leading-none">
                IMPLEX<span className="text-brand-600">EDU</span>
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-widest uppercase font-bold text-slate-400 group-hover:text-slate-500 transition-colors mt-0.5 sm:mt-1">
                Unit of I.C.International
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 bg-slate-100/60 p-1.5 rounded-2xl border border-slate-200/60">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'text-brand-600 bg-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action / Auth Button & 30% OFF Promo Button */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
            {/* 30% OFF Special Admission Pill Button (Near Login) */}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/services"
                className="btn-shine group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-indigo-500/10 hover:from-amber-500/20 hover:to-indigo-500/20 border border-brand-200 hover:border-brand-400 transition-all shadow-2xs"
                title="Special Admission Offer: Flat 30% OFF on all courses! Code: IMPLEX30"
              >
                <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wide shadow-xs">
                  30% OFF
                </span>
                <span className="hidden xl:inline text-xs font-bold text-slate-800">
                  Special Offer
                </span>
                <span className="font-mono text-[10px] text-brand-700 bg-white px-1.5 py-0.5 rounded-md border border-brand-200 font-bold">
                  IMPLEX30
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-600 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 shadow-2xs transition-all hover:scale-102 active:scale-95 cursor-pointer"
                >
                  <div className="w-7.5 h-7.5 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-bold text-slate-900 line-clamp-1 max-w-[100px]">
                      {user.name}
                    </p>
                    <p className="text-[9px] font-bold text-brand-600 uppercase">
                      {user.role?.replace('_', ' ')}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 origin-top-right"
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                      </div>

                      <Link
                        to={getDashboardPath()}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/login"
                    className="px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-brand-600 hover:bg-brand-50/70 rounded-xl transition-all inline-block"
                  >
                    Log In
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="btn-shine inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 rounded-xl shadow-md shadow-brand-500/20 hover:shadow-brand-500/35 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
                    <span>Get Started</span>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Right Controls: 30% OFF Capsule + Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-1.5">
            {/* Quick 30% OFF Mobile Button */}
            <Link
              to="/services"
              className="btn-shine inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[11px] shadow-sm active:scale-95 transition-all"
              title="30% OFF on all courses! Code: IMPLEX30"
            >
              <Tag className="w-3 h-3 text-slate-950 shrink-0" />
              <span>30% OFF</span>
            </Link>

            {/* Mobile Menu Hamburger Button with squircle frame */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-950 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 active:scale-95 transition-all cursor-pointer border border-slate-200/60"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Polished, App-Like & Charming) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="md:hidden border-b border-slate-200 bg-white/98 backdrop-blur-xl px-4 pt-2.5 pb-6 space-y-3.5 overflow-hidden shadow-2xl"
          >
            {/* Mobile Nav Links with App Icons */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? 'text-brand-600 bg-brand-50/90 shadow-2xs border border-brand-200/60'
                        : 'text-slate-700 hover:bg-slate-50 active:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-600" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Drawer Bottom Callout & Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              {/* Special Admission 30% OFF Card */}
              <Link
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-shine flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-500 via-brand-600 to-indigo-600 text-white font-bold text-xs shadow-md"
              >
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black text-[11px] shadow-xs">
                    30% OFF
                  </span>
                  <div className="text-left">
                    <p className="font-extrabold text-white leading-tight">Special Admission Offer</p>
                    <p className="text-[10px] text-amber-200 font-mono mt-0.5">Use Code: IMPLEX30</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>

              {isAuthenticated && user ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 bg-brand-600 text-white font-bold rounded-xl text-sm shadow-sm"
                  >
                    Open Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center py-2 text-rose-600 font-bold text-sm cursor-pointer"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-shine text-center py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:from-brand-700 hover:to-indigo-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
