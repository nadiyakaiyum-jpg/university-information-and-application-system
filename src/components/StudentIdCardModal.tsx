import React, { useState } from 'react';
import { User, Language } from '../types';
import { X, Printer, RotateCw, GraduationCap, ShieldCheck, Sparkles, QrCode } from 'lucide-react';
import { getTranslation } from '../utils/i18n';

interface StudentIdCardModalProps {
  user: User;
  language: Language;
  onClose: () => void;
}

export const StudentIdCardModal: React.FC<StudentIdCardModalProps> = ({ user, language, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Smart Card • NFC & Barcode Enabled</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {language === 'bn' ? 'ডিজিটাল স্মার্ট স্টুডেন্ট কার্ড' : 'Official Student Smart Identity Card'}
          </h2>
          <p className="text-xs text-slate-400">
            {language === 'bn'
              ? 'বিশ্ববিদ্যালয় ক্যাম্পাস প্রবেশ, লাইব্রেরি ও পরীক্ষার হল ভেরিফিকেশনে গ্রহণযোগ্য'
              : 'Valid for campus access, laboratory entry, library, and examination clearance'}
          </p>
        </div>

        {/* Interactive 3D Card Container */}
        <div className="perspective-1000 flex justify-center my-4">
          <div
            className={`w-[360px] sm:w-[400px] h-[230px] sm:h-[250px] rounded-2xl relative cursor-pointer select-none transition-transform duration-700 preserve-3d shadow-2xl`}
            onClick={() => setIsFlipped(!isFlipped)}
            title="Click to flip card"
          >
            {/* FRONT OF THE CARD */}
            <div
              className={`absolute inset-0 rounded-2xl p-5 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-900 border-2 border-emerald-500/50 shadow-emerald-950/50 backface-hidden ${
                isFlipped ? 'rotate-y-180 hidden' : ''
              }`}
            >
              {/* Background watermark hologram pattern */}
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/30">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-emerald-200">
                      University of Technology
                    </h3>
                    <p className="text-[9px] font-mono tracking-widest text-emerald-400/80 uppercase">
                      Student Identity Card
                    </p>
                  </div>
                </div>

                {/* RFID Smart Chip Simulation */}
                <div className="w-9 h-7 rounded bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-600 border border-amber-200/60 shadow-inner flex items-center justify-center">
                  <div className="w-6 h-4 border border-amber-700/40 rounded-sm grid grid-cols-2 gap-0.5">
                    <span className="border-r border-amber-700/40"></span>
                    <span></span>
                  </div>
                </div>
              </div>

              {/* Card Body: Photo & Student Bio */}
              <div className="flex items-center gap-4 py-1">
                {/* Photo with shiny border */}
                <div className="w-20 h-24 sm:w-22 sm:h-26 rounded-xl overflow-hidden bg-slate-800 ring-2 ring-emerald-400 shadow-md shrink-0">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Student Details */}
                <div className="flex-1 space-y-1 text-left min-w-0">
                  <h4 className="text-base sm:text-lg font-extrabold text-white tracking-tight truncate">
                    {user.name}
                  </h4>
                  <div className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[11px] font-bold">
                    ID: {user.student_id}
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium truncate">
                    {user.department || 'Computer Science & Engineering'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {user.semester} • {user.batch || 'Batch 58'}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 pt-0.5">
                    <span>Blood: <b className="text-white">{user.bloodGroup || 'A+'}</b></span>
                    <span>•</span>
                    <span>Reg: {user.registrationNo || 'REG-2023-0421'}</span>
                  </div>
                </div>
              </div>

              {/* Card Bottom Bar */}
              <div className="flex items-center justify-between pt-1 border-t border-emerald-500/30 text-[9px] font-mono text-slate-400">
                <span className="flex items-center gap-1 text-emerald-300">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Valid: {user.validUntil || 'Dec 2027'}</span>
                </span>
                <span className="text-slate-400 italic">Click to view back side ↻</span>
              </div>
            </div>

            {/* BACK OF THE CARD */}
            <div
              className={`absolute inset-0 rounded-2xl p-5 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border-2 border-slate-700 shadow-xl backface-hidden ${
                !isFlipped ? 'hidden' : ''
              }`}
            >
              {/* Back Header */}
              <div className="space-y-1 text-left border-b border-slate-800 pb-2">
                <p className="text-[10px] text-slate-300 font-semibold">
                  This card is property of the University. If found, please return to:
                </p>
                <p className="text-[9px] text-slate-400 leading-tight">
                  Office of Student Affairs & Registrar, Main Academic Campus.
                </p>
                <p className="text-[9px] text-emerald-400 font-mono">
                  Emergency: {user.emergencyContact || '+880 1711-987654'} | Helpdesk: ext. 201
                </p>
              </div>

              {/* Simulated QR Code & Barcode */}
              <div className="flex items-center justify-between gap-4 py-2">
                {/* QR Box */}
                <div className="p-2 bg-white rounded-lg shrink-0 shadow">
                  <QrCode className="w-14 h-14 text-slate-900" />
                </div>

                {/* Simulated Barcode */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="h-10 w-full bg-slate-950 p-1 rounded flex items-center justify-center gap-0.5 overflow-hidden">
                    {[
                      3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6, 2, 6, 4, 3, 3, 8,
                      3, 2, 7, 9, 5, 0, 2, 8, 8,
                    ].map((w, idx) => (
                      <span
                        key={idx}
                        className="bg-white h-full"
                        style={{ width: `${(w % 3) + 1}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 tracking-widest mt-1">
                    *STD-{user.student_id}-SECURE*
                  </span>
                </div>
              </div>

              {/* Authorized Registrar Signature */}
              <div className="flex items-end justify-between pt-2 border-t border-slate-800 text-left">
                <div className="text-[9px] text-slate-500 font-mono">
                  Card Ref: UID-{user.student_id}-2026
                </div>
                <div className="text-right">
                  <div className="w-24 border-b border-slate-600 pb-0.5 font-serif italic text-emerald-400 text-[11px]">
                    Prof. M. Rahman
                  </div>
                  <p className="text-[8px] text-slate-400 font-semibold uppercase">Registrar Signature</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800 text-xs">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium"
          >
            <RotateCw className="w-4 h-4 text-emerald-400" />
            <span>{isFlipped ? 'View Front Side' : 'Flip to Back Side'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-950/40 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Smart Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
