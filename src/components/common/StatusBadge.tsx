import React from 'react';

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface StatusBadgeProps {
  status: string;
  label?: string;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variantMap: Record<string, Variant> = {
  active: 'success', published: 'success', approved: 'success', issued: 'success',
  completed: 'success', present: 'success', online: 'info',
  inactive: 'neutral', archived: 'neutral', revoked: 'neutral', cancelled: 'neutral', draft: 'neutral',
  pending: 'warning', review: 'warning', late: 'warning', upcoming: 'warning', configuration: 'warning',
  rejected: 'danger', dropped: 'danger', absent: 'danger', flagged: 'danger', suspended: 'danger', offline: 'info',
};

const variantClasses: Record<Variant, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-primary-50 text-primary-700 border-primary-200',
  neutral: 'bg-slate-50 text-slate-700 border-slate-200',
};

const dotClasses: Record<Variant, string> = {
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-red-400',
  info: 'bg-primary-400',
  neutral: 'bg-slate-500',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'sm', dot = false }) => {
  const variant = variantMap[status?.toLowerCase()] ?? 'neutral';
  const displayLabel = label ?? status?.replace(/_/g, ' ');
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border capitalize ${sizeClass} ${variantClasses[variant]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClasses[variant]}`} />}
      {displayLabel}
    </span>
  );
};

export default StatusBadge;
