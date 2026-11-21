import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { addToast } from '../../store/slices/uiSlice.js';
import api from '../../api/axios.js';
import { OFFICIAL_COURSES, IMPLEX_ORGANIZATION_INFO } from '../../data/coursesData.js';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Clock,
  Award,
  Sparkles,
  School,
  Building,
  Landmark,
  ShieldCheck,
  Send,
  FileText,
  Briefcase,
  Code,
  GraduationCap,
  QrCode,
  Mail,
} from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';

export default function ServicesPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const [activeCategory, setActiveCategory] = useState(() => searchParams.get('category') || 'all');
  const [activeMedium, setActiveMedium] = useState('all');
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const categories = [
    { id: 'all', label: 'All Courses' },
    { id: 'base', label: 'Base (5th–8th)', list: 'List-A' },
    { id: 'high_school', label: 'High School (9th–10th)', list: 'List-A' },
    { id: 'special_intermediate', label: '11th & 12th Special', list: 'List-B & C' },
    { id: 'integrated', label: 'IIT & NEET Integrated', list: 'List-B & C' },
    { id: 'competitive', label: 'Edu-Competition (Govt/Civil)', list: 'List-D & E' },
    { id: 'tech_skills', label: 'Coding & Tech Skills', list: 'List-F' },
    { id: 'professional', label: 'Professional Nourishment', list: 'List-H' },
  ];

  const filteredCourses = useMemo(() => {
    return OFFICIAL_COURSES.filter((course) => {
      // Category filter
      if (activeCategory !== 'all' && course.category !== activeCategory) {
        return false;
      }
      // Medium filter
      if (activeMedium !== 'all' && course.medium !== activeMedium) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          course.title.toLowerCase().includes(q) ||
          course.courseCode.toLowerCase().includes(q) ||
          course.stream.toLowerCase().includes(q) ||
          course.listCategory.toLowerCase().includes(q) ||
          course.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeCategory, activeMedium, searchQuery]);

  const handleOpenEnquiry = (course) => {
    setSelectedCourse(course);
    setFormData((prev) => ({
      ...prev,
      subject: `Admission Enquiry: ${course.title} (${course.courseCode})`,
      message: `I am interested in enrolling for ${course.title} (Fee: ₹${course.price.toLocaleString('en-IN')}). Please provide registration and batch schedule details.`,
    }));
    setEnquiryModalOpen(true);
  };

  const handleSubmitEnquiry = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/contact', formData);
      dispatch(
        addToast({
          type: 'success',
          message: 'Admission enquiry submitted successfully! Our representative will contact you.',
        })
      );
      setEnquiryModalOpen(false);
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
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header with Official Credentials */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Official Course Offerings & Statutory Price List (2024–25)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Academic Courses & <span className="gradient-text">Fee Schedule</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            <strong className="text-slate-800">IMPLEXEDU</strong> is an educational unit of{' '}
            <strong className="text-slate-800">I.C.International</strong>. Explore our standardized
            academic curricula for school foundation, board excellence, competitive entrance exams, and professional career nourishment.
          </p>

          {/* Statutory Verification Strip */}
          <div className="inline-flex flex-wrap items-center justify-center gap-4 p-3 bg-white rounded-2xl border border-slate-200 shadow-sm text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              TAN: <span className="font-mono font-bold text-slate-900">{IMPLEX_ORGANIZATION_INFO.tanNo}</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              PAN: <span className="font-mono font-bold text-slate-900">{IMPLEX_ORGANIZATION_INFO.panNo}</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">
              {IMPLEX_ORGANIZATION_INFO.adminOrderStamp}
            </span>
          </div>
        </div>

        {/* Search & Filters Control Bar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by course name, stream (PCM/PCB), or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
              />
            </div>

            {/* Medium Toggle */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-semibold">
              <span className="px-2 text-slate-500 font-normal">Medium:</span>
              <button
                type="button"
                onClick={() => setActiveMedium('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeMedium === 'all'
                    ? 'bg-white text-brand-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Mediums
              </button>
              <button
                type="button"
                onClick={() => setActiveMedium('English')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeMedium === 'English'
                    ? 'bg-white text-brand-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English Medium
              </button>
              <button
                type="button"
                onClick={() => setActiveMedium('Hindi')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeMedium === 'Hindi'
                    ? 'bg-white text-brand-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hindi Medium
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{cat.label}</span>
                {cat.list && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                      activeCategory === cat.id ? 'bg-brand-700 text-brand-100' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat.list}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count Banner */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong className="text-slate-800">{filteredCourses.length}</strong> official course offerings
          </span>
          <span className="text-slate-400">
            *Fees are subject to revision as per institutional regulations
          </span>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isCompetitive = course.category === 'competitive';
            const isIntegrated = course.category === 'integrated';
            const isTech = course.category === 'tech_skills';
            const accentBorder = isCompetitive
              ? 'border-t-4 border-t-amber-500'
              : isIntegrated
              ? 'border-t-4 border-t-rose-500'
              : isTech
              ? 'border-t-4 border-t-indigo-500'
              : 'border-t-4 border-t-brand-600';

            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                key={course.courseCode}
                className={`bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] hover-lift transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-brand-400 hover:shadow-xl ${accentBorder}`}
              >
                {/* Card Header & Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono font-bold">
                        {course.listCategory} • {course.courseCode}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
                        {course.title}
                      </h3>
                    </div>
                    <Badge variant={course.medium === 'Hindi' ? 'warning' : 'info'}>
                      {course.medium}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {course.description}
                  </p>

                  {/* Price Display */}
                  <div className="p-4 bg-gradient-to-r from-brand-50/80 via-indigo-50/40 to-slate-50 rounded-2xl border border-brand-100/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-brand-700 tracking-wider">
                        Subscription Fee
                      </span>
                      <div className="text-2xl font-black text-slate-900 tracking-tight">
                        ₹{course.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-slate-600">
                      <div className="font-bold text-slate-800">{course.duration}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{course.classDaysPerWeek} Days / Week</div>
                    </div>
                  </div>

                  {/* Course Specifications Matrix */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span className="truncate">Duration: <strong>{course.classDurationMinutes}m</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                      <Calendar className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span className="truncate">Daily: <strong>{course.classesPerDay} Classes</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Weekly Tests</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Study Notes</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Doubt Clearing</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Verified Cert</span>
                    </div>
                  </div>

                  {/* Extension Tag if available */}
                  {course.syllabusExtension && (
                    <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 leading-snug">
                      <strong className="font-bold">Extension:</strong> {course.syllabusExtension}
                    </div>
                  )}
                </div>

                {/* Card Footer Action */}
                <div className="p-4 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEnquiry(course)}
                    className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-2xs transition-all hover:scale-102 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>Enquire</span>
                  </button>
                  <Link
                    to={`/checkout/${course.courseCode}`}
                    className="btn-shine flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow-brand-500/25 transition-all hover:scale-102 active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5 text-white" />
                    <span>Pay via UPI</span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Institutional Tie-Up Services */}
        <div className="pt-12 border-t border-slate-200 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Institutional Partnerships & Affiliations
            </h2>
            <p className="text-sm text-slate-600">
              Implex Edu partners directly with educational institutions, providing centralized quiz leagues, academic audits, and teacher empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover-lift transition-all duration-300 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <School className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Schools (Classes 5 to 10)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standardized foundation testing, Olympiad training, entrance exam readiness, and school-wide performance tracking.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover-lift transition-all duration-300 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Colleges (11th, 12th & Degree)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Intermediate science, commerce, and arts curricula with integrated JEE & NEET tracks and negative-marking assessment rooms.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover-lift transition-all duration-300 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Universities & Competitive Wings</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                UPSC, State PCS, BPSC, Banking, UGC NET, and corporate nourishment batches with verifiable credential certification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Admission & Enquiry Modal */}
      <Modal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        title={selectedCourse ? `Course Enquiry: ${selectedCourse.title}` : 'Admission Enquiry'}
      >
        <div className="mb-4 p-3 bg-brand-50/70 rounded-xl border border-brand-100 text-xs text-brand-900">
          <p className="font-semibold">Interested in this course?</p>
          <p className="text-[11px] text-slate-600 mt-0.5">
            Leave your email and our academic team will share full batch details, schedule, and study materials.
          </p>
        </div>

        <form onSubmit={handleSubmitEnquiry} className="space-y-4">
          {selectedCourse && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{selectedCourse.title}</span>
                  <div className="text-slate-500 text-[11px]">
                    Code: {selectedCourse.courseCode} • {selectedCourse.medium} Medium • Fee: ₹{selectedCourse.price.toLocaleString('en-IN')}
                  </div>
                </div>
                <Link
                  to={`/checkout/${selectedCourse.courseCode}`}
                  className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold text-[11px] shadow-xs flex items-center gap-1 shrink-0"
                >
                  <QrCode className="w-3 h-3" /> Pay via UPI
                </Link>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Your Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="student@gmail.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name (Optional)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="e.g. Rahul Sharma"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Message / Notes</label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Provide any specific queries, student background, or preferred batch timings..."
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEnquiryModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Submitting...' : 'Send Enquiry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
