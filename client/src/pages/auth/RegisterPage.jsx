import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../../store/slices/authSlice.js';
import { addToast } from '../../store/slices/uiSlice.js';
import { GraduationCap, User, Lock, Mail, Phone, Building, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [role, setRole] = useState('student'); // 'student' | 'teacher' | 'associate'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    institutionCode: '',
    gradeLevel: '',
    department: '',
    organizationName: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    const payload = {
      ...formData,
      role,
    };

    const resultAction = await dispatch(registerUser(payload));

    if (registerUser.fulfilled.match(resultAction)) {
      const responseData = resultAction.payload;
      if (responseData.user?.status === 'pending') {
        dispatch(
          addToast({
            type: 'info',
            message: 'Registration submitted! Your account is pending administrative approval.',
          })
        );
        navigate('/login');
      } else {
        dispatch(
          addToast({
            type: 'success',
            message: 'Registration successful! Welcome to Implex Edu.',
          })
        );
        switch (role) {
          case 'teacher':
            navigate('/teacher/dashboard');
            break;
          case 'student':
            navigate('/student/dashboard');
            break;
          case 'associate':
            navigate('/associate/dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } else {
      dispatch(
        addToast({
          type: 'error',
          message: resultAction.payload || 'Registration failed. Please check inputs.',
        })
      );
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-brand-50/50 via-white to-slate-50">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-card">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-accent-indigo flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Join the Implex Edu network as a Student, Teacher, or Institutional Associate
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`py-2.5 rounded-xl transition-all ${
              role === 'student' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            🎓 Student
          </button>
          <button
            type="button"
            onClick={() => setRole('teacher')}
            className={`py-2.5 rounded-xl transition-all ${
              role === 'teacher' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            👨‍🏫 Teacher
          </button>
          <button
            type="button"
            onClick={() => setRole('associate')}
            className={`py-2.5 rounded-xl transition-all ${
              role === 'associate' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            🤝 Associate
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="alex@institution.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Role specific inputs */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Institution Code (Optional)
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="e.g. SCH-OAK-01 or COL-APX-02"
                  value={formData.institutionCode}
                  onChange={(e) =>
                    setFormData({ ...formData, institutionCode: e.target.value.toUpperCase() })
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 uppercase font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                If your school or university is registered, enter its code to link your account.
              </p>
            </div>

            {role === 'student' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Course / Target Program
                  </label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="">Select your course stream (or enter below)</option>
                    <optgroup label="Intermediate (11th & 12th)">
                      <option value="11th PCM (English/Hindi)">11th PCM (Class 11 Science)</option>
                      <option value="11th PCB (English/Hindi)">11th PCB (Class 11 Science)</option>
                      <option value="11th PCM IIT Integrated">11th PCM IIT Integrated</option>
                      <option value="11th PCB NEET Integrated">11th PCB NEET Integrated</option>
                      <option value="12th PCM (English/Hindi)">12th PCM (Class 12 Science)</option>
                      <option value="12th PCB (English/Hindi)">12th PCB (Class 12 Science)</option>
                      <option value="12th PCM IIT Integrated">12th PCM IIT Integrated</option>
                      <option value="12th PCB NEET Integrated">12th PCB NEET Integrated</option>
                      <option value="Commerce (11th / 12th)">11th / 12th Commerce</option>
                      <option value="Arts / Humanities">11th / 12th Arts</option>
                    </optgroup>
                    <optgroup label="Base & High School">
                      <option value="5th / 6th Fundamental">5th / 6th Fundamental</option>
                      <option value="7th / 8th Advance">7th / 8th Advance</option>
                      <option value="9th / 10th Advance">9th / 10th Advance</option>
                    </optgroup>
                    <optgroup label="Edu-Competition">
                      <option value="BPSC / JPSC Prelims/Mains">BPSC / JPSC Civil Services</option>
                      <option value="UPSC Civil Services">UPSC Civil Services</option>
                      <option value="BPSC Teacher (0-5 / 6-8 / 9-10 / 11-12)">BPSC Teacher Recruitment</option>
                      <option value="C-TET / S-TET">C-TET / S-TET Preparation</option>
                      <option value="Banking (PO / Clerk)">Banking (PO / Clerk)</option>
                      <option value="NDA / CDS Defence">NDA / CDS Defence</option>
                    </optgroup>
                    <optgroup label="Tech & Skills">
                      <option value="Full-Stack / Coding">Advance Coding / Java / C++</option>
                      <option value="Professional Nourishment">HR / Marketing / CS Nourishment</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            )}

            {role === 'teacher' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Department / Subject Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science, Physics, Mathematics"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}

            {role === 'associate' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Organization / Foundation Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Regional STEM Alliance"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {loading ? 'Registering...' : `Register as ${role.replace('_', ' ')}`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-brand-600 font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
