import React from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, Phone, Mail, MapPin, RefreshCw, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { resetToDefaultData, setPage } = useApp();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: University Identity */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-base tracking-tight text-white">UIAS Portal</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              University Information & Application System. Developed for University Management, student routine access, and real-time application processing.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Academic Institution Portal</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => setPage('home')} className="hover:text-emerald-400 transition-colors">
                  Dashboard & Overview
                </button>
              </li>
              <li>
                <button onClick={() => setPage('notice')} className="hover:text-emerald-400 transition-colors">
                  Official University Notices
                </button>
              </li>
              <li>
                <button onClick={() => setPage('class')} className="hover:text-emerald-400 transition-colors">
                  Class Routine Timetable
                </button>
              </li>
              <li>
                <button onClick={() => setPage('exam')} className="hover:text-emerald-400 transition-colors">
                  Semester Examination Routine
                </button>
              </li>
              <li>
                <button onClick={() => setPage('apply')} className="hover:text-emerald-400 transition-colors">
                  Online Application System
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Services & Support */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Student Support Desk</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Room 102, Registrar Building, Main University Campus</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+880 2-9876543 / Ext. 201</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>support@university.edu.bd</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Testing & System Management */}
          <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Demo & Testing Tools</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              You can test the system with full administrative capabilities or student application workflows.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Reset all notices, routines, and applications to initial default sample data?')) {
                  resetToDefaultData();
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Demo Data
            </button>
          </div>
        </div>

        {/* Bottom copyright line - verbatim matching original PHP */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© 2026 University Information & Application System. Developed for University Management.</p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Academic Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
