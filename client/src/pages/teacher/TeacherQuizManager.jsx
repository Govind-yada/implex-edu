import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '../../store/slices/uiSlice.js';
import api from '../../api/axios.js';
import {
  FileQuestion,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function TeacherQuizManager() {
  const dispatch = useDispatch();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Science & Technology');
  const [targetAudience, setTargetAudience] = useState('all');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [passingPercentage, setPassingPercentage] = useState(50);
  const [allowNegativeMarking, setAllowNegativeMarking] = useState(false);
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }],
      correctOptionIndex: 0,
      marks: 1,
      explanation: '',
    },
  ]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/quizzes');
      setQuizzes(res.data.data || []);
    } catch (err) {
      console.error('Failed to load quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }],
        correctOptionIndex: 0,
        marks: 1,
        explanation: '',
      },
    ]);
  };

  const handleRemoveQuestion = (idx) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleOptionTextChange = (qIdx, optIdx, text) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx].text = text;
    setQuestions(updated);
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!title) {
      dispatch(addToast({ type: 'warning', message: 'Quiz title is required.' }));
      return;
    }

    // Validate that questions have text and options
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].questionText.trim()) {
        dispatch(
          addToast({
            type: 'warning',
            message: `Question #${i + 1} is missing its question text.`,
          })
        );
        return;
      }
      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].text.trim()) {
          dispatch(
            addToast({
              type: 'warning',
              message: `Question #${i + 1}, Option ${String.fromCharCode(65 + j)} is empty.`,
            })
          );
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      await api.post('/quizzes', {
        title,
        description,
        category,
        targetAudience,
        durationMinutes: Number(durationMinutes),
        passingPercentage: Number(passingPercentage),
        allowNegativeMarking,
        questions,
        status: 'published',
      });
      dispatch(addToast({ type: 'success', message: 'Quiz created & published successfully!' }));
      setCreateModalOpen(false);
      resetForm();
      fetchQuizzes();
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          message: err.response?.data?.message || 'Failed to create quiz.',
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Science & Technology');
    setDurationMinutes(15);
    setPassingPercentage(50);
    setAllowNegativeMarking(false);
    setQuestions([
      {
        questionText: '',
        options: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }],
        correctOptionIndex: 0,
        marks: 1,
        explanation: '',
      },
    ]);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Quiz Authoring & Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Author standardized assessments, configure question weights, and set pass parameters.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setCreateModalOpen(true);
          }}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Quiz
        </button>
      </div>

      {loading ? (
        <Loader text="Loading quizzes..." />
      ) : quizzes.length === 0 ? (
        <EmptyState
          title="No Quizzes Authored"
          description="Create your first quiz with the quiz authoring wizard."
          icon={FileQuestion}
          actionText="Create Quiz"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="blue">{quiz.category}</Badge>
                  <Badge variant={quiz.status === 'published' ? 'emerald' : 'slate'}>
                    {quiz.status?.toUpperCase()}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{quiz.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                  {quiz.description || 'No description provided.'}
                </p>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600 mb-4">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <strong>{quiz.durationMinutes} mins</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Marks:</span>
                    <strong>{quiz.totalMarks || 5}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Passing Criteria:</span>
                    <strong>{quiz.passingPercentage}%</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>By: {quiz.createdBy?.name || 'Educator'}</span>
                <span className="font-bold text-brand-600">
                  {quiz.questionsCount || 5} Questions
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quiz Creation Wizard Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Author New Assessment Quiz"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleCreateQuiz} className="space-y-6">
          {/* General Config */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600">
              1. Basic Parameters
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Quiz Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Molecular Biology & Genetics Olympiad Prep"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Science & Technology">Science & Technology</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="General Knowledge">General Knowledge</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Duration (Mins) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  required
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Passing % *
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  required
                  value={passingPercentage}
                  onChange={(e) => setPassingPercentage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Description & Instructions
              </label>
              <textarea
                rows={2}
                placeholder="Brief guidelines for participating scholars..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="negMark"
                checked={allowNegativeMarking}
                onChange={(e) => setAllowNegativeMarking(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="negMark" className="text-xs font-bold text-slate-700 cursor-pointer">
                Enable Negative Marking (-25% penalty on wrong answers)
              </label>
            </div>
          </div>

          {/* Question Builder */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600">
                2. Question Bank ({questions.length})
              </h4>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Question
              </button>
            </div>

            <div className="space-y-6 max-h-96 overflow-y-auto pr-1">
              {questions.map((q, qIdx) => (
                <div
                  key={qIdx}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Question #{qIdx + 1}</span>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Enter question text..."
                    value={q.questionText}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[qIdx].questionText = e.target.value;
                      setQuestions(updated);
                    }}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />

                  {/* Options */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">
                      Multiple Choice Options (Select radio for correct answer):
                    </p>
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct_${qIdx}`}
                          checked={q.correctOptionIndex === optIdx}
                          onChange={() => {
                            const updated = [...questions];
                            updated[qIdx].correctOptionIndex = optIdx;
                            setQuestions(updated);
                          }}
                          className="w-4 h-4 text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-400 w-4">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <input
                          type="text"
                          required
                          placeholder={`Option ${String.fromCharCode(65 + optIdx)} text...`}
                          value={opt.text}
                          onChange={(e) => handleOptionTextChange(qIdx, optIdx, e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Explanation for students after submission (optional)..."
                    value={q.explanation}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[qIdx].explanation = e.target.value;
                      setQuestions(updated);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 flex items-center gap-2"
            >
              {submitting ? 'Publishing...' : 'Publish Quiz'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
