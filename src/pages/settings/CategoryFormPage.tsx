import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, FolderTree } from 'lucide-react';
import { FormField, SelectField, TextareaField } from '../../components/forms';
import Button from '../../components/common/Button';
import { mockCategories } from '../../services/mockData';
import { useToast } from '../../hooks/useToast';

const categorySchema = z.object({
  name: z.string().min(2, 'Name is required').max(60, 'Max 60 characters'),
  description: z.string().min(5, 'Description is required').max(300, 'Max 300 characters'),
  status: z.enum(['active', 'inactive'] as const, { error: 'Select status' }),
});
type CategoryForm = z.infer<typeof categorySchema>;

const CategoryFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: { status: 'active' },
  });

  useEffect(() => {
    if (isEdit) {
      const category = mockCategories.find(c => c.id === id);
      if (category) {
        reset({
          name: category.name, description: category.description, status: category.status
        });
      }
    }
  }, [id, isEdit, reset]);

  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 600));
    toast.success(`Category successfully ${isEdit ? 'updated' : 'added'}!`);
    navigate('/settings');
  };

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/settings')} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{isEdit ? 'Edit Category' : 'Add Course Category'}</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage course classification and organization</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
        <form id="category-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          <div className="space-y-5">
            <FormField label="Category Name" placeholder="e.g. Cloud Computing" required {...register('name')} error={errors.name?.message} />
            <TextareaField label="Description" placeholder="Brief description of this category..." required rows={3} {...register('description')} error={errors.description?.message} />
            <SelectField label="Status" required options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} {...register('status')} error={errors.status?.message} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => navigate('/settings')}>Cancel</Button>
            <Button type="submit" loading={isSubmitting} icon={isEdit ? <Save size={16} /> : <FolderTree size={16} />}>
              {isEdit ? 'Save Changes' : 'Add Category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormPage;
