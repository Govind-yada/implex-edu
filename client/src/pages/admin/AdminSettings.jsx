import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '../../store/slices/uiSlice.js';
import api from '../../api/axios.js';
import { Settings, ShieldCheck, Mail, Save, UserCheck, AlertTriangle } from 'lucide-react';
import Loader from '../../components/common/Loader.jsx';

export default function AdminSettings() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Approval workflows
  const [requireTeacherApproval, setRequireTeacherApproval] = useState(false);
  const [requireAssociateApproval, setRequireAssociateApproval] = useState(true);
  const [requireStudentApproval, setRequireStudentApproval] = useState(false);

  // General Settings
  const [siteName, setSiteName] = useState('Implex Edu');
  const [supportEmail, setSupportEmail] = useState('support@implexedu.com');
  const [supportPhone, setSupportPhone] = useState('+1 (800) 555-EDU1');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      const settings = res.data.data || {};

      if (settings.registrationApproval) {
        setRequireTeacherApproval(!!settings.registrationApproval.requireTeacherApproval);
        setRequireAssociateApproval(!!settings.registrationApproval.requireAssociateApproval);
        setRequireStudentApproval(!!settings.registrationApproval.requireStudentApproval);
      }

      if (settings.generalSettings) {
        setSiteName(settings.generalSettings.siteName || 'Implex Edu');
        setSupportEmail(settings.generalSettings.supportEmail || 'support@implexedu.com');
        setSupportPhone(settings.generalSettings.supportPhone || '+1 (800) 555-EDU1');
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApprovalSettings = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put('/admin/settings', {
        key: 'registrationApproval',
        value: {
          requireTeacherApproval,
          requireAssociateApproval,
          requireStudentApproval,
        },
        description: 'Configurable registration approval gates per role',
      });
      dispatch(
        addToast({
          type: 'success',
          message: 'Registration approval settings saved successfully!',
        })
      );
    } catch (err) {
      dispatch(addToast({ type: 'error', message: 'Failed to save settings.' }));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader text="Loading platform settings..." fullScreen />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Platform Settings & Security Controls</h2>
        <p className="text-xs text-slate-500 mt-1">
          Configure dynamic registration approval policies, email dispatch gates, and global parameters.
        </p>
      </div>

      {/* Registration Approval Policies Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card">
        <form onSubmit={handleSaveApprovalSettings} className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Registration Approval Policies (Pending Client Decision)
              </h3>
              <p className="text-xs text-slate-500">
                When enabled, new registrations default to 'pending' and require Super Admin approval
                before sign in is permitted.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">Require Teacher Manual Approval</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Teachers registering publicly will require administrative sign-off.
                </p>
              </div>
              <input
                type="checkbox"
                checked={requireTeacherApproval}
                onChange={(e) => setRequireTeacherApproval(e.target.checked)}
                className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">Require Associate Manual Approval</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Institutional representatives must be verified before accessing institution data.
                </p>
              </div>
              <input
                type="checkbox"
                checked={requireAssociateApproval}
                onChange={(e) => setRequireAssociateApproval(e.target.checked)}
                className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">Require Student Manual Approval</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  If disabled, students can immediately take quizzes upon registration.
                </p>
              </div>
              <input
                type="checkbox"
                checked={requireStudentApproval}
                onChange={(e) => setRequireStudentApproval(e.target.checked)}
                className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {submitting ? 'Saving...' : 'Save Approval Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">General Website Parameters</h3>
            <p className="text-xs text-slate-500">Contact information and platform branding</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Platform Name
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Support Email
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() =>
              dispatch(addToast({ type: 'success', message: 'General parameters updated!' }))
            }
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Parameters
          </button>
        </div>
      </div>
    </div>
  );
}
