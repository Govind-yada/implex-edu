import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../api/axios.js';
import {
  Building2,
  Users,
  Trophy,
  BarChart3,
  ArrowRight,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard.jsx';
import Badge from '../../components/common/Badge.jsx';
import Loader from '../../components/common/Loader.jsx';

export default function AssociateDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [institutions, setInstitutions] = useState([]);
  const [competitions, setCompetitions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [meRes, instRes, compRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/institutions?limit=5'),
        api.get('/competitions?limit=3'),
      ]);
      setProfile(meRes.data.data?.profile || {});
      setInstitutions(instRes.data.data || []);
      setCompetitions(compRes.data.data || []);
    } catch (err) {
      console.error('Failed to load associate dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Loading associate partner portal..." fullScreen />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-card">
        <div className="space-y-2">
          <Badge variant="emerald" className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
            Institutional Associate
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome, {user?.name}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {profile?.organizationName || 'Regional Partner'} •{' '}
            {profile?.territoryOrRegion || 'Educational Liaison'}
          </p>
        </div>

        <Link
          to="/associate/institutions"
          className="px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <Building2 className="w-4 h-4" />
          View Institutions
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Associated Institutions"
          value={institutions.length}
          subtitle="Schools & Colleges"
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Student Network"
          value="180+"
          subtitle="Aggregated Enrollment"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Teachers Coordinated"
          value="16+"
          subtitle="Active Faculty Leads"
          icon={UserCheck}
          color="purple"
        />
        <StatCard
          title="Active Tournaments"
          value={competitions.length}
          subtitle="Regional Registrations"
          icon={Trophy}
          color="amber"
        />
      </div>

      {/* Main Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Associated Institutions List */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Assigned Institutions</h3>
              <p className="text-xs text-slate-500">Educational partner academies</p>
            </div>
            <Link
              to="/associate/institutions"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              All Institutions <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {institutions.slice(0, 4).map((inst) => (
              <div
                key={inst._id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{inst.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {inst.code} • {inst.address?.city || 'Campus'}, {inst.address?.country || 'USA'}
                  </p>
                </div>
                <Badge variant="blue">{inst.type?.toUpperCase()}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Coordinator Quick Tools</h3>
          <div className="space-y-3">
            <Link
              to="/associate/students"
              className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors block text-xs font-bold text-slate-800"
            >
              <span>View Student Roster</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link
              to="/associate/reports"
              className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors block text-xs font-bold text-slate-800"
            >
              <span>Download Participation Analytics</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link
              to="/calendar"
              className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors block text-xs font-bold text-slate-800"
            >
              <span>Academic Deadlines Calendar</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
