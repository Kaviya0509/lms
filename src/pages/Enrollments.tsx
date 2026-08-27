import React, { useState } from 'react';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import { mockEnrollments } from '../data/mockData';
import type { Enrollment } from '../types';

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          value === 100 ? 'bg-emerald-500' : value > 50 ? 'bg-primary-500' : 'bg-amber-500'
        }`}
        style={{ width: `${value}%` }}
      />
    </div>
    <span className="text-xs text-slate-500 w-9 text-right">{value}%</span>
  </div>
);

const Enrollments: React.FC = () => {
  const [enrollments] = useState<Enrollment[]>(mockEnrollments);

  const completed = enrollments.filter(e => e.status === 'completed').length;
  const active    = enrollments.filter(e => e.status === 'active').length;
  const dropped   = enrollments.filter(e => e.status === 'dropped').length;

  const columns = [
    { key: 'studentName', label: 'Student' },
    { key: 'courseName',  label: 'Course' },
    { key: 'enrolledAt',  label: 'Enrolled' },
    {
      key: 'progress',
      label: 'Progress',
      render: (_: unknown, row: Enrollment) => <ProgressBar value={row.progress} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (_: unknown, row: Enrollment) => (
        <Badge variant={
          row.status === 'completed' ? 'info' :
          row.status === 'active' ? 'success' : 'danger'
        }>
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active', count: active, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Completed', count: completed, color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
          { label: 'Dropped', count: dropped, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-slate-500 text-sm">{s.label} Enrollments</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5">
        <DataTable
          columns={columns as never}
          data={enrollments as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search enrollments..."
          emptyMessage="No enrollments found"
        />
      </div>
    </div>
  );
};

export default Enrollments;
