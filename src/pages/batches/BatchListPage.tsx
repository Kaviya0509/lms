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
import { formatDate, getInitials, getAvatarColor } from '../../utils/helpers';
import { useToast } from '../../hooks/useToast';

const BatchListPage: React.FC = () => {
  const batches = useAppSelector(s => s.batches.items);
  const trainees = useAppSelector(s => s.trainees.items);
  const dispatch = useAppDispatch();
  const [viewBatch, setViewBatch] = useState<Batch | null>(null);
  const [modalTab, setModalTab] = useState<'details' | 'sessions' | 'trainees'>('details');
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || '');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const toast = useToast();
  const navigate = useNavigate();

  const selectedBatch = batches.find(b => b.id === selectedBatchId) || batches[0];

  const openAdd = () => { navigate('/batches/add'); };
  const openEdit = (b: Batch) => { navigate(`/batches/edit/${b.id}`); };

  const handleViewBatch = (b: Batch) => {
    setViewBatch(b);
    setModalTab('details');
  };

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
              <p className="text-xs font-semibold tracking-wider text-slate-500">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1.5 tracking-tight">{card.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${card.iconBg} group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ml-3`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex flex-col min-h-[300px]">
        <DataTable
          columns={columns as unknown as TableColumn<Record<string, unknown>>[]}
          data={batches as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search batches..."
          onRowClick={(row) => setSelectedBatchId((row as unknown as Batch).id)}
          actions={(row) => {
            const b = row as unknown as Batch;
            return (
              <div className="flex items-center gap-1.5 justify-end">
                <Button variant="ghost" size="xs" icon={<Eye size={13} />} onClick={() => handleViewBatch(b)} />
                <Button variant="ghost" size="xs" icon={<Pencil size={13} />} onClick={() => openEdit(b)} />
                <Button variant="danger" size="xs" icon={<Trash2 size={13} />} onClick={() => setDeleteId(b.id)} />
              </div>
            );
          }}
        />
      </div>

      {selectedBatch && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <CalendarClock className="text-primary-600" size={18} />
            <h2 className="text-sm font-bold text-slate-900">
              Active Details: <span className="text-primary-600">{selectedBatch.name}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left panel: Session Schedule */}
            <div className="lg:col-span-1 bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Session Schedule</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedBatch.name}</p>
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                  {selectedBatch.sessions.length} sessions
                </span>
              </div>
              
              {selectedBatch.sessions.length > 0 ? (
                <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1">
                  {selectedBatch.sessions.map(s => (
                    <div key={s.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <Clock size={14} className="text-primary-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-900">{s.topic}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{formatDate(s.date)} · {s.startTime}–{s.endTime}</p>
                      </div>
                      <StatusBadge status={s.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-8">No sessions scheduled.</p>
              )}
            </div>

            {/* Right panel: Trainee List */}
            <div className="lg:col-span-2 bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Assigned Trainees</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Trainees currently enrolled in this batch</p>
                </div>
                <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-lg">
                  {trainees.filter(t => t.assignedBatch === selectedBatch.id).length} enrolled
                </span>
              </div>

              {trainees.filter(t => t.assignedBatch === selectedBatch.id).length > 0 ? (
                <div className="border border-slate-100 rounded-xl overflow-hidden overflow-y-auto max-h-[360px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 sticky top-0 z-10">
                        <th className="py-2.5 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Name</th>
                        <th className="py-2.5 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
                        <th className="py-2.5 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progress</th>
                        <th className="py-2.5 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainees.filter(t => t.assignedBatch === selectedBatch.id).map(t => (
                        <tr key={t.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                          <td className="py-2.5 px-4 text-sm">
                            <div className="flex items-center gap-2.5">
                              {t.avatar ? (
                                <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-xl object-cover flex-shrink-0" />
                              ) : (
                                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getAvatarColor(t.name)} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0`}>
                                  {getInitials(t.name)}
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-900 text-xs">{t.name}</span>
                                <span className="text-[10px] text-slate-500">{t.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-4">
                            <StatusBadge status={t.type === 'fresher' ? 'info' : 'warning'} label={t.type === 'fresher' ? 'Fresher' : 'Pro'} />
                          </td>
                          <td className="py-2.5 px-4 text-xs font-semibold text-slate-700">
                            {t.overallProgress}%
                          </td>
                          <td className="py-2.5 px-4 text-xs">
                            <span className={`font-semibold px-2 py-0.5 rounded-lg ${t.attendancePercentage >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                              {t.attendancePercentage}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-12">No trainees assigned to this batch.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={!!viewBatch} onClose={() => setViewBatch(null)} title="Batch Details" size="lg">
        {viewBatch && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div><h3 className="font-bold text-slate-900 text-lg">{viewBatch.name}</h3><p className="text-slate-500 text-sm">{viewBatch.courseName}</p></div>
              <StatusBadge status={viewBatch.status} dot />
            </div>

            <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 gap-1 mb-2">
              <button
                onClick={() => setModalTab('details')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                  modalTab === 'details' ? 'bg-white text-primary-700 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Batch Info
              </button>
              <button
                onClick={() => setModalTab('sessions')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                  modalTab === 'sessions' ? 'bg-white text-primary-700 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Schedule ({viewBatch.sessions.length})
              </button>
              <button
                onClick={() => setModalTab('trainees')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                  modalTab === 'trainees' ? 'bg-white text-primary-700 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Trainees ({trainees.filter(t => t.assignedBatch === viewBatch.id).length})
              </button>
            </div>

            {modalTab === 'details' && (
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
            )}

            {modalTab === 'sessions' && (
              <div>
                {viewBatch.sessions.length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {viewBatch.sessions.map(s => (
                      <div key={s.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <Clock size={14} className="text-primary-600 flex-shrink-0" />
                        <div className="flex-1"><p className="text-sm text-slate-900">{s.topic}</p><p className="text-xs text-slate-500">{formatDate(s.date)} · {s.startTime}–{s.endTime}</p></div>
                        <StatusBadge status={s.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-6">No sessions scheduled for this batch.</p>
                )}
              </div>
            )}

            {modalTab === 'trainees' && (
              <div>
                {trainees.filter(t => t.assignedBatch === viewBatch.id).length > 0 ? (
                  <div className="border border-slate-100 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                          <th className="py-2.5 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Name</th>
                          <th className="py-2.5 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
                          <th className="py-2.5 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trainees.filter(t => t.assignedBatch === viewBatch.id).map(t => (
                          <tr key={t.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                            <td className="py-2.5 px-4 text-sm">
                              <div className="flex items-center gap-2.5">
                                {t.avatar ? (
                                  <img src={t.avatar} alt={t.name} className="w-7 h-7 rounded-lg object-cover flex-shrink-0" />
                                ) : (
                                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${getAvatarColor(t.name)} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                                    {getInitials(t.name)}
                                  </div>
                                )}
                                <div className="flex flex-col">
                                  <span className="font-semibold text-slate-900 text-xs">{t.name}</span>
                                  <span className="text-[10px] text-slate-500">{t.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 px-4">
                              <StatusBadge status={t.type === 'fresher' ? 'info' : 'warning'} label={t.type === 'fresher' ? 'Fresher' : 'Pro'} />
                            </td>
                            <td className="py-2.5 px-4 text-xs font-semibold text-slate-700">{t.overallProgress}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-6">No trainees assigned to this batch.</p>
                )}
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
