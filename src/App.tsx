/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { LoginView } from './components/LoginView';
import { HomeView } from './components/HomeView';
import { NoticeView } from './components/NoticeView';
import { RoutineView } from './components/RoutineView';
import { ApplicationView } from './components/ApplicationView';
import { AdminView } from './components/AdminView';
import { ResultsView } from './components/ResultsView';
import { StudentIdCardModal } from './components/StudentIdCardModal';
import { AdmitCardModal } from './components/AdmitCardModal';

const MainContent: React.FC = () => {
  const {
    currentUser,
    page,
    language,
    routines,
    idCardModalOpen,
    setIdCardModalOpen,
    admitCardModalOpen,
    setAdmitCardModalOpen,
  } = useApp();

  // If not logged in or on login page
  if (!currentUser || page === 'login') {
    return <LoginView />;
  }

  return (
    <>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {page === 'home' && <HomeView />}
        {page === 'notice' && <NoticeView />}
        {page === 'class' && <RoutineView type="Class" />}
        {page === 'exam' && <RoutineView type="Exam" />}
        {page === 'apply' && <ApplicationView />}
        {page === 'results' && <ResultsView />}
        {page === 'admin' && <AdminView />}
      </main>

      {/* Global Modals */}
      {idCardModalOpen && currentUser && (
        <StudentIdCardModal
          user={currentUser}
          language={language}
          onClose={() => setIdCardModalOpen(false)}
        />
      )}

      {admitCardModalOpen && currentUser && (
        <AdmitCardModal
          user={currentUser}
          routines={routines}
          language={language}
          onClose={() => setAdmitCardModalOpen(false)}
        />
      )}
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Navbar />
        <MainContent />
        <Footer />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
