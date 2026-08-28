import React, { useState } from 'react';
import { CheckCircle2, XCircle, Eye, Users, UserCheck } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { mockEnrollments, mockTrainerEnrollments } from '../../services/mockData';
import type { Enrollment, TableColumn } from '../../types';
import { formatDate, getInitials, getAvatarColor } from '../../utils/helpers';
import { useToast } from '../../hooks/useToast';

const EnrollmentListPage: React.FC = () => {
  const [traineeEnrollments, setTraineeEnrollments] = useState<Enrollment[]>(mockEnrollments);
  const [trainerEnrollments, setTrainerEnrollments] = useState<Enrollment[]>(mockTrainerEnrollments);
  const [activeTab, setActiveTab] = useState<'trainee' | 'trainer'>('trainee');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewEnrollment, setViewEnrollment] = useState<Enrollment | null>(null);
  const toast = useToast();

  const currentEnrollments = activeTab === 'trainee' ? traineeEnrollments : trainerEnrollments;
  const filtered = currentEnrollments.filter(e => statusFilter === 'all' || e.status === statusFilter);

  const handleApprove = (id: string) => {
    if (activeTab === 'trainee') {
      setTraineeEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: 'approved', approvedAt: new Date().toISOString().split('T')[0], approvedBy: 'Admin' } : e));
    } else {
      setTrainerEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: 'approved', approvedAt: new Date().toISOString().split('T')[0], approvedBy: 'Admin' } : e));
    }
    toast.success('Enrollment approved successfully!');
  };

  const handleReject = (id: string) => {
    if (activeTab === 'trainee') {
      setTraineeEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: 'rejected' } : e));
    } else {
      setTrainerEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: 'rejected' } : e));
    }
    toast.warning('Enrollment request rejected.');
  };

  const columns: TableColumn<Enrollment>[] = [
    {
      key: 'traineeName', label: activeTab === 'trainee' ? 'Trainee' : 'Trainer', className: 'min-w-[180px]',
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
      key: 'traineeEmail', label: 'Email', className: 'min-w-[220px]',
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Enrollment Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage course enrollment requests and seat approvals</p>
        </div>
        <div className="flex bg-slate-50/50 border border-slate-200 rounded-lg p-1 gap-1 overflow-x-auto scrollbar-hide w-full sm:w-fit self-start sm:self-auto">
          <button
            onClick={() => { setActiveTab('trainee'); setStatusFilter('all'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer
              ${activeTab === 'trainee'
                ? 'bg-white text-primary-700 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 border border-transparent'
              }`}
          >
            <Users size={14} className={activeTab === 'trainee' ? 'text-primary-600' : 'text-slate-400'} />
            <span>Trainee Enrollments</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${activeTab === 'trainee' ? 'text-primary-600 bg-primary-50' : 'text-slate-500 bg-slate-100'}`}>
              {traineeEnrollments.length}
            </span>
          </button>
          <button
            onClick={() => { setActiveTab('trainer'); setStatusFilter('all'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer
              ${activeTab === 'trainer'
                ? 'bg-white text-primary-700 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 border border-transparent'
              }`}
          >
            <UserCheck size={14} className={activeTab === 'trainer' ? 'text-primary-600' : 'text-slate-400'} />
            <span>Trainer Enrollments</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${activeTab === 'trainer' ? 'text-primary-600 bg-primary-50' : 'text-slate-500 bg-slate-100'}`}>
              {trainerEnrollments.length}
            </span>
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {(['all', 'pending', 'approved', 'rejected', 'completed'] as const).map(s => {
          const count = s === 'all' ? currentEnrollments.length : currentEnrollments.filter(e => e.status === s).length;
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium capitalize transition-all cursor-pointer ${statusFilter === s ? 'bg-primary-600 text-white shadow-sm border-none' : 'bg-white border border-slate-200/60 text-slate-500 hover:text-slate-900'}`}>
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
          searchPlaceholder={activeTab === 'trainee' ? "Search trainee enrollments..." : "Search trainer enrollments..."}
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
              <div className="flex justify-between"><span className="text-slate-500">Course</span><span className="text-slate-900 font-medium text-right ml-4 max-w-[200px] truncate">{viewEnrollment.courseName}</span></div>
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
