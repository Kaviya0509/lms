import React, { useEffect, useState } from 'react';
import ImageUpload from '../../components/common/ImageUpload';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UserPlus, Save } from 'lucide-react';
import { FormField, SelectField, TextareaField } from '../../components/forms';
import Button from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { addTrainer, updateTrainer } from '../../store/slices/trainersSlice';
import { useToast } from '../../hooks/useToast';
import type { Trainer } from '../../types';

const trainerSchema = z.object({
  name:          z.string().min(2, 'Name is required'),
  email:         z.string().email('Valid email required'),
  mobile:        z.string().regex(/^\d{10}$/, '10-digit mobile required'),
  qualification: z.string().min(2, 'Qualification is required'),
  expertise:     z.string().min(2, 'At least one expertise area required'),
  experience:    z.coerce.number().min(0, 'Experience must be ≥ 0').max(50, 'Max 50 years'),
  certifications: z.string().optional(),
  bio:           z.string().min(10, 'Bio must be at least 10 characters').max(500),
  availability:  z.enum(['full-time', 'part-time', 'contract'] as const, { error: 'Select availability' }),
});
type TrainerForm = z.infer<typeof trainerSchema>;

const generateTrainerId = () => `trainer-${Date.now()}`;

const TrainerFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const trainers = useAppSelector(s => s.trainers.items);
  const existing = id ? trainers.find(t => t.id === id) : undefined;
  const isEdit = !!existing;

  const [avatar, setAvatar] = useState<string>('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TrainerForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(trainerSchema) as any,
    defaultValues: { availability: 'full-time' }
  });

  useEffect(() => {
    if (existing) {
      reset({
        name: existing.name, email: existing.email, mobile: existing.mobile,
        qualification: existing.qualification, expertise: existing.expertise.join(', '),
        experience: existing.experience, certifications: existing.certifications.join(', '),
        bio: existing.bio, availability: existing.availability
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAvatar(existing.avatar ?? '');
    }
  }, [existing, reset]);

  const onSubmit = async (data: TrainerForm) => {
    await new Promise(r => setTimeout(r, 600));

    const trainer: Trainer = {
      id: existing?.id ?? generateTrainerId(),
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      qualification: data.qualification,
      expertise: data.expertise.split(',').map(s => s.trim()).filter(Boolean),
      experience: data.experience,
      certifications: (data.certifications ?? '').split(',').map(s => s.trim()).filter(Boolean),
      bio: data.bio,
      availability: data.availability,
      status: existing?.status ?? 'active',
      assignedCourses: existing?.assignedCourses ?? [],
      avatar: avatar || undefined,
      joinedAt: existing?.joinedAt ?? new Date().toISOString().split('T')[0],
      totalBatches: existing?.totalBatches ?? 0,
      rating: existing?.rating ?? 0,
    };

    dispatch(isEdit ? updateTrainer(trainer) : addTrainer(trainer));
    toast.success(`Trainer successfully ${isEdit ? 'updated' : 'added'}!`);
    navigate('/trainers');
  };

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/trainers')} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{isEdit ? 'Edit Trainer' : 'Add New Trainer'}</h1>
          <p className="text-slate-500 text-sm mt-0.5">Fill in the trainer details and credentials</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
        <form id="trainer-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <ImageUpload value={avatar} onChange={setAvatar} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Full Name" placeholder="Dr. Arun Kumar" required {...register('name')} error={errors.name?.message} />
            <FormField label="Email Address" type="email" placeholder="trainer@lms.com" required {...register('email')} error={errors.email?.message} />
            <FormField label="Mobile Number" placeholder="9876543210" required {...register('mobile')} error={errors.mobile?.message} />
            <FormField label="Qualification" placeholder="M.Tech, Ph.D" required {...register('qualification')} error={errors.qualification?.message} />
            <FormField label="Experience (Years)" type="number" min={0} required {...register('experience')} error={errors.experience?.message} />
            <SelectField label="Availability" required options={[
                {value:'full-time',label:'Full Time'},{value:'part-time',label:'Part Time'},{value:'contract',label:'Contract'}
              ]} {...register('availability')} error={errors.availability?.message} />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-900 mb-4">Professional Details</p>
            <div className="space-y-4">
              <FormField label="Expertise Areas" placeholder="React, Node.js, TypeScript" required hint="Separate multiple areas with commas" {...register('expertise')} error={errors.expertise?.message} />
              <FormField label="Certifications" placeholder="AWS SA, Google Cloud" hint="Optional, comma-separated" {...register('certifications')} error={errors.certifications?.message} />
              <TextareaField label="Professional Bio" placeholder="Brief professional background..." required rows={4} {...register('bio')} error={errors.bio?.message} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => navigate('/trainers')}>Cancel</Button>
            <Button type="submit" loading={isSubmitting} icon={isEdit ? <Save size={16} /> : <UserPlus size={16} />}>
              {isEdit ? 'Save Changes' : 'Add Trainer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerFormPage;
