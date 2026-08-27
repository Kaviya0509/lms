import React from 'react';
import { InboxIcon } from 'lucide-react';

interface Props { title?: string; subtitle?: string; action?: React.ReactNode; icon?: React.ReactNode; }

const EmptyState: React.FC<Props> = ({ title = 'No data', subtitle, action, icon }) => (
  <div className="flex flex-col items-center justify-center py-14 gap-3">
    <div className="p-4 bg-slate-50 rounded-2xl text-slate-600">
      {icon ?? <InboxIcon size={36} />}
    </div>
    <div className="text-center">
      <p className="text-slate-700 font-medium">{title}</p>
      {subtitle && <p className="text-slate-500 text-sm mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default EmptyState;
