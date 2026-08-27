import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, ClipboardList } from 'lucide-react';
import { FormField, SelectField } from '../../components/forms';
import Button from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { addAssessment, updateAssessment } from '../../store/slices/assessmentsSlice';
import { useToast } from '../../hooks/useToast';
import type { Assessment } from '../../types';

const assessmentSchema = z.object({
  title:          z.string().min(5, 'Title required'),
  courseId:       z.string().min(1, 'Select a course'),
  type:           z.enum(['quiz', 'final', 'assignment'] as const),
  totalQuestions: z.coerce.number().min(1, 'Min 1 question'),
  passingScore:   z.coerce.number().min(1, 'Min 1%').max(100, 'Max 100%'),
  maxAttempts:    z.coerce.number().min(1, 'Min 1 attempt'),
  duration:       z.coerce.number().min(5, 'Min 5 minutes'),
  status:         z.enum(['active', 'inactive'] as const),
});
type AssessmentForm = z.infer<typeof assessmentSchema>;

const generateAssessmentId = () => `assessment-${Date.now()}`;

const AssessmentFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const assessments = useAppSelector(s => s.assessments.items);
  const courses = useAppSelector(s => s.courses.items);
  const existing = id ? assessments.find(a => a.id === id) : undefined;
  const isEdit = !!existing;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AssessmentForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(assessmentSchema) as any,
    defaultValues: { type: 'quiz', passingScore: 70, maxAttempts: 2, duration: 60, status: 'active' },
  });

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title, courseId: existing.courseId, type: existing.type,
        totalQuestions: existing.totalQuestions, passingScore: existing.passingScore,
        maxAttempts: existing.maxAttempts, duration: existing.duration, status: existing.status
      });
    }
  }, [existing, reset]);

  const onSubmit = async (data: AssessmentForm) => {
    await new Promise(r => setTimeout(r, 600));

    const course = courses.find(c => c.id === data.courseId);

    const assessment: Assessment = {
      id: existing?.id ?? generateAssessmentId(),
      title: data.title,
      courseId: data.courseId,
      courseName: course?.name ?? existing?.courseName ?? '',
      type: data.type,
      totalQuestions: data.totalQuestions,
      passingScore: data.passingScore,
      maxAttempts: data.maxAttempts,
      duration: data.duration,
      status: data.status,
      createdAt: existing?.createdAt ?? new Date().toISOString().split('T')[0],
    };

    dispatch(isEdit ? updateAssessment(assessment) : addAssessment(assessment));
    toast.success(`Assessment successfully ${isEdit ? 'updated' : 'created'}!`);
    navigate('/assessments');
  };

  const courseOptions = courses.map(c => ({ value: c.id, label: c.name }));

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/assessments')} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{isEdit ? 'Edit Assessment' : 'Create Assessment'}</h1>
          <p className="text-slate-500 text-sm mt-0.5">Configure quizzes, final exams, passing scores and attempt limits</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
        <form id="assessment-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          <FormField label="Assessment Title" required placeholder="React & TypeScript Final Exam" {...register('title')} error={errors.title?.message} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SelectField label="Course" required placeholder="Select course" options={courseOptions} {...register('courseId')} error={errors.courseId?.message} />
            <SelectField label="Type" required options={[{value:'quiz',label:'Quiz'},{value:'final',label:'Final Exam'},{value:'assignment',label:'Assignment'}]} {...register('type')} error={errors.type?.message} />
            <FormField label="Total Questions" type="number" min={1} required placeholder="20" {...register('totalQuestions')} error={errors.totalQuestions?.message} />
            <FormField label="Passing Score (%)" type="number" min={1} max={100} required placeholder="70" {...register('passingScore')} error={errors.passingScore?.message} />
            <FormField label="Duration (Minutes)" type="number" min={5} required placeholder="60" {...register('duration')} error={errors.duration?.message} />
            <FormField label="Max Attempts" type="number" min={1} required placeholder="2" {...register('maxAttempts')} error={errors.maxAttempts?.message} />
            <SelectField label="Status" options={[{value:'active',label:'Active'},{value:'inactive',label:'Inactive'}]} {...register('status')} error={errors.status?.message} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => navigate('/assessments')}>Cancel</Button>
            <Button type="submit" loading={isSubmitting} icon={isEdit ? <Save size={16} /> : <ClipboardList size={16} />}>
              {isEdit ? 'Save Changes' : 'Create Assessment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentFormPage;
