import React, { useState, useEffect } from 'react';
import api from '../../api/axios.js';
import { useDispatch } from 'react-redux';
import { addToast } from '../../store/slices/uiSlice.js';
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Eye,
  ShieldCheck,
  AlertTriangle,
  FileText,
  DollarSign,
  User,
  Image,
} from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';

export default function AdminPayments() {
  const dispatch = useDispatch();
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenueVerified: 0,
    submittedCount: 0,
    pendingCount: 0,
    verifiedCount: 0,
    rejectedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });

  // Review modal
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [actionNotes, setActionNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/payments/admin', { params });
      if (res.data?.success) {
        setPayments(res.data.data.payments || []);
        setPagination(res.data.data.pagination || { pages: 1, total: 0 });
        if (res.data.data.stats) {
          setStats(res.data.data.stats);
        }
      }
    } catch (err) {
      dispatch(addToast({ type: 'error', message: 'Failed to load payments.' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPayments();
  };

  const handleOpenReview = (payment) => {
    setSelectedPayment(payment);
    setActionNotes(payment.adminNotes || '');
    setRejectionReason(payment.rejectionReason || '');
    setReviewModalOpen(true);
  };

  const handleVerify = async () => {
    if (!selectedPayment) return;
    setActionLoading(true);
    try {
      const res = await api.patch(`/payments/admin/${selectedPayment._id}/verify`, {
        adminNotes: actionNotes,
      });
      if (res.data?.success) {
        dispatch(addToast({ type: 'success', message: 'Payment verified and course enrollment activated!' }));
        setReviewModalOpen(false);
        fetchPayments();
      }
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.response?.data?.message || 'Verification failed.' }));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedPayment) return;
    if (!rejectionReason.trim()) {
      dispatch(addToast({ type: 'warning', message: 'Please provide a rejection reason for the student.' }));
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.patch(`/payments/admin/${selectedPayment._id}/reject`, {
        reason: rejectionReason,
        adminNotes: actionNotes,
      });
      if (res.data?.success) {
        dispatch(addToast({ type: 'info', message: 'Payment marked as rejected.' }));
        setReviewModalOpen(false);
        fetchPayments();
      }
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.response?.data?.message || 'Rejection failed.' }));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">UPI Payment Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Verify manual Google Pay / UPI QR bank settlements against merchant records before activating student access.
          </p>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Under Review (UTR Submitted)</span>
          <div className="text-2xl font-black text-amber-600 mt-1 flex items-center justify-between">
            <span>{stats.submittedCount}</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Verified Revenue</span>
          <div className="text-2xl font-black text-emerald-600 mt-1 flex items-center justify-between">
            <span>₹{stats.totalRevenueVerified.toLocaleString('en-IN')}</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Verified Payments</span>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-center justify-between">
            <span>{stats.verifiedCount}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Rejected / Suspicious</span>
          <div className="text-2xl font-black text-rose-600 mt-1 flex items-center justify-between">
            <span>{stats.rejectedCount}</span>
            <XCircle className="w-5 h-5 text-rose-400" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'submitted', label: 'Needs Review' },
            { id: 'pending', label: 'Pending Payment' },
            { id: 'verified', label: 'Verified' },
            { id: 'rejected', label: 'Rejected' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Order ID, UTR, or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </form>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading payment orders...</div>
        ) : payments.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No payment orders found matching this filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Course</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">UTR Reference</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{p.orderId}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(p.submittedAt || p.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block">{p.customerEmail}</span>
                      {p.customerName && <span className="text-[11px] text-slate-500">{p.customerName}</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-900 line-clamp-1">{p.courseTitle}</span>
                      <span className="text-[10px] font-mono text-slate-400">{p.courseCode}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold">
                      {p.utr ? (
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-800">{p.utr}</span>
                      ) : (
                        <span className="text-slate-400 italic">Not submitted</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          p.status === 'verified'
                            ? 'success'
                            : p.status === 'rejected'
                            ? 'error'
                            : p.status === 'submitted'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenReview(p)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold shadow-xs transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Page {page} of {pagination.pages}</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review & Verify Modal */}
      {selectedPayment && (
        <Modal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          title={`Review Payment: ${selectedPayment.orderId}`}
        >
          <div className="space-y-5 text-xs">
            {/* Payment Summary Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer Email:</span>
                <strong className="text-slate-900">{selectedPayment.customerEmail}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Course Name:</span>
                <strong className="text-slate-900">{selectedPayment.courseTitle}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payable Amount:</span>
                <strong className="text-brand-600 text-sm">₹{selectedPayment.amount.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer UTR / Ref:</span>
                <strong className="font-mono text-slate-900 bg-amber-100 px-2 py-0.5 rounded">
                  {selectedPayment.utr || 'None'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <span className="uppercase font-bold text-slate-700">{selectedPayment.status}</span>
              </div>
            </div>

            {/* Uploaded Screenshot Proof */}
            {selectedPayment.proofImageUrl && (
              <div className="space-y-1.5">
                <span className="font-bold text-slate-700 block">Uploaded Payment Screenshot:</span>
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-60 bg-slate-100 flex items-center justify-center p-2">
                  <img
                    src={selectedPayment.proofImageUrl}
                    alt="Payment Proof"
                    className="max-h-56 max-w-full rounded object-contain shadow-xs"
                  />
                </div>
              </div>
            )}

            {/* Verification Instructions Callout */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 leading-snug">
              <strong>Merchant Verification Warning:</strong> Cross-check the UTR with your Google Pay Business / Axis Bank merchant credit statement for <strong>Implex Cart International</strong>. Only click "Verify" once funds are confirmed in the bank.
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Internal Administrative Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="e.g. Verified in Axis bank settlement on 19/11/2026..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            {/* Rejection Reason (only needed if rejecting) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Rejection Reason (If rejecting transaction)
              </label>
              <input
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. UTR reference not found in bank statement..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleReject}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60"
              >
                <XCircle className="w-4 h-4" />
                Reject Submission
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleVerify}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {actionLoading ? 'Processing...' : 'Verify & Activate Course'}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
