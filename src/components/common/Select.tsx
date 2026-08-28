import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({ value, onChange, options, className = '', placeholder = 'Select' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);

  const updateCoords = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current && ref.current.contains(target)) return;
      if (target instanceof Element && target.closest('[data-select-portal]')) return;
      setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  useEffect(() => {
    if (open) {
      updateCoords();
      window.addEventListener('resize', updateCoords);
      window.addEventListener('scroll', updateCoords, true);
    }
    return () => {
      window.removeEventListener('resize', updateCoords);
      window.removeEventListener('scroll', updateCoords, true);
    };
  }, [open]);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center justify-between gap-2 w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-normal text-slate-700 cursor-pointer hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm ${
          open ? 'ring-1 ring-primary-500 border-primary-500' : ''
        }`}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown size={13} className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && coords && ReactDOM.createPortal(
        <div
          data-select-portal
          role="listbox"
          style={{
            position: 'absolute',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            width: `${coords.width}px`,
          }}
          className="z-[9999] mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-900/5 py-1 animate-fade-in min-w-[120px]"
        >
          {options.map(opt => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`relative flex w-full items-center gap-2 pl-8 pr-3 py-1.5 text-xs text-left cursor-pointer transition-colors ${
                  isSelected ? 'text-slate-900 font-semibold bg-slate-50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {isSelected && <Check size={13} className="absolute left-2.5 text-slate-900" />}
                {opt.label}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
};

export default Select;
