import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Star, Clock, Monitor, Globe, Eye, Pencil, Trash2 } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { removeCourse } from '../../store/slices/coursesSlice';
import type { Course, TableColumn } from '../../types';
import { formatDate, truncate } from '../../utils/helpers';
import { useToast } from '../../hooks/useToast';
import CourseStatCards from './components/CourseStatCards';
import CourseModeTabs from './components/CourseModeTabs';
import CourseDetailModal from './components/CourseDetailModal';

interface CourseListPageProps { initialMode?: 'online' | 'offline'; }

type ModeFilter = 'all' | 'online' | 'offline';

const CourseListPage: React.FC<CourseListPageProps> = ({ initialMode }) => {
  const courses  = useAppSelector(s => s.courses.items);
  const batches  = useAppSelector(s => s.batches.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast    = useToast();

  const [modeFilter, setModeFilter] = useState<ModeFilter>(initialMode ?? 'all');
  const [deleteId,   setDeleteId]   = useState<string | null>(null);
  const [viewCourse, setViewCourse] = useState<Course | null>(null);

  React.useEffect(() => { setModeFilter(initialMode ?? 'all'); }, [initialMode]);

  const filtered = courses.filter(c => {
    if (modeFilter === 'all')     return true;
    if (modeFilter === 'online')  return c.mode === 'online'  || c.mode === 'both';
    if (modeFilter === 'offline') return c.mode === 'offline' || c.mode === 'both';
    return true;
  });

  const doDelete = () => {
    if (deleteId) { dispatch(removeCourse(deleteId)); toast.warning('Course removed.'); setDeleteId(null); }
  };

  const columns: TableColumn<Course>[] = [
    {
      key: 'name', label: 'Course', className: 'min-w-[360px]',
      render: (_, r) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl flex-shrink-0 ${r.mode === 'online' ? 'bg-primary-50' : r.mode === 'offline' ? 'bg-emerald-50' : 'bg-violet-50'}`}>
            {r.mode === 'online'  ? <Monitor size={15} className="text-primary-600" />
            : r.mode === 'offline' ? <Globe   size={15} className="text-emerald-600" />
            :                        <Monitor size={15} className="text-violet-600" />}
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="font-semibold text-slate-900 text-sm whitespace-nowrap">{truncate(r.name, 60)}</p>
            <p className="text-xs text-slate-500 whitespace-nowrap">{r.code} · {r.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'mode', label: 'Mode',
      render: (_, r) => (
        <div className="flex items-center gap-1.5">
          {(r.mode === 'online'  || r.mode === 'both') && <StatusBadge status="online" />}
          {(r.mode === 'offline' || r.mode === 'both') && <StatusBadge status="offline" label="offline" />}
        </div>
      ),
    },
    { key: 'level',       label: 'Level',    render: (v) => <span className="text-xs capitalize text-slate-700">{String(v)}</span> },
    { key: 'trainerName', label: 'Trainer',  render: (v) => <span className="text-xs text-slate-700 whitespace-nowrap">{v ? String(v) : '—'}</span> },
    { key: 'enrolledCount', label: 'Enrolled', render: (_, r) => <div className="flex items-center gap-1.5"><span className="text-xs text-slate-600">{r.enrolledCount}</span></div> },
    { key: 'rating',      label: 'Rating',   render: (_, r) => r.rating > 0 ? <span className="flex items-center gap-1.5 text-amber-500 text-sm font-medium"><Star size={14} fill="currentColor" />{r.rating}</span> : <span className="text-slate-400">—</span> },
    { key: 'duration',    label: 'Duration', render: (v) => <div className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /><span className="text-xs">{String(v)}h</span></div> },
    { key: 'createdAt',   label: 'Created',  render: (v) => <span className="text-xs text-slate-600">{formatDate(String(v))}</span> },
  ];

  return (
    <div className="flex flex-col gap-5 h-full">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Course Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {courses.length} courses —&nbsp;
            {courses.filter(c => c.mode === 'online'  || c.mode === 'both').length} online,&nbsp;
            {courses.filter(c => c.mode === 'offline' || c.mode === 'both').length} offline
          </p>
        </div>
        <Button icon={<PlusCircle size={15} />} onClick={() => navigate('/courses/create')} className="self-start sm:self-auto">Create Course</Button>
      </div>

      <CourseStatCards courses={courses} />

      <CourseModeTabs
        courses={courses}
        value={modeFilter}
        onChange={(mode) => {
          setModeFilter(mode);
          if (mode === 'all') {
            navigate('/courses');
          } else {
            navigate(`/courses/${mode}`);
          }
        }}
      />

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex-1 flex flex-col min-h-0">
        <DataTable
          columns={columns as unknown as TableColumn<Record<string, unknown>>[]}
          data={filtered as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search courses..."
          onRowClick={(row) => setViewCourse(row as unknown as Course)}
          actions={(row) => {
            const c = row as unknown as Course;
            return (
              <div className="flex items-center gap-1.5 justify-end">
                <Button variant="ghost"  size="xs" icon={<Eye    size={13} />} onClick={() => setViewCourse(c)} />
                <Button variant="ghost"  size="xs" icon={<Pencil size={13} />} onClick={() => navigate(`/courses/edit/${c.id}`)} />
                <Button variant="danger" size="xs" icon={<Trash2 size={13} />} onClick={() => setDeleteId(c.id)} />
              </div>
            );
          }}
        />
      </div>

      <CourseDetailModal course={viewCourse} batches={batches} onClose={() => setViewCourse(null)} />

      <ConfirmDialog
        isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={doDelete}
        title="Delete Course"
        message="This will permanently delete the course and all its content, enrollments, and assessments. This action cannot be undone."
        confirmText="Delete Course"
      />
    </div>
  );
};

export default CourseListPage;
