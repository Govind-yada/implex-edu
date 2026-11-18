import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../api/axios.js';
import {
  BookOpen,
  Award,
  Trophy,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  FileQuestion,
} from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard.jsx';
import Badge from '../../components/common/Badge.jsx';
import Loader from '../../components/common/Loader.jsx';

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [meRes, attemptsRes, compRes, quizRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/quizzes/my-attempts'),
        api.get('/competitions/my-registrations'),
        api.get('/quizzes?limit=4'),
      ]);
      setProfileData(meRes.data.data?.profile || {});
      setAttempts(attemptsRes.data.data || []);
      setCompetitions(compRes.data.data || []);
      setQuizzes(quizRes.data.data || []);
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Loading your student workspace..." fullScreen />;
  }

  const totalAttempts = attempts.length;
  const passedAttempts = attempts.filter((a) => a.isPassed).length;
  const avgScore =
    totalAttempts > 0
      ? (attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / totalAttempts).toFixed(1)
      : profileData?.averageScore || 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-card">
        <div className="space-y-2">
          <Badge variant="blue" className="bg-brand-500/20 text-brand-200 border-brand-400/30">
            Student Scholar
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {profileData?.institution?.name || 'Academic Scholar'} •{' '}
            {profileData?.gradeLevel || 'Standard Track'}
          </p>
        </div>

        <Link
          to="/student/quizzes"
          className="px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <BookOpen className="w-4 h-4" />
          Attempt a Quiz
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Quizzes Attempted"
          value={totalAttempts}
          subtitle={`${passedAttempts} Quizzes Passed`}
          icon={FileQuestion}
          color="blue"
        />
        <StatCard
          title="Average Score"
          value={`${avgScore}%`}
          subtitle="Cumulative Accuracy"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Competitions"
          value={competitions.length}
          subtitle="Active Registrations"
          icon={Trophy}
          color="amber"
        />
        <StatCard
          title="Certificates"
          value={passedAttempts > 0 ? passedAttempts : 0}
          subtitle="Merit Honors Earned"
          icon={Award}
          color="purple"
        />
      </div>

      {/* Main Grids: Recent Attempts & Available Quizzes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Attempts */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Quiz Results</h3>
              <p className="text-xs text-slate-500">Your latest quiz submissions & scores</p>
            </div>
            <Link
              to="/student/results"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              All Results <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {attempts.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              No quizzes attempted yet. Try your first quiz from the right panel!
            </div>
          ) : (
            <div className="space-y-3">
              {attempts.slice(0, 5).map((att) => (
                <div
                  key={att._id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {att.quiz?.title || 'Academic Quiz'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Completed on {new Date(att.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-extrabold ${
                        att.isPassed ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {att.percentage}%
                    </span>
                    <Badge variant={att.isPassed ? 'emerald' : 'rose'}>
                      {att.isPassed ? 'Passed' : 'Needs Review'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Quizzes Shortcut */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Recommended Quizzes</h3>
            <Link
              to="/student/quizzes"
              className="text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              Browse
            </Link>
          </div>

          <div className="space-y-3">
            {quizzes.slice(0, 4).map((q) => (
              <div key={q._id} className="p-3.5 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="blue">{q.category}</Badge>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {q.durationMinutes}m
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{q.title}</h4>
                <Link
                  to={`/student/quizzes/room/${q._id}`}
                  className="w-full py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-xs font-bold text-center block transition-colors"
                >
                  Start Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
