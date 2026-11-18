import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import {
  GraduationCap,
  Sparkles,
  Trophy,
  Award,
  BookOpen,
  Building,
  Users,
  ShieldCheck,
  Calendar,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  School,
  Landmark,
  BrainCircuit,
} from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';

export default function HomePage() {
  const [quizzes, setQuizzes] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [quizRes, compRes, eventRes] = await Promise.all([
        api.get('/quizzes?limit=3'),
        api.get('/competitions?limit=2'),
        api.get('/events?limit=3'),
      ]);
      setQuizzes(quizRes.data.data || []);
      setCompetitions(compRes.data.data || []);
      setEvents(eventRes.data.data || []);
    } catch (err) {
      console.error('Failed to fetch home preview data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-24 pb-24 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-brand-50/70 via-white to-slate-50">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-brand-400/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-accent-indigo/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-200/80 shadow-sm text-xs font-bold text-brand-700 animate-in fade-in slide-in-from-bottom-2">
              <Sparkles className="w-3.5 h-3.5 text-accent-amber" />
              <span>IMPLEXEDU — An Educational Unit of I.C.International</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Excellence in <span className="text-gradient">School, Board</span> & Competitive Batches
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Govt. Registered (TAN: <strong className="text-slate-800">PTN001255C</strong> | PAN: <strong className="text-slate-800">AAJF10957N</strong>). Offering structured 6-day base classes, 11th & 12th PCM/PCB/Commerce/Arts, IIT & NEET integrated programs, and Civil Services batches.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/25 transition-all active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                View Course Catalog & Fees
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 shadow-sm transition-all"
              >
                Online Student Admission
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* Micro stats banner */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-subtle text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-brand-600">3+</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">Institutional Tiers</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-subtle text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">100%</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">Verified Credentials</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-subtle text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-accent-indigo">Auto</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">Server Grading</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-subtle text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-500">24/7</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">Digital Access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INSTITUTIONAL TIERS (Schools, Colleges, Universities) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="blue" className="mb-2">Multi-Tier Integration</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Tailored Educational Solutions
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Structured platforms customized for every phase of scholarly development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Schools */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6">
              <School className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Schools & Academies</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Foundational science, mathematics, logic, and general knowledge quizzes tailored for
              grades 6 through 12, encouraging curiosity and early STEM interest.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 font-medium mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Inter-school science & math leagues
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Curriculum-aligned practice exams
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Verified merit certificates
              </li>
            </ul>
            <Link
              to="/services"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Learn about School Services <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Colleges */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card hover:-translate-y-1 transition-all duration-300 relative ring-2 ring-brand-500/20">
            <div className="absolute -top-3 right-8 bg-brand-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm">
              Popular
            </div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Building className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Colleges & Institutes</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Departmental quizzes, technical Olympiads, and competitive aptitude assessments for
              undergraduates preparing for professional and technical careers.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 font-medium mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Engineering & Computer Science tracks
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Automated negative marking & passing criteria
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Detailed percentile ranking reports
              </li>
            </ul>
            <Link
              to="/services"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Learn about College Services <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Universities */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
              <Landmark className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Universities & Research</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Inter-university research hackathons, symposiums, innovation tournaments, and
              multi-disciplinary scholarly award programs.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 font-medium mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Hybrid online & on-campus hackathons
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Team-based registrations & submissions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Institutional sponsorship & grant awards
              </li>
            </ul>
            <Link
              to="/services"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Learn about University Services <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. FEATURED QUIZZES & LIVE CHALLENGES */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider text-brand-400 uppercase">
                Scholastic Challenges
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-1">Available Quizzes & Tests</h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xl">
                Test your knowledge in real-time. Secure timer engines with automated result
                tabulation and instant merit recognition.
              </p>
            </div>
            <Link
              to="/quiz-awards"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-400 hover:text-brand-300"
            >
              View All Quizzes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between hover:border-brand-500 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded-lg text-xs font-bold uppercase tracking-wider">
                      {quiz.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {quiz.durationMinutes} mins
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{quiz.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {quiz.description || 'Test your proficiency with standardized questions.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    <span>{quiz.questionsCount || 5} Questions</span> •{' '}
                    <span>{quiz.totalMarks || 5} Marks</span>
                  </div>
                  <Link
                    to="/student/quizzes"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Start Quiz
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. UPCOMING COMPETITIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <Badge variant="amber" className="mb-2">Grand Competitions</Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Scholastic Competitions & Olympiads
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Represent your institution on regional and national stages.
            </p>
          </div>
          <Link
            to="/quiz-awards"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            All Competitions <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {competitions.map((comp) => (
            <div
              key={comp._id}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    {comp.mode?.toUpperCase()} TOURNAMENT
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Reg Closes: {new Date(comp.registrationEndDate).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">{comp.title}</h3>
                <p className="text-xs text-brand-600 font-semibold mb-3">{comp.tagline}</p>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">{comp.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">
                    {comp.totalRegistered || 0} Registered
                  </span>
                  <span>•</span>
                  <span>Max: {comp.maxParticipants}</span>
                </div>
                <Link
                  to="/quiz-awards"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  View Details & Register
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. AWARDS, CERTIFICATES & VERIFICATION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-700/60 border border-brand-500/30 text-xs font-bold text-brand-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Cryptographically Verified Honors
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Verifiable Certificates & Academic Laurels
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every certificate issued through Implex Edu carries a unique tamper-proof identifier.
              Institutions, admissions boards, and employers can verify academic authenticity
              instantly.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/verify"
                className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-sm font-bold shadow-md transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verify a Certificate Now
              </Link>
              <Link
                to="/quiz-awards"
                className="px-6 py-3 bg-brand-700/60 hover:bg-brand-700 text-white border border-brand-500/40 rounded-xl text-sm font-bold transition-all"
              >
                View Award Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION FOR INSTITUTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/80 rounded-3xl p-8 sm:p-12 border border-slate-200 text-center max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Ready to Connect Your Institution?
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Join secondary schools, engineering colleges, and universities already organizing
            inter-institutional challenges and evaluating academic progress on Implex Edu.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/contact"
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all"
            >
              Contact Educational Liaison
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm rounded-xl transition-all"
            >
              Institutional Signup
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
