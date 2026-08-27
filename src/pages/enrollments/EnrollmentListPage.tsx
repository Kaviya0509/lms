import React, { useState } from 'react';
import { CheckCircle2, XCircle, Eye } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { mockEnrollments } from '../../services/mockData';
import type { Enrollment, TableColumn } from '../../types';
import { formatDate, getInitials, getAvatarColor } from '../../utils/helpers';
import { useToast } from '../../hooks/useToast';

const EnrollmentListPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockEnrollments);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewEnrollment, setViewEnrollment] = useState<Enrollment | null>(null);
  const toast = useToast();

  const filtered = enrollments.filter(e => statusFilter === 'all' || e.status === statusFilter);

  const handleApprove = (id: string) => {
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: 'approved', approvedAt: new Date().toISOString().split('T')[0], approvedBy: 'Admin' } : e));
    toast.success('Enrollment approved successfully!');
  };

  const handleReject = (id: string) => {
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: 'rejected' } : e));
    toast.warning('Enrollment request rejected.');
  };

  const columns: TableColumn<Enrollment>[] = [
    {
      key: 'traineeName', label: 'Trainee', className: 'min-w-[180px]',
      render: (_, r) => (
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getAvatarColor(r.traineeName)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {getInitials(r.traineeName)}
          </div>
          <span className="font-semibold text-slate-900 text-sm whitespace-nowrap">{r.traineeName}</span>
        </div>
      ),
    },
    {
      key: 'traineeEmail', label: 'Email', className: 'min-w-[180px]',
      render: (v) => <span className="text-xs text-slate-600 font-medium whitespace-nowrap">{String(v)}</span>
    },
    {
      key: 'courseName', label: 'Course', className: 'min-w-[320px]',
      render: (_, r) => (
        <div className="flex flex-col gap-1.5">
          <p className="font-medium text-slate-900 text-sm whitespace-nowrap">{r.courseName}</p>
          <p className="text-xs text-slate-500 capitalize whitespace-nowrap">{r.courseMode} {r.batchName ? `· ${r.batchName}` : ''}</p>
        </div>
      ),
    },
    { key: 'enrolledAt', label: 'Requested Date', className: 'min-w-[140px]', render: (v) => <span className="text-xs whitespace-nowrap">{formatDate(String(v))}</span> },
    {
      key: 'progress', label: 'Progress', className: 'min-w-[100px]',
      render: (v) => (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg whitespace-nowrap ${
          Number(v) >= 80 ? 'bg-emerald-50 text-emerald-700' :
          Number(v) >= 50 ? 'bg-amber-50 text-amber-700' :
          'bg-slate-100 text-slate-600'
        }`}>{Number(v)}%</span>
      ),
    },
    { key: 'status', label: 'Status', className: 'min-w-[100px]', render: (_, r) => <StatusBadge status={r.status} dot /> },
  ];

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Enrollment Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage course enrollment requests and seat approvals</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {(['all', 'pending', 'approved', 'rejected', 'completed'] as const).map(s => {
          const count = s === 'all' ? enrollments.length : enrollments.filter(e => e.status === s).length;
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${statusFilter === s ? 'bg-primary-600 text-white shadow-sm' : 'bg-white border border-slate-100 shadow-sm text-slate-500 hover:text-slate-900'}`}>
              {s}
              <span className="opacity-60 text-[11px]">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex-1 flex flex-col min-h-0">
        <DataTable
          columns={columns as unknown as TableColumn<Record<string, unknown>>[]}
          data={filtered as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search enrollments..."
          actions={(row) => {
            const e = row as unknown as Enrollment;
            return (
              <div className="flex items-center gap-1.5 justify-end">
                <Button variant="ghost" size="xs" icon={<Eye size={13} />} onClick={() => setViewEnrollment(e)} />
                {e.status === 'pending' && (
                  <>
                    <Button variant="success" size="xs" icon={<CheckCircle2 size={13} />} onClick={() => handleApprove(e.id)}>Approve</Button>
                    <Button variant="danger" size="xs" icon={<XCircle size={13} />} onClick={() => handleReject(e.id)}>Reject</Button>
                  </>
                )}
              </div>
            );
          }}
        />
      </div>
      <Modal isOpen={!!viewEnrollment} onClose={() => setViewEnrollment(null)} title="Enrollment Details" size="md">
        {viewEnrollment && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{viewEnrollment.traineeName}</h3>
                <p className="text-slate-500 text-xs">{viewEnrollment.traineeEmail}</p>
              </div>
              <StatusBadge status={viewEnrollment.status} dot />
            </div>

            <div className="bg-slate-50 rounded-xl p-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Course</span><span className="text-slate-900 font-medium">{viewEnrollment.courseName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Mode</span><span className="text-slate-900 capitalize">{viewEnrollment.courseMode}</span></div>
              {viewEnrollment.batchName && <div className="flex justify-between"><span className="text-slate-500">Batch</span><span className="text-slate-900">{viewEnrollment.batchName}</span></div>}
              <div className="flex justify-between"><span className="text-slate-500">Enrolled On</span><span className="text-slate-900">{formatDate(viewEnrollment.enrolledAt)}</span></div>
              {viewEnrollment.approvedBy && <div className="flex justify-between"><span className="text-slate-500">Approved By</span><span className="text-emerald-600">{viewEnrollment.approvedBy} on {formatDate(viewEnrollment.approvedAt)}</span></div>}
            </div>

            {viewEnrollment.status === 'pending' && (
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 shadow-sm">
                <Button variant="danger" size="sm" icon={<XCircle size={14} />} onClick={() => { handleReject(viewEnrollment.id); setViewEnrollment(null); }}>Reject Request</Button>
                <Button variant="success" size="sm" icon={<CheckCircle2 size={14} />} onClick={() => { handleApprove(viewEnrollment.id); setViewEnrollment(null); }}>Approve Request</Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EnrollmentListPage;
