import React, { useState } from 'react';
import { useApp, PageId } from '../context/AppContext';
import { getTranslation } from '../utils/i18n';
import {
  GraduationCap,
  Home,
  Bell,
  CalendarDays,
  FileCheck2,
  FileText,
  ShieldAlert,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  CreditCard,
  Award,
  Languages,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    page,
    setPage,
    logout,
    quickLogin,
    applications,
    notices,
    language,
    setLanguage,
    setIdCardModalOpen,
    setAdmitCardModalOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const pendingAppsCount = applications.filter((a) => a.status === 'Pending').length;
  const myPendingCount = applications.filter(
    (a) => a.user_id === currentUser?.id && a.status === 'Pending'
  ).length;

  const isStudent = currentUser?.role === 'student';

  const navItems: { id: PageId; labelKey: any; icon: React.ReactNode; badge?: number; adminOnly?: boolean }[] = [
    { id: 'home', labelKey: 'home', icon: <Home className="w-4 h-4" /> },
    { id: 'notice', labelKey: 'notices', icon: <Bell className="w-4 h-4" />, badge: notices.length },
    { id: 'class', labelKey: 'classRoutine', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'exam', labelKey: 'examRoutine', icon: <FileCheck2 className="w-4 h-4" /> },
    {
      id: 'apply',
      labelKey: 'application',
      icon: <FileText className="w-4 h-4" />,
      badge: isStudent && myPendingCount > 0 ? myPendingCount : undefined,
    },
    ...(isStudent
      ? [
          {
            id: 'results' as PageId,
            labelKey: 'results' as any,
            icon: <Award className="w-4 h-4" />,
          },
        ]
      : []),
    {
      id: 'admin',
      labelKey: 'adminPanel',
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: pendingAppsCount > 0 ? pendingAppsCount : undefined,
      adminOnly: true,
    },
  ];

  const visibleNavItems = navItems.filter((item) => {
    if (item.adminOnly) {
      return currentUser?.role === 'admin';
    }
    return true;
  });

  const handleNavClick = (targetPage: PageId) => {
    setPage(targetPage);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top micro-bar */}
      <div className="bg-slate-950/90 px-4 py-1.5 text-xs border-b border-slate-800/80 text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              {getTranslation(language, 'academicSession')}
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline">Student Affairs & Registrar Portal</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 mr-2">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  language === 'en'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  language === 'bn'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                বাংলা
              </button>
            </div>

            {/* Quick Demo Role Switcher */}
            <span className="text-slate-500 hidden md:inline text-[11px]">Quick Switch:</span>
            <button
              onClick={() => quickLogin('admin')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                currentUser?.role === 'admin'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Switch to Admin role (admin / admin123)"
            >
              👑 Admin
            </button>
            <button
              onClick={() => quickLogin('student', '2026001')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                currentUser?.student_id === '2026001'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Switch to Student Nadiya Kaiyum (2026001 / student123)"
            >
              🎓 Nadiya Kaiyum (2026001)
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <button
            onClick={() => handleNavClick(currentUser ? 'home' : 'login')}
            className="flex items-center gap-3 text-left group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-base sm:text-lg tracking-tight text-white leading-tight flex items-center gap-1.5">
                <span>{language === 'bn' ? 'ইউআইএএস' : 'UIAS'}</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Portal
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400 leading-none">
                {getTranslation(language, 'portalName')}
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          {currentUser ? (
            <nav className="hidden lg:flex items-center gap-1">
              {visibleNavItems.map((item) => {
                const isActive = page === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/50'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    {item.icon}
                    <span>{getTranslation(language, item.labelKey)}</span>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-tight ${
                          isActive
                            ? 'bg-white text-emerald-900'
                            : item.id === 'admin'
                            ? 'bg-rose-500 text-white'
                            : 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/40'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          ) : null}

          {/* Student Quick Badges & Profile Menu */}
          {currentUser ? (
            <div className="hidden md:flex items-center gap-2.5">
              {/* Student Quick Tools */}
              {isStudent && (
                <div className="flex items-center gap-1.5 mr-1">
                  <button
                    onClick={() => setIdCardModalOpen(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-emerald-200 border border-slate-700 text-xs font-medium transition-all"
                    title="View Digital Student ID Card"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>ID Card</span>
                  </button>
                  <button
                    onClick={() => setAdmitCardModalOpen(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700 text-xs font-medium transition-all"
                    title="Download Official Admit Card"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Admit</span>
                  </button>
                </div>
              )}

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center ring-2 ring-emerald-500/30 shrink-0">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-200 leading-tight max-w-[110px] truncate">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          currentUser.role === 'admin' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                      />
                      {currentUser.student_id}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {roleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-700/60">
                      <p className="font-semibold text-white">{currentUser.name}</p>
                      <p className="text-slate-400 text-[11px] truncate">{currentUser.email}</p>
                      <p className="text-emerald-400 font-mono mt-1 text-[11px]">ID: {currentUser.student_id}</p>
                      {currentUser.department && (
                        <p className="text-slate-400 text-[11px] mt-0.5">{currentUser.department}</p>
                      )}
                    </div>
                    {isStudent && (
                      <div className="py-1 border-b border-slate-700/60 space-y-0.5">
                        <button
                          onClick={() => {
                            setRoleMenuOpen(false);
                            setIdCardModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-200 hover:bg-slate-700/60 rounded-lg text-left"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Digital Student ID Card</span>
                        </button>
                        <button
                          onClick={() => {
                            setRoleMenuOpen(false);
                            setAdmitCardModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-200 hover:bg-slate-700/60 rounded-lg text-left"
                        >
                          <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Exam Admit Card</span>
                        </button>
                        <button
                          onClick={() => {
                            setRoleMenuOpen(false);
                            setPage('results');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-200 hover:bg-slate-700/60 rounded-lg text-left"
                        >
                          <Award className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Academic Results & CGPA</span>
                        </button>
                      </div>
                    )}
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          setRoleMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        {getTranslation(language, 'logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900/98 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {currentUser ? (
            <>
              {/* User profile summary in mobile */}
              <div className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-xl mb-3 border border-slate-700/50">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-700 ring-2 ring-emerald-500/30">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-5 h-5 text-slate-300 m-auto mt-2" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{currentUser.name}</div>
                  <div className="text-xs text-slate-400">
                    {currentUser.role.toUpperCase()} • ID: {currentUser.student_id}
                  </div>
                </div>
              </div>

              {/* Quick ID Card & Admit Card buttons in Mobile */}
              {isStudent && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIdCardModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Smart ID Card</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAdmitCardModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-600/20 text-amber-300 border border-amber-500/30 text-xs font-semibold"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Admit Card</span>
                  </button>
                </div>
              )}

              {/* Navigation links */}
              <div className="space-y-1">
                {visibleNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      page === item.id ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{getTranslation(language, item.labelKey)}</span>
                    </div>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-300 border border-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Logout in mobile */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-rose-400 hover:bg-rose-500/10 rounded-lg text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{getTranslation(language, 'logout')}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2">
              <button
                onClick={() => handleNavClick('login')}
                className="w-full py-2.5 rounded-lg text-sm font-medium bg-emerald-600 text-white text-center shadow"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
