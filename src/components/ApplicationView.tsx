import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ApplicationType, Application } from '../types';
import { ApplicationSlipModal } from './ApplicationSlipModal';
import {
  FileText,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  Printer,
  Sparkles,
  Info,
  ShieldAlert,
  ArrowRight,
  Filter,
  Paperclip,
  Wand2,
  User,
  Building,
} from 'lucide-react';

export const ApplicationView: React.FC = () => {
  const { currentUser, applications, submitApplication, setPage, language } = useApp();
  const isAdmin = currentUser?.role === 'admin';

  // Form states
  const [appType, setAppType] = useState<ApplicationType>('Exam Permission');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // Modal slip state
  const [selectedAppForSlip, setSelectedAppForSlip] = useState<Application | null>(null);

  // Filter for my applications
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  // Filter applications for current student
  const myApplications = applications.filter((app) => app.user_id === currentUser?.id);

  const filteredMyApps = myApplications.filter((app) => {
    if (statusFilter === 'All') return true;
    return app.status === statusFilter;
  });

  // Letter Auto-Drafting templates
  const applyTemplate = (type: ApplicationType) => {
    setAppType(type);
    if (type === 'Exam Permission') {
      setSubject('Request for permission to sit in Final Term Examination with tuition fee installment');
      setDetails(
        `To: The Controller of Examinations & Registrar
Subject: Application for permission to appear in Spring 2026 Semester Final Examination.

Respected Sir,
With due respect, I am ${currentUser?.name || 'Nadiya Kaiyum'}, a regular student of the Department of ${currentUser?.department || 'Computer Science & Engineering'} (ID: ${currentUser?.student_id || '2026001'}, ${currentUser?.semester || '6th Semester'}).

Due to unforeseen family financial circumstances, I have managed to pay 60% of the current semester tuition fees. I earnestly request you to grant me permission to sit for the upcoming final term examinations. I assure the administration that the remaining dues will be cleared before the publication of final grade sheets.

I pray and hope that you will kindly consider my application sympathetically.

Yours obediently,
${currentUser?.name || 'Nadiya Kaiyum'}
ID: ${currentUser?.student_id || '2026001'}`
      );
      setAttachmentName('Tuition_Fee_Deposit_Slip_60_percent.pdf');
    } else if (type === 'Lost ID Card') {
      setSubject('Application for issuance of duplicate student smart card');
      setDetails(
        `To: The Office of the Registrar
Subject: Request for re-issuing duplicate Student Identity Card.

Respected Sir,
I beg to inform you that I have unfortunately misplaced my university student ID card while commuting on campus transit last Monday. I have lodged a General Diary (GD) with the local police station (GD Reference No: 418/2026).

I have enclosed the police GD acknowledgment copy and paid the requisite duplicate card fee. Kindly approve the issuance of a replacement smart identity card at your earliest convenience.

Sincerely,
${currentUser?.name || 'Nadiya Kaiyum'}
ID: ${currentUser?.student_id || '2026001'}`
      );
      setAttachmentName('Police_GD_Copy_Lost_ID.pdf');
    } else if (type === 'Transport Fee Off') {
      setSubject('Application for exemption of university transport bus fee');
      setDetails(
        `To: The Transport Manager & Accounts Division
Subject: Exemption of transport charges for Spring 2026.

Respected Sir,
I am ${currentUser?.name || 'Nadiya Kaiyum'}, ID: ${currentUser?.student_id || '2026001'}. I have recently relocated to an apartment adjacent to the main campus and will no longer be utilizing the university shuttle service.

Therefore, I kindly request you to waive the transport fee from my current semester billing invoice.

Respectfully,
${currentUser?.name || 'Nadiya Kaiyum'}`
      );
      setAttachmentName('Utility_Bill_New_Address_Proof.pdf');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim() || !appType) return;

    setSubmitting(true);
    const finalSubject = subject.trim() || `Application for ${appType}`;

    const created = submitApplication({
      app_type: appType,
      subject: finalSubject,
      details: details.trim(),
      phone: phone.trim(),
      attachmentName: attachmentName || undefined,
    });

    setSubmitting(false);
    if (created) {
      setDetails('');
      setSubject('');
      setAttachmentName('');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {language === 'bn' ? 'অনলাইন আবেদন পোর্টাল' : 'Online Application System'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit formal institutional requests directly to the Registrar & Exam Committee
            </p>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => setPage('admin')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Go to Admin Review Station</span>
          </button>
        )}
      </div>

      {/* Main submission form for students (matches PHP: if (!isAdmin()): ) */}
      {!isAdmin ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <span>Submit New Application</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Applicant: <b className="text-slate-200">{currentUser?.name}</b> (ID: {currentUser?.student_id}) • {currentUser?.department}
              </p>
            </div>

            {/* Smart Auto-Drafting templates */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                Auto-Draft:
              </span>
              <button
                type="button"
                onClick={() => applyTemplate('Exam Permission')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px]"
              >
                Exam Permission
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('Lost ID Card')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px]"
              >
                Lost ID Card
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('Transport Fee Off')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] hidden md:inline"
              >
                Transport Fee
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Application Type - exactly matching PHP options */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Application Type <span className="text-rose-400">*</span>
                </label>
                <select
                  name="app_type"
                  value={appType}
                  onChange={(e) => setAppType(e.target.value as ApplicationType)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select Application</option>
                  <option value="Exam Permission">Exam Permission</option>
                  <option value="Lost ID Card">Lost ID Card</option>
                  <option value="Transport Fee Off">Transport Fee Off</option>
                  <option value="Semester Drop">Semester Drop / Leave of Absence</option>
                  <option value="Scholarship / Financial Aid">Scholarship / Financial Aid</option>
                  <option value="Transcript / Certificate">Transcript / Certificate Request</option>
                  <option value="Other Application">Other Application</option>
                </select>
              </div>

              {/* Phone number */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Contact Mobile Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1XXXXXXXXX"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Subject */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Subject / Short Title
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Request for Exam Permission with 2nd installment commitment"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Details - exactly matching PHP */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Application Details <span className="text-rose-400">*</span>
                </label>
                <textarea
                  name="details"
                  rows={6}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Write your application details, reasons, and any reference information..."
                  required
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed font-sans"
                />
              </div>

              {/* Attachment field */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Supporting Document / Attachment Name (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Paperclip className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={attachmentName}
                    onChange={(e) => setAttachmentName(e.target.value)}
                    placeholder="e.g. Medical_Certificate.pdf or Police_GD_slip.jpg"
                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-400" />
                <span>Applications are forwarded immediately to Department Heads & Registrar.</span>
              </div>

              <button
                type="submit"
                name="submit_application"
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-amber-950/20 border border-amber-500/30 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-amber-200">You are logged in as Administrator</h3>
            <p className="text-xs text-slate-300 mt-1">
              Administrators review and take decisions on student applications in the Admin Dashboard.
            </p>
          </div>
          <button
            onClick={() => setPage('admin')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all"
          >
            Open Admin Dashboard
          </button>
        </div>
      )}

      {/* "My Applications" Section - Matching PHP */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span>My Applications ({filteredMyApps.length})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review submission status, multi-stage approval tracker, and printable slips
            </p>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* List of Applications */}
        {filteredMyApps.length > 0 ? (
          <div className="space-y-6">
            {filteredMyApps.map((app) => (
              <div
                key={app.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{app.app_type}</span>
                    <span className="text-[11px] font-mono text-slate-400">Ref: {app.application_no}</span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                      app.status === 'Approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : app.status === 'Rejected'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {app.status === 'Approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {app.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" />}
                    {app.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                    <b>Status:</b> {app.status}
                  </span>
                </div>

                {app.subject && (
                  <p className="text-xs font-semibold text-slate-300 mb-2">
                    Subject: {app.subject}
                  </p>
                )}

                {/* Details formatted with nl2br */}
                <div className="text-xs text-slate-300 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80 whitespace-pre-line leading-relaxed mb-3">
                  {app.details}
                </div>

                {/* Attachment tag if present */}
                {app.attachmentName && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-400 mb-3 font-mono">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Attached Document: {app.attachmentName}</span>
                  </div>
                )}

                {/* Multi-step progress tracker timeline */}
                {app.timeline && app.timeline.length > 0 && (
                  <div className="my-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                      Application Review Progress:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      {app.timeline.map((step, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-lg border text-xs ${
                            step.status === 'completed'
                              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                              : step.status === 'current'
                              ? 'bg-amber-950/30 border-amber-500/40 text-amber-200 animate-pulse'
                              : 'bg-slate-950 border-slate-800 text-slate-500'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                            {step.status === 'completed' ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Clock className="w-3 h-3 text-amber-400" />
                            )}
                            <span className="truncate">{language === 'bn' ? step.title_bn : step.title}</span>
                          </div>
                          {step.actor && (
                            <p className="text-[10px] text-slate-400 mt-1 truncate">{step.actor}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin remark if present */}
                {app.admin_remark && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs mb-3">
                    <span className="text-emerald-400 font-bold block mb-0.5">Admin Remark / Decision:</span>
                    <p className="text-slate-300 italic">{app.admin_remark}</p>
                    {app.reviewed_by && (
                      <p className="text-[10px] text-slate-500 mt-1">
                        Reviewed by {app.reviewed_by} on {app.reviewed_at}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <span>
                    <b>Submitted:</b> {app.created_at}
                  </span>

                  <button
                    onClick={() => setSelectedAppForSlip(app)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all font-medium"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View / Print Official Slip</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 bg-slate-950/50 rounded-2xl border border-slate-800/60">
            <FileText className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-slate-300">You have not submitted any application yet.</p>
            <p className="text-xs text-slate-500 mt-1">
              Select an application type above or use an auto-draft template.
            </p>
          </div>
        )}
      </div>

      {/* Slip Modal */}
      {selectedAppForSlip && (
        <ApplicationSlipModal
          application={selectedAppForSlip}
          onClose={() => setSelectedAppForSlip(null)}
        />
      )}
    </div>
  );
};
