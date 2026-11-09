import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, Lock, User, ArrowRight, ShieldCheck, KeyRound, Eye, EyeOff } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useApp();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim() || !password) return;
    setIsSubmitting(true);
    setTimeout(() => {
      login(studentId, password);
      setIsSubmitting(false);
    }, 200);
  };

  const fillCredentials = (id: string, pass: string) => {
    setStudentId(id);
    setPassword(pass);
  };

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
            Student / Admin Login
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to access university notices, schedules, and application requests
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Student ID / Admin ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="student_id"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. 2026001 or admin"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white shadow-lg shadow-emerald-950/50 transition-all disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Verifying...' : 'Login to Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Preset Demo Credentials Box - matches original PHP text explicitly */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span>Default Credentials (Click to autofill)</span>
            </div>

            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => fillCredentials('admin', 'admin123')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 text-left transition-all group"
              >
                <div>
                  <div className="font-semibold text-amber-300 group-hover:text-amber-200 flex items-center gap-1.5">
                    <span>👑 Admin Account</span>
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono">
                    ID: <b className="text-slate-300">admin</b> | Password: <b className="text-slate-300">admin123</b>
                  </div>
                </div>
                <span className="text-[10px] font-medium px-2 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Autofill
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('2026001', 'student123')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
              >
                <div>
                  <div className="font-semibold text-emerald-300 group-hover:text-emerald-200 flex items-center gap-1.5">
                    <span>🎓 Student: Nadiya Kaiyum (CSE)</span>
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono">
                    ID: <b className="text-slate-300">2026001</b> | Password: <b className="text-slate-300">student123</b>
                  </div>
                </div>
                <span className="text-[10px] font-medium px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Autofill
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('2026002', 'student123')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
              >
                <div>
                  <div className="font-semibold text-cyan-300 group-hover:text-cyan-200 flex items-center gap-1.5">
                    <span>🎓 Student Account (EEE)</span>
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono">
                    ID: <b className="text-slate-300">2026002</b> | Password: <b className="text-slate-300">student123</b>
                  </div>
                </div>
                <span className="text-[10px] font-medium px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Autofill
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Security footnote */}
        <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted Session • University Information & Application System</span>
        </div>
      </div>
    </div>
  );
};
