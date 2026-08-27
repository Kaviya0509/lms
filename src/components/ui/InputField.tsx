import React from 'react';
import { AlertCircle } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, hint, icon, containerClassName = '', className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={`flex flex-col ${containerClassName}`}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            {...props}
            className={`w-full bg-slate-100/60 border rounded-xl px-4 py-3 text-slate-100 text-sm placeholder-slate-500 
              focus:outline-none focus:ring-2 transition-all duration-200
              ${icon ? 'pl-10' : ''}
              ${error
                ? 'border-red-500/70 focus:ring-red-500/30 focus:border-red-500'
                : 'border-slate-200 focus:ring-primary-500/40 focus:border-primary-500'
              }
              ${className}`}
          />
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

InputField.displayName = 'InputField';
export default InputField;
