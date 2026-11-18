import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '../../store/slices/uiSlice.js';
import api from '../../api/axios.js';
import { Building2, Plus, Search, MapPin, Mail, Phone, Edit, Trash2 } from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function AdminInstitutions() {
  const dispatch = useDispatch();
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'school',
    description: '',
    email: '',
    phone: '',
    website: '',
    city: '',
    state: '',
    country: 'USA',
  });

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/institutions?limit=50');
      setInstitutions(res.data.data || []);
    } catch (err) {
      console.error('Failed to load institutions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      dispatch(addToast({ type: 'warning', message: 'Name and Code are required.' }));
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/institutions', {
        name: formData.name,
        code: formData.code.toUpperCase(),
        type: formData.type,
        description: formData.description,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        address: {
          city: formData.city,
          state: formData.state,
          country: formData.country,
        },
      });
      dispatch(addToast({ type: 'success', message: 'Institution added successfully!' }));
      setAddModalOpen(false);
      setFormData({
        name: '',
        code: '',
        type: 'school',
        description: '',
        email: '',
        phone: '',
        website: '',
        city: '',
        state: '',
        country: 'USA',
      });
      fetchInstitutions();
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          message: err.response?.data?.message || 'Failed to create institution.',
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this institution?')) return;
    try {
      await api.delete(`/institutions/${id}`);
      dispatch(addToast({ type: 'info', message: 'Institution deactivated.' }));
      fetchInstitutions();
    } catch (err) {
      dispatch(addToast({ type: 'error', message: 'Failed to deactivate institution.' }));
    }
  };

  const filtered = institutions.filter(
    (i) =>
      i.name?.toLowerCase().includes(search.toLowerCase()) ||
      i.code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Institution Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure participating Schools, Colleges, and Universities with unique institutional codes.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Institution
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-subtle">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by institution name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold">{filtered.length} Institutions</span>
      </div>

      {loading ? (
        <Loader text="Loading institutions..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Institutions"
          description="Click 'Add Institution' to enroll the first academy."
          icon={Building2}
          actionText="Add Institution"
          onAction={() => setAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((inst) => (
            <div
              key={inst._id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="blue">{inst.type?.toUpperCase()}</Badge>
                  <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                    {inst.code}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">{inst.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {inst.description || 'Educational academy enrolled on Implex Edu platform.'}
                </p>

                <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {inst.address?.city || 'City'}, {inst.address?.state || 'State'}
                    </span>
                  </div>
                  {inst.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inst.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Badge variant={inst.isActive ? 'emerald' : 'rose'}>
                  {inst.isActive ? 'Active' : 'Deactivated'}
                </Badge>
                {inst.isActive && (
                  <button
                    onClick={() => handleDeactivate(inst._id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Deactivate Institution"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Institution Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Enroll New Institution"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Institution Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Stanford Collegiate Academy"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Unique Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SCH-STN-01"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 uppercase font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Institution Tier *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="school">School (K-12)</option>
                <option value="college">College / Institute</option>
                <option value="university">University / Higher Ed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Contact Email
              </label>
              <input
                type="email"
                placeholder="admissions@institution.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City</label>
              <input
                type="text"
                placeholder="Boston"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">State</label>
              <input
                type="text"
                placeholder="MA"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Description / Profile
            </label>
            <textarea
              rows={2}
              placeholder="Institutional overview..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              {submitting ? 'Enrolling...' : 'Save Institution'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
