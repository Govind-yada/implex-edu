import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import { Award, CheckCircle2, XCircle, Clock, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Modal from '../../components/common/Modal.jsx';

export default function StudentResults() {
  const [attempts, setAttempts] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [attemptDetails, setAttemptDetails] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const [attRes, certRes] = await Promise.all([
        api.get('/quizzes/my-attempts'),
        api.get('/certificates/my-certificates'),
      ]);
      setAttempts(attRes.data.data || []);
      setCertificates(certRes.data.data || []);
    } catch (err) {
      console.error('Failed to load results:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = async (attempt) => {
    setSelectedAttempt(attempt);
    setReviewModalOpen(true);
    setLoadingDetails(true);
    try {
      const res = await api.get(`/quizzes/attempts/${attempt._id}`);
      setAttemptDetails(res.data.data);
    } catch (err) {
      console.error('Failed to load review details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="space-y-12 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Performance Results & Laurels</h2>
        <p className="text-xs text-slate-500 mt-1">
          Review your quiz attempt history, answer evaluations, and verifiable certificates.
        </p>
      </div>

      {loading ? (
        <Loader text="Loading your academic performance..." />
      ) : (
        <>
          {/* Certificates Showcase */}
          {certificates.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Earned Certificates of Distinction ({certificates.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                  <div
                    key={cert._id}
                    className="bg-gradient-to-tr from-amber-50/60 via-white to-brand-50/40 rounded-3xl p-6 border border-amber-200/80 shadow-card flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <Badge variant="amber">OFFICIAL CREDENTIAL</Badge>
                        <span className="text-[10px] font-mono text-slate-500">
                          {cert.certificateNumber}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900">{cert.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Conferred upon {cert.recipientName} on{' '}
                        {new Date(cert.issueDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-amber-100 flex items-center justify-between">
                      <Link
                        to={`/verify`}
                        className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verify Authenticity
                      </Link>

                      <span className="text-[10px] text-slate-400 font-mono">
                        Token: {cert.verificationToken}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quiz Attempts History Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Quiz Attempt History</h3>

            {attempts.length === 0 ? (
              <EmptyState
                title="No Quiz Records Yet"
                description="Start your first quiz challenge to populate your performance history."
                icon={Award}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3">Quiz Title</th>
                      <th className="pb-3">Score</th>
                      <th className="pb-3">Accuracy</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {attempts.map((att) => (
                      <tr key={att._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 font-bold text-slate-900">
                          {att.quiz?.title || 'Examination'}
                        </td>
                        <td className="py-3.5 font-semibold text-slate-700">
                          {att.score} / {att.totalMarksPossible}
                        </td>
                        <td className="py-3.5 font-bold text-brand-600">{att.percentage}%</td>
                        <td className="py-3.5">
                          <Badge variant={att.isPassed ? 'emerald' : 'rose'}>
                            {att.isPassed ? 'Passed' : 'Needs Review'}
                          </Badge>
                        </td>
                        <td className="py-3.5 text-slate-500">
                          {new Date(att.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => handleOpenReview(att)}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] transition-colors"
                          >
                            Review Answers
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Attempt Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Quiz Attempt Breakdown"
        maxWidth="max-w-2xl"
      >
        {loadingDetails ? (
          <Loader text="Loading question responses..." />
        ) : attemptDetails ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Score</p>
                <p className="text-lg font-extrabold text-slate-900">
                  {attemptDetails.attempt?.score} / {attemptDetails.attempt?.totalMarksPossible}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Correct</p>
                <p className="text-lg font-extrabold text-emerald-600">
                  {attemptDetails.attempt?.correctAnswersCount}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Result</p>
                <p className="text-lg font-extrabold text-brand-600">
                  {attemptDetails.attempt?.percentage}%
                </p>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {attemptDetails.submissions?.map((sub, idx) => (
                <div
                  key={sub._id}
                  className={`p-4 rounded-2xl border text-xs space-y-2 ${
                    sub.isCorrect
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-500">Question {idx + 1}</span>
                    <Badge variant={sub.isCorrect ? 'emerald' : 'rose'}>
                      {sub.isCorrect ? '+ Full Marks' : 'Incorrect'}
                    </Badge>
                  </div>
                  <p className="font-bold text-slate-900">{sub.question?.questionText}</p>
                  <p className="text-slate-600">
                    <span className="font-semibold text-slate-500">Your Answer: </span>
                    {sub.selectedOptionIndex >= 0
                      ? sub.question?.options[sub.selectedOptionIndex]?.text
                      : 'Unanswered'}
                  </p>
                  {sub.question?.explanation && (
                    <div className="p-2.5 bg-slate-100/80 rounded-xl text-slate-600 text-[11px]">
                      <span className="font-bold text-slate-800">Explanation: </span>
                      {sub.question?.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
