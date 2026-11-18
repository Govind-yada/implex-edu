import React, { useState, useEffect } from 'react';
import api from '../../api/axios.js';
import { Users, Search, GraduationCap } from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function AssociateStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin/users?role=student');
      setStudents(res.data.data || []);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Affiliated Student Network</h2>
        <p className="text-xs text-slate-500 mt-1">
          Track participating scholars registered under your partner institutional portfolio.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search student by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold">{filtered.length} Scholars</span>
      </div>

      {loading ? (
        <Loader text="Loading scholars..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Students Found"
          description="No students registered under this filter."
          icon={Users}
        />
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Enrolled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-600 font-bold flex items-center justify-center text-[10px]">
                        {s.name?.charAt(0).toUpperCase()}
                      </div>
                      {s.name}
                    </td>
                    <td className="py-3.5 text-slate-600">{s.email}</td>
                    <td className="py-3.5 text-slate-500">{s.phone || '—'}</td>
                    <td className="py-3.5">
                      <Badge variant={s.status === 'active' ? 'emerald' : 'amber'}>
                        {s.status?.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-slate-500">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
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
