import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
  growth?: number;
  subtitle?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconBg = 'bg-primary-50 text-primary-600', growth, subtitle, delay = 0 }) => {
  const isPositive = (growth ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1.5 tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${iconBg} group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ml-3`}>
          {icon}
        </div>
      </div>
      {growth !== undefined && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-50">
          {isPositive ? <TrendingUp size={13} className="text-emerald-600" /> : <TrendingDown size={13} className="text-red-600" />}
          <span className={`text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{growth}%
          </span>
          <span className="text-xs text-slate-500">from last month</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
