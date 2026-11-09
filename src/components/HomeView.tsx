import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/i18n';
import {
  GraduationCap,
  Bell,
  CalendarDays,
  FileCheck2,
  FileText,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  BookOpen,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Award,
  Download,
  MapPin,
  TrendingUp,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    currentUser,
    setPage,
    notices,
    routines,
    applications,
    language,
    setIdCardModalOpen,
    setAdmitCardModalOpen,
  } = useApp();

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';
  const isStudent = currentUser.role === 'student';
  const myApplications = applications.filter((a) => a.user_id === currentUser.id);
  const pendingCount = applications.filter((a) => a.status === 'Pending').length;
  const classRoutines = routines.filter((r) => r.type === 'Class');
  const examRoutines = routines.filter((r) => r.type === 'Exam');

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Card - honoring PHP specifications precisely */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 border border-slate-700/80 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{getTranslation(language, 'portalName')}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {language === 'bn' ? `স্বাগতম, ${currentUser.name}!` : `Welcome, ${currentUser.name}!`}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {language === 'bn'
                ? 'বিশ্ববিদ্যালয় তথ্য ও অনলাইন আবেদন ব্যবস্থায় আপনাকে স্বাগতম। রুটিন, জরুরি নোটিশ এবং অনলাইন আবেদনের সুবিধা গ্রহণ করুন।'
                : 'Welcome to University Information & Application System. Access your academic schedules, stay updated with official notices, and submit institutional applications effortlessly.'}
            </p>

            {/* Profile Meta Pills */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300">
                <span className="text-slate-500">{getTranslation(language, 'userId')}:</span>
                <span className="font-mono font-bold text-emerald-400">{currentUser.student_id}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300">
                <span className="text-slate-500">{getTranslation(language, 'role')}:</span>
                <span className="font-semibold uppercase text-amber-400">{currentUser.role}</span>
              </div>
              {currentUser.department && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300">
                  <span className="text-slate-500">{getTranslation(language, 'department')}:</span>
                  <span className="font-medium text-slate-200">{currentUser.department}</span>
                </div>
              )}
              {currentUser.cgpa && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-amber-500/30 text-amber-300 font-bold">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>CGPA: {currentUser.cgpa}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick CTAs */}
          <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto shrink-0">
            {isAdmin ? (
              <button
                onClick={() => setPage('admin')}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02]"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{getTranslation(language, 'adminPanel')}</span>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-amber-300 text-xs">
                    {pendingCount} Pending
                  </span>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={() => setPage('apply')}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02]"
                >
                  <FileText className="w-4 h-4" />
                  <span>{getTranslation(language, 'submitApp')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIdCardModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-sm border border-slate-700 transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Smart ID Card</span>
                </button>
              </>
            )}

            <button
              onClick={() => setPage('notice')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-all"
            >
              <Bell className="w-4 h-4 text-emerald-400" />
              <span>{getTranslation(language, 'notices')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Numerical Metrics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setPage('notice')}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 sm:p-5 transition-all cursor-pointer group shadow-sm hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {getTranslation(language, 'notices')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">{notices.length}</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 group-hover:text-emerald-400 transition-colors">
            <span>{language === 'bn' ? 'সকল বিজ্ঞপ্তি' : 'View board'}</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div
          onClick={() => setPage('class')}
          className="bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 sm:p-5 transition-all cursor-pointer group shadow-sm hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {getTranslation(language, 'classRoutine')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">{classRoutines.length}</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 group-hover:text-cyan-400 transition-colors">
            <span>{language === 'bn' ? 'ক্লাস শিডিউল' : 'Weekly schedule'}</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div
          onClick={() => setPage('exam')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 sm:p-5 transition-all cursor-pointer group shadow-sm hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {getTranslation(language, 'examRoutine')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">{examRoutines.length}</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 group-hover:text-amber-400 transition-colors">
            <span>{language === 'bn' ? 'পরীক্ষার সময়সূচি' : 'Exam timetable'}</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div
          onClick={() => setPage(isAdmin ? 'admin' : 'apply')}
          className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 sm:p-5 transition-all cursor-pointer group shadow-sm hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {isAdmin ? getTranslation(language, 'allApplications') : getTranslation(language, 'myApplications')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {isAdmin ? applications.length : myApplications.length}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 group-hover:text-indigo-400 transition-colors">
            <span>{isAdmin ? `${pendingCount} to review` : 'Check status'}</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Available Services Section - Matching PHP code text & items explicitly */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span>{getTranslation(language, 'availableServices')}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Integrated services available for your current account role ({currentUser.role})
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
            {isAdmin ? '7 Core Modules' : '6 Student Modules'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Service 1 */}
          <div
            onClick={() => setPage('notice')}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-800/40 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  1. Official University Notices
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Stay updated with circulars, academic calendar revisions, and urgent official announcements.
                </p>
              </div>
            </div>
          </div>

          {/* Service 2 */}
          <div
            onClick={() => setPage('class')}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-800/40 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  2. Class Routine
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Departmental semester-wise weekly lecture timings, classroom locations, and faculty assignments.
                </p>
              </div>
            </div>
          </div>

          {/* Service 3 */}
          <div
            onClick={() => setPage('exam')}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-800/40 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                  3. Exam Routine
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Midterm and final term examination dates, morning/afternoon slots, and assigned exam halls.
                </p>
              </div>
            </div>
          </div>

          {/* Service 4 */}
          <div
            onClick={() => setPage('apply')}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-800/40 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  4. Online Application
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Submit requests for Exam Permission, Lost ID Card, Transport Fee Off, and other applications online.
                </p>
              </div>
            </div>
          </div>

          {/* Service 5 */}
          <div
            onClick={() => setPage('apply')}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-800/40 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                5
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                  5. Application Status
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Track real-time approval status (Pending, Approved, Rejected) and printable verification slips.
                </p>
              </div>
            </div>
          </div>

          {/* Service for Student: Academic Results */}
          {isStudent && (
            <div
              onClick={() => setPage('results')}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-800/40 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                  ★
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-amber-200 group-hover:text-amber-100 transition-colors">
                    Results & CGPA Transcript
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Semester-wise grades, cumulative CGPA (3.88), degree credit progress, and target GPA calculator.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Admin Services (6 & 7) - strictly matching PHP condition */}
          {isAdmin && (
            <>
              <div
                onClick={() => setPage('admin')}
                className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-950/30 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-sm shrink-0">
                    6
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-amber-200 group-hover:text-amber-100 transition-colors">
                      6. Admin Management Panel
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Review, approve, or reject student applications with remarks and oversee institutional processes.
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setPage('notice')}
                className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 hover:border-rose-400 hover:bg-rose-950/30 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-sm shrink-0">
                    7
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-rose-200 group-hover:text-rose-100 transition-colors">
                      7. Delete Notices and Routines
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Privileged administrative powers to publish, modify, or delete obsolete notices and schedules.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Split Highlights: Recent Notices & Quick Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notices Snapshot */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                <span>{language === 'bn' ? 'সাম্প্রতিক বিজ্ঞপ্তি' : 'Latest University Circulars'}</span>
              </h3>
              <button
                onClick={() => setPage('notice')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>View All ({notices.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {notices.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  onClick={() => setPage('notice')}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                      {n.category}
                    </span>
                    <span className="text-[11px] text-slate-500">{n.created_at}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white line-clamp-1">
                    {language === 'bn' && n.title_bn ? n.title_bn : n.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {language === 'bn' && n.body_bn ? n.body_bn : n.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Applications (Student) or Pending Reviews (Admin) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>{isAdmin ? 'Applications Requiring Review' : 'My Recent Applications'}</span>
              </h3>
              <button
                onClick={() => setPage(isAdmin ? 'admin' : 'apply')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>{isAdmin ? 'Review Panel' : 'Application Portal'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {isAdmin ? (
              <div className="space-y-3">
                {applications.slice(0, 3).map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setPage('admin')}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{app.student_name}</span>
                        <span className="text-[11px] font-mono text-slate-400">({app.student_id})</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          app.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : app.status === 'Rejected'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{app.app_type}</p>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{app.details}</p>
                  </div>
                ))}
              </div>
            ) : myApplications.length > 0 ? (
              <div className="space-y-3">
                {myApplications.slice(0, 3).map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setPage('apply')}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-white">{app.app_type}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          app.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : app.status === 'Rejected'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{app.details}</p>
                    <div className="text-[11px] text-slate-500 mt-2 font-mono flex items-center justify-between">
                      <span>Ref: {app.application_no}</span>
                      <span className="text-emerald-400">View progress timeline →</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                <p>You have not submitted any application yet.</p>
                <button
                  onClick={() => setPage('apply')}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 text-xs font-semibold transition-all"
                >
                  Apply Online Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
