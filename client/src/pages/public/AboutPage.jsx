import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Target,
  Compass,
  Lightbulb,
  CheckCircle2,
  ShieldCheck,
  Building2,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';

export default function AboutPage() {
  const objectives = [
    {
      title: 'Unified Scholastic Infrastructure',
      desc: 'Bridging schools, colleges, and higher research universities under a single coherent academic competition and evaluation framework.',
    },
    {
      title: 'High-Integrity Assessments',
      desc: 'Deploying server-side timers, automated objective grading, and fair evaluation algorithms to ensure equitable assessment.',
    },
    {
      title: 'Transparent Merit Recognition',
      desc: 'Delivering verifiable certificates and recognized honors that students and institutions can proudly present.',
    },
    {
      title: 'Collaborative Institutional Network',
      desc: 'Enabling educators and regional associates to coordinate inter-school and inter-collegiate events with minimal administrative friction.',
    },
  ];

  const reasons = [
    {
      title: 'Multi-Role Scoped Access',
      desc: 'Separate, tailored dashboards for Teachers, Students, Institutional Associates, and Super Admins eliminate confusion and enforce strict security boundaries.',
    },
    {
      title: 'Instant Server-Side Evaluation',
      desc: 'Students receive comprehensive result breakdowns with zero answer leaks during attempts and anti-cheat timer safeguards.',
    },
    {
      title: 'Verifiable Digital Credentials',
      desc: 'Unique verification codes allow third parties and admissions committees to authenticate awards and quiz honors directly.',
    },
    {
      title: 'Institutional Administration',
      desc: 'Effortlessly track member student performance, manage educator access, and monitor school-wide participation metrics.',
    },
  ];

  return (
    <div className="space-y-20 pb-24">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-brand-50/70 to-white pt-16 pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Badge variant="blue" className="mb-4">IMPLEXEDU — An Educational Unit of I.C.International</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Advancing Education Through Technology & Academic Integrity
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed">
            Implex Edu provides structured academic learning, competitive examination preparation, and educational opportunities designed to help learners build a stronger future.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600">
            <span className="px-3 py-1.5 rounded-full bg-slate-100 font-medium">
              6 Days Academic Structure
            </span>
            <span className="px-3 py-1.5 rounded-full bg-slate-100 font-medium">
              45-Minute Standard Periods
            </span>
            <span className="px-3 py-1.5 rounded-full bg-slate-100 font-medium">
              Weekly & Class Test Series
            </span>
            <span className="px-3 py-1.5 rounded-full bg-slate-100 font-medium">
              Full Revision Cycles
            </span>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Our Mission</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To provide a reliable, transparent, and scalable digital ecosystem that enables
              educational institutions of all levels to host high-integrity competitions, conduct
              comprehensive knowledge quizzes, and recognize scholarly achievement with verifiable
              distinction.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Our Vision</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To be the benchmark educational platform where students discover intellectual
              passion, teachers leverage powerful assessment tools, and institutions collaborate
              seamlessly to celebrate academic excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Educational Approach */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 overflow-hidden relative">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Pedagogical Framework
            </span>
            <h2 className="text-3xl font-extrabold text-white">Our Educational Approach</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We believe that healthy scholastic competition paired with immediate, constructive
              feedback accelerates learning. Our platform focuses on:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Formative & Summative Quizzing</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Carefully timed quizzes that reinforce core concepts while evaluating subject
                    mastery.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Fairness & Equal Opportunity</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Standardized test conditions and randomized question arrangements ensure fair
                    competition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Objectives */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="blue" className="mb-2">Key Targets</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Core Objectives</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {objectives.map((obj, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
              <span className="text-2xl font-black text-brand-600 mb-2 block">0{i + 1}</span>
              <h3 className="text-base font-bold text-slate-900 mb-2">{obj.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{obj.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Institutions Choose Implex Edu */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="emerald" className="mb-2">Institutional Advantages</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Why Institutions Choose Implex Edu
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reasons.map((r, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/80 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{r.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-50 border border-brand-200/60 rounded-3xl p-8 text-center max-w-3xl mx-auto space-y-4">
          <h3 className="text-2xl font-extrabold text-slate-900">Partner With Implex Edu</h3>
          <p className="text-sm text-slate-600">
            Learn how Implex Edu can support your school, college, or university with turnkey
            competition systems.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all"
          >
            Contact Our Team <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
