import React from 'react';
import { Shield, Globe } from 'lucide-react';
import Button from '../../components/common/Button';
import { FormField } from '../../components/forms';
import { useToast } from '../../hooks/useToast';

const SettingsPage: React.FC = () => {
  const toast = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('System settings saved successfully!');
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-xl font-bold text-slate-900">System Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Configure platform settings, security standards, and notification rules</p>
      </div>

      <form onSubmit={handleSave} noValidate className="space-y-6">
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 shadow-sm pb-3">
            <Globe size={18} className="text-primary-600" />
            <h2 className="font-semibold text-slate-900">General Information</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Portal Title" defaultValue="Enterprise LMS Admin Portal" />
            <FormField label="Admin Support Email" defaultValue="support@lms.com" />
            <FormField label="Default Timezone" defaultValue="Asia/Kolkata (IST)" />
            <FormField label="Session Timeout (mins)" defaultValue="60" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 shadow-sm pb-3">
            <Shield size={18} className="text-emerald-600" />
            <h2 className="font-semibold text-slate-900">Security & Access Policy</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Require 2FA for Trainers', desc: 'Enforce two-factor authentication on trainer login', defaultChecked: true },
              { label: 'Auto-lock Unattended Sessions', desc: 'Lock dashboard after 15 minutes of inactivity', defaultChecked: true },
              { label: 'Enforce Complex Passwords', desc: 'Min 8 chars with uppercase, lowercase, numbers, symbols', defaultChecked: true },
            ].map((s, i) => (
              <label key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-slate-900">{s.label}</p>
                  <p className="text-xs text-slate-500">{s.desc}</p>
                </div>
                <input type="checkbox" defaultChecked={s.defaultChecked} className="w-4 h-4 accent-primary-600 rounded" />
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save All Settings</Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
