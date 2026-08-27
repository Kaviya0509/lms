import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Pencil, Trash2, Shield } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { InputField } from '../components/forms';
import { SelectField } from '../components/forms';
import { mockUsers } from '../data/mockData';
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  status: 'active' | 'inactive' | 'suspended';
  joinedAt: string;
  coursesEnrolled: number;
}

const userSchema = z.object({
  name:  z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name too long'),
  email: z.string().email('Enter a valid email address'),
  role:  z.enum(['admin', 'instructor', 'student'] as const, { error: 'Select a valid role' }),
  status: z.enum(['active', 'inactive', 'suspended'] as const, { error: 'Select a valid status' }),
  password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
});

type UserFormData = z.infer<typeof userSchema>;

const roleColors: Record<string, 'info' | 'warning' | 'neutral'> = {
  admin:      'info',
  instructor: 'warning',
  student:    'neutral',
};

const statusColors: Record<string, 'success' | 'warning' | 'danger'> = {
  active:    'success',
  inactive:  'warning',
  suspended: 'danger',
};

const generateUserId = () => String(Date.now());

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { role: 'student', status: 'active', password: '' },
  });

  const openAdd = () => {
    setEditUser(null);
    reset({ name: '', email: '', role: 'student', status: 'active', password: '' });
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setValue('name', user.name);
    setValue('email', user.email);
    setValue('role', user.role);
    setValue('status', user.status);
    setValue('password', '');
    setModalOpen(true);
  };

  const onSubmit = async (data: UserFormData) => {
    await new Promise(r => setTimeout(r, 600));
    if (editUser) {
      setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...data } : u));
      setSuccessMsg('User updated successfully!');
    } else {
      const newUser: User = {
        id: generateUserId(),
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
        joinedAt: new Date().toISOString().split('T')[0],
        coursesEnrolled: 0,
      };
      setUsers(prev => [newUser, ...prev]);
      setSuccessMsg('User created successfully!');
    }
    setModalOpen(false);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const confirmDelete = (id: string) => setDeleteId(id);
  const doDelete = () => {
    if (deleteId) {
      setUsers(prev => prev.filter(u => u.id !== deleteId));
      setSuccessMsg('User deleted.');
      setDeleteId(null);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (_: unknown, row: User) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {row.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="font-medium text-slate-900 text-sm">{row.name}</p>
            <p className="text-xs text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (_: unknown, row: User) => (
        <Badge variant={roleColors[row.role] ?? 'neutral'}>
          <Shield size={10} className="mr-1" />{row.role}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_: unknown, row: User) => (
        <Badge variant={statusColors[row.status] ?? 'neutral'}>{row.status}</Badge>
      ),
    },
    { key: 'coursesEnrolled', label: 'Courses' },
    { key: 'joinedAt', label: 'Joined' },
  ];

  return (
    <div className="space-y-5">
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-sm animate-fade-in">
          ✓ {successMsg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-slate-500 text-sm mt-0.5">{users.length} total users</p>
        </div>
        <Button icon={<UserPlus size={16} />} onClick={openAdd}>Add User</Button>
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5">
        <DataTable
          columns={columns as never}
          data={users as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search users..."
          actions={(row) => {
            const user = row as unknown as User;
            return (
              <div className="flex items-center gap-2 justify-end">
                <Button variant="ghost" size="sm" icon={<Pencil size={13} />} onClick={() => openEdit(user)} />
                <Button variant="danger" size="sm" icon={<Trash2 size={13} />} onClick={() => confirmDelete(user.id)} />
              </div>
            );
          }}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editUser ? 'Edit User' : 'Add New User'}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <InputField
            label="Full Name"
            placeholder="e.g. Aarav Sharma"
            required
            {...register('name')}
            error={errors.name?.message}
          />
          <InputField
            label="Email Address"
            type="email"
            placeholder="user@example.com"
            required
            {...register('email')}
            error={errors.email?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Role"
              required
              options={[
                { value: 'student', label: 'Student' },
                { value: 'instructor', label: 'Instructor' },
                { value: 'admin', label: 'Admin' },
              ]}
              {...register('role')}
              error={errors.role?.message}
            />
            <SelectField
              label="Status"
              required
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'suspended', label: 'Suspended' },
              ]}
              {...register('status')}
              error={errors.status?.message}
            />
          </div>
          {!editUser && (
            <InputField
              label="Password"
              type="password"
              placeholder="Min 8 characters"
              required
              hint="Required for new user accounts"
              {...register('password')}
              error={errors.password?.message}
            />
          )}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 shadow-sm">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>
              {editUser ? 'Save Changes' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete" size="sm">
        <p className="text-slate-700 text-sm mb-5">
          Are you sure you want to delete this user? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" icon={<Trash2 size={14} />} onClick={doDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
