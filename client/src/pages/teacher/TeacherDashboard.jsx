import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../api/axios.js';
import {
  Users,
  FileQuestion,
  Trophy,
  Calendar,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  School,
} from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard.jsx';
import Badge from '../../components/common/Badge.jsx';
import Loader from '../../components/common/Loader.jsx';

export default function TeacherDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [myQuizzes, setMyQuizzes] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [meRes, quizRes, compRes, eventRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/quizzes'),
        api.get('/competitions?limit=3'),
        api.get('/events?limit=3'),
      ]);
      setProfile(meRes.data.data?.profile || {});
      setMyQuizzes(quizRes.data.data || []);
      setCompetitions(compRes.data.data || []);
      setEvents(eventRes.data.data || []);
    } catch (err) {
      console.error('Failed to load teacher dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Loading educator portal..." fullScreen />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-card">
        <div className="space-y-2">
          <Badge variant="blue" className="bg-brand-500/20 text-brand-200 border-brand-400/30">
            Faculty Workspace
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome, {user?.name}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {profile?.designation || 'Faculty Member'} •{' '}
            {profile?.department || 'Department of Instruction'}
          </p>
        </div>

        <Link
          to="/teacher/quizzes"
          className="px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Quiz
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Quizzes"
          value={myQuizzes.length}
          subtitle="Authored Quizzes"
          icon={FileQuestion}
          color="blue"
        />
        <StatCard
          title="Competitions"
          value={competitions.length}
          subtitle="Tournaments Tracked"
          icon={Trophy}
          color="amber"
        />
        <StatCard
          title="Assigned Students"
          value="48+"
          subtitle="Class Roster"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Scheduled Events"
          value={events.length}
          subtitle="This Month"
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* Main Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Managed Quizzes */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Quizzes & Assessments</h3>
              <p className="text-xs text-slate-500">Manage questions and examine submissions</p>
            </div>
            <Link
              to="/teacher/quizzes"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Manage Quizzes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {myQuizzes.slice(0, 4).map((q) => (
              <div
                key={q._id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{q.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {q.category} • {q.durationMinutes} mins • {q.questionsCount || 5} Questions
                  </p>
                </div>

                <Badge variant={q.status === 'published' ? 'emerald' : 'slate'}>
                  {q.status?.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Competitions Ticker */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Olympiads</h3>
            <Link
              to="/teacher/competitions"
              className="text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              View
            </Link>
          </div>

          <div className="space-y-3">
            {competitions.slice(0, 3).map((c) => (
              <div key={c._id} className="p-3.5 rounded-2xl border border-slate-100 space-y-1.5">
                <Badge variant="amber">{c.mode?.toUpperCase()}</Badge>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{c.title}</h4>
                <p className="text-[10px] text-slate-500">
                  Starts: {new Date(c.competitionStartDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
