import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { loginSuccess } from '../../store/slices/authSlice';
import { InputField } from '../../components/forms';

import loginBg from '../../assets/login_background.png';
import logoImg from '../../assets/logo.png';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

const generateToken = () => 'mock_jwt_token_' + Date.now();

const LoginPage: React.FC = () => {
  const [showPw, setShowPw] = React.useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { remember: true },
  });

  const onSubmit = async (data: FormData) => {
    await new Promise(r => setTimeout(r, 1000));
    if (data.password === 'wrong') {
      setError('password', { message: 'Invalid credentials. Try "admin123".' });
      return;
    }
    dispatch(loginSuccess({
      user: { id: 'admin1', name: 'Kaviyapriya Perumal', email: data.email, role: 'admin' },
      token: generateToken(),
    }));
    navigate('/');
  };

  return (
    <div
      className="h-screen w-screen bg-primary-50 flex overflow-hidden select-none font-sans"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'left bottom',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="hidden lg:flex flex-[1.4] flex-col justify-between relative z-10 p-10 xl:p-14 h-full">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 xl:w-11 xl:h-11 overflow-hidden flex-shrink-0 flex items-center">
              <img src={logoImg} alt="LMS Logo" className="max-w-none" style={{ width: '396.875%', height: '100%', objectFit: 'cover', objectPosition: 'left' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 leading-none tracking-tight font-serif">LMS</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Admin Portal</p>
            </div>
          </div>



          <div>
            <h2 className="text-4xl xl:text-5xl font-serif text-[#18130F] leading-[1.15] tracking-tight mb-3">
              Manage Learning.<br />
              Empower <span className="text-primary-500">People.</span>
            </h2>
            <div className="w-14 h-[3px] bg-primary-500 rounded-full mb-4"></div>
            <p className="text-slate-600 text-xs xl:text-base max-w-none leading-relaxed font-semibold whitespace-nowrap">
              A unified workspace to manage trainers, trainees, courses, batches, enrollments, assessments, attendance and certificates.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 lg:flex-[0.7] bg-white rounded-[2rem] shadow-xl border border-[#e8e6dc]/20 relative z-20 flex flex-col justify-center py-8 px-6 sm:px-10 xl:px-12 h-[calc(100%-2rem)] my-4 mr-4 lg:my-6 lg:mr-6 lg:ml-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[400px] mx-auto"
        >
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-6">
            <div className="w-8 h-8 overflow-hidden flex-shrink-0 flex items-center">
              <img src={logoImg} alt="LMS Logo" className="max-w-none" style={{ width: '396.875%', height: '100%', objectFit: 'cover', objectPosition: 'left' }} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none font-serif">LMS</h1>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Admin Portal</p>
            </div>
          </div>

          <div className="text-center mb-8 select-none">
            <div className="mx-auto mb-4 w-24 h-24 lg:w-28 lg:h-28 flex items-center justify-center">
              <img src={logoImg} alt="Welcome Icon" className="w-full h-full object-contain drop-shadow-sm" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-serif font-bold text-slate-900 mb-1.5">Welcome back</h2>
            <p className="text-slate-500 text-sm font-semibold">Sign in to your admin workspace</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <InputField
              label="Email Address" type="email" placeholder="admin@lms.com"
              icon={<Mail className="w-4 h-4 text-slate-400" />}
              {...register('email')} error={errors.email?.message}
              className="bg-white border-slate-200/80 focus:ring-primary-500/30 focus:border-primary-500 py-3 text-sm rounded-xl"
            />

            <div className="relative">
              <InputField
                label="Password" type={showPw ? 'text' : 'password'} placeholder="••••••••••••"
                icon={<Lock className="w-4 h-4 text-slate-400" />}
                {...register('password')} error={errors.password?.message}
                className="bg-white border-slate-200/80 focus:ring-primary-500/30 focus:border-primary-500 py-3 text-sm rounded-xl pr-10"
              />
              <button type="button" onClick={() => setShowPw(p => !p)}
                className="absolute right-4 bottom-3.5 text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center h-4 w-4">
                {showPw ? <EyeOff className="w-4 h-4" strokeWidth={1.8} /> : <Eye className="w-4 h-4" strokeWidth={1.8} />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" {...register('remember')}
                    className="peer appearance-none w-4 h-4 rounded-[4px] border-2 border-slate-200 checked:border-primary-500 checked:bg-primary-500 transition-colors cursor-pointer" />
                  <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-sm font-semibold text-slate-700">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors">Forgot password?</a>
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white rounded-md py-3.5 font-bold text-sm transition-all duration-200 shadow-sm shadow-primary-500/25 flex items-center justify-center gap-1.5 mt-2 active:scale-[0.99] cursor-pointer">
              {isSubmitting ? 'Signing in...' : 'Sign In'}
              {!isSubmitting && <ArrowRight className="w-4 h-4" strokeWidth={2.5} />}
            </button>
          </form>

          <div className="mt-6">
            <div className="flex items-center gap-3 mb-6 text-xs text-slate-300">
              <div className="flex-1 h-px bg-slate-200/60" />
              <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">or</span>
              <div className="flex-1 h-px bg-slate-200/60" />
            </div>

            <button type="button"
              className="w-full bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 rounded-md py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] cursor-pointer">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              Continue with Google
            </button>

            <div className="mt-5 flex items-center justify-center gap-2 text-slate-500">
              <div className="w-7 h-7 rounded-full bg-primary-50 border border-primary-500/10 flex items-center justify-center flex-shrink-0 text-primary-500">
                <ShieldCheck className="w-4 h-4" strokeWidth={1.8} />
              </div>
              <p className="text-xs font-semibold max-w-[220px] leading-normal text-slate-500">
                Your account is protected with secure authentication.
              </p>
            </div>
          </div>
        </motion.div>
      </div>


    </div>
  );
};

export default LoginPage;
