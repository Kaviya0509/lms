import React from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, hint, options, placeholder, containerClassName = '', className = '', id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={`flex flex-col ${containerClassName}`}>
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            {...props}
            className={`w-full appearance-none bg-slate-100/60 border rounded-xl px-4 py-3 text-slate-900 text-sm
              focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer
              ${error
                ? 'border-red-500/70 focus:ring-red-500/30 focus:border-red-500'
                : 'border-slate-200 focus:ring-primary-500/40 focus:border-primary-500'
              }
              ${className}`}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-slate-100">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
        {error && (
          <p className="flex items-center gap-1 text-red-400 text-xs mt-1.5">
            <AlertCircle size={12} />
            {error}
          </p>
        )}
        {!error && hint && (
          <p className="text-slate-500 text-xs mt-1.5">{hint}</p>
        )}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';
export default SelectField;
