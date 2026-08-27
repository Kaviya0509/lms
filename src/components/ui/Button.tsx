import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-slate-900 shadow-glow-sm hover:shadow-glow',
  secondary: 'bg-slate-100 hover:bg-slate-700 text-slate-200 border border-slate-200',
  danger:    'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30',
  ghost:     'hover:bg-white/5 text-slate-500 hover:text-slate-900',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm:  'px-3.5 py-2 text-xs gap-1.5',
  md:  'px-5 py-2.5 text-sm gap-2',
  lg:  'px-6 py-3 text-base gap-2.5',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  ...props
}) => (
  <button
    {...props}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
  >
    {loading ? (
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    ) : icon}
    {children}
  </button>
);

export default Button;
