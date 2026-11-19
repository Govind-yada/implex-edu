import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios.js';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Mail,
  Key,
} from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';

export default function PaymentStatusPage() {
  const { orderId } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = async () => {
    try {
      setRefreshing(true);
      const res = await api.get(`/payments/status/${orderId}`);
      if (res.data?.success) {
        setPayment(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch payment status.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <p className="text-sm text-slate-500 mt-1">{error || 'Unable to locate payment order.'}</p>
        <Link to="/services" className="mt-4 px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold">
          Browse Courses
        </Link>
      </div>
    );
  }

  const isVerified = payment.status === 'verified';
  const isSubmitted = payment.status === 'submitted' || payment.status === 'under_review';
  const isRejected = payment.status === 'rejected';

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-brand-50/40 via-white to-slate-50 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-card space-y-6">
        {/* Top Status Icon */}
        <div className="text-center space-y-3">
          {isVerified ? (
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
          ) : isRejected ? (
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-sm">
              <XCircle className="w-9 h-9" />
            </div>
          ) : (
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-sm animate-pulse">
              <Clock className="w-9 h-9" />
            </div>
          )}

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isVerified
              ? 'Payment Verified & Enrolled!'
              : isRejected
              ? 'Verification Unsuccessful'
              : 'Payment Submitted — Under Review'}
          </h2>

          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            {isVerified
              ? 'Your payment was successfully verified against our merchant records. Your course access is active.'
              : isRejected
              ? 'The submitted transaction reference could not be validated. Please contact support or re-check your UTR.'
              : 'Your transaction reference has been logged. Our admissions admin team is matching it against Axis merchant records.'}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500">Order ID:</span>
            <span className="font-mono font-bold text-slate-900">{payment.orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Course:</span>
            <span className="font-bold text-slate-900">{payment.courseTitle}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Amount:</span>
            <span className="font-bold text-slate-900">₹{payment.amount.toLocaleString('en-IN')}</span>
          </div>
          {payment.utr && (
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Submitted UTR / Ref:</span>
              <span className="font-mono text-slate-800">{payment.utr}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-1">
            <span className="text-slate-500">Current Status:</span>
            <Badge
              variant={
                isVerified
                  ? 'success'
                  : isRejected
                  ? 'error'
                  : 'warning'
              }
            >
              {payment.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* If Verified: Access Key box */}
        {isVerified && payment.accessKey && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-center">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Your Course Access Key
            </span>
            <div className="text-lg font-mono font-black text-emerald-900 tracking-wider">
              {payment.accessKey}
            </div>
            <p className="text-[11px] text-emerald-700">
              Save this key. You can also view materials directly in the services section.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {!isVerified && !isRejected && (
            <button
              type="button"
              onClick={fetchStatus}
              disabled={refreshing}
              className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Checking...' : 'Check Status Again'}</span>
            </button>
          )}

          <Link
            to="/services"
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Explore Course Catalog</span>
          </Link>

          <div className="text-center pt-2">
            <a
              href="mailto:student@implexedu.in"
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Need help? Contact student@implexedu.in</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
