import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Pencil, Trash2, Star, Eye, Users, UserCheck, UserX, CalendarClock, ToggleLeft, ToggleRight } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { removeTrainer, toggleTrainerStatus } from '../../store/slices/trainersSlice';
import type { Trainer, TableColumn } from '../../types';
import { getInitials, getAvatarColor, formatDate } from '../../utils/helpers';
import { useToast } from '../../hooks/useToast';

const TrainerListPage: React.FC = () => {
  const trainers = useAppSelector(s => s.trainers.items);
  const dispatch = useAppDispatch();
  const [viewTrainer, setViewTrainer] = useState<Trainer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const toast = useToast();
  const navigate = useNavigate();

  const openAdd = () => {
    navigate('/trainers/add');
  };

  const openEdit = (t: Trainer) => {
    navigate(`/trainers/edit/${t.id}`);
  };

  const toggleStatus = (id: string) => {
    dispatch(toggleTrainerStatus(id));
    toast.info('Trainer status updated.');
  };

  const doDelete = () => {
    if (deleteId) { dispatch(removeTrainer(deleteId)); toast.warning('Trainer removed.'); setDeleteId(null); }
  };

  const columns: TableColumn<Trainer>[] = [
    {
      key: 'name', label: 'Trainer', className: 'min-w-[180px]',
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
    { key: 'qualification', label: 'Qualification', className: 'min-w-[180px]', render: (v) => <span className="text-xs whitespace-nowrap">{String(v)}</span> },
    {
      key: 'expertise', label: 'Expertise', className: 'min-w-[220px]',
      render: (_, r) => (
        <div className="flex flex-wrap gap-1 items-center">
          {r.expertise.slice(0, 2).map(e => <span key={e} className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-lg whitespace-nowrap">{e}</span>)}
          {r.expertise.length > 2 && <span className="text-xs text-slate-500 whitespace-nowrap">+{r.expertise.length - 2}</span>}
        </div>
      ),
    },
    { key: 'experience', label: 'Exp.', className: 'min-w-[80px]', render: (v) => <span className="whitespace-nowrap">{String(v)}y</span> },
    {
      key: 'rating', label: 'Rating', className: 'min-w-[100px]',
      render: (_, r) => r.rating ? <span className="flex items-center gap-1 text-amber-600 text-sm whitespace-nowrap"><Star size={12} fill="currentColor" />{r.rating}</span> : <span className="text-slate-400">—</span>,
    },
    { key: 'totalBatches', label: 'Batches', className: 'min-w-[90px]' },
    {
      key: 'availability', label: 'Availability', className: 'min-w-[120px]',
      render: (v) => <StatusBadge status={String(v)} label={String(v)} />,
      filterOptions: [
        { value: 'full-time', label: 'Full-Time' },
        { value: 'part-time', label: 'Part-Time' }
      ]
    },
    {
      key: 'status', label: 'Status', className: 'min-w-[100px]',
      render: (_, r) => <StatusBadge status={r.status} dot />,
      filterOptions: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    },
    { key: 'joinedAt', label: 'Joined', className: 'min-w-[120px]', render: (v) => <span className="text-xs whitespace-nowrap">{formatDate(String(v))}</span> },
  ];

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Trainer Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">{trainers.length} trainers registered</p>
        </div>
        <Button icon={<UserPlus size={15} />} onClick={openAdd}>Add Trainer</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total Trainers',  value: trainers.length,                                                                                                   icon: <Users size={18} />,         iconBg: 'bg-primary-50 text-primary-600' },
          { label: 'Active',          value: trainers.filter(t => t.status === 'active').length,                                                                 icon: <UserCheck size={18} />,     iconBg: 'bg-emerald-50 text-emerald-600' },
          { label: 'Inactive',        value: trainers.filter(t => t.status === 'inactive').length,                                                               icon: <UserX size={18} />,         iconBg: 'bg-slate-100 text-slate-500'   },
          { label: 'Avg. Rating',     value: (() => { const r = trainers.filter(t => t.rating); return r.length ? (r.reduce((s,t) => s+(t.rating??0),0)/r.length).toFixed(1) : '—'; })(), icon: <Star size={18} />,        iconBg: 'bg-amber-50 text-amber-500'   },
          { label: 'Total Batches',   value: trainers.reduce((s, t) => s + (t.totalBatches ?? 0), 0),                                                           icon: <CalendarClock size={18} />, iconBg: 'bg-violet-50 text-violet-600' },
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
          data={trainers as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search trainers..."
          actions={(row) => {
            const t = row as unknown as Trainer;
            return (
              <div className="flex items-center gap-1.5 justify-end">
                <Button variant="ghost" size="xs" icon={<Eye size={13} />} onClick={() => setViewTrainer(t)} />
                <Button variant="ghost" size="xs" icon={<Pencil size={13} />} onClick={() => openEdit(t)} />
                <Button variant="ghost" size="xs" icon={t.status === 'active' ? <ToggleRight size={13} className="text-emerald-600" /> : <ToggleLeft size={13} className="text-slate-500" />} onClick={() => toggleStatus(t.id)} />
                <Button variant="danger" size="xs" icon={<Trash2 size={13} />} onClick={() => setDeleteId(t.id)} />
              </div>
            );
          }}
        />
      </div>

      <Modal isOpen={!!viewTrainer} onClose={() => setViewTrainer(null)} title="Trainer Profile" size="lg">
        {viewTrainer && (
          <div className="space-y-5">
            <div className="flex items-start gap-5">
              {viewTrainer.avatar ? (
                <img src={viewTrainer.avatar} alt={viewTrainer.name} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-slate-200 shadow-sm" />
              ) : (
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getAvatarColor(viewTrainer.name)} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>
                  {getInitials(viewTrainer.name)}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-slate-900">{viewTrainer.name}</h3>
                <p className="text-slate-500">{viewTrainer.email} · {viewTrainer.mobile}</p>
                <div className="flex gap-2 mt-2"><StatusBadge status={viewTrainer.status} dot /> <StatusBadge status={viewTrainer.availability} /></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Qualification', value: viewTrainer.qualification },
                { label: 'Experience', value: `${viewTrainer.experience} Years` },
                { label: 'Total Batches', value: viewTrainer.totalBatches },
                { label: 'Rating', value: viewTrainer.rating ? `⭐ ${viewTrainer.rating}` : 'Not rated' },
                { label: 'Joined', value: formatDate(viewTrainer.joinedAt) },
              ].map(f => (
                <div key={f.label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-0.5">{f.label}</p>
                  <p className="text-sm font-medium text-slate-900">{f.value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-2">Expertise Areas</p>
              <div className="flex flex-wrap gap-2">{viewTrainer.expertise.map(e => <span key={e} className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-lg">{e}</span>)}</div>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-2">Certifications</p>
              <div className="flex flex-wrap gap-2">{viewTrainer.certifications.map(c => <span key={c} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-lg">{c}</span>)}</div>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Bio</p>
              <p className="text-sm text-slate-700 leading-relaxed">{viewTrainer.bio}</p>
            </div>
          </div>
        )}
      </Modal>



      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={doDelete}
        title="Delete Trainer" message="Are you sure you want to remove this trainer? All their batch assignments will be unlinked." confirmText="Delete Trainer" />
    </div>
  );
};

export default TrainerListPage;
