import React from 'react';
import { Calendar, User, MapPin } from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import { formatDate } from '../../../utils/helpers';
import type { Batch } from '../../../types';

interface Props {
  label: string;
  icon: React.ReactNode;
  batches: Batch[];
  emptyMessage: string;
  accentColor: 'primary' | 'emerald';
}

const BatchColumn: React.FC<Props> = ({ label, icon, batches, emptyMessage, accentColor }) => {
  const accent = {
    primary: {
      badge: 'bg-primary-50 text-primary-700',
      card: 'bg-primary-50/10 border-primary-100/80 hover:border-primary-200',
      bar: 'bg-primary-500',
      icon: 'text-primary-600',
    },
    emerald: {
      badge: 'bg-emerald-50 text-emerald-700',
      card: 'bg-emerald-50/10 border-emerald-100/85 hover:border-emerald-200',
      bar: 'bg-emerald-500',
      icon: 'text-emerald-600',
    },
  }[accentColor];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <span className={accent.icon}>{icon}</span>
        <h5 className="font-semibold text-slate-900 text-sm">{label}</h5>
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ml-auto ${accent.badge}`}>
          {batches.length}
        </span>
      </div>

      {batches.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <p className="text-xs text-slate-400 font-medium">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
          {batches.map(b => (
            <div key={b.id} className={`p-3.5 border rounded-xl transition-all ${accent.card}`}>
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold text-slate-800 text-xs truncate max-w-[170px]" title={b.name}>{b.name}</p>
                <StatusBadge status={b.status} dot />
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-600">
                <p className="flex items-center gap-1.5">
                  <Calendar size={11} className="text-slate-400" />
                  <span>{formatDate(b.startDate)} → {formatDate(b.endDate)}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <User size={11} className="text-slate-400" />
                  <span>Trainer: <strong className="text-slate-700">{b.trainerName}</strong></span>
                </p>
                {b.locationName && (
                  <p className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-slate-400" />
                    <span>Location: <strong className="text-slate-700">{b.locationName}</strong></span>
                  </p>
                )}
                <div className="pt-2">
                  <div className="flex justify-between text-[10px] font-medium mb-1">
                    <span>Seats Filled</span>
                    <span>{b.enrolledCount} / {b.seatCapacity}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1">
                    <div
                      className={`h-full rounded-full ${accent.bar}`}
                      style={{ width: `${Math.min(100, (b.enrolledCount / b.seatCapacity) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BatchColumn;
