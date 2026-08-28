import React from 'react';
import { BookOpen, Monitor, Globe, CheckCircle2, Star } from 'lucide-react';
import type { Course } from '../../../types';

interface Props { courses: Course[]; }

const CourseStatCards: React.FC<Props> = ({ courses }) => {
  const avgRating = (() => {
    const r = courses.filter(c => c.rating > 0);
    return r.length ? (r.reduce((s, c) => s + c.rating, 0) / r.length).toFixed(1) : '—';
  })();

  const cards = [
    { label: 'Total Courses', value: courses.length,                                                          icon: <BookOpen size={18} />,     iconBg: 'bg-primary-50 text-primary-600'  },
    { label: 'Online',        value: courses.filter(c => c.mode === 'online' || c.mode === 'both').length,    icon: <Monitor size={18} />,      iconBg: 'bg-cyan-50 text-cyan-600'        },
    { label: 'Offline',       value: courses.filter(c => c.mode === 'offline' || c.mode === 'both').length,   icon: <Globe size={18} />,        iconBg: 'bg-emerald-50 text-emerald-600'  },
    { label: 'Published',     value: courses.filter(c => c.status === 'published').length,                    icon: <CheckCircle2 size={18} />, iconBg: 'bg-violet-50 text-violet-600'   },
    { label: 'Avg. Rating',   value: avgRating,                                                               icon: <Star size={18} />,         iconBg: 'bg-amber-50 text-amber-500'     },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map(card => (
        <div key={card.label} className="flex items-start justify-between px-4 py-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-300 group">
          <div>
            <p className="text-xs font-semibold tracking-wider text-slate-500">{card.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1.5 tracking-tight">{card.value}</p>
          </div>
          <div className={`p-3 rounded-xl ${card.iconBg} group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ml-3`}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseStatCards;
