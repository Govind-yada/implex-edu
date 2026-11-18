import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../../store/slices/uiSlice.js';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
  error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
  info: <Info className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />,
};

const borders = {
  success: 'border-emerald-200 bg-emerald-50/95 text-emerald-950 shadow-emerald-500/10',
  error: 'border-rose-200 bg-rose-50/95 text-rose-950 shadow-rose-500/10',
  warning: 'border-amber-200 bg-amber-50/95 text-amber-950 shadow-amber-500/10',
  info: 'border-brand-200 bg-brand-50/95 text-brand-950 shadow-brand-500/10',
};

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-slide-up ${
        borders[toast.type] || borders.info
      }`}
    >
      {icons[toast.type] || icons.info}
      <div className="flex-1 text-xs sm:text-sm font-semibold leading-relaxed">
        {toast.message}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-black/5"
        title="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function Toast() {
  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.ui.toasts);

  if (!toasts || !toasts.length) return null;

  const handleDismiss = (id) => {
    dispatch(removeToast(id));
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={handleDismiss} />
      ))}
    </div>
  );
}
