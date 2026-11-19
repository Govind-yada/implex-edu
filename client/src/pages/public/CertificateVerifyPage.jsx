import React, { useState } from 'react';
import api from '../../api/axios.js';
import { ShieldCheck, Search, Award, CheckCircle2, XCircle, Calendar, User, Building } from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';

export default function CertificateVerifyPage() {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.get(`/certificates/verify/${identifier.trim()}`);
      setResult(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Certificate record not found. Please ensure the token or certificate number is spelled accurately.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 pb-24">
      {/* Header */}
      <section className="bg-gradient-to-b from-brand-50/70 to-white pt-16 pb-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Badge variant="emerald" className="mb-4">Official Verification Registry</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Verify Certificate Authenticity
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed">
            Validate the legitimacy of Implex Edu credentials, Olympiad laurels, and quiz distinction
            certificates issued to students and educators.
          </p>

          {/* Search box */}
          <form onSubmit={handleVerify} className="mt-8 max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-card glow-card hover-lift-sm transition-all">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Enter Certificate Number (e.g. CERT-IMP-DEMO-2026)"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-shine px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {loading ? 'Verifying...' : 'Verify Credential'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Results / Verification Badge */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {result && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-300 shadow-xl glow-card-hover hover-lift relative overflow-hidden animate-in zoom-in-95 duration-300 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full pointer-events-none" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs animate-float">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Authentic & Verified
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Official Implex Edu Credential
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  Certificate Title
                </p>
                <p className="text-lg font-extrabold text-slate-900">{result.title}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
                    Conferred Upon
                  </p>
                  <p className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-brand-600" />
                    {result.recipientName}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
                    Certificate Code
                  </p>
                  <p className="text-base font-mono font-bold text-slate-900">
                    {result.certificateNumber}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
                    Issue Date
                  </p>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {new Date(result.issueDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
                    Institution Affiliation
                  </p>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-slate-400" />
                    {result.metadata?.institutionName || 'Implex Edu Academy'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 rounded-3xl p-8 border border-rose-200 text-center space-y-3">
            <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-lg font-bold text-rose-950">Verification Unsuccessful</h3>
            <p className="text-xs text-rose-700 max-w-md mx-auto">{error}</p>
          </div>
        )}
      </section>
    </div>
  );
}
