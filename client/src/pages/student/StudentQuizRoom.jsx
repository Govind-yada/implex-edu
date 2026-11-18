import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToast } from '../../store/slices/uiSlice.js';
import api from '../../api/axios.js';
import confetti from 'canvas-confetti';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Award,
  BookOpen,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';

export default function StudentQuizRoom() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [quizDetails, setQuizDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attemptStarted, setAttemptStarted] = useState(false);
  const [attemptData, setAttemptData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: selectedOptionIndex }
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    fetchQuizInfo();
  }, [quizId]);

  // Timer countdown hook
  useEffect(() => {
    if (!attemptStarted || !attemptData || timeLeft <= 0 || result) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [attemptStarted, attemptData, timeLeft, result]);

  const fetchQuizInfo = async () => {
    try {
      const res = await api.get(`/quizzes/${quizId}`);
      setQuizDetails(res.data.data?.quiz);
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          message: err.response?.data?.message || 'Failed to load quiz details.',
        })
      );
      navigate('/student/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleStartAttempt = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/quizzes/${quizId}/start`);
      const data = res.data.data;
      setAttemptData(data);

      // Calculate time left in seconds based on server expiry timestamp
      const serverExpiry = new Date(data.timeLimitExpiresAt).getTime();
      const remainingSeconds = Math.max(0, Math.floor((serverExpiry - Date.now()) / 1000));
      setTimeLeft(remainingSeconds);

      setAttemptStarted(true);
      dispatch(addToast({ type: 'info', message: 'Quiz started! Timer is now active.' }));
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          message: err.response?.data?.message || 'Unable to start quiz attempt.',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleAutoSubmit = () => {
    dispatch(
      addToast({
        type: 'warning',
        message: 'Time has expired! Automatically submitting your answers...',
      })
    );
    executeSubmission();
  };

  const executeSubmission = async () => {
    if (submitting || !attemptData) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/quizzes/${quizId}/submit`, {
        attemptId: attemptData.attemptId,
        answers,
      });
      const resData = res.data.data;
      setResult(resData);
      setConfirmModalOpen(false);

      if (resData.isPassed) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
        dispatch(
          addToast({
            type: 'success',
            message: `Congratulations! You passed with ${resData.percentage}%!`,
          })
        );
      } else {
        dispatch(
          addToast({
            type: 'info',
            message: `Attempt submitted. Your score is ${resData.percentage}%.`,
          })
        );
      }
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          message: err.response?.data?.message || 'Failed to submit quiz attempt.',
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader text="Preparing examination room..." fullScreen />;
  }

  // PRE-QUIZ INSTRUCTIONS VIEW
  if (!attemptStarted && !result) {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-card space-y-6">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="blue">{quizDetails?.category}</Badge>
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {quizDetails?.durationMinutes} Minutes Duration
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {quizDetails?.title}
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed">
            {quizDetails?.description ||
              'This standardized assessment tests proficiency in the indicated subject area.'}
          </p>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Exam Rules & Instructions:
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                This quiz has a strict timer of {quizDetails?.durationMinutes} minutes.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Passing criteria: Minimum {quizDetails?.passingPercentage}% required to pass.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                {quizDetails?.allowNegativeMarking
                  ? `Negative marking is ACTIVE: -${quizDetails?.negativeMarkValue * 100}% on incorrect answers.`
                  : 'Negative marking is DISABLED: No penalties for incorrect guesses.'}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Scores above 75% automatically receive an authenticated Certificate of Merit.
              </li>
            </ul>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <Link
              to="/student/quizzes"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              onClick={handleStartAttempt}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              I Am Ready — Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // POST-QUIZ RESULT VIEW
  if (result) {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-card text-center space-y-6">
          <div
            className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
              result.isPassed ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}
          >
            {result.isPassed ? (
              <CheckCircle2 className="w-10 h-10" />
            ) : (
              <XCircle className="w-10 h-10" />
            )}
          </div>

          <div>
            <Badge variant={result.isPassed ? 'emerald' : 'rose'} className="mb-2">
              {result.isPassed ? 'EXAMINATION PASSED' : 'RETEST RECOMMENDED'}
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-900">{quizDetails?.title}</h2>
            <p className="text-xs text-slate-500 mt-1">Official Server-Side Evaluation Report</p>
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Score</p>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                {result.score} / {result.totalMarksPossible}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Percentage</p>
              <p
                className={`text-xl font-extrabold mt-0.5 ${
                  result.isPassed ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {result.percentage}%
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Correct</p>
              <p className="text-xl font-extrabold text-emerald-600 mt-0.5">
                {result.correctAnswersCount}
              </p>
            </div>
          </div>

          {result.certificate && (
            <div className="p-4 bg-gradient-to-r from-amber-50 to-brand-50 rounded-2xl border border-amber-200/60 text-left flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-amber-500 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Certificate of Merit Conferred!
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Credential #{result.certificate.certificateNumber}
                  </p>
                </div>
              </div>
              <Link
                to="/student/results"
                className="px-3 py-1.5 bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-xl text-xs font-bold shadow-sm whitespace-nowrap"
              >
                View Laurels
              </Link>
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/student/results"
              className="w-full sm:w-auto px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              View My Performance History
            </Link>
            <Link
              to="/student/quizzes"
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              Browse Other Quizzes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE ATTEMPT ROOM
  const questions = attemptData?.questions || [];
  const currentQuestion = questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isTimeCritical = timeLeft < 120; // less than 2 mins

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Top Bar: Title & Countdown Timer */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 truncate max-w-xs sm:max-w-md">
            {attemptData.quizTitle}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Countdown Pill */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-extrabold font-mono transition-colors ${
            isTimeCritical
              ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
              : 'bg-brand-50 text-brand-700 border-brand-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Main Examination Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-card space-y-8">
        {/* Question Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Question {currentIndex + 1}</span>
            <span>Marks: {currentQuestion?.marks || 1} pt</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {currentQuestion?.questionText}
          </h3>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQuestion?.options?.map((opt, optIdx) => {
            const isSelected = answers[currentQuestion._id] === optIdx;
            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(currentQuestion._id, optIdx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20 text-brand-950 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 text-slate-700'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold transition-colors ${
                    isSelected
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-slate-300 text-slate-500'
                  }`}
                >
                  {String.fromCharCode(65 + optIdx)}
                </div>
                <span className="text-sm leading-relaxed">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmModalOpen(true)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>

      {/* Question Navigator Grid */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-subtle space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Question Navigator</span>
          <span className="text-slate-400 font-medium">
            {Object.keys(answers).length} of {questions.length} Answered
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const hasAnswer = answers[q._id] !== undefined;
            const isCurrent = currentIndex === idx;
            return (
              <button
                key={q._id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                  isCurrent
                    ? 'ring-2 ring-brand-600 bg-brand-600 text-white'
                    : hasAnswer
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Final Submission"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            You have answered{' '}
            <strong className="text-slate-900">{Object.keys(answers).length}</strong> out of{' '}
            <strong className="text-slate-900">{questions.length}</strong> questions.
          </p>
          <p className="text-xs text-slate-500">
            Once submitted, your responses will be evaluated immediately by the grading engine.
          </p>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              onClick={() => setConfirmModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
            >
              Review Questions
            </button>
            <button
              onClick={executeSubmission}
              disabled={submitting}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              {submitting ? 'Submitting...' : 'Yes, Submit Now'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
