import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, ArrowRight, ArrowLeft, MailCheck } from 'lucide-react';
import { FormField } from '../../components/forms';
import Button from '../../components/common/Button';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});
type FormData = z.infer<typeof schema>;

const ForgotPasswordPage: React.FC = () => {
  const [sent, setSent] = useState(false);
  const [sentTo, setSentTo] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await new Promise(r => setTimeout(r, 1000));
    setSentTo(data.email);
    setSent(true);
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

        {!sent ? (
          <>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Forgot password?</h2>
            <p className="text-slate-500 text-sm mb-8">Enter your admin email and we'll send you a reset link.</p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <FormField
                label="Email Address" type="email" placeholder="admin@lms.com"
                icon={<Mail size={15} />} required
                {...register('email')} error={errors.email?.message}
              />
              <Button type="submit" fullWidth loading={isSubmitting} iconRight={!isSubmitting ? <ArrowRight size={16} /> : undefined}>
                {isSubmitting ? 'Sending link...' : 'Send Reset Link'}
              </Button>
            </form>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <MailCheck size={26} className="text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Check your inbox</h2>
            <p className="text-slate-500 text-sm mb-6">
              We've sent a password reset link to <span className="text-slate-200 font-medium">{sentTo}</span>.
            </p>
            <Link to="/reset-password">
              <Button variant="secondary" fullWidth>Continue to Reset Password (Demo)</Button>
            </Link>
          </motion.div>
        )}

        <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-primary-400 hover:text-primary-300 transition-colors mt-6">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
