import React from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  containerClassName?: string;
  icon?: React.ReactNode;
}

const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, hint, options, placeholder, containerClassName = '', icon, id, className = '', ...props }, ref) => {
    const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label htmlFor={fieldId} className="text-sm font-medium text-slate-700">
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">{icon}</div>}
          <select ref={ref} id={fieldId} {...props}
            className={`w-full bg-slate-100/60 border rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all duration-200 appearance-none cursor-pointer
              ${icon ? 'pl-10' : ''} pr-10
              ${error ? 'border-red-500/60 focus:ring-red-500/30 focus:border-red-500' : 'border-slate-200 focus:ring-primary-500/40 focus:border-primary-500'}
              ${className}`}>
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {options.map(o => <option key={o.value} value={o.value} className="bg-slate-100">{o.label}</option>)}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <ChevronDown size={16} />
          </div>
        </div>
        {error && <p className="flex items-center gap-1 text-red-500 text-xs mt-1"><AlertCircle size={12} />{error}</p>}
        {!error && hint && <p className="text-slate-500 text-xs mt-1">{hint}</p>}
      </div>
    );
  }
);
SelectField.displayName = 'SelectField';

export default SelectField;
