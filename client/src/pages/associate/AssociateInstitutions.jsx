import React, { useState, useEffect } from 'react';
import api from '../../api/axios.js';
import { Building2, Search, MapPin, Mail, Phone, Globe } from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function AssociateInstitutions() {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const res = await api.get('/institutions');
      setInstitutions(res.data.data || []);
    } catch (err) {
      console.error('Failed to load institutions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = institutions.filter(
    (i) =>
      i.name?.toLowerCase().includes(search.toLowerCase()) ||
      i.code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Assigned Partner Institutions</h2>
        <p className="text-xs text-slate-500 mt-1">
          Review accredited schools, colleges, and universities within your regional coordination purview.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle">
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
          title="No Institutions Assigned"
          description="No partner institutions found matching your query."
          icon={Building2}
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
                  <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                    {inst.code}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">{inst.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {inst.description || 'Accredited educational institution.'}
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
                  {inst.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inst.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
