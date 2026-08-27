import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, MapPin } from 'lucide-react';
import { FormField } from '../../components/forms';
import Button from '../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { addLocation, updateLocation } from '../../store/slices/locationsSlice';
import { useToast } from '../../hooks/useToast';
import type { Location } from '../../types';

const locationSchema = z.object({
  name:    z.string().min(3, 'Location name required'),
  address: z.string().min(5, 'Address required'),
  city:    z.string().min(2, 'City required'),
  state:   z.string().min(2, 'State required'),
});
type LocationForm = z.infer<typeof locationSchema>;

const LocationFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const locations = useAppSelector(s => s.locations.items);
  const existing = id ? locations.find(l => l.id === id) : undefined;
  const isEdit = !!existing;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<LocationForm>({
    resolver: zodResolver(locationSchema),
  });

  useEffect(() => {
    if (existing) {
      reset({
        name: existing.name, address: existing.address,
        city: existing.city, state: existing.state
      });
    }
  }, [existing, reset]);

  const onSubmit = async (data: LocationForm) => {
    await new Promise(r => setTimeout(r, 600));

    const location: Location = {
      id: existing?.id ?? `location-${Date.now()}`,
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      buildings: existing?.buildings ?? [],
    };

    dispatch(isEdit ? updateLocation(location) : addLocation(location));
    toast.success(`Location successfully ${isEdit ? 'updated' : 'added'}!`);
    navigate('/locations');
  };

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/locations')} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{isEdit ? 'Edit Location' : 'Add Training Center'}</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage physical training facility details</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
        <form id="loc-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          <div className="space-y-5">
            <FormField label="Center Name" required placeholder="Chennai Tech Center" {...register('name')} error={errors.name?.message} />
            <FormField label="Address" required placeholder="45, Mount Road" {...register('address')} error={errors.address?.message} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="City" required placeholder="Chennai" {...register('city')} error={errors.city?.message} />
              <FormField label="State" required placeholder="Tamil Nadu" {...register('state')} error={errors.state?.message} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => navigate('/locations')}>Cancel</Button>
            <Button type="submit" loading={isSubmitting} icon={isEdit ? <Save size={16} /> : <MapPin size={16} />}>
              {isEdit ? 'Save Changes' : 'Add Location'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationFormPage;
