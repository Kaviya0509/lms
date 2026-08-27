import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Pencil, Trash2, BookOpen, Star } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { InputField } from '../components/forms';
import { SelectField } from '../components/forms';
import { mockCourses } from '../data/mockData';
import type { Course } from '../types';

const courseSchema = z.object({
  title:      z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title too long'),
  instructor: z.string().min(2, 'Instructor name is required'),
  category:   z.string().min(1, 'Please select a category'),
  status:     z.enum(['published', 'draft', 'archived'] as const, { error: 'Select a valid status' }),
  price:      z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid price (e.g. 4999)'),
  duration:   z.string().min(1, 'Duration is required (e.g. 30h 00m)'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(500, 'Too long').optional().or(z.literal('')),
});

type CourseFormData = z.infer<typeof courseSchema>;

const statusColors: Record<string, 'success' | 'warning' | 'neutral'> = {
  published: 'success',
  draft:     'warning',
  archived:  'neutral',
};

const categoryOptions = [
  { value: 'Web Development', label: 'Web Development' },
  { value: 'Data Science', label: 'Data Science' },
  { value: 'Design', label: 'Design' },
  { value: 'Backend', label: 'Backend' },
  { value: 'Cloud', label: 'Cloud' },
  { value: 'Mobile', label: 'Mobile' },
  { value: 'DevOps', label: 'DevOps' },
];

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: { status: 'draft' },
  });

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const openAdd = () => {
    setEditCourse(null);
    reset({ title: '', instructor: '', category: '', status: 'draft', price: '', duration: '', description: '' });
    setModalOpen(true);
  };

  const openEdit = (course: Course) => {
    setEditCourse(course);
    setValue('title', course.title);
    setValue('instructor', course.instructor);
    setValue('category', course.category);
    setValue('status', course.status);
    setValue('price', String(course.price));
    setValue('duration', course.duration);
    setModalOpen(true);
  };

  const onSubmit = async (data: CourseFormData) => {
    await new Promise(r => setTimeout(r, 700));
    if (editCourse) {
      setCourses(prev => prev.map(c => c.id === editCourse.id
        ? { ...c, ...data, price: parseFloat(data.price) }
        : c
      ));
      showSuccess('Course updated successfully!');
    } else {
      const newCourse: Course = {
        id: String(Date.now()),
        title: data.title,
        instructor: data.instructor,
        category: data.category,
        status: data.status,
        price: parseFloat(data.price),
        duration: data.duration,
        studentsCount: 0,
        rating: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCourses(prev => [newCourse, ...prev]);
      showSuccess('Course created successfully!');
    }
    setModalOpen(false);
  };

  const doDelete = () => {
    if (deleteId) {
      setCourses(prev => prev.filter(c => c.id !== deleteId));
      showSuccess('Course deleted.');
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Course',
      render: (_: unknown, row: Course) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <BookOpen size={15} className="text-primary-400" />
          </div>
          <div>
            <p className="font-medium text-slate-900 text-sm">{row.title}</p>
            <p className="text-xs text-slate-500">{row.instructor} · {row.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_: unknown, row: Course) => <Badge variant={statusColors[row.status] ?? 'neutral'}>{row.status}</Badge>,
    },
    { key: 'studentsCount', label: 'Students' },
    {
      key: 'price',
      label: 'Price',
      render: (_: unknown, row: Course) => <span className="font-semibold text-slate-900">₹{row.price.toLocaleString()}</span>,
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (_: unknown, row: Course) => row.rating ? (
        <span className="flex items-center gap-1 text-amber-400 text-sm">
          <Star size={13} /> {row.rating}
        </span>
      ) : <span className="text-slate-600 text-sm">—</span>,
    },
    { key: 'duration', label: 'Duration' },
  ];

  return (
    <div className="space-y-5">
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-sm animate-fade-in">
          ✓ {successMsg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-slate-500 text-sm">{courses.length} total courses</p>
        <Button icon={<PlusCircle size={16} />} onClick={openAdd}>Add Course</Button>
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5">
        <DataTable
          columns={columns as never}
          data={courses as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search courses..."
          actions={(row) => {
            const course = row as unknown as Course;
            return (
              <div className="flex items-center gap-2 justify-end">
                <Button variant="ghost" size="sm" icon={<Pencil size={13} />} onClick={() => openEdit(course)} />
                <Button variant="danger" size="sm" icon={<Trash2 size={13} />} onClick={() => setDeleteId(course.id)} />
              </div>
            );
          }}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editCourse ? 'Edit Course' : 'Add New Course'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <InputField
            label="Course Title"
            placeholder="e.g. React & TypeScript Masterclass"
            required
            {...register('title')}
            error={errors.title?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Instructor Name"
              placeholder="e.g. Priya Nair"
              required
              {...register('instructor')}
              error={errors.instructor?.message}
            />
            <SelectField
              label="Category"
              required
              placeholder="Select category"
              options={categoryOptions}
              {...register('category')}
              error={errors.category?.message}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <SelectField
              label="Status"
              required
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' },
                { value: 'archived', label: 'Archived' },
              ]}
              {...register('status')}
              error={errors.status?.message}
            />
            <InputField
              label="Price (₹)"
              placeholder="4999"
              required
              {...register('price')}
              error={errors.price?.message}
            />
            <InputField
              label="Duration"
              placeholder="30h 00m"
              required
              {...register('duration')}
              error={errors.duration?.message}
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Brief course description..."
              {...register('description')}
              className="w-full bg-slate-100/60 border border-slate-200 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all resize-none"
            />
            {errors.description && <p className="text-red-400 text-xs mt-1.5">{errors.description.message}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 shadow-sm">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>
              {editCourse ? 'Save Changes' : 'Create Course'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Course" size="sm">
        <p className="text-slate-700 text-sm mb-5">
          Deleting this course will remove all associated data. This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" icon={<Trash2 size={14} />} onClick={doDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Courses;
