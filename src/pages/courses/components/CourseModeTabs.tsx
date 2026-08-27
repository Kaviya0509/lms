import React from 'react';
import { BookOpen, Monitor, Globe } from 'lucide-react';
import type { Course } from '../../../types';

type ModeFilter = 'all' | 'online' | 'offline';

interface Props {
  courses: Course[];
  value: ModeFilter;
  onChange: (v: ModeFilter) => void;
}

const TABS: [ModeFilter, string, React.ElementType][] = [
  ['all',     'All Courses',    BookOpen],
  ['online',  'Online',         Monitor],
  ['offline', 'Offline',        Globe],
];

const CourseModeTabs: React.FC<Props> = ({ courses, value, onChange }) => {
  const count = (v: ModeFilter) => {
    if (v === 'all') return courses.length;
    return courses.filter(c => c.mode === v || c.mode === 'both').length;
  };

  return (
    <div className="flex bg-slate-50/50 border border-slate-200 rounded-lg p-1 gap-1 overflow-x-auto scrollbar-hide w-full sm:w-fit">
      {TABS.map(([v, label, Icon]) => {
        const active = value === v;
        return (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
              ${active
                ? 'bg-white text-primary-700 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 border border-transparent'
              }`}
          >
            <Icon size={14} className={active ? 'text-primary-600' : 'text-slate-400'} />
            {label}
            <span className={`text-xs px-1.5 rounded-full ${active ? 'text-primary-500 bg-primary-50' : 'opacity-70'}`}>
              {count(v)}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CourseModeTabs;
