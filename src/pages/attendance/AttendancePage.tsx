import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Clock, ShieldAlert } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { mockAttendance } from '../../services/mockData';
import type { AttendanceRecord, TableColumn } from '../../types';
import { formatDate } from '../../utils/helpers';
import { useToast } from '../../hooks/useToast';

const AttendancePage: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>(mockAttendance);
  const [filter, setFilter] = useState<'all' | 'flagged'>('all');
  const toast = useToast();

  const filtered = records.filter(r => filter === 'all' || r.flagged);
  const flaggedCount = records.filter(r => r.flagged).length;

  const handleMark = (id: string, status: 'present' | 'absent' | 'late') => {
    setRecords(prev => prev.map(r => {
      if (r.id !== id) return r;
      const newPct = status === 'present' ? Math.min(100, r.percentage + 5) : Math.max(0, r.percentage - 10);
      return { ...r, status, percentage: newPct, flagged: newPct < r.required };
    }));
    toast.info(`Attendance marked as ${status}.`);
  };

  const columns: TableColumn<AttendanceRecord>[] = [
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

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Attendance Oversight</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track session attendance and flag low-attendance trainees</p>
        </div>
      </div>

      {flaggedCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert size={20} className="text-red-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-700">{flaggedCount} Trainee(s) with Low Attendance</p>
              <p className="text-xs text-red-600/80 mt-0.5">Attendance falls below the minimum required 80% threshold for batch completion.</p>
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={() => setFilter(f => f === 'all' ? 'flagged' : 'all')}>
            {filter === 'all' ? 'View Low Attendance Only' : 'Show All'}
          </Button>
        </div>
      )}

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex-1 flex flex-col min-h-0">
        <DataTable
          columns={columns as unknown as TableColumn<Record<string, unknown>>[]}
          data={filtered as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search attendance records..."
          actions={(row) => {
            const r = row as unknown as AttendanceRecord;
            return (
              <div className="flex items-center gap-1 justify-end">
                <Button variant="ghost" size="xs" className="text-emerald-600 hover:bg-emerald-50" icon={<CheckCircle2 size={13} />} onClick={() => handleMark(r.id, 'present')}>Present</Button>
                <Button variant="ghost" size="xs" className="text-amber-600 hover:bg-amber-50" icon={<Clock size={13} />} onClick={() => handleMark(r.id, 'late')}>Late</Button>
                <Button variant="ghost" size="xs" className="text-red-600 hover:bg-red-50" icon={<XCircle size={13} />} onClick={() => handleMark(r.id, 'absent')}>Absent</Button>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default AttendancePage;
