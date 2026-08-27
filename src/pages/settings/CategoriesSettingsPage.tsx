import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FolderTree, ListOrdered, ClipboardCheck, Award, CalendarCheck, Settings as SettingsIcon,
  Plus, Pencil, Trash2, Check, X, Save,
} from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { FormField, SelectField } from '../../components/forms';
import { useToast } from '../../hooks/useToast';
import { mockCategories } from '../../services/mockData';
import { truncate } from '../../utils/helpers';
import type { Category, TableColumn } from '../../types';

type TabId = 'categories' | 'levels' | 'assessment' | 'certificate' | 'attendance' | 'system';

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'categories', label: 'Course Categories', icon: FolderTree },
  { id: 'levels', label: 'Course Levels', icon: ListOrdered },
  { id: 'assessment', label: 'Assessment Settings', icon: ClipboardCheck },
  { id: 'certificate', label: 'Certificate Settings', icon: Award },
  { id: 'attendance', label: 'Attendance Settings', icon: CalendarCheck },
  { id: 'system', label: 'System Settings', icon: SettingsIcon },
];

const SettingsSection: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
    <div className="mb-5">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500 mt-0.5">{description}</p>
    </div>
    {children}
  </div>
);

import { useNavigate } from 'react-router-dom';

const CourseCategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const toast = useToast();
  const navigate = useNavigate();

  const openAdd = () => { navigate('/settings/categories/add'); };
  const openEdit = (c: Category) => { navigate(`/settings/categories/edit/${c.id}`); };

  const doDelete = () => {
    if (deleteId) {
      setCategories(prev => prev.filter(c => c.id !== deleteId));
      toast.warning('Category deleted.');
      setDeleteId(null);
    }
  };

  const columns: TableColumn<Category>[] = [
    { key: 'name', label: 'Name', render: (v) => <span className="font-medium text-slate-900 text-sm">{String(v)}</span> },
    { key: 'description', label: 'Description', render: (v) => <span className="text-xs text-slate-500">{truncate(String(v), 60)}</span> },
    { key: 'coursesCount', label: 'Courses', render: (v) => <span className="text-sm text-slate-700">{String(v)}</span> },
    { key: 'status', label: 'Status', render: (_, r) => <StatusBadge status={r.status} dot /> },
  ];

  return (
    <SettingsSection title="Course Categories" description="Manage the categories used to organize courses across the platform.">
      <div className="flex justify-end mb-4">
        <Button icon={<Plus size={15} />} onClick={openAdd}>Add Category</Button>
      </div>
      <DataTable
        columns={columns as unknown as TableColumn<Record<string, unknown>>[]}
        data={categories as unknown as Record<string, unknown>[]}
        searchPlaceholder="Search categories..."
        actions={(row) => {
          const c = row as unknown as Category;
          return (
            <div className="flex items-center gap-1.5 justify-end">
              <Button variant="ghost" size="xs" icon={<Pencil size={13} />} onClick={() => openEdit(c)} />
              <Button variant="danger" size="xs" icon={<Trash2 size={13} />} onClick={() => setDeleteId(c.id)} />
            </div>
          );
        }}
      />

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={doDelete}
        title="Delete Category"
        message="Deleting this category will affect course counts and may leave courses currently linked to it uncategorized. Are you sure you want to continue?"
        confirmText="Delete Category" />
    </SettingsSection>
  );
};

interface Level { id: string; name: string; }

const CourseLevelsSection: React.FC = () => {
  const [levels, setLevels] = useState<Level[]>([
    { id: 'lvl-1', name: 'Beginner' },
    { id: 'lvl-2', name: 'Intermediate' },
    { id: 'lvl-3', name: 'Advanced' },
  ]);
  const [newLevel, setNewLevel] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const toast = useToast();

  const addLevel = () => {
    const name = newLevel.trim();
    if (!name) { toast.error('Level name cannot be empty.'); return; }
    if (levels.some(l => l.name.toLowerCase() === name.toLowerCase())) { toast.error('This level already exists.'); return; }
    setLevels(prev => [...prev, { id: `lvl-${Date.now()}`, name }]);
    setNewLevel('');
    toast.success('Level added successfully!');
  };

  const startEdit = (l: Level) => { setEditingId(l.id); setEditValue(l.name); };

  const saveEdit = (id: string) => {
    const name = editValue.trim();
    if (!name) { toast.error('Level name cannot be empty.'); return; }
    setLevels(prev => prev.map(l => l.id === id ? { ...l, name } : l));
    setEditingId(null);
    toast.success('Level renamed successfully!');
  };

  const doDelete = () => {
    if (deleteId) { setLevels(prev => prev.filter(l => l.id !== deleteId)); toast.warning('Level removed.'); setDeleteId(null); }
  };

  return (
    <SettingsSection title="Course Levels" description="Manage the difficulty levels available when creating courses.">
      <div className="flex gap-3 mb-5">
        <FormField
          containerClassName="flex-1"
          placeholder="e.g. Expert"
          value={newLevel}
          onChange={e => setNewLevel(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addLevel(); } }}
        />
        <Button icon={<Plus size={15} />} onClick={addLevel} className="self-start mt-[1px]">Add Level</Button>
      </div>

      <div className="space-y-2">
        {levels.length === 0 && <p className="text-sm text-slate-500 text-center py-6">No levels configured.</p>}
        {levels.map(l => (
          <div key={l.id} className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            {editingId === l.id ? (
              <input
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveEdit(l.id); if (e.key === 'Escape') setEditingId(null); }}
                autoFocus
                className="flex-1 bg-white border border-primary-500/50 rounded-lg px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              />
            ) : (
              <span className="text-sm font-medium text-slate-900">{l.name}</span>
            )}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {editingId === l.id ? (
                <>
                  <Button variant="ghost" size="xs" icon={<Check size={13} className="text-emerald-400" />} onClick={() => saveEdit(l.id)} />
                  <Button variant="ghost" size="xs" icon={<X size={13} />} onClick={() => setEditingId(null)} />
                </>
              ) : (
                <>
                  <Button variant="ghost" size="xs" icon={<Pencil size={13} />} onClick={() => startEdit(l)} />
                  <Button variant="danger" size="xs" icon={<Trash2 size={13} />} onClick={() => setDeleteId(l.id)} />
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={doDelete}
        title="Delete Level" message="Are you sure you want to remove this course level? Existing courses using this level will be unaffected." confirmText="Delete Level" />
    </SettingsSection>
  );
};

const assessmentSettingsSchema = z.object({
  defaultPassingScore: z.number().min(0, 'Min 0').max(100, 'Max 100'),
  defaultMaxAttempts: z.number().min(1, 'At least 1 attempt'),
  allowRetakeAfterDays: z.number().min(0, 'Cannot be negative'),
  randomizeQuestionOrder: z.boolean(),
  showResultsImmediately: z.boolean(),
});
type AssessmentSettingsForm = z.infer<typeof assessmentSettingsSchema>;

const AssessmentSettingsSection: React.FC = () => {
  const toast = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AssessmentSettingsForm>({
    resolver: zodResolver(assessmentSettingsSchema),
    defaultValues: {
      defaultPassingScore: 60,
      defaultMaxAttempts: 3,
      allowRetakeAfterDays: 2,
      randomizeQuestionOrder: true,
      showResultsImmediately: true,
    },
  });

  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 600));
    toast.success('Assessment settings saved successfully!');
  };

  return (
    <SettingsSection title="Assessment Settings" description="Configure the default rules applied to assessments across courses.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Default Passing Score (%)" type="number" min={0} max={100} required {...register('defaultPassingScore', { valueAsNumber: true })} error={errors.defaultPassingScore?.message} />
          <FormField label="Default Max Attempts" type="number" min={1} required {...register('defaultMaxAttempts', { valueAsNumber: true })} error={errors.defaultMaxAttempts?.message} />
          <FormField label="Allow Retake After (days)" type="number" min={0} required {...register('allowRetakeAfterDays', { valueAsNumber: true })} error={errors.allowRetakeAfterDays?.message} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: 'randomizeQuestionOrder' as const, label: 'Randomize Question Order', desc: 'Shuffle questions for every attempt' },
            { name: 'showResultsImmediately' as const, label: 'Show Results Immediately', desc: 'Display results right after submission' },
          ].map(f => (
            <label key={f.name} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
              <input type="checkbox" {...register(f.name)} className="w-4 h-4 accent-primary-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">{f.label}</p>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </div>
            </label>
          ))}
        </div>
        <div className="flex justify-end pt-2 border-t border-slate-100 shadow-sm">
          <Button type="submit" icon={<Save size={15} />} loading={isSubmitting}>Save Settings</Button>
        </div>
      </form>
    </SettingsSection>
  );
};

const certificateSettingsSchema = z.object({
  minAttendancePercent: z.number().min(0, 'Min 0').max(100, 'Max 100'),
  minScorePercent: z.number().min(0, 'Min 0').max(100, 'Max 100'),
  autoIssue: z.boolean(),
  requireApproval: z.boolean(),
  certificatePrefix: z.string().min(2, 'Prefix is required').max(30, 'Max 30 characters'),
});
type CertificateSettingsForm = z.infer<typeof certificateSettingsSchema>;

const CertificateSettingsSection: React.FC = () => {
  const toast = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CertificateSettingsForm>({
    resolver: zodResolver(certificateSettingsSchema),
    defaultValues: {
      minAttendancePercent: 75,
      minScorePercent: 60,
      autoIssue: true,
      requireApproval: false,
      certificatePrefix: 'LMS-2024-CERT-',
    },
  });

  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 600));
    toast.success('Certificate settings saved successfully!');
  };

  return (
    <SettingsSection title="Certificate Settings" description="Configure eligibility defaults and issuance behavior for certificates.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Default Minimum Attendance (%)" type="number" min={0} max={100} required {...register('minAttendancePercent', { valueAsNumber: true })} error={errors.minAttendancePercent?.message} />
          <FormField label="Default Minimum Score (%)" type="number" min={0} max={100} required {...register('minScorePercent', { valueAsNumber: true })} error={errors.minScorePercent?.message} />
        </div>
        <FormField label="Certificate ID Prefix" placeholder="LMS-2024-CERT-" required hint="Used as the prefix for generated verification codes" {...register('certificatePrefix')} error={errors.certificatePrefix?.message} />
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: 'autoIssue' as const, label: 'Auto-issue Certificates', desc: 'Issue automatically once a trainee becomes eligible' },
            { name: 'requireApproval' as const, label: 'Require Admin Approval', desc: 'Hold issuance until an admin approves' },
          ].map(f => (
            <label key={f.name} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
              <input type="checkbox" {...register(f.name)} className="w-4 h-4 accent-primary-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">{f.label}</p>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </div>
            </label>
          ))}
        </div>
        <div className="flex justify-end pt-2 border-t border-slate-100 shadow-sm">
          <Button type="submit" icon={<Save size={15} />} loading={isSubmitting}>Save Settings</Button>
        </div>
      </form>
    </SettingsSection>
  );
};

const attendanceSettingsSchema = z.object({
  defaultAttendanceRequirement: z.number().min(50, 'Min 50%').max(100, 'Max 100%'),
  autoFlagBelowRequirement: z.boolean(),
  gracePeriodSessions: z.number().min(0, 'Cannot be negative'),
});
type AttendanceSettingsForm = z.infer<typeof attendanceSettingsSchema>;

const AttendanceSettingsSection: React.FC = () => {
  const toast = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AttendanceSettingsForm>({
    resolver: zodResolver(attendanceSettingsSchema),
    defaultValues: {
      defaultAttendanceRequirement: 75,
      autoFlagBelowRequirement: true,
      gracePeriodSessions: 2,
    },
  });

  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 600));
    toast.success('Attendance settings saved successfully!');
  };

  return (
    <SettingsSection title="Attendance Settings" description="Configure default attendance requirements and flagging behavior.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Default Attendance Requirement (%)" type="number" min={50} max={100} required {...register('defaultAttendanceRequirement', { valueAsNumber: true })} error={errors.defaultAttendanceRequirement?.message} />
          <FormField label="Grace Period (Sessions)" type="number" min={0} required hint="Sessions a trainee may miss before being flagged" {...register('gracePeriodSessions', { valueAsNumber: true })} error={errors.gracePeriodSessions?.message} />
        </div>
        <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
          <input type="checkbox" {...register('autoFlagBelowRequirement')} className="w-4 h-4 accent-primary-600" />
          <div>
            <p className="text-sm font-medium text-slate-900">Auto-flag Trainees Below Requirement</p>
            <p className="text-xs text-slate-500">Automatically flag trainees who fall below the attendance requirement</p>
          </div>
        </label>
        <div className="flex justify-end pt-2 border-t border-slate-100 shadow-sm">
          <Button type="submit" icon={<Save size={15} />} loading={isSubmitting}>Save Settings</Button>
        </div>
      </form>
    </SettingsSection>
  );
};

const systemSettingsSchema = z.object({
  organizationName: z.string().min(2, 'Organization name is required').max(100, 'Max 100 characters'),
  supportEmail: z.string().email('Valid email required'),
  timezone: z.string().min(1, 'Select a timezone'),
  maintenanceMode: z.boolean(),
  emailNotificationsEnabled: z.boolean(),
});
type SystemSettingsForm = z.infer<typeof systemSettingsSchema>;

const TIMEZONE_OPTIONS = [
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'America/New_York (EST)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST)' },
  { value: 'Europe/London', label: 'Europe/London (GMT)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT)' },
];

const SystemSettingsSection: React.FC = () => {
  const toast = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SystemSettingsForm>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      organizationName: 'GWC Data Academy',
      supportEmail: 'support@gwcdata.ai',
      timezone: 'Asia/Kolkata',
      maintenanceMode: false,
      emailNotificationsEnabled: true,
    },
  });

  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 600));
    toast.success('System settings saved successfully!');
  };

  return (
    <SettingsSection title="System Settings" description="General organization-wide preferences for the LMS platform.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Organization Name" placeholder="Your organization" required {...register('organizationName')} error={errors.organizationName?.message} />
          <FormField label="Support Email" type="email" placeholder="support@company.com" required {...register('supportEmail')} error={errors.supportEmail?.message} />
        </div>
        <SelectField label="Timezone" required options={TIMEZONE_OPTIONS} {...register('timezone')} error={errors.timezone?.message} />
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: 'maintenanceMode' as const, label: 'Maintenance Mode', desc: 'Temporarily restrict portal access to admins only' },
            { name: 'emailNotificationsEnabled' as const, label: 'Email Notifications Enabled', desc: 'Send system emails to trainers and trainees' },
          ].map(f => (
            <label key={f.name} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
              <input type="checkbox" {...register(f.name)} className="w-4 h-4 accent-primary-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">{f.label}</p>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </div>
            </label>
          ))}
        </div>
        <div className="flex justify-end pt-2 border-t border-slate-100 shadow-sm">
          <Button type="submit" icon={<Save size={15} />} loading={isSubmitting}>Save Settings</Button>
        </div>
      </form>
    </SettingsSection>
  );
};

const CategoriesSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('categories');

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Categories & Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage course categories, levels, and platform-wide configuration.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                    active ? 'bg-primary-600/15 text-primary-400' : 'text-slate-500 hover:text-slate-900 hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {activeTab === 'categories' && <CourseCategoriesSection />}
          {activeTab === 'levels' && <CourseLevelsSection />}
          {activeTab === 'assessment' && <AssessmentSettingsSection />}
          {activeTab === 'certificate' && <CertificateSettingsSection />}
          {activeTab === 'attendance' && <AttendanceSettingsSection />}
          {activeTab === 'system' && <SystemSettingsSection />}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSettingsPage;
