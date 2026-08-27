import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  danger:  'bg-red-500/15 text-red-400 border border-red-500/20',
  info:    'bg-primary-500/15 text-primary-400 border border-primary-500/20',
  neutral: 'bg-slate-700/50 text-slate-500 border border-slate-200',
};

const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantClasses[variant]} ${className}`}>
    {children}
  </span>
);

export default Badge;
