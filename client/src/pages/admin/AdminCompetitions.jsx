import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '../../store/slices/uiSlice.js';
import api from '../../api/axios.js';
import { Trophy, Plus, Calendar, Users, Award, ShieldCheck } from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function AdminCompetitions() {
  const dispatch = useDispatch();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    guidelines: '',
    eligibilityCriteria: '',
    targetAudience: 'all',
    mode: 'online',
    venueDetails: '',
    registrationEndDate: '',
    competitionStartDate: '',
    maxParticipants: 500,
  });

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/competitions');
      setCompetitions(res.data.data || []);
    } catch (err) {
      console.error('Failed to load competitions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.registrationEndDate || !formData.competitionStartDate) {
      dispatch(addToast({ type: 'warning', message: 'Please complete all required date fields.' }));
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/competitions', formData);
      dispatch(addToast({ type: 'success', message: 'Competition created successfully!' }));
      setCreateModalOpen(false);
      setFormData({
        title: '',
        tagline: '',
        description: '',
        guidelines: '',
        eligibilityCriteria: '',
        targetAudience: 'all',
        mode: 'online',
        venueDetails: '',
        registrationEndDate: '',
        competitionStartDate: '',
        maxParticipants: 500,
      });
      fetchCompetitions();
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          message: err.response?.data?.message || 'Failed to create competition.',
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
          <h2 className="text-2xl font-extrabold text-slate-900">Competition Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Publish educational Olympiads, tournaments, registration deadlines, and guidelines.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Competition
        </button>
      </div>

      {loading ? (
        <Loader text="Loading competitions..." />
      ) : competitions.length === 0 ? (
        <EmptyState
          title="No Competitions"
          description="Click 'Create Competition' to publish your first tournament."
          icon={Trophy}
          actionText="Create Competition"
          onAction={() => setCreateModalOpen(true)}
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
                  <span className="text-xs text-slate-500 font-semibold">
                    Reg Closes: {new Date(comp.registrationEndDate).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 mb-2">{comp.title}</h3>
                <p className="text-xs text-brand-600 font-bold mb-3">{comp.tagline}</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">{comp.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="font-bold text-slate-800">
                  {comp.totalRegistered || 0} Registered Entries
                </span>
                <span>Starts: {new Date(comp.competitionStartDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Competition Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Publish Educational Competition"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Tournament Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. National Inter-School STEM Challenge 2026"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tagline</label>
            <input
              type="text"
              placeholder="Inspiring young innovators across schools and academies"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Format / Mode *
              </label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="online">Online Assessment</option>
                <option value="offline">Offline / On-Campus</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Max Participants
              </label>
              <input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Registration Deadline *
              </label>
              <input
                type="date"
                required
                value={formData.registrationEndDate}
                onChange={(e) => setFormData({ ...formData, registrationEndDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Competition Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.competitionStartDate}
                onChange={(e) =>
                  setFormData({ ...formData, competitionStartDate: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Description & Guidelines
            </label>
            <textarea
              rows={3}
              placeholder="Eligibility and competition guidelines..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              {submitting ? 'Publishing...' : 'Publish Tournament'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
