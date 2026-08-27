import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Pencil, Trash2, Eye, CheckCircle2, Users, UserCheck, UserX, Clock, AlertTriangle, TrendingUp, XCircle } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { removeTrainee, approveTraineeStatus } from '../../store/slices/traineesSlice';
import type { Trainee, TableColumn } from '../../types';
import { getInitials, getAvatarColor, formatDate } from '../../utils/helpers';
import { useToast } from '../../hooks/useToast';


const TraineeListPage: React.FC = () => {
  const trainees = useAppSelector(s => s.trainees.items);
  const dispatch = useAppDispatch();
  const [viewTrainee, setViewTrainee] = useState<Trainee | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | 'fresher' | 'professional'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const toast = useToast();
  const navigate = useNavigate();

  const filtered = trainees.filter(t =>
    (typeFilter === 'all' || t.type === typeFilter) &&
    (statusFilter === 'all' || t.status === statusFilter)
  );

  const openAdd = () => { navigate('/trainees/add'); };
  const openEdit = (t: Trainee) => { navigate(`/trainees/edit/${t.id}`); };

  const approveTrainee = (id: string) => {
    dispatch(approveTraineeStatus(id));
    toast.success('Trainee approved and activated!');
  };

  const doDelete = () => { if (deleteId) { dispatch(removeTrainee(deleteId)); toast.warning('Trainee removed.'); setDeleteId(null); } };

  const columns: TableColumn<Trainee>[] = [
    {
      key: 'name', label: 'Trainee', className: 'min-w-[180px]',
      render: (_, r) => (
        <div className="flex items-center gap-3">
          {r.avatar ? (
            <img src={r.avatar} alt={r.name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0 border border-slate-100 shadow-sm" />
          ) : (
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getAvatarColor(r.name)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
              {getInitials(r.name)}
            </div>
          )}
          <span className="font-semibold text-slate-900 text-sm whitespace-nowrap">{r.name}</span>
        </div>
      ),
    },
    {
      key: 'email', label: 'Email', className: 'min-w-[180px]',
      render: (v) => <span className="text-xs text-slate-600 font-medium whitespace-nowrap">{String(v)}</span>
    },
    {
      key: 'type', label: 'Type', className: 'min-w-[120px]',
      render: (_, r) => <StatusBadge status={r.type === 'fresher' ? 'info' : 'warning'} label={r.type === 'fresher' ? 'Fresher' : 'Professional'} />,
      filterOptions: [
        { value: 'fresher', label: 'Fresher' },
        { value: 'professional', label: 'Professional' }
      ]
    },
    { key: 'location', label: 'Location', className: 'min-w-[120px]', render: (v) => <span className="text-xs whitespace-nowrap">{String(v)}</span> },
    { key: 'overallProgress', label: 'Progress', className: 'min-w-[100px]', sortable: false, render: (_, r) => <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg whitespace-nowrap ${r.overallProgress >= 80 ? 'bg-emerald-50 text-emerald-700' : r.overallProgress >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{r.overallProgress}%</span> },
    { key: 'attendancePercentage', label: 'Attendance', className: 'min-w-[110px]', sortable: false, render: (_, r) => <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg whitespace-nowrap ${r.attendancePercentage >= 60 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>{r.attendancePercentage}%</span> },
    {
      key: 'status', label: 'Status', className: 'min-w-[100px]',
      render: (_, r) => <StatusBadge status={r.status} dot />,
      filterOptions: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' }
      ]
    },
    { key: 'joinedAt', label: 'Joined', className: 'min-w-[120px]', render: (v) => <span className="text-xs whitespace-nowrap">{formatDate(String(v))}</span> },
  ];

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Trainee Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">{trainees.length} trainees registered</p>
        </div>
        <Button icon={<UserPlus size={15} />} onClick={openAdd}>Add Trainee</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total Trainees', value: trainees.length,                                                                                                          icon: <Users size={18} />,         iconBg: 'bg-primary-50 text-primary-600'  },
          { label: 'Active',          value: trainees.filter(t => t.status === 'active').length,                                                                        icon: <UserCheck size={18} />,     iconBg: 'bg-emerald-50 text-emerald-600'  },
          { label: 'Inactive',        value: trainees.filter(t => t.status === 'inactive').length,                                                                      icon: <UserX size={18} />,         iconBg: 'bg-slate-100 text-slate-500'     },
          { label: 'Pending',         value: trainees.filter(t => t.status === 'pending').length,                                                                       icon: <Clock size={18} />,         iconBg: 'bg-amber-50 text-amber-500'      },
          { label: 'Low Attendance',  value: trainees.filter(t => t.attendancePercentage < 60 && t.status === 'active').length,                                         icon: <AlertTriangle size={18} />, iconBg: 'bg-red-50 text-red-500'          },
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

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-slate-100/60 border border-slate-200 rounded-lg p-1 gap-1">
          {(['all', 'fresher', 'professional'] as const).map(f => (
            <button key={f} onClick={() => setTypeFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${typeFilter === f ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex bg-slate-100/60 border border-slate-200 rounded-lg p-1 gap-1">
          {(['all', 'active', 'inactive', 'pending'] as const).map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${statusFilter === f ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl">
          <TrendingUp size={13} className="text-amber-600" />
          <span className="text-xs text-amber-700">{trainees.filter(t => t.attendancePercentage < 60 && t.status === 'active').length} flagged for low attendance</span>
        </div>
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex-1 flex flex-col min-h-0">
        <DataTable
          columns={columns as unknown as TableColumn<Record<string, unknown>>[]}
          data={filtered as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search trainees..."
          actions={(row) => {
            const t = row as unknown as Trainee;
            return (
              <div className="flex items-center gap-1.5 justify-end">
                <Button variant="ghost" size="xs" icon={<Eye size={13} />} onClick={() => setViewTrainee(t)} />
                <Button variant="ghost" size="xs" icon={<Pencil size={13} />} onClick={() => openEdit(t)} />
                {t.status === 'pending' && <Button variant="success" size="xs" icon={<CheckCircle2 size={13} />} onClick={() => approveTrainee(t.id)} />}
                <Button variant="danger" size="xs" icon={<Trash2 size={13} />} onClick={() => setDeleteId(t.id)} />
              </div>
            );
          }}
        />
      </div>

      <Modal isOpen={!!viewTrainee} onClose={() => setViewTrainee(null)} title="Trainee Profile" size="lg">
        {viewTrainee && (
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              {viewTrainee.avatar ? (
                <img src={viewTrainee.avatar} alt={viewTrainee.name} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 border border-slate-200 shadow-sm" />
              ) : (
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getAvatarColor(viewTrainee.name)} flex items-center justify-center text-slate-900 text-lg font-bold flex-shrink-0`}>
                  {getInitials(viewTrainee.name)}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-slate-900">{viewTrainee.name}</h3>
                <p className="text-slate-500 text-sm">{viewTrainee.email} · {viewTrainee.mobile}</p>
                <div className="flex gap-2 mt-2"><StatusBadge status={viewTrainee.status} dot /><StatusBadge status={viewTrainee.type} /></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Location', value: viewTrainee.location },
                { label: 'Type', value: viewTrainee.type },
                { label: 'Company', value: viewTrainee.company ?? 'N/A' },
                { label: 'Experience', value: viewTrainee.experience ? `${viewTrainee.experience}y` : 'N/A' },
                { label: 'Enrolled Courses', value: viewTrainee.enrolledCourses.length },
                { label: 'Joined', value: formatDate(viewTrainee.joinedAt) },
              ].map(f => <div key={f.label} className="bg-slate-50 rounded-xl p-3"><p className="text-[11px] text-slate-500">{f.label}</p><p className="text-sm font-medium text-slate-900">{f.value}</p></div>)}
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-1.5">Overall Progress</p>
                <span className={`text-sm font-semibold px-2 py-0.5 rounded-lg ${viewTrainee.overallProgress >= 80 ? 'bg-emerald-50 text-emerald-700' : viewTrainee.overallProgress >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{viewTrainee.overallProgress}%</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1.5">Attendance {viewTrainee.attendancePercentage < 60 && <span className="text-red-600 ml-1">⚠ Low — follow up required</span>}</p>
                <span className={`text-sm font-semibold px-2 py-0.5 rounded-lg ${viewTrainee.attendancePercentage >= 60 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>{viewTrainee.attendancePercentage}%</span>
              </div>
            </div>
            {viewTrainee.status === 'pending' && (
              <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-700 flex-1">This trainee is pending approval.</p>
                <Button size="sm" variant="success" icon={<CheckCircle2 size={14} />} onClick={() => { approveTrainee(viewTrainee.id); setViewTrainee(null); }}>Approve</Button>
                <Button size="sm" variant="danger" icon={<XCircle size={14} />}>Reject</Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={doDelete} title="Remove Trainee" message="Are you sure you want to remove this trainee? All their enrollment and progress data will be archived." confirmText="Remove" />
    </div>
  );
};

export default TraineeListPage;
