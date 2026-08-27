import React, { useEffect, useState } from 'react';
import ImageUpload from '../../components/common/ImageUpload';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UserPlus, Save } from 'lucide-react';
import { FormField, SelectField } from '../../components/forms';
import Button from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { addTrainee, updateTrainee } from '../../store/slices/traineesSlice';
import { useToast } from '../../hooks/useToast';
import type { Trainee } from '../../types';

const traineeSchema = z.object({
  name:     z.string().min(2, 'Name is required'),
  email:    z.string().email('Valid email required'),
  mobile:   z.string().regex(/^\d{10}$/, '10-digit mobile required'),
  type:     z.enum(['fresher', 'professional'] as const, { error: 'Select type' }),
  company:  z.string().optional(),
  experience: z.coerce.number().min(0).optional(),
  location: z.string().min(2, 'Location is required'),
  status:   z.enum(['active', 'inactive', 'pending'] as const),
});
type TraineeForm = z.infer<typeof traineeSchema>;

const generateTraineeId = () => `trainee-${Date.now()}`;

const TraineeFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const trainees = useAppSelector(s => s.trainees.items);
  const existing = id ? trainees.find(t => t.id === id) : undefined;
  const isEdit = !!existing;

  const [avatar, setAvatar] = useState<string>('');

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<TraineeForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(traineeSchema) as any,
    defaultValues: { type: 'fresher', status: 'active' },
  });

  const typeWatch = useWatch({ control, name: 'type' });

  useEffect(() => {
    if (existing) {
      reset({
        name: existing.name, email: existing.email, mobile: existing.mobile,
        type: existing.type, company: existing.company ?? '', experience: existing.experience ?? 0,
        location: existing.location, status: existing.status
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAvatar(existing.avatar ?? '');
    }
  }, [existing, reset]);

  const onSubmit = async (data: TraineeForm) => {
    await new Promise(r => setTimeout(r, 600));

    const trainee: Trainee = {
      id: existing?.id ?? generateTraineeId(),
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      type: data.type,
      company: data.company,
      experience: data.experience,
      location: data.location,
      status: data.status,
      enrolledCourses: existing?.enrolledCourses ?? [],
      assignedBatch: existing?.assignedBatch,
      overallProgress: existing?.overallProgress ?? 0,
      attendancePercentage: existing?.attendancePercentage ?? 0,
      joinedAt: existing?.joinedAt ?? new Date().toISOString().split('T')[0],
      avatar: avatar || undefined,
    };

    dispatch(isEdit ? updateTrainee(trainee) : addTrainee(trainee));
    toast.success(`Trainee successfully ${isEdit ? 'updated' : 'added'}!`);
    navigate('/trainees');
  };

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/trainees')} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{isEdit ? 'Edit Trainee' : 'Add New Trainee'}</h1>
          <p className="text-slate-500 text-sm mt-0.5">Register a new student or professional to the LMS</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
        <form id="trainee-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <ImageUpload value={avatar} onChange={setAvatar} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Full Name" required placeholder="Aarav Sharma" {...register('name')} error={errors.name?.message} />
            <FormField label="Email Address" type="email" required placeholder="trainee@email.com" {...register('email')} error={errors.email?.message} />
            <FormField label="Mobile Number" required placeholder="9876543210" {...register('mobile')} error={errors.mobile?.message} />
            <FormField label="Location" required placeholder="Chennai" {...register('location')} error={errors.location?.message} />
            <SelectField label="Trainee Type" required options={[{value:'fresher',label:'Fresher'},{value:'professional',label:'Professional'}]} {...register('type')} error={errors.type?.message} />
            <SelectField label="Account Status" required options={[{value:'active',label:'Active'},{value:'inactive',label:'Inactive'},{value:'pending',label:'Pending'}]} {...register('status')} error={errors.status?.message} />
          </div>

          {typeWatch === 'professional' && (
            <div className="pt-2 border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-900 mb-4">Professional Details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Company Name" placeholder="TCS, Infosys..." {...register('company')} error={errors.company?.message} />
                <FormField label="Experience (Years)" type="number" min={0} {...register('experience')} error={errors.experience?.message} />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => navigate('/trainees')}>Cancel</Button>
            <Button type="submit" loading={isSubmitting} icon={isEdit ? <Save size={16} /> : <UserPlus size={16} />}>
              {isEdit ? 'Save Changes' : 'Add Trainee'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TraineeFormPage;
