import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth, type UserRole } from '../../context/AuthContext';
import {
  ShieldCheck,
  Building,
  Briefcase,
  KeyRound,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  User,
  CheckCircle2,
  ArrowRight,
  Shield,
  Fingerprint
} from 'lucide-react';

// Zod schema for login validation
const loginSchema = z.object({
  loginId: z.string().min(3, 'Login ID must be at least 3 characters.'),
  password: z.string().min(4, 'Password must be at least 4 characters.'),
  captchaInput: z.string().min(1, 'Please solve the CAPTCHA code.'),
  rememberMe: z.boolean().optional()
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Authentication view states
  const [role, setRole] = useState<UserRole>('ADMIN');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmittingInternal, setIsSubmittingInternal] = useState<boolean>(false);

  // Captcha setup
  const [captchaCode, setCaptchaCode] = useState<{ num1: number; num2: number; sum: number }>({
    num1: 4,
    num2: 3,
    sum: 7
  });

  // Forgot password flow
  const [forgotPasswordView, setForgotPasswordView] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 8) + 2;
    const num2 = Math.floor(Math.random() * 7) + 1;
    setCaptchaCode({ num1, num2, sum: num1 + num2 });
  };

  useEffect(() => {
    generateCaptcha();

    // Set default role based on URL params
    const roleParam = searchParams.get('role');
    if (roleParam === 'officer') {
      setRole('OFFICER');
    } else if (roleParam === 'ngo') {
      setRole('NGO');
    } else {
      setRole('ADMIN');
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      loginId: '',
      password: '',
      captchaInput: '',
      rememberMe: true
    }
  });

  // Demo auto-fill helper for convenience
  const handleQuickFill = (demoId: string, demoPass: string, demoRole: UserRole) => {
    setRole(demoRole);
    setValue('loginId', demoId, { shouldValidate: true });
    setValue('password', demoPass, { shouldValidate: true });
    setValue('captchaInput', String(captchaCode.sum), { shouldValidate: true });
    setAuthError(null);
  };

  const handleLoginSubmit = async (data: LoginFormData) => {
    setAuthError(null);

    // Validate Captcha
    if (Number(data.captchaInput.trim()) !== captchaCode.sum) {
      setAuthError('Incorrect CAPTCHA answer. Please solve the updated arithmetic problem.');
      generateCaptcha();
      setValue('captchaInput', '');
      return;
    }

    setIsSubmittingInternal(true);
    try {
      await login(data.loginId, data.password, role);
      navigate('/dashboard');
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Authentication failed. Please verify your login credentials.';
      setAuthError(message);
      generateCaptcha();
      setValue('captchaInput', '');
    } finally {
      setIsSubmittingInternal(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSuccess(true);
    setTimeout(() => {
      setForgotPasswordView(false);
      setResetSuccess(false);
      setResetEmail('');
    }, 4000);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden backdrop-blur-sm transition-all">
        
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#07240c] via-[#0f3813] to-[#1a5d22] text-white p-6 relative overflow-hidden text-center">
          <div className="absolute -right-8 -top-8 w-36 h-36 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-36 h-36 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              {role === 'ADMIN' ? (
                <ShieldCheck className="h-6 w-6 text-amber-400" />
              ) : role === 'OFFICER' ? (
                <Briefcase className="h-6 w-6 text-emerald-300" />
              ) : (
                <Building className="h-6 w-6 text-blue-300" />
              )}
            </div>

            <div>
              <h2 className="text-xl font-black tracking-tight text-white">
                {role === 'ADMIN'
                  ? 'Administrator Control Portal'
                  : role === 'OFFICER'
                  ? 'Officer & Recruiter Desk'
                  : 'NGO Workspace Login'}
              </h2>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Sign in to your authenticated government service workspace
              </p>
            </div>
          </div>
        </div>

        {/* 3-WAY ROLE SELECTION TABS */}
        {!forgotPasswordView && (
          <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/80 p-1.5 gap-1 select-none text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setRole('ADMIN');
                setAuthError(null);
              }}
              className={`py-2.5 px-2 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                role === 'ADMIN'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-extrabold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Shield className={`h-4 w-4 ${role === 'ADMIN' ? 'text-amber-600' : 'text-slate-400'}`} />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('OFFICER');
                setAuthError(null);
              }}
              className={`py-2.5 px-2 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                role === 'OFFICER'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-extrabold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Briefcase className={`h-4 w-4 ${role === 'OFFICER' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>Officer / Recruiter</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('NGO');
                setAuthError(null);
              }}
              className={`py-2.5 px-2 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                role === 'NGO'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-extrabold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Building className={`h-4 w-4 ${role === 'NGO' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>NGO Partner</span>
            </button>
          </div>
        )}

        {/* BODY CONTAINER */}
        <div className="p-6 space-y-5">
          
          {/* FORGOT PASSWORD VIEW */}
          {forgotPasswordView ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center space-y-1">
                <KeyRound className="h-8 w-8 text-amber-500 mx-auto" />
                <h3 className="font-bold text-sm text-slate-900">Reset Portal Password</h3>
                <p className="text-xs text-slate-500">
                  Enter your registered email address or login code to receive recovery instructions.
                </p>
              </div>

              {resetSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-3.5 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Password reset instructions have been dispatched to your email.</span>
                </div>
              )}

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Registered Username / Email Address
                  </label>
                  <input
                    type="text"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@self.org.in or username"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordView(false)}
                    className="text-xs font-semibold px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Back to Login
                  </button>
                  <button
                    type="submit"
                    className="text-xs font-bold px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-all cursor-pointer"
                  >
                    Send Recovery Email
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* STANDARD LOGIN FORM */
            <form onSubmit={handleSubmit(handleLoginSubmit)} className="space-y-4 animate-fadeIn">
              
              {/* Error Message Box */}
              {authError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold p-3.5 rounded-xl flex items-start gap-2.5 animate-shake">
                  <AlertCircle className="h-4.5 w-4.5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Login ID Input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  {role === 'ADMIN'
                    ? 'Admin Username or Email'
                    : role === 'OFFICER'
                    ? 'Officer Code / Username'
                    : 'NGO Darpan ID / Username'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    autoComplete="username"
                    placeholder={
                      role === 'ADMIN'
                        ? 'admin or admin@self.org.in'
                        : role === 'OFFICER'
                        ? 'officer_ranchi or recruiter_pawan'
                        : 'gvp_ngo or JH/2026/08849'
                    }
                    className={`w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border ${
                      errors.loginId ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    } focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all`}
                    {...register('loginId')}
                  />
                  <User className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                </div>
                {errors.loginId && (
                  <p className="text-[11px] text-rose-600 font-semibold">{errors.loginId.message}</p>
                )}
              </div>

              {/* Password Input with Show/Hide Toggle */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Security Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordView(true)}
                    className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    className={`w-full text-xs pl-10 pr-10 py-2.5 rounded-xl border ${
                      errors.password ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    } focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all`}
                    {...register('password')}
                  />
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-rose-600 font-semibold">{errors.password.message}</p>
                )}
              </div>

              {/* CAPTCHA VERIFICATION */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-slate-700">
                  Security Math Verification
                </label>
                <div className="flex items-center gap-2">
                  <div className="bg-slate-100 border border-slate-300 rounded-xl px-4 py-2 flex items-center gap-2 font-mono font-black text-sm tracking-wider select-none text-slate-800 shadow-inner">
                    <span>{captchaCode.num1}</span>
                    <span>+</span>
                    <span>{captchaCode.num2}</span>
                    <span>=</span>
                    <span className="text-slate-400 font-normal">?</span>
                  </div>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    title="Generate new CAPTCHA"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Result"
                    className={`flex-1 text-xs px-3 py-2.5 rounded-xl border ${
                      errors.captchaInput ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    } focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all font-mono`}
                    {...register('captchaInput')}
                  />
                </div>
                {errors.captchaInput && (
                  <p className="text-[11px] text-rose-600 font-semibold">{errors.captchaInput.message}</p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                    {...register('rememberMe')}
                  />
                  <span>Remember my session on this browser</span>
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmittingInternal}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.99]"
              >
                {isSubmittingInternal ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Verifying Credentials & Permissions...</span>
                  </>
                ) : (
                  <>
                    <Fingerprint className="h-4 w-4" />
                    <span>Authorize & Access Workspace</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* FAST DEMO CREDENTIAL CHIPS */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block text-center mb-2">
                  Quick Demo Autofill Credentials
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('admin', 'Admin@12345', 'ADMIN')}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-900 font-semibold transition-all text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <Shield className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
                    <span className="truncate">Root Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFill('recruiter_pawan', 'Password@123', 'OFFICER')}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 font-semibold transition-all text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <Briefcase className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">Recruiter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFill('officer_ranchi', 'Officer@12345', 'OFFICER')}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 font-semibold transition-all text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <Briefcase className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">State Officer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFill('gvp_ngo', 'Ngo@12345', 'NGO')}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-900 font-semibold transition-all text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <Building className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                    <span className="truncate">NGO Partner</span>
                  </button>
                </div>
              </div>

            </form>
          )}

        </div>

        {/* Footer Registration Link */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200/80 text-center text-xs text-slate-600">
          <span>Are you a registered NGO seeking grant certification? </span>
          <Link
            to="/register"
            className="font-bold text-emerald-800 hover:text-emerald-900 hover:underline inline-flex items-center gap-1 ml-1"
          >
            Register Darpan Entity
          </Link>
        </div>

      </div>
    </div>
  );
};
