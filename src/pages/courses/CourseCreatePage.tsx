import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Monitor, Globe, CheckCircle2, ArrowRight, ArrowLeft, BookOpen,
  Clock, Target, GraduationCap, FileText, Calendar, MapPin, Users, AlertCircle, GripVertical, Trash2
} from 'lucide-react';
import { FormField, SelectField, TextareaField } from '../../components/forms';
import Button from '../../components/common/Button';
import { useToast } from '../../hooks/useToast';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { addCourse, updateCourse } from '../../store/slices/coursesSlice';
import type { Course } from '../../types';

const commonSchema = z.object({
  name:        z.string().min(5, 'Course name must be at least 5 characters'),
  code:        z.string().min(2, 'Course code required').regex(/^[A-Z0-9-]+$/, 'Use uppercase, numbers and hyphens'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  duration:    z.coerce.number().min(1, 'Duration must be at least 1 month').max(120),
  objectives:  z.string().min(10, 'Add at least one objective'),
  trainerId:   z.string().min(1, 'Assign a trainer'),
  mode:        z.enum(['online', 'offline', 'both'] as const, { error: 'Select delivery mode' }),
});

const onlineSchema = z.object({
  modules: z.array(z.object({
    title: z.string().min(2, 'Module title is required')
  })).min(1, 'At least one module required'),
  hasVideos: z.boolean(),
  hasQuiz: z.boolean(),
});

const offlineSchema = z.object({
  locationId:    z.string().min(1, 'Select training center'),
  startDate:     z.string().min(1, 'Start date required'),
  endDate:       z.string().min(1, 'End date required'),
  seatCapacity:  z.coerce.number().min(5, 'Minimum 5 seats').max(200),
  dailyStart:    z.string().min(1, 'Session start time required'),
  dailyEnd:      z.string().min(1, 'Session end time required'),
  attendanceRequired: z.coerce.number().min(50).max(100),
});

type CommonForm = z.infer<typeof commonSchema>;
type CommonFormInput = z.input<typeof commonSchema>;
type OnlineForm = z.infer<typeof onlineSchema>;
type OnlineFormInput = z.input<typeof onlineSchema>;
type OfflineForm = z.infer<typeof offlineSchema>;
type OfflineFormInput = z.input<typeof offlineSchema>;

const Step: React.FC<{ n: number; label: string; active: boolean; done: boolean }> = ({ n, label, active, done }) => (
  <div className={`flex items-center gap-2 ${active ? 'text-primary-600' : done ? 'text-emerald-600' : 'text-slate-600'}`}>
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${active ? 'bg-primary-600/20 border-primary-500' : done ? 'bg-emerald-600/20 border-emerald-500' : 'bg-slate-100 border-slate-200'}`}>
      {done ? <CheckCircle2 size={14} /> : n}
    </div>
    <span className="text-sm font-medium hidden md:block">{label}</span>
  </div>
);

const CourseCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const courses = useAppSelector(s => s.courses.items);
  const trainers = useAppSelector(s => s.trainers.items);
  const locations = useAppSelector(s => s.locations.items);
  const existing = id ? courses.find(c => c.id === id) : undefined;
  const isEdit = !!existing;

  const [step, setStep] = useState(1);
  const [selectedMode, setSelectedMode] = useState<'online' | 'offline' | 'both' | null>(existing?.mode ?? null);
  const [submitting, setSubmitting] = useState(false);

  const commonForm = useForm<CommonFormInput, unknown, CommonForm>({
    resolver: zodResolver(commonSchema),
    defaultValues: existing ? {
      name: existing.name, code: existing.code, description: existing.description,
      duration: existing.duration,
      objectives: existing.objectives.join(', '), trainerId: existing.trainerId ?? '',
      mode: existing.mode,
    } : undefined,
  });
  
  const onlineForm = useForm<OnlineFormInput, unknown, OnlineForm>({
    resolver: zodResolver(onlineSchema),
    defaultValues: (existing?.mode === 'online' || existing?.mode === 'both') ? {
      modules: existing.modules?.map(m => ({ title: m.title })) || [{ title: '' }],
      hasVideos: true, hasQuiz: true,
    } : { modules: [{ title: '' }] },
  });

  const { fields: moduleFields, append: appendModule, remove: removeModule, move: moveModule } = useFieldArray({
    control: onlineForm.control,
    name: 'modules'
  });

  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const onDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    moveModule(draggedIdx, idx);
    setDraggedIdx(idx);
  };
  
  const onDragEnd = () => {
    setDraggedIdx(null);
  };
  
  const offlineForm = useForm<OfflineFormInput, unknown, OfflineForm>({
    resolver: zodResolver(offlineSchema),
    defaultValues: (existing?.mode === 'offline' || existing?.mode === 'both') ? {
      locationId: existing.locationId ?? '', startDate: existing.startDate ?? '', endDate: existing.endDate ?? '',
      seatCapacity: existing.seatCapacity ?? 30, dailyStart: '09:00', dailyEnd: '13:00',
      attendanceRequired: 80,
    } : { attendanceRequired: 80 },
  });

  const trainerOptions = trainers.map(t => ({ value: t.id, label: `${t.name} (${t.expertise.slice(0,2).join(', ')})` }))
  const locationOptions = locations.map(l => ({ value: l.id, label: l.name }))

  const handleStep1 = commonForm.handleSubmit((data) => {
    setSelectedMode(data.mode);
    setStep(2);
  });

  const handleStep2 = async () => {
    let valid = false;
    if (selectedMode === 'online') {
      valid = await onlineForm.trigger();
    } else if (selectedMode === 'offline') {
      valid = await offlineForm.trigger();
    } else if (selectedMode === 'both') {
      const oValid = await onlineForm.trigger();
      const fValid = await offlineForm.trigger();
      valid = oValid && fValid;
    }
    if (valid) setStep(3);
  };

  const handlePublish = async (status: 'draft' | 'published') => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));

    const common = commonForm.getValues();
    const trainer = trainers.find(t => t.id === common.trainerId);
    const offlineVals = offlineForm.getValues();

    const course: Course = {
      id: existing?.id ?? `course-${Date.now()}`,
      name: common.name,
      code: common.code,
      description: common.description,
      category: existing?.category ?? 'General',
      categoryId: existing?.categoryId ?? 'general',
      level: existing?.level ?? 'beginner',
      duration: Number(common.duration),
      mode: common.mode,
      status: status === 'draft' ? 'draft' : 'published',
      objectives: common.objectives.split(',').map(s => s.trim()).filter(Boolean),
      prerequisites: existing?.prerequisites ?? [],
      skills: existing?.skills ?? [],
      trainerId: common.trainerId,
      trainerName: trainer?.name,
      hasAssessment: existing?.hasAssessment ?? false,
      hasCertificate: existing?.hasCertificate ?? false,
      modules: (common.mode === 'online' || common.mode === 'both') 
        ? onlineForm.getValues('modules').map((m, i) => ({
            id: existing?.modules?.[i]?.id ?? `mod-${Date.now()}-${i}`,
            title: m.title,
            order: i + 1,
            lessons: existing?.modules?.[i]?.lessons ?? []
          }))
        : existing?.modules,
      locationId: (selectedMode === 'offline' || selectedMode === 'both') ? offlineVals.locationId : undefined,
      startDate: (selectedMode === 'offline' || selectedMode === 'both') ? offlineVals.startDate : undefined,
      endDate: (selectedMode === 'offline' || selectedMode === 'both') ? offlineVals.endDate : undefined,
      seatCapacity: (selectedMode === 'offline' || selectedMode === 'both') ? Number(offlineVals.seatCapacity) : undefined,
      enrolledCount: existing?.enrolledCount ?? 0,
      completedCount: existing?.completedCount ?? 0,
      rating: existing?.rating ?? 0,
      createdAt: existing?.createdAt ?? new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      thumbnail: existing?.thumbnail,
    };

    dispatch(isEdit ? updateCourse(course) : addCourse(course));
    setSubmitting(false);
    toast.success(`Course ${status === 'draft' ? 'saved as draft' : 'published'} successfully!`);
    navigate('/courses');
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const cw = commonForm.watch('mode');
  
  const publishChecks = [
    { label: 'Course information complete', done: true },
    { label: 'Trainer assigned', done: !!commonForm.watch('trainerId') },
    { label: 'Delivery mode configured', done: step >= 2 },
  ];

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{isEdit ? 'Edit Course' : 'Create New Course'}</h1>
        <p className="text-slate-500 text-sm mt-0.5">{isEdit ? 'Modify course specifications and schedule' : 'Follow the steps to configure and publish a new course'}</p>
      </div>

      <div className="flex items-center gap-3 bg-white border border-slate-100 shadow-sm rounded-2xl px-6 py-4">
        <Step n={1} label="Course Information" active={step === 1} done={step > 1} />
        <div className="flex-1 h-px bg-slate-100" />
        <Step n={2} label={selectedMode ? `${selectedMode === 'both' ? 'Hybrid' : selectedMode === 'online' ? 'Online' : 'Offline'} Config` : 'Delivery Config'} active={step === 2} done={step > 2} />
        <div className="flex-1 h-px bg-slate-100" />
        <Step n={3} label="Review & Publish" active={step === 3} done={false} />
      </div>

      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>

        {step === 1 && (
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={18} className="text-primary-600" />
              <h2 className="font-semibold text-slate-900">Course Information</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Course Name" placeholder="Full Stack Web Development" required
                {...commonForm.register('name')} error={commonForm.formState.errors.name?.message} />
              <SelectField label="Course Code" placeholder="Select course code" required
                options={[
                  { value: 'FSWD-001', label: 'FSWD-001' },
                  { value: 'FSWD-002', label: 'FSWD-002' },
                  { value: 'AIG-001', label: 'AIG-001' },
                  { value: 'DS-001', label: 'DS-001' },
                  { value: 'UIX-001', label: 'UIX-001' },
                  { value: 'BE-001', label: 'BE-001' },
                  { value: 'SEC-001', label: 'SEC-001' },
                  { value: 'CLD-001', label: 'CLD-001' },
                  { value: 'MOB-001', label: 'MOB-001' },
                ]}
                {...commonForm.register('code')} error={commonForm.formState.errors.code?.message} />
            </div>

            <TextareaField label="Description" placeholder="Comprehensive course covering..." required rows={3}
              {...commonForm.register('description')} error={commonForm.formState.errors.description?.message} />

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Duration (Months)" type="number" min={1} required placeholder="6"
                icon={<Clock size={14} />} {...commonForm.register('duration')} error={commonForm.formState.errors.duration?.message} />
              <SelectField label="Assign Trainer" required placeholder="Select trainer"
                options={trainerOptions} icon={<GraduationCap size={14} />}
                {...commonForm.register('trainerId')} error={commonForm.formState.errors.trainerId?.message} />
            </div>

            <FormField label="Learning Objectives" placeholder="Build production apps, Design RESTful APIs... (comma-separated)" required
              icon={<Target size={14} />} {...commonForm.register('objectives')} error={commonForm.formState.errors.objectives?.message} />

            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Delivery Mode <span className="text-red-500">*</span></p>
              <div className="grid grid-cols-3 gap-4">
                {([['online', 'Online Course', Monitor, 'Modules, Lessons, Videos, Quizzes', 'text-primary-600', 'bg-primary-600/10 border-primary-500/30'],
                   ['offline', 'Offline Course', Globe, 'Batch, Location, Schedule, Sessions', 'text-emerald-600', 'bg-emerald-600/10 border-emerald-500/30'],
                   ['both', 'Online & Offline', BookOpen, 'Both delivery modes and schedules', 'text-violet-600', 'bg-violet-600/10 border-violet-500/30']] as const).map(([v, label, Icon, desc, ic, bg]) => (
                  <label key={v} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${cw === v ? bg + ' border-opacity-100' : 'border-slate-200 bg-slate-100/30 hover:border-slate-600'}`}>
                    <input type="radio" value={v} {...commonForm.register('mode')} className="mt-0.5 accent-primary-600" />
                    <div>
                      <div className="flex items-center gap-2"><Icon size={16} className={ic} /><span className="font-semibold text-slate-900 text-sm">{label}</span></div>
                      <p className="text-xs text-slate-500 mt-1">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              {commonForm.formState.errors.mode && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{commonForm.formState.errors.mode.message}</p>}
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={handleStep1} iconRight={<ArrowRight size={15} />}>Continue to Configuration</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              {selectedMode === 'both' ? <BookOpen size={18} className="text-violet-600" /> : selectedMode === 'online' ? <Monitor size={18} className="text-primary-600" /> : <Globe size={18} className="text-emerald-600" />}
              <h2 className="font-semibold text-slate-900">{selectedMode === 'both' ? 'Online & Offline Course' : selectedMode === 'online' ? 'Online Course' : 'Offline Course'} Configuration</h2>
            </div>

            {selectedMode === 'both' ? (
              <div className="space-y-6">
                <div className="p-4 bg-violet-600/5 border border-violet-500/20 rounded-xl">
                  <p className="text-xs text-violet-600 font-medium">Configure settings for both online modules and offline scheduling.</p>
                </div>
                
                <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/30 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Monitor size={16} className="text-primary-600" />
                    <h3 className="text-sm font-bold text-slate-800">Online Settings</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-slate-900">Course Modules</label>
                      <button type="button" onClick={() => appendModule({ title: '' })} className="text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 px-2 py-1 rounded">+ Add Module</button>
                    </div>
                    <div className="space-y-2">
                      {moduleFields.map((field, index) => (
                        <div key={field.id} 
                          draggable
                          onDragStart={(e) => onDragStart(e, index)}
                          onDragOver={(e) => onDragOver(e, index)}
                          onDragEnd={onDragEnd}
                          className={`flex items-center gap-3 p-3 bg-white border ${draggedIdx === index ? 'border-primary-500 opacity-50' : 'border-slate-200'} rounded-xl transition-colors cursor-move group`}
                        >
                          <div className="text-slate-400 group-hover:text-primary-500 transition-colors">
                            <GripVertical size={16} />
                          </div>
                          <div className="flex-1">
                            <input type="text" {...onlineForm.register(`modules.${index}.title` as const)} placeholder={`Module ${index + 1} Title`} className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400" />
                          </div>
                          <button type="button" onClick={() => removeModule(index)} disabled={moduleFields.length === 1} className="text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      {onlineForm.formState.errors.modules && (
                        <p className="text-red-500 text-xs flex items-center gap-1 mt-1"><AlertCircle size={12} /> {onlineForm.formState.errors.modules.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'hasVideos' as const, label: 'Include Video Lessons', desc: 'Upload or link video content' },
                      { name: 'hasQuiz' as const, label: 'Module Quizzes', desc: 'Add quizzes at end of each module' },
                    ].map(f => (
                      <label key={f.name} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input type="checkbox" {...onlineForm.register(f.name)} className="w-4 h-4 accent-primary-600" />
                        <div><p className="text-sm font-medium text-slate-900">{f.label}</p><p className="text-xs text-slate-500">{f.desc}</p></div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/30 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Globe size={16} className="text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-800">Offline Settings</h3>
                  </div>
                  <SelectField label="Training Center" required placeholder="Select location" icon={<MapPin size={14} />}
                    options={locationOptions}
                    {...offlineForm.register('locationId')} error={offlineForm.formState.errors.locationId?.message} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Start Date" type="date" required icon={<Calendar size={14} />}
                      {...offlineForm.register('startDate')} error={offlineForm.formState.errors.startDate?.message} />
                    <FormField label="End Date" type="date" required icon={<Calendar size={14} />}
                      {...offlineForm.register('endDate')} error={offlineForm.formState.errors.endDate?.message} />
                    <FormField label="Seat Capacity" type="number" min={5} required icon={<Users size={14} />}
                      placeholder="30" {...offlineForm.register('seatCapacity')} error={offlineForm.formState.errors.seatCapacity?.message} />
                    <FormField label="Attendance Required (%)" type="number" min={50} max={100}
                      placeholder="80" {...offlineForm.register('attendanceRequired')} error={offlineForm.formState.errors.attendanceRequired?.message} />
                    <FormField label="Daily Session Start" type="time" required {...offlineForm.register('dailyStart')} error={offlineForm.formState.errors.dailyStart?.message} />
                    <FormField label="Daily Session End" type="time" required {...offlineForm.register('dailyEnd')} error={offlineForm.formState.errors.dailyEnd?.message} />
                  </div>
                </div>
              </div>
            ) : selectedMode === 'online' ? (
              <div className="space-y-4">
                <div className="p-4 bg-primary-600/5 border border-primary-500/20 rounded-xl">
                  <p className="text-xs text-primary-600">Configure the content structure for this online course.</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-900">Course Modules</label>
                    <button type="button" onClick={() => appendModule({ title: '' })} className="text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 px-2 py-1 rounded">+ Add Module</button>
                  </div>
                  <div className="space-y-2">
                    {moduleFields.map((field, index) => (
                      <div key={field.id} 
                        draggable
                        onDragStart={(e) => onDragStart(e, index)}
                        onDragOver={(e) => onDragOver(e, index)}
                        onDragEnd={onDragEnd}
                        className={`flex items-center gap-3 p-3 bg-white border ${draggedIdx === index ? 'border-primary-500 opacity-50' : 'border-slate-200'} rounded-xl transition-colors cursor-move group`}
                      >
                        <div className="text-slate-400 group-hover:text-primary-500 transition-colors">
                          <GripVertical size={16} />
                        </div>
                        <div className="flex-1">
                          <input type="text" {...onlineForm.register(`modules.${index}.title` as const)} placeholder={`Module ${index + 1} Title`} className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400" />
                        </div>
                        <button type="button" onClick={() => removeModule(index)} disabled={moduleFields.length === 1} className="text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {onlineForm.formState.errors.modules && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1"><AlertCircle size={12} /> {onlineForm.formState.errors.modules.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'hasVideos' as const, label: 'Include Video Lessons', desc: 'Upload or link video content' },
                    { name: 'hasQuiz' as const, label: 'Module Quizzes', desc: 'Add quizzes at end of each module' },
                  ].map(f => (
                    <label key={f.name} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                      <input type="checkbox" {...onlineForm.register(f.name)} className="w-4 h-4 accent-primary-600" />
                      <div><p className="text-sm font-medium text-slate-900">{f.label}</p><p className="text-xs text-slate-500">{f.desc}</p></div>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-600/5 border border-emerald-500/20 rounded-xl">
                  <p className="text-xs text-emerald-600">Configure the batch, location and schedule for this offline course.</p>
                </div>
                <SelectField label="Training Center" required placeholder="Select location" icon={<MapPin size={14} />}
                  options={locationOptions}
                  {...offlineForm.register('locationId')} error={offlineForm.formState.errors.locationId?.message} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Start Date" type="date" required icon={<Calendar size={14} />}
                    {...offlineForm.register('startDate')} error={offlineForm.formState.errors.startDate?.message} />
                  <FormField label="End Date" type="date" required icon={<Calendar size={14} />}
                    {...offlineForm.register('endDate')} error={offlineForm.formState.errors.endDate?.message} />
                  <FormField label="Seat Capacity" type="number" min={5} required icon={<Users size={14} />}
                    placeholder="30" {...offlineForm.register('seatCapacity')} error={offlineForm.formState.errors.seatCapacity?.message} />
                  <FormField label="Attendance Required (%)" type="number" min={50} max={100}
                    placeholder="80" {...offlineForm.register('attendanceRequired')} error={offlineForm.formState.errors.attendanceRequired?.message} />
                  <FormField label="Daily Session Start" type="time" required {...offlineForm.register('dailyStart')} error={offlineForm.formState.errors.dailyStart?.message} />
                  <FormField label="Daily Session End" type="time" required {...offlineForm.register('dailyEnd')} error={offlineForm.formState.errors.dailyEnd?.message} />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <Button variant="secondary" icon={<ArrowLeft size={15} />} onClick={() => setStep(1)}>Back</Button>
              <Button onClick={handleStep2} iconRight={<ArrowRight size={15} />}>Review & Publish</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-primary-600" />
              <h2 className="font-semibold text-slate-900">Review & Publish</h2>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">{commonForm.getValues('name')}</h3>
              {[
                { label: 'Code', value: commonForm.getValues('code') },
                { label: 'Duration', value: `${commonForm.getValues('duration')} months` },
                { label: 'Mode', value: commonForm.getValues('mode') },
                { label: 'Trainer', value: trainers.find(t=>t.id===commonForm.getValues('trainerId'))?.name ?? '—' },
              ].map(f => (
                <div key={f.label} className="flex justify-between text-sm">
                  <span className="text-slate-500">{f.label}</span>
                  <span className="text-slate-900 capitalize font-medium">{f.value}</span>
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">Pre-Publish Checklist</p>
              <div className="space-y-2">
                {publishChecks.map(c => (
                  <div key={c.label} className={`flex items-center gap-3 p-3 rounded-xl ${c.done ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-red-500/5 border border-red-500/20'}`}>
                    {c.done
                      ? <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                      : <AlertCircle size={16} className="text-red-500 flex-shrink-0" />}
                    <span className={`text-sm ${c.done ? 'text-emerald-700' : 'text-red-600'}`}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="secondary" icon={<ArrowLeft size={15} />} onClick={() => setStep(2)}>Back</Button>
              <div className="flex gap-3">
                <Button variant="secondary" loading={submitting} onClick={() => handlePublish('draft')}>Save as Draft</Button>
                <Button loading={submitting} onClick={() => handlePublish('published')}>Publish Course</Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CourseCreatePage;
