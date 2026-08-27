import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
  loading?: boolean;
}

const ConfirmDialog: React.FC<Props> = ({
  isOpen, onClose, onConfirm, title = 'Confirm Action',
  message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger', loading = false,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <div className="flex gap-4">
      <div className={`p-2 rounded-xl flex-shrink-0 h-fit ${variant === 'danger' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
        <AlertTriangle size={20} />
      </div>
      <p className="text-slate-700 text-sm leading-relaxed">{message}</p>
    </div>
    <div className="flex justify-end gap-3 mt-6">
      <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200">
        {cancelText}
      </button>
      <button onClick={onConfirm} disabled={loading}
        className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all disabled:opacity-50 ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}>
        {loading ? 'Processing...' : confirmText}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
