import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Pencil, Trash2, Users, Clock, Eye, CalendarClock, PlayCircle, CheckCircle2, XCircle } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { removeBatch } from '../../store/slices/batchesSlice';
import type { Batch, TableColumn } from '../../types';
import { formatDate } from '../../utils/helpers';
import { useToast } from '../../hooks/useToast';

const BatchListPage: React.FC = () => {
  const batches = useAppSelector(s => s.batches.items);
  const dispatch = useAppDispatch();
  const [viewBatch, setViewBatch] = useState<Batch | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const toast = useToast();
  const navigate = useNavigate();

  const openAdd = () => { navigate('/batches/add'); };
  const openEdit = (b: Batch) => { navigate(`/batches/edit/${b.id}`); };

  const doDelete = () => { if (deleteId) { dispatch(removeBatch(deleteId)); toast.warning('Batch removed.'); setDeleteId(null); } };

  const columns: TableColumn<Batch>[] = [
    { key: 'name', label: 'Batch Name', className: 'min-w-[280px]', render: (_, r) => <div className="flex flex-col gap-1.5"><p className="font-semibold text-slate-900 text-sm whitespace-nowrap">{r.name}</p><p className="text-xs text-slate-500 whitespace-nowrap">{r.courseName}</p></div> },
    { key: 'trainerName', label: 'Trainer', className: 'min-w-[150px]', render: (v) => <span className="text-sm text-slate-700 whitespace-nowrap">{String(v)}</span> },
    { key: 'locationName', label: 'Location', className: 'min-w-[120px]', render: (v) => <span className="text-xs whitespace-nowrap">{v ? String(v) : 'Online'}</span> },
    {
      key: 'enrolledCount', label: 'Enrollment', className: 'min-w-[100px]',
      render: (_, r) => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Users size={13} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">{r.enrolledCount}</span>
          <span className="text-xs text-slate-400">/</span>
          <span className="text-xs text-slate-400">{r.seatCapacity}</span>
        </div>
      ),
    },
    { key: 'startDate', label: 'Period', className: 'min-w-[180px]', sortable: false, render: (_, r) => <span className="text-xs whitespace-nowrap">{formatDate(r.startDate)} → {formatDate(r.endDate)}</span> },
    { key: 'attendanceRequired', label: 'Attendance Req.', className: 'min-w-[120px]', render: (v) => <span className="text-xs whitespace-nowrap">{String(v)}%</span> },
    { key: 'status', label: 'Status', className: 'min-w-[100px]', render: (_, r) => <StatusBadge status={r.status} dot /> },
  ];

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Batches & Schedules</h1>
          <p className="text-slate-500 text-sm mt-0.5">{batches.length} batches — {batches.filter(b => b.status === 'active').length} active</p>
        </div>
        <Button icon={<PlusCircle size={15} />} onClick={openAdd}>Create Batch</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Upcoming',  value: batches.filter(b => b.status === 'upcoming').length,  icon: <CalendarClock size={18} />, iconBg: 'bg-amber-50 text-amber-500' },
          { label: 'Active',    value: batches.filter(b => b.status === 'active').length,    icon: <PlayCircle size={18} />,    iconBg: 'bg-emerald-50 text-emerald-600' },
          { label: 'Completed', value: batches.filter(b => b.status === 'completed').length, icon: <CheckCircle2 size={18} />,  iconBg: 'bg-primary-50 text-primary-600' },
          { label: 'Cancelled', value: batches.filter(b => b.status === 'cancelled').length, icon: <XCircle size={18} />,       iconBg: 'bg-slate-100 text-slate-500' },
        ].map(card => (
          <div key={card.label} className="flex items-start justify-between px-4 py-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-300 group">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1.5 tracking-tight">{card.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${card.iconBg} group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ml-3`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex-1 flex flex-col min-h-0">
        <DataTable
          columns={columns as unknown as TableColumn<Record<string, unknown>>[]}
          data={batches as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search batches..."
          actions={(row) => {
            const b = row as unknown as Batch;
            return (
              <div className="flex items-center gap-1.5 justify-end">
                <Button variant="ghost" size="xs" icon={<Eye size={13} />} onClick={() => setViewBatch(b)} />
                <Button variant="ghost" size="xs" icon={<Pencil size={13} />} onClick={() => openEdit(b)} />
                <Button variant="danger" size="xs" icon={<Trash2 size={13} />} onClick={() => setDeleteId(b.id)} />
              </div>
            );
          }}
        />
      </div>

      <Modal isOpen={!!viewBatch} onClose={() => setViewBatch(null)} title="Batch Details" size="lg">
        {viewBatch && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div><h3 className="font-bold text-slate-900 text-lg">{viewBatch.name}</h3><p className="text-slate-500 text-sm">{viewBatch.courseName}</p></div>
              <StatusBadge status={viewBatch.status} dot />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Trainer', value: viewBatch.trainerName },
                { label: 'Location', value: viewBatch.locationName ?? 'Online' },
                { label: 'Start Date', value: formatDate(viewBatch.startDate) },
                { label: 'End Date', value: formatDate(viewBatch.endDate) },
                { label: 'Enrolled', value: `${viewBatch.enrolledCount} / ${viewBatch.seatCapacity}` },
                { label: 'Attendance Required', value: `${viewBatch.attendanceRequired}%` },
              ].map(f => <div key={f.label} className="bg-slate-50 rounded-xl p-3"><p className="text-[11px] text-slate-500">{f.label}</p><p className="text-sm font-medium text-slate-900">{f.value}</p></div>)}
            </div>
            {viewBatch.sessions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Scheduled Sessions</p>
                <div className="space-y-2">
                  {viewBatch.sessions.map(s => (
                    <div key={s.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <Clock size={14} className="text-primary-600 flex-shrink-0" />
                      <div className="flex-1"><p className="text-sm text-slate-900">{s.topic}</p><p className="text-xs text-slate-500">{formatDate(s.date)} · {s.startTime}–{s.endTime}</p></div>
                      <StatusBadge status={s.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={doDelete} title="Delete Batch"
        message="Deleting this batch will remove all session schedules. Enrollments will be preserved." confirmText="Delete Batch" />
    </div>
  );
};

export default BatchListPage;
