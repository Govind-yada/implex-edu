import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToast } from '../../store/slices/uiSlice.js';
import api from '../../api/axios.js';
import {
  Trophy,
  BrainCircuit,
  Award,
  Search,
  Filter,
  ArrowRight,
  Clock,
  Calendar,
  CheckCircle2,
  Medal,
  Users,
  ShieldCheck,
} from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function QuizAwardsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('quizzes'); // 'quizzes' | 'competitions' | 'awards'
  const [quizzes, setQuizzes] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, [categoryFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const catQuery = categoryFilter !== 'all' ? `&category=${categoryFilter}` : '';
      const [quizRes, compRes] = await Promise.all([
        api.get(`/quizzes?limit=12${catQuery}`),
        api.get('/competitions?limit=12'),
      ]);
      setQuizzes(quizRes.data.data || []);
      setCompetitions(compRes.data.data || []);
    } catch (err) {
      console.error('Failed to load quiz & awards data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (quizId) => {
    if (!isAuthenticated) {
      dispatch(
        addToast({
          type: 'info',
          message: 'Please log in to start this quiz challenge and earn verifiable honors.',
        })
      );
      navigate('/login');
    } else {
      navigate('/student/quizzes');
    }
  };

  const awardCategories = [
    {
      title: 'Grand Gold Scholastic Trophy',
      recipient: 'National 1st Place Winners',
      desc: 'Awarded to top-ranking scholars and schools demonstrating supreme academic mastery across Olympiad finals.',
      badge: 'Gold Tier',
      icon: Trophy,
      color: 'amber',
    },
    {
      title: 'Distinction Certificate of Merit',
      recipient: 'Quiz Scores >= 75%',
      desc: 'Automatically generated and cryptographically issued to students who score with high honors on standardized quiz attempts.',
      badge: 'Merit Honors',
      icon: Award,
      color: 'blue',
    },
    {
      title: 'Inter-Collegiate Innovation Laurel',
      recipient: 'Top Research & Tech Teams',
      desc: 'Bestowed upon university and collegiate teams proposing breakthroughs in sustainable engineering and AI.',
      badge: 'Collegiate Honor',
      icon: Medal,
      color: 'purple',
    },
    {
      title: 'Institutional Academic Excellence Cup',
      recipient: 'Highest Performing Academies',
      desc: 'Annual championship awarded to the educational institution with the highest cumulative student participation and pass rate.',
      badge: 'Institutional',
      icon: ShieldCheck,
      color: 'emerald',
    },
  ];

  return (
    <div className="space-y-16 pb-24">
      {/* Header */}
      <section className="bg-gradient-to-b from-brand-50/70 to-white pt-16 pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Badge variant="amber" className="mb-4">Academic Arena</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Quizzes, Competitions & Laurels
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed">
            Participate in timed scholastic challenges, register for multi-stage educational
            Olympiads, and discover recognized academic laureates.
          </p>

          {/* Navigation Tabs */}
          <div className="mt-8 inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'quizzes'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Available Quizzes ({quizzes.length})
            </button>
            <button
              onClick={() => setActiveTab('competitions')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'competitions'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Competitions ({competitions.length})
            </button>
            <button
              onClick={() => setActiveTab('awards')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'awards'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Awards & Recognition
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <Loader text="Loading educational challenges..." fullScreen />
        ) : (
          <>
            {/* 1. QUIZZES TAB */}
            {activeTab === 'quizzes' && (
              <div className="space-y-8">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search quizzes by title or topic..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                    {['all', 'Science & Technology', 'Mathematics', 'General Knowledge'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                          categoryFilter === cat
                            ? 'bg-brand-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat === 'all' ? 'All Disciplines' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {quizzes.length === 0 ? (
                  <EmptyState
                    title="No Quizzes Available"
                    description="There are no published quizzes currently active in this category."
                    icon={BrainCircuit}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes
                      .filter((q) => q.title.toLowerCase().includes(search.toLowerCase()))
                      .map((quiz) => (
                        <div
                          key={quiz._id}
                          className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <Badge variant="blue">{quiz.category}</Badge>
                              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {quiz.durationMinutes} mins
                              </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-2">{quiz.title}</h3>
                            <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                              {quiz.description || 'Standardized curriculum-aligned assessment.'}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div className="text-xs text-slate-500 font-medium">
                              <span>{quiz.questionsCount || 5} Questions</span> •{' '}
                              <span>{quiz.totalMarks || 5} Marks</span>
                            </div>
                            <button
                              onClick={() => handleStartQuiz(quiz._id)}
                              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                            >
                              Attempt Quiz
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. COMPETITIONS TAB */}
            {activeTab === 'competitions' && (
              <div className="space-y-8">
                {competitions.length === 0 ? (
                  <EmptyState
                    title="No Competitions Listed"
                    description="Check back shortly for upcoming inter-institutional tournaments."
                    icon={Trophy}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {competitions.map((comp) => (
                      <div
                        key={comp._id}
                        className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-4">
                            <Badge variant="amber">{comp.mode?.toUpperCase()} TOURNAMENT</Badge>
                            <span className="text-xs text-slate-500 font-medium">
                              Reg Closes: {new Date(comp.registrationEndDate).toLocaleDateString()}
                            </span>
                          </div>

                          <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                            {comp.title}
                          </h3>
                          <p className="text-xs text-brand-600 font-bold mb-3">{comp.tagline}</p>
                          <p className="text-xs text-slate-600 leading-relaxed mb-6">
                            {comp.description}
                          </p>

                          {/* Guidelines */}
                          {comp.guidelines && (
                            <div className="p-4 bg-slate-50 rounded-2xl mb-6">
                              <p className="text-xs font-bold text-slate-700 mb-1">
                                Format & Guidelines:
                              </p>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {comp.guidelines}
                              </p>
                            </div>
                          )}

                          {/* Awards summary */}
                          {comp.awardsAndPrizes?.length > 0 && (
                            <div className="space-y-1.5 mb-6">
                              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Prizes & Laurels:
                              </p>
                              {comp.awardsAndPrizes.map((p, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs">
                                  <Medal className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                  <span className="font-bold text-slate-800">{p.rank}:</span>
                                  <span className="text-slate-600">{p.title}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span>{comp.totalRegistered || 0} Registered</span>
                          </div>
                          {isAuthenticated ? (
                            <Link
                              to="/student/competitions"
                              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                            >
                              Register Now
                            </Link>
                          ) : (
                            <Link
                              to="/login"
                              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
                            >
                              Log In to Register
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. AWARDS & RECOGNITION TAB */}
            {activeTab === 'awards' && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {awardCategories.map((cat, idx) => {
                    const Icon = cat.icon;
                    return (
                      <div
                        key={idx}
                        className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                            <Icon className="w-6 h-6" />
                          </div>
                          <Badge variant={cat.color} className="mb-2">
                            {cat.badge}
                          </Badge>
                          <h3 className="text-base font-bold text-slate-900 mb-1">{cat.title}</h3>
                          <p className="text-xs font-bold text-brand-600 mb-3">{cat.recipient}</p>
                          <p className="text-xs text-slate-600 leading-relaxed">{cat.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Certificate Verification Banner */}
                <div className="bg-gradient-to-tr from-brand-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <h3 className="text-2xl font-extrabold text-white">
                      Instant Certificate Verification Portal
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      All certificates granted for Olympiads and distinction scores contain an
                      immutable token. Enter the code to verify credential authenticity.
                    </p>
                  </div>
                  <Link
                    to="/verify"
                    className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Open Verification Portal
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
