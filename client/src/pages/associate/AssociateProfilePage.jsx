import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToast } from '../../store/slices/uiSlice.js';
import { setUser } from '../../store/slices/authSlice.js';
import api from '../../api/axios.js';
import { User, Mail, Phone, Building, Save } from 'lucide-react';
import Loader from '../../components/common/Loader.jsx';

export default function AssociateProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [territoryOrRegion, setTerritoryOrRegion] = useState('');
  const [partnershipNotes, setPartnershipNotes] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      const u = res.data.data?.user;
      const p = res.data.data?.profile;
      setName(u?.name || '');
      setPhone(u?.phone || '');
      setOrganizationName(p?.organizationName || '');
      setTerritoryOrRegion(p?.territoryOrRegion || '');
      setPartnershipNotes(p?.partnershipNotes || '');
    } catch (err) {
      console.error('Failed to load associate profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.put('/auth/profile', {
        name,
        phone,
        organizationName,
        territoryOrRegion,
        partnershipNotes,
      });
      dispatch(
        setUser({
          user: res.data.data?.user,
          profile: res.data.data?.profile,
        })
      );
      dispatch(addToast({ type: 'success', message: 'Associate profile updated successfully!' }));
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          message: err.response?.data?.message || 'Failed to update profile.',
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading associate profile..." fullScreen />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Associate Partner Profile</h2>
        <p className="text-xs text-slate-500 mt-1">
          Update your organization liaison information and assigned territory.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-card">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  disabled
                  value={user?.email}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Direct Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Organization / Foundation Name
              </label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Assigned Regional Territory
            </label>
            <input
              type="text"
              placeholder="e.g. North American Eastern Educational District"
              value={territoryOrRegion}
              onChange={(e) => setTerritoryOrRegion(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Partnership & Coordination Notes
            </label>
            <textarea
              rows={3}
              placeholder="Active inter-school coordination programs..."
              value={partnershipNotes}
              onChange={(e) => setPartnershipNotes(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {submitting ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
