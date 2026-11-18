import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '../../store/slices/uiSlice.js';
import api from '../../api/axios.js';
import { MessageSquare, Search, CheckCircle2, Clock, Mail, Phone } from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function AdminEnquiries() {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [status, setStatus] = useState('pending');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact?limit=50');
      setMessages(res.data.data || []);
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (msg) => {
    setSelectedMsg(msg);
    setAdminNotes(msg.adminNotes || '');
    setStatus(msg.status || 'pending');
    setModalOpen(true);
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!selectedMsg) return;

    setSubmitting(true);
    try {
      await api.put(`/contact/${selectedMsg._id}/status`, {
        status,
        adminNotes,
      });
      dispatch(addToast({ type: 'success', message: 'Enquiry updated successfully!' }));
      setModalOpen(false);
      fetchMessages();
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          message: err.response?.data?.message || 'Failed to update enquiry.',
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Contact & Enquiry Management</h2>
        <p className="text-xs text-slate-500 mt-1">
          Review institutional inquiries, student questions, and partnership requests.
        </p>
      </div>

      {loading ? (
        <Loader text="Loading enquiries..." />
      ) : messages.length === 0 ? (
        <EmptyState
          title="No Messages"
          description="There are currently no contact enquiries submitted."
          icon={MessageSquare}
        />
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Sender Name</th>
                  <th className="pb-3">Email & Phone</th>
                  <th className="pb-3">Subject</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Received Date</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {messages.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 font-bold text-slate-900">{m.name}</td>
                    <td className="py-3.5 text-slate-600">
                      <div>{m.email}</div>
                      {m.phone && <div className="text-[11px] text-slate-400">{m.phone}</div>}
                    </td>
                    <td className="py-3.5 font-medium text-slate-800 line-clamp-1">{m.subject}</td>
                    <td className="py-3.5">
                      <Badge
                        variant={
                          m.status === 'resolved'
                            ? 'emerald'
                            : m.status === 'in_review'
                            ? 'amber'
                            : 'rose'
                        }
                      >
                        {m.status?.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-slate-500">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleOpenReview(m)}
                        className="px-3 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg font-bold text-[11px] transition-colors"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Review Enquiry Message"
        maxWidth="max-w-xl"
      >
        {selectedMsg && (
          <form onSubmit={handleSaveStatus} className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-slate-800">
                <span>{selectedMsg.name}</span>
                <span className="text-slate-500">{selectedMsg.email}</span>
              </div>
              <p className="font-bold text-slate-900 pt-1">{selectedMsg.subject}</p>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {selectedMsg.message}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Resolution Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="pending">Pending</option>
                <option value="in_review">In Review</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Administrative Notes
              </label>
              <textarea
                rows={3}
                placeholder="Internal notes regarding follow-up call or resolution..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                {submitting ? 'Saving...' : 'Update Enquiry'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
