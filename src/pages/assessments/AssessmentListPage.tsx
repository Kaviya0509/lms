import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Pencil, Trash2, HelpCircle, Clock } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { removeAssessment } from '../../store/slices/assessmentsSlice';
import type { Assessment, TableColumn } from '../../types';
import { useToast } from '../../hooks/useToast';

const AssessmentListPage: React.FC = () => {
  const assessments = useAppSelector(s => s.assessments.items);
  const dispatch = useAppDispatch();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const toast = useToast();
  const navigate = useNavigate();

  const openAdd = () => { navigate('/assessments/add'); };
  const openEdit = (a: Assessment) => { navigate(`/assessments/edit/${a.id}`); };

  const doDelete = () => { if (deleteId) { dispatch(removeAssessment(deleteId)); toast.warning('Assessment removed.'); setDeleteId(null); } };

  const columns: TableColumn<Assessment>[] = [
    { 
      key: 'title', 
      label: 'Assessment Title', 
      className: 'min-w-[280px]', 
      render: (_, r) => (
        <div className="flex flex-col gap-1.5">
          <p className="font-semibold text-slate-900 text-sm whitespace-nowrap">{r.title}</p>
          <p className="text-xs text-slate-500 whitespace-nowrap">{r.courseName}</p>
        </div>
      ) 
    },
    { 
      key: 'type', 
      label: 'Type', 
      className: 'min-w-[120px]', 
      render: (v) => (
        <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md whitespace-nowrap">
          {String(v)}
        </span>
      ) 
    },
    { 
      key: 'totalQuestions', 
      label: 'Questions', 
      className: 'min-w-[110px]', 
      render: (v) => (
        <div className="flex items-center gap-1 whitespace-nowrap">
          <HelpCircle size={13} className="text-slate-500" />
          <span className="text-xs text-slate-700">{String(v)}</span>
        </div>
      ) 
    },
    { 
      key: 'passingScore', 
      label: 'Passing Score', 
      className: 'min-w-[120px]', 
      render: (v) => (
        <span className="text-xs font-bold text-emerald-600 whitespace-nowrap">
          {String(v)}%
        </span>
      ) 
    },
    { 
      key: 'duration', 
      label: 'Duration', 
      className: 'min-w-[120px]', 
      render: (v) => (
        <div className="flex items-center gap-1 whitespace-nowrap">
          <Clock size={13} className="text-slate-500" />
          <span className="text-xs text-slate-700">{String(v)} mins</span>
        </div>
      ) 
    },
    { 
      key: 'maxAttempts', 
      label: 'Max Attempts', 
      className: 'min-w-[120px]', 
      render: (v) => (
        <span className="text-xs text-slate-700 whitespace-nowrap">
          {String(v)}
        </span>
      ) 
    },
    { 
      key: 'status', 
      label: 'Status', 
      className: 'min-w-[120px]', 
      render: (_, r) => (
        <span className="whitespace-nowrap">
          <StatusBadge status={r.status} dot />
        </span>
      ) 
    },
  ];

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Assessment Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Configure quizzes, final exams, passing scores and attempt limits</p>
        </div>
        <Button icon={<PlusCircle size={15} />} onClick={openAdd}>Create Assessment</Button>
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex-1 flex flex-col min-h-0">
        <DataTable
          columns={columns as unknown as TableColumn<Record<string, unknown>>[]}
          data={assessments as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search assessments..."
          actions={(row) => {
            const a = row as unknown as Assessment;
            return (
              <div className="flex items-center gap-1.5 justify-end">
                <Button variant="ghost" size="xs" icon={<Pencil size={13} />} onClick={() => openEdit(a)} />
                <Button variant="danger" size="xs" icon={<Trash2 size={13} />} onClick={() => setDeleteId(a.id)} />
              </div>
            );
          }}
        />
      </div>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={doDelete} title="Delete Assessment"
        message="Deleting this assessment will remove it from all course requirements." confirmText="Delete" />
    </div>
  );
};

export default AssessmentListPage;
