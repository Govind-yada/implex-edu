import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import {
  Users,
  Building2,
  FileQuestion,
  Trophy,
  Award,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Activity,
  UserCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import StatCard from '../../components/dashboard/StatCard.jsx';
import Badge from '../../components/common/Badge.jsx';
import Loader from '../../components/common/Loader.jsx';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const chartData = [
    { name: 'Mon', attempts: 32, users: 12 },
    { name: 'Tue', attempts: 54, users: 19 },
    { name: 'Wed', attempts: 68, users: 24 },
    { name: 'Thu', attempts: 85, users: 31 },
    { name: 'Fri', attempts: 110, users: 42 },
    { name: 'Sat', attempts: 94, users: 38 },
    { name: 'Sun', attempts: 128, users: 50 },
  ];

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const res = await api.get('/admin/overview');
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to load admin overview:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Loading administrative system metrics..." fullScreen />;
  }

  const counts = data?.counts || {};

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-brand-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-card">
        <div className="space-y-2">
          <Badge variant="blue" className="bg-brand-500/20 text-brand-300 border-brand-400/30">
            Platform Master Console
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Super Administrator</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            System status: Operational • All educational services running normally
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/admin/users"
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/settings"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            Settings
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={counts.totalUsers || 0}
          subtitle={`${counts.totalStudents || 0} Students • ${counts.totalTeachers || 0} Teachers`}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Institutions"
          value={counts.totalInstitutions || 0}
          subtitle="Schools, Colleges, Univ"
          icon={Building2}
          color="indigo"
        />
        <StatCard
          title="Quizzes & Attempts"
          value={counts.totalAttempts || 0}
          subtitle={`${counts.totalQuizzes || 0} Quizzes Published`}
          icon={FileQuestion}
          color="emerald"
        />
        <StatCard
          title="Competitions"
          value={counts.totalCompetitions || 0}
          subtitle={`${counts.totalRegistrations || 0} Registered Entries`}
          icon={Trophy}
          color="amber"
        />
      </div>

      {/* Main Charts & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Engagement Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Platform Activity Surge</h3>
              <p className="text-xs text-slate-500">Live examination submissions vs user signups</p>
            </div>
            <Badge variant="emerald">Live Stream</Badge>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="attempts"
                  name="Quiz Attempts"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorAttempts)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Registered Users */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Signups</h3>
            <Link
              to="/admin/users"
              className="text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentUsers?.map((u) => (
              <div
                key={u._id}
                className="p-3 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
              >
                <div className="truncate">
                  <p className="font-bold text-slate-900 truncate">{u.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase">{u.role?.replace('_', ' ')}</p>
                </div>
                <Badge variant={u.status === 'active' ? 'emerald' : 'amber'}>
                  {u.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
