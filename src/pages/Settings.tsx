import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Bell, Shield, Globe, Palette } from 'lucide-react';
import { InputField } from '../components/forms';
import Button from '../components/ui/Button';

const profileSchema = z.object({
  portalName:    z.string().min(2, 'Portal name is required'),
  adminEmail:    z.string().email('Enter a valid email'),
  supportEmail:  z.string().email('Enter a valid email'),
  timezone:      z.string().min(1, 'Select a timezone'),
  language:      z.string().min(1, 'Select a language'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword:     z.string().min(8, 'New password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[0-9]/, 'Must include a number'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

const Toggle: React.FC<{ label: string; description?: string; defaultChecked?: boolean }> = ({ label, description, defaultChecked }) => {
  const [on, setOn] = useState(defaultChecked ?? false);
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 shadow-sm/60 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-200">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => setOn(o => !o)}
        className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${on ? 'bg-primary-600' : 'bg-slate-700'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${on ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
};

const SectionCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5">
    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100 shadow-sm">
      <div className="text-primary-400">{icon}</div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
    </div>
    {children}
  </div>
);

const Settings: React.FC = () => {
  const [profileSuccess, setProfileSuccess] = useState('');
  const [pwSuccess, setPwSuccess]     = useState('');

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { portalName: 'LMS Admin Portal', adminEmail: 'admin@lmsportal.com', supportEmail: 'support@lmsportal.com', timezone: 'Asia/Kolkata', language: 'en' },
  });

  const pwForm = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) });

  const onProfileSave = async (data: ProfileData) => {
    console.log('Profile saved:', data);
    await new Promise(r => setTimeout(r, 600));
    setProfileSuccess('Profile settings saved!');
    setTimeout(() => setProfileSuccess(''), 3000);
  };

  const onPasswordSave = async () => {
    await new Promise(r => setTimeout(r, 600));
    pwForm.reset();
    setPwSuccess('Password updated successfully!');
    setTimeout(() => setPwSuccess(''), 3000);
  };

  return (
    <div className="max-w-3xl space-y-5">
      <SectionCard icon={<Globe size={18} />} title="General Settings">
        {profileSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-2.5 rounded-xl text-sm mb-4 animate-fade-in">
            ✓ {profileSuccess}
          </div>
        )}
        <form onSubmit={profileForm.handleSubmit(onProfileSave)} noValidate className="space-y-4">
          <InputField
            label="Portal Name"
            required
            {...profileForm.register('portalName')}
            error={profileForm.formState.errors.portalName?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Admin Email"
              type="email"
              required
              {...profileForm.register('adminEmail')}
              error={profileForm.formState.errors.adminEmail?.message}
            />
            <InputField
              label="Support Email"
              type="email"
              required
              {...profileForm.register('supportEmail')}
              error={profileForm.formState.errors.supportEmail?.message}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Timezone <span className="text-red-400">*</span></label>
              <select
                {...profileForm.register('timezone')}
                className="w-full bg-slate-100/60 border border-slate-200 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Language <span className="text-red-400">*</span></label>
              <select
                {...profileForm.register('language')}
                className="w-full bg-slate-100/60 border border-slate-200 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all"
              >
                <option value="en">English</option>
                <option value="ta">Tamil</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" icon={<Save size={14} />} loading={profileForm.formState.isSubmitting}>
              Save Settings
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard icon={<Shield size={18} />} title="Security">
        {pwSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-2.5 rounded-xl text-sm mb-4 animate-fade-in">
            ✓ {pwSuccess}
          </div>
        )}
        <form onSubmit={pwForm.handleSubmit(onPasswordSave)} noValidate className="space-y-4">
          <InputField
            label="Current Password"
            type="password"
            required
            placeholder="Enter current password"
            {...pwForm.register('currentPassword')}
            error={pwForm.formState.errors.currentPassword?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="New Password"
              type="password"
              required
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              {...pwForm.register('newPassword')}
              error={pwForm.formState.errors.newPassword?.message}
            />
            <InputField
              label="Confirm Password"
              type="password"
              required
              placeholder="Repeat new password"
              {...pwForm.register('confirmPassword')}
              error={pwForm.formState.errors.confirmPassword?.message}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" icon={<Shield size={14} />} loading={pwForm.formState.isSubmitting}>
              Update Password
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard icon={<Bell size={18} />} title="Notification Preferences">
        <Toggle label="New User Registrations" description="Get notified when a new user signs up" defaultChecked />
        <Toggle label="Course Submissions" description="Alert when instructor submits a course for review" defaultChecked />
        <Toggle label="Payment Events" description="Notify on successful or failed payments" defaultChecked />
        <Toggle label="System Alerts" description="Critical system errors and warnings" />
        <Toggle label="Weekly Summary" description="Receive weekly analytics digest via email" />
      </SectionCard>

      <SectionCard icon={<Palette size={18} />} title="Appearance">
        <Toggle label="Dark Mode" description="Use dark theme across the portal" defaultChecked />
        <Toggle label="Compact Sidebar" description="Collapse sidebar by default on load" />
        <Toggle label="Animations" description="Enable smooth transitions and micro-animations" defaultChecked />
      </SectionCard>
    </div>
  );
};

export default Settings;
