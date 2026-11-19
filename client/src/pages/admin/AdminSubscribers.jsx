import React, { useState, useEffect } from 'react';
import api from '../../api/axios.js';
import { useDispatch } from 'react-redux';
import { addToast } from '../../store/slices/uiSlice.js';
import {
  Mail,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Download,
  Send,
  Trash2,
  Settings,
  Bell,
  Tag,
  Users,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';

export default function AdminSubscribers() {
  const dispatch = useDispatch();
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    verified: 0,
    basicNotifications: 0,
    specialOffers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });

  // Campaign Modal
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [targetCategory, setTargetCategory] = useState('basic');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignContent, setCampaignContent] = useState('');
  const [sendingCampaign, setSendingCampaign] = useState(false);

  // Popup Settings Modal
  const [popupModalOpen, setPopupModalOpen] = useState(false);
  const [popupSettings, setPopupSettings] = useState({
    enabled: true,
    delaySeconds: 5,
    frequencyDays: 3,
    heading: 'Stay Connected with Implex Edu!',
    description:
      'Get the latest academic updates, new course announcements, important notifications and exclusive learning offers directly in your inbox.',
  });
  const [savingPopup, setSavingPopup] = useState(false);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 15 };
      if (search.trim()) params.search = search.trim();
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (verifiedFilter !== 'all') params.verified = verifiedFilter;

      const res = await api.get('/email-subscriptions/admin', { params });
      if (res.data?.success) {
        setSubscribers(res.data.data.subscribers || []);
        setPagination(res.data.data.pagination || { pages: 1, total: 0 });
        if (res.data.data.stats) {
          setStats(res.data.data.stats);
        }
      }
    } catch (err) {
      dispatch(addToast({ type: 'error', message: 'Failed to load subscribers.' }));
    } finally {
      setLoading(false);
    }
  };

  const fetchPopupSettings = async () => {
    try {
      const res = await api.get('/email-subscriptions/popup-settings');
      if (res.data?.success && res.data.data) {
        setPopupSettings(res.data.data);
      }
    } catch (err) {
      // Keep defaults
    }
  };

  useEffect(() => {
    fetchSubscribers();
    fetchPopupSettings();
  }, [page, categoryFilter, statusFilter, verifiedFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchSubscribers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this subscriber?')) return;
    try {
      await api.delete(`/email-subscriptions/admin/${id}`);
      dispatch(addToast({ type: 'info', message: 'Subscriber removed.' }));
      fetchSubscribers();
    } catch (err) {
      dispatch(addToast({ type: 'error', message: 'Failed to remove subscriber.' }));
    }
  };

  const handleSendCampaign = async (e) => {
    e.preventDefault();
    if (!campaignSubject || !campaignContent) {
      dispatch(addToast({ type: 'warning', message: 'Subject and content are required.' }));
      return;
    }
    setSendingCampaign(true);
    try {
      const res = await api.post('/email-subscriptions/admin/campaign', {
        targetCategory,
        subject: campaignSubject,
        htmlContent: `<p>${campaignContent.replace(/\n/g, '<br/>')}</p>`,
      });
      if (res.data?.success) {
        dispatch(
          addToast({
            type: 'success',
            message: `Campaign broadcasted to ${res.data.data.sentCount} subscriber(s)!`,
          })
        );
        setCampaignModalOpen(false);
        setCampaignSubject('');
        setCampaignContent('');
      }
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.response?.data?.message || 'Failed to send campaign.' }));
    } finally {
      setSendingCampaign(false);
    }
  };

  const handleSavePopupSettings = async (e) => {
    e.preventDefault();
    setSavingPopup(true);
    try {
      const res = await api.put('/email-subscriptions/admin/popup-settings', popupSettings);
      if (res.data?.success) {
        dispatch(addToast({ type: 'success', message: 'Homepage popup settings updated!' }));
        setPopupModalOpen(false);
      }
    } catch (err) {
      dispatch(addToast({ type: 'error', message: 'Failed to save settings.' }));
    } finally {
      setSavingPopup(false);
    }
  };

  const handleExportCsv = () => {
    if (!subscribers.length) return;
    const headers = ['Email', 'Verified', 'Basic Notifications', 'Special Offers', 'Status', 'Subscribed Date'];
    const rows = subscribers.map((s) => [
      s.email,
      s.verified ? 'Yes' : 'No',
      s.basicNotifications ? 'Yes' : 'No',
      s.specialOffers ? 'Yes' : 'No',
      s.subscriptionStatus,
      new Date(s.createdAt).toISOString().split('T')[0],
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `implex_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Email Subscriber Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage public website email subscriptions, broadcast targeted campaigns, and configure homepage lead capture.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPopupModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Popup Settings</span>
          </button>
          <button
            type="button"
            onClick={() => setCampaignModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Campaign</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Subscribers</span>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-center justify-between">
            <span>{stats.total}</span>
            <Users className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Verified Emails</span>
          <div className="text-2xl font-black text-emerald-600 mt-1 flex items-center justify-between">
            <span>{stats.verified}</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Basic Notifications</span>
          <div className="text-2xl font-black text-brand-600 mt-1 flex items-center justify-between">
            <span>{stats.basicNotifications}</span>
            <Bell className="w-5 h-5 text-brand-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Special Offers Consent</span>
          <div className="text-2xl font-black text-accent-indigo mt-1 flex items-center justify-between">
            <span>{stats.specialOffers}</span>
            <Tag className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700"
          >
            <option value="all">All Subscription Types</option>
            <option value="basic">Basic Notifications Only</option>
            <option value="offers">Special Offers Only</option>
          </select>

          {/* Verified Filter */}
          <select
            value={verifiedFilter}
            onChange={(e) => {
              setVerifiedFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700"
          >
            <option value="all">All Verification States</option>
            <option value="true">Verified Only</option>
            <option value="false">Unverified Only</option>
          </select>

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="email"
            placeholder="Search email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </form>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading subscribers...</div>
        ) : subscribers.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No subscribers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Subscriber Email</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4">Preferences</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Subscribed Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {subscribers.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{s.email}</td>
                    <td className="py-3.5 px-4">
                      {s.verified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 space-x-1">
                      {s.basicNotifications && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                          Basic Notifications
                        </span>
                      )}
                      {s.specialOffers && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          Special Offers
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={s.subscriptionStatus === 'active' ? 'success' : 'neutral'}>
                        {s.subscriptionStatus}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(s._id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete Subscriber"
                      >
                        <Trash2 className="w-4 h-4" />
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

      {/* Campaign Broadcast Modal */}
      <Modal
        isOpen={campaignModalOpen}
        onClose={() => setCampaignModalOpen(false)}
        title="Broadcast Notification Campaign"
      >
        <form onSubmit={handleSendCampaign} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Target Audience (Consent Filter)
            </label>
            <select
              value={targetCategory}
              onChange={(e) => setTargetCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="basic">Basic Educational Notifications Only (Academic alerts & schedules)</option>
              <option value="special_offers">Special Offers & Promotions Only (Scholarships & fee waivers)</option>
              <option value="all">All Active Subscribers</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Email Subject Line
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Important Batch Schedule & Academic Calendar Update"
              value={campaignSubject}
              onChange={(e) => setCampaignSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Message Content
            </label>
            <textarea
              rows={5}
              required
              placeholder="Write your email announcement here..."
              value={campaignContent}
              onChange={(e) => setCampaignContent(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Note: An automated compliance unsubscribe link will be included at the bottom of every sent email.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setCampaignModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sendingCampaign}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-500/20 disabled:opacity-60 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {sendingCampaign ? 'Broadcasting...' : 'Send Campaign'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Popup Configuration Modal */}
      <Modal
        isOpen={popupModalOpen}
        onClose={() => setPopupModalOpen(false)}
        title="Homepage Subscription Popup Settings"
      >
        <form onSubmit={handleSavePopupSettings} className="space-y-4 text-xs">
          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={popupSettings.enabled}
              onChange={(e) => setPopupSettings({ ...popupSettings, enabled: e.target.checked })}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
            <span className="font-bold text-slate-800">Enable Subscription Popup on Homepage</span>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Display Delay (Seconds)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={popupSettings.delaySeconds}
                onChange={(e) => setPopupSettings({ ...popupSettings, delaySeconds: parseInt(e.target.value, 10) || 5 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Dismiss Interval (Days)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={popupSettings.frequencyDays}
                onChange={(e) => setPopupSettings({ ...popupSettings, frequencyDays: parseInt(e.target.value, 10) || 3 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Popup Heading
            </label>
            <input
              type="text"
              value={popupSettings.heading}
              onChange={(e) => setPopupSettings({ ...popupSettings, heading: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Popup Description
            </label>
            <textarea
              rows={3}
              value={popupSettings.description}
              onChange={(e) => setPopupSettings({ ...popupSettings, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setPopupModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingPopup}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-500/20 disabled:opacity-60"
            >
              {savingPopup ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
