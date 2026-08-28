import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Clock, ShieldAlert, Users, UserCheck } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { mockAttendance, mockTrainerAttendance } from '../../services/mockData';
import type { AttendanceRecord, TrainerAttendanceRecord, TableColumn } from '../../types';
import { formatDate } from '../../utils/helpers';
import { useToast } from '../../hooks/useToast';

const AttendancePage: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>(mockAttendance);
  const [trainerRecords, setTrainerRecords] = useState<TrainerAttendanceRecord[]>(mockTrainerAttendance);
  const [activeTab, setActiveTab] = useState<'trainee' | 'trainer'>('trainee');
  const [filter, setFilter] = useState<'all' | 'flagged'>('all');
  const toast = useToast();

  const filtered = activeTab === 'trainee'
    ? records.filter(r => filter === 'all' || r.flagged)
    : trainerRecords.filter(r => filter === 'all' || r.flagged);

  const flaggedCount = records.filter(r => r.flagged).length;
  const flaggedTrainerCount = trainerRecords.filter(r => r.flagged).length;
  const activeFlaggedCount = activeTab === 'trainee' ? flaggedCount : flaggedTrainerCount;

  const handleMarkTrainee = (id: string, status: 'present' | 'absent' | 'late') => {
    setRecords(prev => prev.map(r => {
      if (r.id !== id) return r;
      const newPct = status === 'present' ? Math.min(100, r.percentage + 5) : Math.max(0, r.percentage - 10);
      return { ...r, status, percentage: newPct, flagged: newPct < r.required };
    }));
    toast.info(`Trainee attendance marked as ${status}.`);
  };

  const handleMarkTrainer = (id: string, status: 'present' | 'absent' | 'late') => {
    setTrainerRecords(prev => prev.map(r => {
      if (r.id !== id) return r;
      const newPct = status === 'present' ? Math.min(100, r.percentage + 2) : Math.max(0, r.percentage - 8);
      return { ...r, status, percentage: newPct, flagged: newPct < r.required };
    }));
    toast.info(`Trainer attendance marked as ${status}.`);
  };

  const traineeColumns: TableColumn<AttendanceRecord>[] = [
    { key: 'traineeName', label: 'Trainee Name', render: (v) => <span className="font-semibold text-slate-900 text-sm">{String(v)}</span> },
    { key: 'batchName', label: 'Batch', render: (v) => <span className="text-xs text-slate-700">{String(v)}</span> },
    { key: 'sessionDate', label: 'Session Date', render: (v) => <span className="text-xs">{formatDate(String(v))}</span> },
    {
      key: 'percentage', label: 'Attendance %',
      render: (_, r) => (
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
            r.percentage >= r.required ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
          }`}>{r.percentage}%</span>
          <span className="text-[10px] text-slate-400">(min {r.required}%)</span>
        </div>
      ),
    },
    { key: 'status', label: 'Status', render: (_, r) => <StatusBadge status={r.status} dot /> },
    {
      key: 'flagged', label: 'Alert Flag',
      render: (_, r) => r.flagged ? (
        <span className="inline-flex items-center gap-1 text-xs text-red-700 font-medium bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
          <AlertTriangle size={11} /> Low Attendance
        </span>
      ) : <span className="text-xs text-slate-500">Normal</span>,
    },
  ];

  const trainerColumns: TableColumn<TrainerAttendanceRecord>[] = [
    { key: 'trainerName', label: 'Trainer Name', render: (v) => <span className="font-semibold text-slate-900 text-sm">{String(v)}</span> },
    { key: 'batchName', label: 'Batch', render: (v) => <span className="text-xs text-slate-700">{String(v)}</span> },
    { key: 'sessionDate', label: 'Session Date', render: (v) => <span className="text-xs">{formatDate(String(v))}</span> },
    {
      key: 'percentage', label: 'Attendance %',
      render: (_, r) => (
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
            r.percentage >= r.required ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
          }`}>{r.percentage}%</span>
          <span className="text-[10px] text-slate-400">(min {r.required}%)</span>
        </div>
      ),
    },
    { key: 'status', label: 'Status', render: (_, r) => <StatusBadge status={r.status} dot /> },
    {
      key: 'flagged', label: 'Alert Flag',
      render: (_, r) => r.flagged ? (
        <span className="inline-flex items-center gap-1 text-xs text-red-700 font-medium bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
          <AlertTriangle size={11} /> Low Attendance
        </span>
      ) : <span className="text-xs text-slate-500">Normal</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-outfit">Attendance Oversight</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track session attendance and flag low-attendance individuals</p>
        </div>
        <div className="flex bg-slate-50/50 border border-slate-200 rounded-lg p-1 gap-1 overflow-x-auto scrollbar-hide w-full sm:w-fit self-start sm:self-auto">
          <button
            onClick={() => { setActiveTab('trainee'); setFilter('all'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer
              ${activeTab === 'trainee'
                ? 'bg-white text-primary-700 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 border border-transparent'
              }`}
          >
            <Users size={14} className={activeTab === 'trainee' ? 'text-primary-600' : 'text-slate-400'} />
            <span>Trainee Attendance</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${activeTab === 'trainee' ? 'text-primary-600 bg-primary-50' : 'text-slate-500 bg-slate-100'}`}>
              {records.length}
            </span>
          </button>
          <button
            onClick={() => { setActiveTab('trainer'); setFilter('all'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer
              ${activeTab === 'trainer'
                ? 'bg-white text-primary-700 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 border border-transparent'
              }`}
          >
            <UserCheck size={14} className={activeTab === 'trainer' ? 'text-primary-600' : 'text-slate-400'} />
            <span>Trainer Attendance</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${activeTab === 'trainer' ? 'text-primary-600 bg-primary-50' : 'text-slate-500 bg-slate-100'}`}>
              {trainerRecords.length}
            </span>
          </button>
        </div>
      </div>

      {activeFlaggedCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert size={20} className="text-red-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-700">
                {activeFlaggedCount} {activeTab === 'trainee' ? 'Trainee(s)' : 'Trainer(s)'} with Low Attendance
              </p>
              <p className="text-xs text-red-600/80 mt-0.5">
                Attendance falls below the minimum required {activeTab === 'trainee' ? '80%' : '90%'} threshold threshold for platform guidelines.
              </p>
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={() => setFilter(f => f === 'all' ? 'flagged' : 'all')}>
            {filter === 'all' 
              ? 'View Low Attendance Only' 
              : 'Show All'}
          </Button>
        </div>
      )}

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex-1 flex flex-col min-h-0">
        <DataTable
          columns={(activeTab === 'trainee' ? traineeColumns : trainerColumns) as unknown as TableColumn<Record<string, unknown>>[]}
          data={filtered as unknown as Record<string, unknown>[]}
          searchPlaceholder={activeTab === 'trainee' ? "Search trainee attendance..." : "Search trainer attendance..."}
          actions={(row) => {
            const r = row as unknown as (AttendanceRecord | TrainerAttendanceRecord);
            return (
              <div className="flex items-center gap-1 justify-end">
                <Button variant="ghost" size="xs" className="text-emerald-600 hover:bg-emerald-50" icon={<CheckCircle2 size={13} />} onClick={() => activeTab === 'trainee' ? handleMarkTrainee(r.id, 'present') : handleMarkTrainer(r.id, 'present')}>Present</Button>
                <Button variant="ghost" size="xs" className="text-amber-600 hover:bg-amber-50" icon={<Clock size={13} />} onClick={() => activeTab === 'trainee' ? handleMarkTrainee(r.id, 'late') : handleMarkTrainer(r.id, 'late')}>Late</Button>
                <Button variant="ghost" size="xs" className="text-red-600 hover:bg-red-50" icon={<XCircle size={13} />} onClick={() => activeTab === 'trainee' ? handleMarkTrainee(r.id, 'absent') : handleMarkTrainer(r.id, 'absent')}>Absent</Button>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default AttendancePage;
