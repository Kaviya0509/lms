import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, ChevronDown, Check, X } from 'lucide-react';

export interface MultiSelectFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  value: string[];
  onChange: (value: string[]) => void;
  required?: boolean;
  containerClassName?: string;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  label, error, hint, options, placeholder = 'Select options...', value = [], onChange, required, containerClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeOption = (e: React.MouseEvent, optionValue: string) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== optionValue));
  };

  const selectedOptions = options.filter(o => value.includes(o.value));

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`} ref={containerRef}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full min-h-[46px] bg-slate-100/60 border rounded-xl pl-4 pr-10 py-2.5 text-sm text-slate-900 cursor-pointer flex flex-wrap items-center gap-2 transition-all duration-200
            ${error ? 'border-red-500/60 focus:ring-red-500/30' : 'border-slate-200 hover:border-slate-300 focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500'}
            ${isOpen ? 'ring-2 ring-primary-500/40 border-primary-500' : ''}`}
        >
          {selectedOptions.length === 0 ? (
            <span className="text-slate-500 py-0.5">{placeholder}</span>
          ) : (
            selectedOptions.map(opt => (
              <span key={opt.value} onClick={(e) => e.stopPropagation()} className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md flex items-center gap-1.5 text-xs font-medium shadow-sm hover:border-slate-300 transition-colors">
                {opt.label}
                <button type="button" onClick={(e) => removeOption(e, opt.value)} className="text-slate-400 hover:text-red-500 focus:outline-none p-0.5 rounded-sm hover:bg-slate-50">
                  <X size={13} />
                </button>
              </span>
            ))
          )}
        </div>
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary-500' : 'text-slate-400'}`}>
          <ChevronDown size={18} />
        </div>
      </div>

      {isOpen && (
        <div className="mt-2 bg-white border border-slate-200 rounded-xl shadow-sm max-h-64 overflow-y-auto py-2 animate-in fade-in duration-200">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-500 text-center">No options available</div>
          ) : (
            options.map(opt => {
              const isSelected = value.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  onClick={() => toggleOption(opt.value)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all duration-200 ${isSelected ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-300 bg-white group-hover:border-primary-400'}`}>
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                  <span className={`text-sm select-none ${isSelected ? 'font-semibold text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>{opt.label}</span>
                </div>
              );
            })
          )}
        </div>
      )}
      {error && <p className="flex items-center gap-1 text-red-500 text-xs mt-1"><AlertCircle size={12} />{error}</p>}
      {!error && hint && <p className="text-slate-500 text-xs mt-1">{hint}</p>}
    </div>
  );
};

export default MultiSelectField;
