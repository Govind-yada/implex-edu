import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '../../store/slices/uiSlice.js';
import api from '../../api/axios.js';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';

export default function ContactPage() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      dispatch(addToast({ type: 'warning', message: 'Please fill in all required fields.' }));
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/contact', formData);
      setSubmitted(true);
      dispatch(
        addToast({
          type: 'success',
          message: 'Your enquiry has been received! Our educational team will get back to you shortly.',
        })
      );
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          message: err.response?.data?.message || 'Failed to submit enquiry. Please try again.',
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-24">
      {/* Header */}
      <section className="bg-gradient-to-b from-brand-50/70 to-white pt-16 pb-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Badge variant="blue" className="mb-4">Get In Touch</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Contact Implex Edu
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed">
            Have questions about institutional onboarding, quiz partnerships, or competition
            guidelines? Our team is ready to assist you.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Details Card */}
          <div className="bg-gradient-to-br from-slate-950 via-[#0a1a3e] to-slate-950 text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover-lift transition-all duration-300 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-3xl pointer-events-none" />
            <div className="space-y-6 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-900/60 border border-brand-700/50 text-[11px] font-bold text-brand-300 uppercase tracking-wider">
                Support & Admissions Desk
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Contact Information</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Connect directly with our educational support desk for institutional inquiries,
                technical help, and partnership proposals.
              </p>

              <div className="space-y-5 pt-4 text-xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-brand-600/25 border border-brand-500/40 text-brand-300 flex items-center justify-center shrink-0 shadow-xs">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">General Inquiries</p>
                    <p className="font-bold text-white text-sm">contact@implexedu.com</p>
                    <p className="text-[11px] text-slate-400">student@implexedu.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600/25 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0 shadow-xs">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Institutional Hotline</p>
                    <p className="font-bold text-white text-sm">+91 98765 43210</p>
                    <p className="text-[11px] text-slate-400">Toll Free: 1800-IMPLEX-EDU</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600/25 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0 shadow-xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Academic Headquarters</p>
                    <p className="font-bold text-white text-sm">
                      I.C. International Educational Hub
                    </p>
                    <p className="text-[11px] text-slate-400">Patna & New Delhi Centers</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800 text-[11px] text-slate-400 relative z-10 flex items-center justify-between">
              <span>Operating Hours: Mon - Sat</span>
              <span className="font-bold text-slate-300">8:00 AM - 8:00 PM IST</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] hover-lift transition-all duration-300">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Send an Enquiry</h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-8 leading-relaxed">
              Complete the form below and your message will be forwarded directly to the
              appropriate academic counseling department.
            </p>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-emerald-950">Message Sent Successfully!</h3>
                <p className="text-xs text-emerald-700 mt-1 max-w-sm mx-auto">
                  Thank you for reaching out. A confirmation has been logged in our system.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all bg-slate-50/50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all bg-slate-50/50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Admission / School Partnership"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Provide details about your institution, student count, or inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all bg-slate-50/50 focus:bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-shine w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-brand-500/25 hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
