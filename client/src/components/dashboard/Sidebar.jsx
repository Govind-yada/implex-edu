import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSidebarOpen } from '../../store/slices/uiSlice.js';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  Building2,
  FileQuestion,
  Trophy,
  Award,
  MessageSquare,
  Globe2,
  Settings,
  Calendar,
  CheckSquare,
  BookOpen,
  UserCheck,
  BarChart3,
  X,
  User,
  CreditCard,
  Mail,
} from 'lucide-react';

export default function Sidebar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);

  const getNavItems = () => {
    switch (user?.role) {
      case 'super_admin':
        return [
          { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Users & Roles', path: '/admin/users', icon: Users },
          { name: 'Institutions', path: '/admin/institutions', icon: Building2 },
          { name: 'Quizzes', path: '/admin/quizzes', icon: FileQuestion },
          { name: 'Competitions', path: '/admin/competitions', icon: Trophy },
          { name: 'Certificates', path: '/admin/certificates', icon: Award },
          { name: 'UPI Payments', path: '/admin/payments', icon: CreditCard },
          { name: 'Subscribers', path: '/admin/subscribers', icon: Mail },
          { name: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
          { name: 'Website CMS', path: '/admin/cms', icon: Globe2 },
          { name: 'Settings', path: '/admin/settings', icon: Settings },
        ];
      case 'teacher':
        return [
          { name: 'Overview', path: '/teacher/dashboard', icon: LayoutDashboard },
          { name: 'Assigned Students', path: '/teacher/students', icon: Users },
          { name: 'Quiz Management', path: '/teacher/quizzes', icon: FileQuestion },
          { name: 'Competitions', path: '/teacher/competitions', icon: Trophy },
          { name: 'Calendar', path: '/calendar', icon: Calendar },
          { name: 'Teacher Profile', path: '/teacher/profile', icon: User },
        ];
      case 'student':
        return [
          { name: 'Overview', path: '/student/dashboard', icon: LayoutDashboard },
          { name: 'Browse Quizzes', path: '/student/quizzes', icon: BookOpen },
          { name: 'Competitions', path: '/student/competitions', icon: Trophy },
          { name: 'Results & Certificates', path: '/student/results', icon: Award },
          { name: 'Schedule Calendar', path: '/calendar', icon: Calendar },
          { name: 'My Profile', path: '/student/profile', icon: User },
        ];
      case 'associate':
        return [
          { name: 'Overview', path: '/associate/dashboard', icon: LayoutDashboard },
          { name: 'Institutions', path: '/associate/institutions', icon: Building2 },
          { name: 'Student Roster', path: '/associate/students', icon: UserCheck },
          { name: 'Analytics & Reports', path: '/associate/reports', icon: BarChart3 },
          { name: 'Calendar', path: '/calendar', icon: Calendar },
          { name: 'Associate Profile', path: '/associate/profile', icon: User },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 text-slate-300 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand header */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800/80">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-indigo flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-white">
                  IMPLEX <span className="text-brand-500">EDU</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider font-semibold text-brand-400">
                  {user?.role?.replace('_', ' ')}
                </span>
              </div>
            </Link>

            <button
              onClick={() => dispatch(setSidebarOpen(false))}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      dispatch(setSidebarOpen(false));
                    }
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom user badge */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
