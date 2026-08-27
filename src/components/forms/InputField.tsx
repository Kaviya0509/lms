import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, hint, icon, containerClassName = '', id, className = '', ...props }, ref) => {
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
          <input
            ref={ref} id={fieldId} {...props}
            className={`w-full bg-slate-100/60 border rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-500
              focus:outline-none focus:ring-2 transition-all duration-200
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-500/60 focus:ring-red-500/30 focus:border-red-500' : 'border-slate-200 focus:ring-primary-500/40 focus:border-primary-500'}
              ${className}`}
          />
        </div>
        {error && <p className="flex items-center gap-1 text-red-500 text-xs mt-1"><AlertCircle size={12} />{error}</p>}
        {!error && hint && <p className="text-slate-500 text-xs mt-1">{hint}</p>}
      </div>
    );
  }
);
InputField.displayName = 'InputField';

export default InputField;
