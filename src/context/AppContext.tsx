import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Notice,
  Routine,
  Application,
  ApplicationStatus,
  RoutineType,
  ApplicationType,
  NoticeCategory,
  Language,
} from '../types';
import { INITIAL_USERS, INITIAL_NOTICES, INITIAL_ROUTINES, INITIAL_APPLICATIONS } from '../mockData';

export type PageId = 'home' | 'notice' | 'class' | 'exam' | 'apply' | 'admin' | 'results' | 'login';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  page: PageId;
  setPage: (page: PageId) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  notices: Notice[];
  routines: Routine[];
  applications: Application[];
  toasts: ToastMessage[];
  idCardModalOpen: boolean;
  setIdCardModalOpen: (open: boolean) => void;
  admitCardModalOpen: boolean;
  setAdmitCardModalOpen: (open: boolean) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  login: (studentId: string, password: string) => boolean;
  quickLogin: (role: 'admin' | 'student', studentId?: string) => void;
  logout: () => void;
  // Notice actions
  addNotice: (data: {
    title: string;
    body: string;
    title_bn?: string;
    body_bn?: string;
    category?: NoticeCategory;
    priority?: 'Urgent' | 'Important' | 'Normal';
    isPinned?: boolean;
  }) => void;
  deleteNotice: (id: number) => void;
  // Routine actions
  addRoutine: (data: {
    type: RoutineType;
    department: string;
    semester: string;
    day_date: string;
    time_text: string;
    course: string;
    courseCode?: string;
    room?: string;
    instructor?: string;
  }) => void;
  deleteRoutine: (id: number) => void;
  // Application actions
  submitApplication: (data: {
    app_type: ApplicationType;
    subject: string;
    details: string;
    phone?: string;
    department?: string;
    semester?: string;
    attachmentName?: string;
  }) => Application | null;
  updateApplicationStatus: (id: number, status: ApplicationStatus, remark?: string) => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'uias_current_user',
  PAGE: 'uias_active_page',
  LANG: 'uias_language',
  NOTICES: 'uias_notices_data',
  ROUTINES: 'uias_routines_data',
  APPLICATIONS: 'uias_applications_data',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current logged in user - default to Nadiya Kaiyum (2026001)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.student_id === '2026001') {
          return {
            ...parsed,
            name: 'Nadiya Kaiyum',
            email: 'nadiyakaiyum@gmail.com',
            bloodGroup: 'A+',
            validUntil: 'December 2027',
            registrationNo: 'REG-2023-CSE-0421',
            cgpa: 3.88,
            creditsCompleted: 96,
            totalCredits: 144,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          };
        }
        return parsed;
      }
      return INITIAL_USERS[1];
    } catch {
      return INITIAL_USERS[1];
    }
  });

  // Current page
  const [page, setPageState] = useState<PageId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAGE) as PageId;
      return saved || 'home';
    } catch {
      return 'home';
    }
  });

  // Language state
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANG) as Language;
      return saved || 'en';
    } catch {
      return 'en';
    }
  });

  // Modals
  const [idCardModalOpen, setIdCardModalOpen] = useState(false);
  const [admitCardModalOpen, setAdmitCardModalOpen] = useState(false);

  // Notices
  const [notices, setNotices] = useState<Notice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTICES);
      return saved ? JSON.parse(saved) : INITIAL_NOTICES;
    } catch {
      return INITIAL_NOTICES;
    }
  });

  // Routines
  const [routines, setRoutines] = useState<Routine[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROUTINES);
      return saved ? JSON.parse(saved) : INITIAL_ROUTINES;
    } catch {
      return INITIAL_ROUTINES;
    }
  });

  // Applications
  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (saved) {
        const parsed: Application[] = JSON.parse(saved);
        return parsed.map((app) =>
          app.student_id === '2026001' ? { ...app, student_name: 'Nadiya Kaiyum' } : app
        );
      }
      return INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAGE, page);
  }, [page]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    showToast(
      lang === 'bn' ? 'ভাষা পরিবর্তন করা হয়েছে: বাংলা' : 'Language changed to: English',
      'info'
    );
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setPage = (newPage: PageId) => {
    if (newPage === 'admin' && currentUser?.role !== 'admin') {
      showToast(
        language === 'bn'
          ? 'অনুমোদনহীন প্রবেশ: কেবল অ্যাডমিনিস্ট্রেটরদের জন্য সংরক্ষিত'
          : 'Access restricted: Administrator role required',
        'error'
      );
      setPageState('home');
      return;
    }
    if (!currentUser && newPage !== 'login') {
      setPageState('login');
      return;
    }
    setPageState(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = (studentId: string, password: string): boolean => {
    const trimmedId = studentId.trim();
    const found = INITIAL_USERS.find(
      (u) =>
        u.student_id.toLowerCase() === trimmedId.toLowerCase() &&
        u.password === password
    );

    if (found) {
      const { password: _, ...userWithoutPass } = found;
      setCurrentUser(userWithoutPass);
      showToast(
        language === 'bn'
          ? `স্বাগতম, ${userWithoutPass.name}!`
          : `Welcome back, ${userWithoutPass.name}!`,
        'success'
      );
      setPageState('home');
      return true;
    } else {
      showToast(
        language === 'bn'
          ? 'ভুল আইডি বা পাসওয়ার্ড। অনুগ্রহ করে আবার চেষ্টা করুন।'
          : 'Invalid Student ID / Admin ID or Password. Try admin/admin123 or 2026001/student123',
        'error'
      );
      return false;
    }
  };

  const quickLogin = (role: 'admin' | 'student', studentId?: string) => {
    let target = INITIAL_USERS.find((u) => u.role === role);
    if (studentId) {
      const specific = INITIAL_USERS.find((u) => u.student_id === studentId);
      if (specific) target = specific;
    }
    if (target) {
      const { password: _, ...userWithoutPass } = target;
      setCurrentUser(userWithoutPass);
      showToast(
        language === 'bn'
          ? `একাউন্টে সুইচ করা হয়েছে: ${userWithoutPass.name} (${userWithoutPass.role.toUpperCase()})`
          : `Switched account to ${userWithoutPass.name} (${userWithoutPass.role.toUpperCase()})`,
        'info'
      );
      setPageState(target.role === 'admin' ? 'admin' : 'home');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    showToast(
      language === 'bn'
        ? 'সফলভাবে লগআউট করা হয়েছে।'
        : 'You have been logged out successfully.',
      'info'
    );
    setPageState('login');
  };

  const addNotice = (data: {
    title: string;
    body: string;
    title_bn?: string;
    body_bn?: string;
    category?: NoticeCategory;
    priority?: 'Urgent' | 'Important' | 'Normal';
    isPinned?: boolean;
  }) => {
    const newNotice: Notice = {
      id: Date.now(),
      title: data.title,
      body: data.body,
      title_bn: data.title_bn,
      body_bn: data.body_bn,
      category: data.category || 'General',
      priority: data.priority || 'Normal',
      isPinned: !!data.isPinned,
      publishedBy: currentUser?.name || 'Office of the Registrar',
      created_at: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };
    setNotices((prev) => [newNotice, ...prev]);
    showToast(
      language === 'bn' ? 'নোটিশ সফলভাবে প্রকাশিত হয়েছে!' : 'Notice published successfully!',
      'success'
    );
  };

  const deleteNotice = (id: number) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    showToast(
      language === 'bn' ? 'নোটিশ মুছে ফেলা হয়েছে।' : 'Notice deleted successfully.',
      'info'
    );
  };

  const addRoutine = (data: {
    type: RoutineType;
    department: string;
    semester: string;
    day_date: string;
    time_text: string;
    course: string;
    courseCode?: string;
    room?: string;
    instructor?: string;
  }) => {
    const newRoutine: Routine = {
      id: Date.now(),
      ...data,
    };
    setRoutines((prev) => [newRoutine, ...prev]);
    showToast(
      language === 'bn'
        ? `${data.type} রুটিন সফলভাবে যুক্ত হয়েছে!`
        : `${data.type} Routine entry added successfully!`,
      'success'
    );
  };

  const deleteRoutine = (id: number) => {
    const target = routines.find((r) => r.id === id);
    setRoutines((prev) => prev.filter((r) => r.id !== id));
    showToast(
      language === 'bn'
        ? `${target?.type || 'রুটিন'} মুছে ফেলা হয়েছে।`
        : `${target?.type || 'Routine'} entry removed.`,
      'info'
    );
  };

  const submitApplication = (data: {
    app_type: ApplicationType;
    subject: string;
    details: string;
    phone?: string;
    department?: string;
    semester?: string;
    attachmentName?: string;
  }): Application | null => {
    if (!currentUser) {
      showToast('Please login to submit an application.', 'error');
      return null;
    }

    const applicationNo = `APP-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const timestamp = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const newApp: Application = {
      id: Date.now(),
      application_no: applicationNo,
      user_id: currentUser.id,
      student_name: currentUser.name,
      student_id: currentUser.student_id,
      department: data.department || currentUser.department || 'General',
      semester: data.semester || currentUser.semester || 'Current',
      phone: data.phone || currentUser.phone || 'N/A',
      app_type: data.app_type,
      subject: data.subject,
      details: data.details,
      status: 'Pending',
      attachmentName: data.attachmentName,
      created_at: timestamp,
      timeline: [
        {
          title: 'Application Submitted',
          title_bn: 'আবেদন দাখিল সম্পন্ন',
          status: 'completed',
          date: timestamp,
          actor: currentUser.name,
        },
        {
          title: 'Department Head Review',
          title_bn: 'বিভাগীয় প্রধানের পর্যালোচনা',
          status: 'current',
          date: 'In Queue',
          actor: 'Academic Advisor',
        },
        {
          title: 'Administration Decision',
          title_bn: 'রেজিস্ট্রার চূড়ান্ত সিদ্ধান্ত',
          status: 'pending',
          actor: 'Office of Registrar',
        },
      ],
    };

    setApplications((prev) => [newApp, ...prev]);

    // Celebratory confetti burst!
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#06b6d4', '#f59e0b'],
      });
    } catch {
      // ignore
    }

    showToast(
      language === 'bn'
        ? `আবেদন #${applicationNo} সফলভাবে জমা হয়েছে!`
        : `Application #${applicationNo} submitted successfully!`,
      'success'
    );
    return newApp;
  };

  const updateApplicationStatus = (id: number, status: ApplicationStatus, remark?: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const timestamp = new Date().toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          });

          const updatedTimeline = app.timeline
            ? app.timeline.map((step, idx) => {
                if (idx === app.timeline!.length - 1) {
                  return {
                    ...step,
                    status: (status === 'Approved' ? 'completed' : 'pending') as any,
                    date: timestamp,
                    actor: currentUser?.name || 'Administrator',
                  };
                }
                return { ...step, status: 'completed' as any };
              })
            : undefined;

          return {
            ...app,
            status,
            admin_remark: remark !== undefined ? remark : app.admin_remark,
            reviewed_at: timestamp,
            reviewed_by: currentUser?.name || 'Administrator',
            timeline: updatedTimeline,
          };
        }
        return app;
      })
    );

    if (status === 'Approved') {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b'],
        });
      } catch {}
    }

    showToast(
      language === 'bn'
        ? `আবেদনটি ${status === 'Approved' ? 'অনুমোদন' : 'বাতিল'} করা হয়েছে।`
        : `Application marked as ${status}.`,
      status === 'Approved' ? 'success' : 'info'
    );
  };

  const resetToDefaultData = () => {
    setNotices(INITIAL_NOTICES);
    setRoutines(INITIAL_ROUTINES);
    setApplications(INITIAL_APPLICATIONS);
    showToast(
      language === 'bn'
        ? 'ডেমো ডেটা ডিফল্ট অবস্থায় ফিরিয়ে আনা হয়েছে।'
        : 'Demo data restored to defaults.',
      'info'
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        page,
        setPage,
        language,
        setLanguage,
        notices,
        routines,
        applications,
        toasts,
        idCardModalOpen,
        setIdCardModalOpen,
        admitCardModalOpen,
        setAdmitCardModalOpen,
        showToast,
        removeToast,
        login,
        quickLogin,
        logout,
        addNotice,
        deleteNotice,
        addRoutine,
        deleteRoutine,
        submitApplication,
        updateApplicationStatus,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
