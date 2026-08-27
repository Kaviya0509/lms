import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { removeToast } from '../../store/slices/uiSlice';

const icons = {
  success: <CheckCircle2 size={18} className="text-emerald-600" />,
  error:   <XCircle size={18} className="text-red-600" />,
  warning: <AlertCircle size={18} className="text-amber-600" />,
  info:    <Info size={18} className="text-primary-600" />,
};

const borderColors = {
  success: 'border-emerald-200 bg-emerald-50/60',
  error:   'border-red-200 bg-red-50/60',
  warning: 'border-amber-200 bg-amber-50/60',
  info:    'border-primary-200 bg-primary-50/60',
};

const ToastItem: React.FC<{ id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string; duration?: number }> = ({ id, type, message, duration = 3000 }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const t = setTimeout(() => dispatch(removeToast(id)), duration);
    return () => clearTimeout(t);
  }, [id, duration, dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 48, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 48, scale: 0.97 }}
      className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border ${borderColors[type]} bg-white shadow-xl min-w-72 max-w-sm backdrop-blur`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <p className="text-sm text-slate-700 flex-1">{message}</p>
      <button onClick={() => dispatch(removeToast(id))} className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0">
        <X size={15} />
      </button>
    </motion.div>
  );
};

const ToastContainer: React.FC = () => {
  const toasts = useAppSelector(s => s.ui.toasts);
  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map(t => <ToastItem key={t.id} {...t} />)}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
