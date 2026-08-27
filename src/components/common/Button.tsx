import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'warning';
type Size = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white shadow-sm hover:shadow-md',
  secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm',
  danger:    'bg-red-50 hover:bg-red-100 text-red-600 border border-red-100',
  ghost:     'hover:bg-slate-100 text-slate-600 hover:text-slate-900',
  success:   'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100',
  warning:   'bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-100',
};

const sizeClasses: Record<Size, string> = {
  xs:  'px-2.5 py-1.5 text-xs gap-1 rounded-md',
  sm:  'px-3.5 py-2 text-xs gap-1.5 rounded-md',
  md:  'px-5 py-2.5 text-sm gap-2 rounded-md',
  lg:  'px-6 py-3 text-sm gap-2.5 rounded-md',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary', size = 'md', loading, icon, iconRight, fullWidth, children, disabled, className = '', ...props
}) => (
  <button
    {...props}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
  >
    {loading ? (
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    ) : icon}
    {children}
    {!loading && iconRight}
  </button>
);

export default Button;
