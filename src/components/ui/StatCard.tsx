import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  growth?: number;
  icon: React.ReactNode;
  iconBg?: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, growth, icon, iconBg = 'bg-primary-50 text-primary-600', subtitle }) => {
  const isPositive = (growth ?? 0) >= 0;
  return (
    <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <p className="text-[13px] font-semibold text-slate-500">{title}</p>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
      
      <div className="mb-3">
        <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>
      
      {(growth !== undefined || subtitle) && (
        <div className="flex items-center gap-2 mt-auto">
          {growth !== undefined && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {isPositive ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
              {isPositive ? '+' : ''}{growth}%
            </div>
          )}
          <span className="text-[11px] font-medium text-slate-500">
            {subtitle || 'vs last month'}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
