import React, { useState } from 'react';
import { User, Mail, ShieldCheck, KeyRound, Save } from 'lucide-react';
import Button from '../../components/common/Button';
import { InputField } from '../../components/forms';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { updateProfile } from '../../store/slices/authSlice';
import { useToast } from '../../hooks/useToast';
import { getInitials, getAvatarColor } from '../../utils/helpers';

const roleLabel: Record<string, string> = { admin: 'Administrator', trainer: 'Trainer', trainee: 'Trainee' };

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const user = useAppSelector(s => s.auth.user);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const nameError = name.trim().length < 2 ? 'Name must be at least 2 characters' : '';
  const emailError = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email address';

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nameError || emailError) return;
    setSavingProfile(true);
    await new Promise(r => setTimeout(r, 500));
    dispatch(updateProfile({ name: name.trim(), email: email.trim() }));
    setSavingProfile(false);
    toast.success('Profile updated successfully!');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || newPassword.length < 8) {
      toast.error('Enter your current password and a new password of at least 8 characters.');
      return;
    }
    setSavingPassword(true);
    await new Promise(r => setTimeout(r, 500));
    setSavingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    toast.success('Password changed successfully!');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage your account details and security settings</p>
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 flex items-center gap-4">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getAvatarColor(user?.name ?? 'Admin')} flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-sm`}>
          {getInitials(user?.name ?? 'Admin')}
        </div>
        <div>
          <p className="text-lg font-bold text-slate-900">{user?.name ?? 'Admin'}</p>
          <p className="text-sm text-slate-500">{user?.email ?? '—'}</p>
          <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-100 px-2 py-0.5 rounded-full">
            <ShieldCheck size={12} /> {roleLabel[user?.role ?? 'admin']}
          </span>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} noValidate className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <User size={18} className="text-primary-600" />
          <h2 className="font-semibold text-slate-900">Personal Information</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField
            label="Full Name"
            required
            icon={<User size={15} />}
            value={name}
            onChange={e => setName(e.target.value)}
            error={name ? nameError : ''}
          />
          <InputField
            label="Email Address"
            type="email"
            required
            icon={<Mail size={15} />}
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={email ? emailError : ''}
          />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" icon={<Save size={15} />} loading={savingProfile}>Save Changes</Button>
        </div>
      </form>

      <form onSubmit={handleChangePassword} noValidate className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <KeyRound size={18} className="text-emerald-600" />
          <h2 className="font-semibold text-slate-900">Change Password</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            required
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
          <InputField
            label="New Password"
            type="password"
            placeholder="Min 8 characters"
            required
            hint="Use at least 8 characters with a mix of letters and numbers"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" variant="secondary" icon={<KeyRound size={15} />} loading={savingPassword}>Update Password</Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
