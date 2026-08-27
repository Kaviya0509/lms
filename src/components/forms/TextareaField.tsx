import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, hint, containerClassName = '', id, className = '', ...props }, ref) => {
    const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label htmlFor={fieldId} className="text-sm font-medium text-slate-700">
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea ref={ref} id={fieldId} {...props}
          className={`w-full bg-slate-100/60 border rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 resize-y min-h-[100px]
            ${error ? 'border-red-500/60 focus:ring-red-500/30 focus:border-red-500' : 'border-slate-200 focus:ring-primary-500/40 focus:border-primary-500'}
            ${className}`}
        />
        {error && <p className="flex items-center gap-1 text-red-500 text-xs mt-1"><AlertCircle size={12} />{error}</p>}
        {!error && hint && <p className="text-slate-500 text-xs mt-1">{hint}</p>}
      </div>
    );
  }
);
TextareaField.displayName = 'TextareaField';

export default TextareaField;
