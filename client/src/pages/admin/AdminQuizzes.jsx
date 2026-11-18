import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '../../store/slices/uiSlice.js';
import api from '../../api/axios.js';
import { FileQuestion, Search, Clock, Trash2, CheckCircle2 } from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function AdminQuizzes() {
  const dispatch = useDispatch();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/quizzes?limit=50');
      setQuizzes(res.data.data || []);
    } catch (err) {
      console.error('Failed to load quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = quizzes.filter(
    (q) =>
      q.title?.toLowerCase().includes(search.toLowerCase()) ||
      q.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">System-Wide Quiz Management</h2>
        <p className="text-xs text-slate-500 mt-1">
          Monitor all examination repositories, question volumes, and passing parameters.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-subtle">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search quizzes by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold">{filtered.length} Quizzes Total</span>
      </div>

      {loading ? (
        <Loader text="Loading quiz inventory..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Quizzes Found"
          description="No quizzes matched your search query."
          icon={FileQuestion}
        />
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Total Marks</th>
                  <th className="pb-3">Passing %</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Author</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 font-bold text-slate-900">{q.title}</td>
                    <td className="py-3.5 text-slate-600">{q.category}</td>
                    <td className="py-3.5 text-slate-500">{q.durationMinutes} mins</td>
                    <td className="py-3.5 font-semibold text-slate-700">{q.totalMarks || 5}</td>
                    <td className="py-3.5 font-bold text-brand-600">{q.passingPercentage}%</td>
                    <td className="py-3.5">
                      <Badge variant={q.status === 'published' ? 'emerald' : 'slate'}>
                        {q.status?.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-slate-500">{q.createdBy?.name || 'Educator'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
