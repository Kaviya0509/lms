import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
  footer?: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children, width = 'max-w-xl', footer }) => {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) { document.addEventListener('keydown', h); document.body.style.overflow = 'hidden'; }
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose} />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className={`fixed right-0 top-0 h-full ${width} w-full bg-white border-l border-slate-100 shadow-sm z-50 flex flex-col shadow-2xl`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shadow-sm flex-shrink-0">
              <h2 className="text-base font-semibold text-slate-900">{title}</h2>
              <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white/10 rounded-lg transition-all">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && <div className="px-6 py-4 border-t border-slate-100 shadow-sm flex-shrink-0">{footer}</div>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
