import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import { BookOpen, Clock, Search, ArrowRight } from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function StudentQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchQuizzes();
  }, [category]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const catParam = category !== 'all' ? `&category=${category}` : '';
      const res = await api.get(`/quizzes?status=published${catParam}`);
      setQuizzes(res.data.data || []);
    } catch (err) {
      console.error('Failed to load student quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Available Quizzes & Challenges</h2>
        <p className="text-xs text-slate-500 mt-1">
          Select a quiz to test your mastery. High scores earn official merit credentials.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-subtle">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'Science & Technology', 'Mathematics', 'General Knowledge'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Subjects' : cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader text="Loading quiz challenges..." />
      ) : filteredQuizzes.length === 0 ? (
        <EmptyState
          title="No Quizzes Found"
          description="There are currently no active quizzes matching your filter."
          icon={BookOpen}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
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
                  {quiz.description || 'Standard curriculum-aligned quiz.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500 font-medium">
                  <span>{quiz.questionsCount || 5} Questions</span> •{' '}
                  <span>{quiz.totalMarks || 5} Marks</span>
                </div>
                <Link
                  to={`/student/quizzes/room/${quiz._id}`}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  Start Quiz <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
