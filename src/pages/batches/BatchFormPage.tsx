import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Users } from 'lucide-react';
import { FormField, SelectField } from '../../components/forms';
import { MultiSelectField } from '../../components/forms';
import Button from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { addBatch, updateBatch } from '../../store/slices/batchesSlice';
import { updateTrainee } from '../../store/slices/traineesSlice';
import { useToast } from '../../hooks/useToast';
import type { Batch } from '../../types';

const batchSchema = z.object({
  id:         z.string().min(2, 'Batch ID is required'),
  name:       z.string().min(2, 'Name is required'),
  courseId:   z.string().min(1, 'Select a course'),
  trainerId:  z.string().min(1, 'Select a trainer'),
  location:   z.string().min(2, 'Location is required'),
  capacity:   z.coerce.number().min(1, 'Min 1').max(100, 'Max 100'),
  startDate:  z.string().min(1, 'Start date is required'),
  endDate:    z.string().min(1, 'End date is required'),
  timing:     z.string().min(1, 'Timing is required'),
  status:     z.enum(['upcoming', 'active', 'completed'] as const),
  traineeIds: z.array(z.string()).min(1, 'Please select at least one trainee'),
});
type BatchForm = z.infer<typeof batchSchema>;


const BatchFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const batches = useAppSelector(s => s.batches.items);
  const courses = useAppSelector(s => s.courses.items);
  const trainers = useAppSelector(s => s.trainers.items);
  const trainees = useAppSelector(s => s.trainees.items);
  const existing = id ? batches.find(b => b.id === id) : undefined;
  const isEdit = !!existing;

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BatchForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(batchSchema) as any,
    defaultValues: { id: '', status: 'upcoming', capacity: 20, traineeIds: [] },
  });

  useEffect(() => {
    if (existing) {
      reset({
        id: existing.id, name: existing.name, courseId: existing.courseId, trainerId: existing.trainerId,
        location: existing.locationName ?? '', capacity: existing.seatCapacity, startDate: existing.startDate,
        endDate: existing.endDate, timing: '', status: existing.status === 'cancelled' ? 'completed' : existing.status,
        traineeIds: trainees.filter(t => t.assignedBatch === existing.id).map(t => t.id)
      });
    }
  }, [existing, reset, trainees]);

  const onSubmit = async (data: BatchForm) => {
    await new Promise(r => setTimeout(r, 600));

    const course = courses.find(c => c.id === data.courseId);
    const trainer = trainers.find(t => t.id === data.trainerId);

    const batch: Batch = {
      id: data.id,
      name: data.name,
      courseId: data.courseId,
      courseName: course?.name ?? existing?.courseName ?? '',
      trainerId: data.trainerId,
      trainerName: trainer?.name ?? existing?.trainerName ?? '',
      locationId: existing?.locationId,
      locationName: data.location,
      startDate: data.startDate,
      endDate: data.endDate,
      seatCapacity: data.capacity,
      enrolledCount: existing?.enrolledCount ?? 0,
      status: data.status,
      attendanceRequired: existing?.attendanceRequired ?? 80,
      sessions: existing?.sessions ?? [],
    };

    dispatch(isEdit ? updateBatch(batch) : addBatch(batch));

    // Update assigned trainees
    if (data.traineeIds) {
      data.traineeIds.forEach(tid => {
        const trainee = trainees.find(t => t.id === tid);
        if (trainee) dispatch(updateTrainee({ ...trainee, assignedBatch: batch.id }));
      });
      // Optionally remove trainees that were unassigned, but leaving this simple for now.
    }

    toast.success(`Batch successfully ${isEdit ? 'updated' : 'added'}!`);
    navigate('/batches');
  };

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/batches')} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{isEdit ? 'Edit Batch' : 'Create New Batch'}</h1>
          <p className="text-slate-500 text-sm mt-0.5">Configure schedule and assign resources</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
        <form id="batch-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Batch ID" required placeholder="BCH-2024-01" readOnly={isEdit} className={isEdit ? 'opacity-70 cursor-not-allowed bg-slate-100' : ''} {...register('id')} error={errors.id?.message} />
            <FormField label="Batch Name" required placeholder="Python Weekend Batch" {...register('name')} error={errors.name?.message} />
            <SelectField label="Course" required options={courses.filter(c => c.mode === 'offline').map(c => ({ value: c.id, label: c.name }))} {...register('courseId')} error={errors.courseId?.message} />
            <SelectField label="Trainer" required options={trainers.map(t => ({ value: t.id, label: t.name }))} {...register('trainerId')} error={errors.trainerId?.message} />
            <FormField label="Location/Center" required placeholder="TechHub Guindy" {...register('location')} error={errors.location?.message} />
            <FormField label="Capacity" type="number" required min={1} max={100} {...register('capacity')} error={errors.capacity?.message} />
            <SelectField label="Status" required options={[{value:'upcoming',label:'Upcoming'},{value:'active',label:'Active'},{value:'completed',label:'Completed'}]} {...register('status')} error={errors.status?.message} />
            <FormField label="Start Date" type="date" required {...register('startDate')} error={errors.startDate?.message} />
            <FormField label="End Date" type="date" required {...register('endDate')} error={errors.endDate?.message} />
            <FormField label="Timing" required placeholder="Sat-Sun, 10:00 AM - 01:00 PM" {...register('timing')} error={errors.timing?.message} />
            
            <div>
              <Controller
                control={control}
                name="traineeIds"
                render={({ field }) => (
                  <MultiSelectField
                    label="Assign Trainees"
                    options={trainees.map(t => ({ value: t.id, label: t.name }))}
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Select trainees to assign to this batch..."
                    error={errors.traineeIds?.message}
                    required
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => navigate('/batches')}>Cancel</Button>
            <Button type="submit" loading={isSubmitting} icon={isEdit ? <Save size={16} /> : <Users size={16} />}>
              {isEdit ? 'Save Changes' : 'Create Batch'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchFormPage;
