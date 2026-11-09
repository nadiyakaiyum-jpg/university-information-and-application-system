import React from 'react';
import { Application } from '../types';
import { X, Printer, GraduationCap, CheckCircle2, Clock, XCircle, ShieldCheck } from 'lucide-react';

interface ApplicationSlipModalProps {
  application: Application;
  onClose: () => void;
}

export const ApplicationSlipModal: React.FC<ApplicationSlipModalProps> = ({ application, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white text-slate-900 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Official Header */}
        <div className="text-center pb-4 border-b-2 border-slate-900 mb-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-950">
              University of Technology & Management
            </h2>
          </div>
          <p className="text-xs uppercase font-bold tracking-widest text-emerald-800">
            Student Application Acknowledgement Slip
          </p>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            System Ref: {application.application_no} • Issued: {application.created_at}
          </p>
        </div>

        {/* Status Banner */}
        <div
          className={`flex items-center justify-between p-3.5 rounded-xl mb-5 text-xs font-bold uppercase tracking-wider ${
            application.status === 'Approved'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
              : application.status === 'Rejected'
              ? 'bg-rose-50 text-rose-900 border border-rose-300'
              : 'bg-amber-50 text-amber-900 border border-amber-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {application.status === 'Approved' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            {application.status === 'Rejected' && <XCircle className="w-4 h-4 text-rose-600" />}
            {application.status === 'Pending' && <Clock className="w-4 h-4 text-amber-600" />}
            <span>Application Status: {application.status}</span>
          </div>
          <span className="font-mono text-[11px] font-normal lowercase">{application.reviewed_at || 'Under processing'}</span>
        </div>

        {/* Student Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5">
          <div>
            <span className="text-slate-500 block">Applicant Name:</span>
            <span className="font-bold text-slate-900 text-sm">{application.student_name}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Student ID:</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{application.student_id}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Department:</span>
            <span className="font-semibold text-slate-800">{application.department}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Semester / Session:</span>
            <span className="font-semibold text-slate-800">{application.semester}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Application Type:</span>
            <span className="font-bold text-emerald-800">{application.app_type}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Contact Phone:</span>
            <span className="font-mono text-slate-800">{application.phone}</span>
          </div>
        </div>

        {/* Application Details */}
        <div className="space-y-3 mb-6">
          {application.subject && (
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject:</span>
              <p className="text-sm font-bold text-slate-900">{application.subject}</p>
            </div>
          )}

          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Application Content:</span>
            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-800 leading-relaxed font-sans border border-slate-200 whitespace-pre-line max-h-36 overflow-y-auto">
              {application.details}
            </div>
          </div>

          {/* Admin Remark if any */}
          {application.admin_remark && (
            <div className="p-3 bg-slate-100 rounded-lg border border-slate-300 text-xs">
              <span className="font-bold text-slate-900 block mb-0.5">Administrative Decision Remark:</span>
              <p className="text-slate-700 italic">{application.admin_remark}</p>
              {application.reviewed_by && (
                <p className="text-[10px] text-slate-500 mt-1">— {application.reviewed_by}</p>
              )}
            </div>
          )}
        </div>

        {/* Footer Seal & Signature */}
        <div className="flex items-end justify-between pt-4 border-t border-slate-200 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="font-bold text-slate-800">Central Academic Registrar</p>
              <p className="text-[10px] text-slate-500">Official Computer-Generated Record</p>
            </div>
          </div>

          <div className="text-right">
            <div className="w-28 border-b border-slate-400 pb-0.5 mb-1 font-serif italic text-slate-700 text-xs">
              Digital Verified
            </div>
            <p className="text-[10px] text-slate-500">Authorized Signature</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Official Slip
          </button>
        </div>
      </div>
    </div>
  );
};
