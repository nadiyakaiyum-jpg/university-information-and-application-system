import React from 'react';
import { User, Routine, Language } from '../types';
import { X, Printer, GraduationCap, ShieldCheck, QrCode, AlertCircle, FileCheck2 } from 'lucide-react';

interface AdmitCardModalProps {
  user: User;
  routines: Routine[];
  language: Language;
  onClose: () => void;
}

export const AdmitCardModal: React.FC<AdmitCardModalProps> = ({ user, routines, language, onClose }) => {
  const examRoutines = routines.filter((r) => r.type === 'Exam');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl relative my-8 border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Official Letterhead Header */}
        <div className="text-center pb-5 border-b-2 border-slate-900 mb-6">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-slate-950">
              University of Technology & Management
            </h2>
          </div>
          <p className="text-xs uppercase font-bold tracking-widest text-emerald-800">
            Office of the Controller of Examinations
          </p>
          <div className="inline-block mt-2 px-4 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-bold uppercase tracking-wider text-slate-800">
            Official Examination Admit Card • Spring 2026
          </div>
        </div>

        {/* Student Bio & Photograph Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
          {/* Photograph */}
          <div className="w-24 h-28 rounded-xl overflow-hidden bg-slate-200 border-2 border-slate-400 shrink-0 shadow-sm">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs flex-1 w-full">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Candidate Name:</span>
              <span className="font-extrabold text-slate-950 text-sm">{user.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Student ID:</span>
              <span className="font-mono font-extrabold text-emerald-800 text-sm">{user.student_id}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Department:</span>
              <span className="font-semibold text-slate-800">{user.department || 'Computer Science & Engineering'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Exam Roll / Token:</span>
              <span className="font-mono font-bold text-slate-900">EX-2026-0842</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Semester:</span>
              <span className="font-semibold text-slate-800">{user.semester || '6th Semester'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Registration No:</span>
              <span className="font-mono text-slate-700">{user.registrationNo || 'REG-2023-0421'}</span>
            </div>
          </div>
        </div>

        {/* Exam Schedule Table */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-emerald-700" />
            <span>Eligible Courses & Examination Schedule</span>
          </h4>

          <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-300">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Course Title</th>
                  <th className="py-2.5 px-3">Hall / Seat</th>
                  <th className="py-2.5 px-3 text-center">Invigilator Sign</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {examRoutines.map((ex) => (
                  <tr key={ex.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 font-semibold text-emerald-900 whitespace-nowrap">
                      {ex.day_date}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] whitespace-nowrap">
                      {ex.time_text}
                    </td>
                    <td className="py-2.5 px-3 font-medium">
                      {ex.course}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-600">
                      {ex.room || 'Hall A'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-block w-16 border-b border-slate-400"></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[10px] text-amber-900 mb-6 space-y-1">
          <div className="font-bold uppercase tracking-wider flex items-center gap-1 text-amber-950">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Important Instructions for Candidate:</span>
          </div>
          <p>1. Must bring this printed Admit Card and original Student ID Card to every exam hall.</p>
          <p>2. Electronic devices, smartwatches, and programmable calculators are strictly prohibited.</p>
          <p>3. Gates will close 15 minutes before exam commencement.</p>
        </div>

        {/* Signatures & Seal */}
        <div className="flex items-end justify-between pt-4 border-t-2 border-slate-900 text-xs text-slate-700">
          {/* Candidate Signature */}
          <div className="text-center">
            <div className="w-32 border-b border-slate-500 pb-0.5 mb-1 font-serif italic text-slate-900">
              Nadiya Kaiyum
            </div>
            <p className="text-[10px] font-semibold uppercase text-slate-500">Candidate Signature</p>
          </div>

          {/* Center QR Seal */}
          <div className="flex flex-col items-center">
            <QrCode className="w-12 h-12 text-slate-900" />
            <span className="text-[9px] font-mono text-slate-500 mt-1">VERIFIED-SECURE-2026</span>
          </div>

          {/* Controller of Examinations */}
          <div className="text-center">
            <div className="w-36 border-b border-slate-500 pb-0.5 mb-1 font-serif italic text-emerald-800 text-sm font-bold">
              Prof. Dr. M. Rahman
            </div>
            <p className="text-[10px] font-semibold uppercase text-slate-500">Controller of Examinations</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-lg"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Admit Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};
