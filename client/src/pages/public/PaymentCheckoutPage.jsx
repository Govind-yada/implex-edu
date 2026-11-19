import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { addToast } from '../../store/slices/uiSlice.js';
import api from '../../api/axios.js';
import { OFFICIAL_COURSES } from '../../data/coursesData.js';
import {
  GraduationCap,
  QrCode,
  Copy,
  Check,
  Download,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  Upload,
  CreditCard,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function PaymentCheckoutPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Resolved course from catalog or DB
  const course = OFFICIAL_COURSES.find(
    (c) => c.courseCode.toUpperCase() === (courseId || '').toUpperCase()
  );

  // Checkout Step: 1 = Email Details, 2 = QR & UTR Submission, 3 = Submitted
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Customer Contact Info (Supports guest)
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');

  // Order Details from Backend
  const [orderData, setOrderData] = useState(null);

  // UTR submission form
  const [utr, setUtr] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [submittingProof, setSubmittingProof] = useState(false);

  const MERCHANT_UPI = '7859088239@okbizaxis';
  const MERCHANT_NAME = 'Implex Cart International';

  useEffect(() => {
    if (user?.email && !customerEmail) {
      setCustomerEmail(user.email);
    }
  }, [user]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(MERCHANT_UPI);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    dispatch(addToast({ type: 'info', message: 'UPI ID copied to clipboard!' }));
  };

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = '/images/upi-payment-qr.jpg';
    link.download = 'Implex-Edu-UPI-QR.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Step 1: Create Payment Order
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!customerEmail) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/payments/create-order', {
        courseCode: course ? course.courseCode : courseId,
        customerEmail,
        customerName,
        customerPhone,
      });

      if (res.data?.success) {
        setOrderData(res.data.data);
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate checkout order.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit UTR Reference
  const handleSubmitReference = async (e) => {
    e.preventDefault();
    if (!utr || utr.trim().length < 6) {
      setError('Please enter a valid 12-digit UPI transaction reference / UTR.');
      return;
    }

    setSubmittingProof(true);
    setError('');

    const formData = new FormData();
    formData.append('orderId', orderData.orderId);
    formData.append('customerEmail', orderData.customerEmail);
    formData.append('utr', utr.trim());
    formData.append('amount', orderData.amount);
    if (screenshotFile) {
      formData.append('proofImage', screenshotFile);
    }

    try {
      const res = await api.post('/payments/submit-reference', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        dispatch(
          addToast({
            type: 'success',
            message: 'Payment details submitted! Under administrative review.',
          })
        );
        navigate(`/payment/status/${orderData.orderId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit payment reference.');
    } finally {
      setSubmittingProof(false);
    }
  };

  if (!course && !orderData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Course Not Found</h2>
        <p className="text-sm text-slate-500 mt-1">Please select a valid course from our catalog.</p>
        <Link to="/services" className="mt-4 px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold">
          Back to Courses
        </Link>
      </div>
    );
  }

  const courseTitle = orderData?.courseTitle || course?.title;
  const coursePrice = orderData?.amount || course?.price || 0;
  const originalPrice = orderData?.originalPrice || course?.price || 0;
  const discount = orderData?.discount || 0;

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-brand-50/40 via-white to-slate-50">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link to="/services" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1.5">
            ← Back to Course Catalog
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure 256-Bit SSL Checkout</span>
          </div>
        </div>

        {/* Checkout Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Course Summary & Payment Breakdown */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card hover-lift transition-all duration-300 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Course Enrollment
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{courseTitle}</h3>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Code:</span>
                <strong className="font-mono text-slate-900">{course?.courseCode || orderData?.courseCode}</strong>
              </div>
              <div className="flex justify-between">
                <span>Medium:</span>
                <strong className="text-slate-900">{course?.medium || 'English'}</strong>
              </div>
              <div className="flex justify-between">
                <span>Weekly Schedule:</span>
                <strong className="text-slate-900">6 Days / Week (45 mins)</strong>
              </div>
              <div className="flex justify-between">
                <span>Assessment:</span>
                <strong className="text-slate-900">Weekly Test Series Included</strong>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Original Course Fee</span>
                <span>₹{originalPrice.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Special Discount</span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-100 pt-2">
                <span>Final Payable Amount</span>
                <span className="text-brand-600">₹{coursePrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Merchant Details Box */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl text-xs space-y-1.5 glow-card">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Authorized Merchant Details</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Merchant Name: <strong>{MERCHANT_NAME}</strong>
              </p>
              <div className="flex items-center justify-between text-[11px] pt-1 font-mono">
                <span>UPI ID: <strong>{MERCHANT_UPI}</strong></span>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer hover:scale-105 active:scale-95 transition-all"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Payment Actions (Step 1 or Step 2) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card hover-lift transition-all duration-300 space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.form
                  key="step-1"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  onSubmit={handleCreateOrder}
                  className="space-y-5"
                >
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Step 1: Contact Details</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Provide your email to receive your course access key and verification receipt. No account required.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="student@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Course access instructions will be delivered directly to this address.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                        Full Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Student Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 9876543210"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                  >
                    {loading ? 'Generating Order...' : 'Continue to Payment QR'}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.form>
              )}

              {step === 2 && orderData && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="space-y-6"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md">
                        Order ID: {orderData.orderId}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Awaiting Payment
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">
                      Step 2: Scan QR & Enter UTR Reference
                    </h3>
                  </div>

                  {/* Important Instructions Box */}
                  <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed space-y-1">
                    <strong>Instructions:</strong>
                    <p>
                      Scan the QR code using Google Pay, PhonePe, Paytm or any supported UPI application. Verify the merchant name (<strong>{MERCHANT_NAME}</strong>) and amount (<strong>₹{orderData.amount}</strong>) before completing your payment.
                    </p>
                  </div>

                  {/* QR Display Card */}
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 text-center space-y-4 hover-lift glow-card transition-all duration-300">
                    <div className="relative inline-block bg-white p-3 rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
                      <img
                        src="/images/upi-payment-qr.jpg"
                        alt="Google Pay UPI Payment QR - Implex Cart International"
                        className="w-64 h-auto max-h-[340px] mx-auto rounded-xl object-contain shadow-xs"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 shadow-xs flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy UPI ID ({MERCHANT_UPI})</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadQr}
                        className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 shadow-xs flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download QR</span>
                      </button>
                    </div>
                  </div>

                  {/* Payment Reference Submission Form */}
                  <form onSubmit={handleSubmitReference} className="space-y-4 pt-2">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Submit Payment Confirmation
                      </h4>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          UPI Transaction Reference / 12-Digit UTR *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 423456789012 or UPI Ref"
                          value={utr}
                          onChange={(e) => setUtr(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                        />
                        <p className="text-[11px] text-slate-500 mt-1">
                          Located in your GPay / PhonePe / Paytm transaction receipt details.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Payment Screenshot (Optional Proof)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setScreenshotFile(e.target.files[0])}
                          className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Anti-fraud security notice */}
                    <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-900 leading-snug">
                      <strong>Payment Verification Policy:</strong> Your submission will be placed in pending review. Our admissions team validates the UTR against merchant settlement records before issuing access.
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={submittingProof}
                      className="btn-shine w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                    >
                      {submittingProof ? 'Submitting Details...' : 'Submit Payment Details for Verification'}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
