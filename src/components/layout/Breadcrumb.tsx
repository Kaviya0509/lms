import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeMap: Record<string, string> = {
  '': 'Dashboard', trainers: 'Trainers', trainees: 'Trainees',
  courses: 'Courses', online: 'Online', offline: 'Offline',
  batches: 'Batches & Schedules', locations: 'Locations',
  enrollments: 'Enrollments', attendance: 'Attendance',
  assessments: 'Assessments', certificates: 'Certificates',
  reports: 'Reports', settings: 'Settings', add: 'Add New', edit: 'Edit',
};

const Breadcrumb: React.FC = () => {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return (
    <div className="flex items-center gap-1.5">
      <Home size={14} className="text-slate-500" />
      <span className="text-sm font-medium text-slate-900">Dashboard</span>
    </div>
  );

  return (
    <nav className="flex items-center gap-1.5 text-sm">
      <Link to="/" className="text-slate-500 hover:text-primary-600 transition-colors">
        <Home size={14} />
      </Link>
      {segments.map((seg, i) => {
        const path = '/' + segments.slice(0, i + 1).join('/');
        const label = routeMap[seg] ?? seg.replace(/-/g, ' ');
        const isLast = i === segments.length - 1;
        return (
          <React.Fragment key={path}>
            <ChevronRight size={13} className="text-slate-700" />
            {isLast ? (
              <span className="font-medium text-slate-900 capitalize">{label}</span>
            ) : (
              <Link to={path} className="text-slate-500 hover:text-primary-600 capitalize transition-colors">{label}</Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
