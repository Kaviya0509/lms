import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { FormField } from '../../components/forms';
import Button from '../../components/common/Button';

const schema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

const ResetPasswordPage: React.FC = () => {
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 1000));
    setDone(true);
    setTimeout(() => navigate('/login'), 1800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-[0_0_28px_rgba(99,102,241,0.35)]">
            <ShieldCheck size={26} className="text-slate-900" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">LMS Admin Portal</h2>
        </div>

        {!done ? (
          <>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Reset your password</h2>
            <p className="text-slate-500 text-sm mb-8">Choose a new password for your admin account.</p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <div className="relative">
                <FormField
                  label="New Password" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                  icon={<Lock size={15} />} required
                  {...register('password')} error={errors.password?.message}
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-[38px] text-slate-500 hover:text-slate-700 transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <FormField
                label="Confirm Password" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                icon={<Lock size={15} />} required
                {...register('confirmPassword')} error={errors.confirmPassword?.message}
              />
              <Button type="submit" fullWidth loading={isSubmitting}>
                {isSubmitting ? 'Updating password...' : 'Reset Password'}
              </Button>
            </form>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={26} className="text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Password updated</h2>
            <p className="text-slate-500 text-sm">Redirecting you to sign in...</p>
          </motion.div>
        )}

        {!done && (
          <Link to="/login" className="block text-center text-sm text-primary-400 hover:text-primary-300 transition-colors mt-6">
            Back to Sign In
          </Link>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
