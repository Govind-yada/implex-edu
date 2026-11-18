import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '../../store/slices/uiSlice.js';
import api from '../../api/axios.js';
import { Trophy, Calendar, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function StudentCompetitions() {
  const dispatch = useDispatch();
  const [competitions, setCompetitions] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComp, setSelectedComp] = useState(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCompetitionData();
  }, []);

  const fetchCompetitionData = async () => {
    setLoading(true);
    try {
      const [allCompRes, myRegRes] = await Promise.all([
        api.get('/competitions'),
        api.get('/competitions/my-registrations'),
      ]);
      setCompetitions(allCompRes.data.data || []);
      setMyRegistrations(myRegRes.data.data || []);
    } catch (err) {
      console.error('Failed to load competition data:', err);
    } finally {
      setLoading(false);
    }
  };

  const isRegistered = (compId) => {
    return myRegistrations.some((reg) => reg.competition?._id === compId || reg.competition === compId);
  };

  const handleOpenRegister = (comp) => {
    setSelectedComp(comp);
    setTeamName('');
    setRegisterModalOpen(true);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComp) return;

    setSubmitting(true);
    try {
      await api.post(`/competitions/${selectedComp._id}/register`, { teamName });
      dispatch(
        addToast({
          type: 'success',
          message: `Successfully registered for ${selectedComp.title}!`,
        })
      );
      setRegisterModalOpen(false);
      fetchCompetitionData();
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          message: err.response?.data?.message || 'Registration failed.',
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Competitions & Olympiads</h2>
        <p className="text-xs text-slate-500 mt-1">
          Compete on national and collegiate stages, represent your institution, and win grants and honors.
        </p>
      </div>

      {loading ? (
        <Loader text="Loading competitions..." />
      ) : competitions.length === 0 ? (
        <EmptyState
          title="No Competitions Listed"
          description="There are currently no active competitions scheduled."
          icon={Trophy}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {competitions.map((comp) => {
            const registered = isRegistered(comp._id);
            return (
              <div
                key={comp._id}
                className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <Badge variant="amber">{comp.mode?.toUpperCase()} TOURNAMENT</Badge>
                    <span className="text-xs text-slate-500 font-medium">
                      Closes: {new Date(comp.registrationEndDate).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">{comp.title}</h3>
                  <p className="text-xs text-brand-600 font-bold mb-3">{comp.tagline}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">{comp.description}</p>

                  {comp.guidelines && (
                    <div className="p-4 bg-slate-50 rounded-2xl mb-6">
                      <p className="text-xs font-bold text-slate-700 mb-1">Guidelines:</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{comp.guidelines}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{comp.totalRegistered || 0} Registered</span>
                  </div>

                  {registered ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOpenRegister(comp)}
                      className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      Register Now <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Registration Modal */}
      <Modal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        title={selectedComp?.title || 'Competition Registration'}
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <p className="text-xs text-slate-600">
            Confirm your entry for this scholastic competition. You will receive an official entry
            registration token.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Team / Entry Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Oakridge Innovators Team"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setRegisterModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              {submitting ? 'Registering...' : 'Confirm Registration'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
