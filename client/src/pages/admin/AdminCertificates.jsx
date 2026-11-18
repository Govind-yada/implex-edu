import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '../../store/slices/uiSlice.js';
import api from '../../api/axios.js';
import { Award, Plus, ShieldCheck, User, Search, Calendar } from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function AdminCertificates() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    userId: '',
    title: '',
    category: 'special_achievement',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data || []);
    } catch (err) {
      console.error('Failed to load users for cert issuing:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    if (!formData.userId || !formData.title) {
      dispatch(addToast({ type: 'warning', message: 'Please select a recipient and enter a title.' }));
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/certificates/issue', formData);
      dispatch(addToast({ type: 'success', message: 'Official certificate issued successfully!' }));
      setIssueModalOpen(false);
      setFormData({ userId: '', title: '', category: 'special_achievement' });
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          message: err.response?.data?.message || 'Failed to issue certificate.',
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Certificate & Laurels Authority</h2>
          <p className="text-xs text-slate-500 mt-1">
            Issue cryptographically authenticated credentials and merit honors.
          </p>
        </div>

        <button
          onClick={() => setIssueModalOpen(true)}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Confer Certificate
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Official Authenticity Protocol</h3>
            <p className="text-xs text-slate-500">
              Certificates automatically generate unique tokens queryable via the public verifier
              portal at <span className="font-mono text-brand-600">/verify</span>.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">Public Verification Gateway</span>
          <a
            href="/verify"
            target="_blank"
            rel="noreferrer"
            className="text-brand-600 font-bold hover:underline"
          >
            Open Verifier Interface →
          </a>
        </div>
      </div>

      {/* Issue Modal */}
      <Modal
        isOpen={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        title="Confer Official Academic Certificate"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleIssue} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Recipient User *
            </label>
            <select
              required
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Select Recipient Student or Faculty...</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email}) — {u.role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Certificate Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. National Science Olympiad — 1st Place Honors"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="competition_winner">Competition Winner</option>
              <option value="quiz_merit">Quiz Distinction Merit</option>
              <option value="competition_participation">Competition Participation</option>
              <option value="special_achievement">Special Scholastic Achievement</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIssueModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              {submitting ? 'Conferring...' : 'Issue Credential'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
