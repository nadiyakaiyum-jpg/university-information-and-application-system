import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ApplicationStatus, Application, User } from '../types';
import { ApplicationSlipModal } from './ApplicationSlipModal';
import { INITIAL_USERS } from '../mockData';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  User as UserIcon,
  Printer,
  FileText,
  Bell,
  CalendarDays,
  FileCheck2,
  ChevronDown,
  Sparkles,
  Download,
  Users,
  CheckSquare,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { currentUser, applications, updateApplicationStatus, setPage, notices, routines, language } = useApp();

  // Tab switch within Admin View
  const [activeAdminTab, setActiveAdminTab] = useState<'applications' | 'students'>('applications');

  // Selected status for each application being modified
  const [selectedStatusMap, setSelectedStatusMap] = useState<Record<number, ApplicationStatus>>({});
  const [remarksMap, setRemarksMap] = useState<Record<number, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [selectedAppForSlip, setSelectedAppForSlip] = useState<Application | null>(null);

  if (currentUser?.role !== 'admin') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          You must be logged in with an Administrator account (admin / admin123) to access the administrative dashboard.
        </p>
      </div>
    );
  }

  // Summary counts
  const totalApps = applications.length;
  const pendingApps = applications.filter((a) => a.status === 'Pending').length;
  const approvedApps = applications.filter((a) => a.status === 'Approved').length;
  const rejectedApps = applications.filter((a) => a.status === 'Rejected').length;

  const handleStatusChange = (appId: number, status: ApplicationStatus) => {
    setSelectedStatusMap((prev) => ({ ...prev, [appId]: status }));
  };

  const handleRemarkChange = (appId: number, remark: string) => {
    setRemarksMap((prev) => ({ ...prev, [appId]: remark }));
  };

  const handleUpdate = (app: Application) => {
    const targetStatus = selectedStatusMap[app.id] || (app.status === 'Pending' ? 'Approved' : app.status);
    const remark = remarksMap[app.id] !== undefined ? remarksMap[app.id] : app.admin_remark || '';
    updateApplicationStatus(app.id, targetStatus, remark);
  };

  const handleQuickDecision = (appId: number, status: ApplicationStatus) => {
    const defaultRemark =
      status === 'Approved'
        ? 'Application verified and approved by Office of the Registrar.'
        : 'Request declined after administrative review. Contact academic advisor for details.';
    updateApplicationStatus(appId, status, defaultRemark);
  };

  // Export applications to CSV
  const exportToCSV = () => {
    const headers = ['Ref No', 'Student ID', 'Student Name', 'Department', 'Type', 'Status', 'Date', 'Admin Remark'];
    const rows = applications.map((a) => [
      a.application_no,
      a.student_id,
      `"${a.student_name}"`,
      `"${a.department}"`,
      `"${a.app_type}"`,
      a.status,
      `"${a.created_at}"`,
      `"${a.admin_remark || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `University_Applications_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Batch approve all pending
  const handleBatchApprovePending = () => {
    if (pendingApps === 0) return;
    if (window.confirm(`Approve all ${pendingApps} pending applications simultaneously?`)) {
      applications
        .filter((a) => a.status === 'Pending')
        .forEach((a) => {
          updateApplicationStatus(a.id, 'Approved', 'Bulk approved during Administrative Session');
        });
    }
  };

  // Filter applications
  const filteredApps = applications.filter((app) => {
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesSearch =
      app.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.app_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.application_no.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const studentsList = INITIAL_USERS.filter((u) => u.role === 'student');

  return (
    <div className="space-y-8 pb-12">
      {/* Admin Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Admin Dashboard
                </h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Authorized Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Central command for managing student applications, notices, and routine schedules
              </p>
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 text-xs font-semibold border border-slate-700 transition-all"
              title="Download CSV export"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setPage('notice')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
            >
              <Bell className="w-3.5 h-3.5 text-emerald-400" />
              <span>Notices ({notices.length})</span>
            </button>
            <button
              onClick={() => setPage('class')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
            >
              <CalendarDays className="w-3.5 h-3.5 text-cyan-400" />
              <span>Routines ({routines.length})</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div
            onClick={() => {
              setActiveAdminTab('applications');
              setStatusFilter('All');
            }}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              statusFilter === 'All' && activeAdminTab === 'applications'
                ? 'bg-slate-800 border-emerald-500/50'
                : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/40'
            }`}
          >
            <div className="text-slate-400 font-medium">Total Applications</div>
            <div className="text-xl sm:text-2xl font-bold text-white mt-1">{totalApps}</div>
          </div>

          <div
            onClick={() => {
              setActiveAdminTab('applications');
              setStatusFilter('Pending');
            }}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              statusFilter === 'Pending' && activeAdminTab === 'applications'
                ? 'bg-amber-950/40 border-amber-500/60'
                : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/40'
            }`}
          >
            <div className="text-amber-300 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Pending Review
            </div>
            <div className="text-xl sm:text-2xl font-bold text-amber-400 mt-1">{pendingApps}</div>
          </div>

          <div
            onClick={() => {
              setActiveAdminTab('applications');
              setStatusFilter('Approved');
            }}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              statusFilter === 'Approved' && activeAdminTab === 'applications'
                ? 'bg-emerald-950/40 border-emerald-500/60'
                : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/40'
            }`}
          >
            <div className="text-emerald-300 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Approved
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">{approvedApps}</div>
          </div>

          <div
            onClick={() => {
              setActiveAdminTab('applications');
              setStatusFilter('Rejected');
            }}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              statusFilter === 'Rejected' && activeAdminTab === 'applications'
                ? 'bg-rose-950/40 border-rose-500/60'
                : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/40'
            }`}
          >
            <div className="text-rose-300 font-medium flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              Rejected
            </div>
            <div className="text-xl sm:text-2xl font-bold text-rose-400 mt-1">{rejectedApps}</div>
          </div>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveAdminTab('applications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeAdminTab === 'applications'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Student Applications</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('students')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeAdminTab === 'students'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Directory & Cards</span>
        </button>
      </div>

      {activeAdminTab === 'students' ? (
        /* Student Registry Section */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>Enrolled Student Directory</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Profiles, degree progress, and issued credentials
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentsList.map((std) => (
              <div
                key={std.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-sm flex items-start gap-4"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 ring-2 ring-emerald-500/40 shrink-0">
                  <img src={std.avatar} alt={std.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-white truncate">{std.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                      ID: {std.student_id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{std.department}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {std.semester} • {std.batch}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-emerald-400 mt-2">
                    <span>CGPA: {std.cgpa || 3.88}</span>
                    <span>•</span>
                    <span>Blood: {std.bloodGroup || 'A+'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Main Section: All Student Applications - Matching PHP explicitly */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>All Student Applications ({filteredApps.length})</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Review submission details, make decisions, and issue institutional remarks
              </p>
            </div>

            <div className="flex items-center gap-3">
              {pendingApps > 0 && (
                <button
                  onClick={handleBatchApprovePending}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-all"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Approve All Pending ({pendingApps})</span>
                </button>
              )}

              {/* Search bar */}
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student or ID..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Applications List */}
          {filteredApps.length > 0 ? (
            <div className="space-y-6">
              {filteredApps.map((app) => {
                const currentSelectValue = selectedStatusMap[app.id] || (app.status === 'Pending' ? 'Approved' : app.status);
                const currentRemarkValue =
                  remarksMap[app.id] !== undefined ? remarksMap[app.id] : app.admin_remark || '';

                return (
                  <div
                    key={app.id}
                    className={`bg-slate-950 border rounded-2xl p-6 transition-all shadow-md ${
                      app.status === 'Pending'
                        ? 'border-amber-500/40 ring-1 ring-amber-500/20'
                        : 'border-slate-800'
                    }`}
                  >
                    {/* Top Bar of Card */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white">{app.app_type}</span>
                        <span className="text-xs font-mono text-slate-400">Ref: {app.application_no}</span>
                      </div>

                      <div className="flex items-center gap-2">
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

                        <button
                          onClick={() => setSelectedAppForSlip(app)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="Print official slip"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Student Info - exactly matching PHP parameters */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-slate-400">Student: </span>
                        <b className="text-slate-100">{app.student_name}</b>
                      </div>
                      <div>
                        <span className="text-slate-400">Student ID: </span>
                        <b className="text-emerald-400 font-mono">{app.student_id}</b>
                      </div>
                      <div>
                        <span className="text-slate-400">Department: </span>
                        <span className="text-slate-300">{app.department}</span>
                      </div>
                      {app.phone && (
                        <div>
                          <span className="text-slate-400">Phone: </span>
                          <span className="text-slate-300 font-mono">{app.phone}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-slate-400">Submitted: </span>
                        <span className="text-slate-400 font-mono">{app.created_at}</span>
                      </div>
                    </div>

                    {app.subject && (
                      <div className="text-xs font-semibold text-slate-200 mb-2">
                        Subject: {app.subject}
                      </div>
                    )}

                    {/* Application Details (with nl2br) */}
                    <div className="text-xs text-slate-300 bg-slate-900 p-4 rounded-xl border border-slate-800 whitespace-pre-line leading-relaxed mb-4">
                      <span className="text-slate-400 font-bold block mb-1">Details:</span>
                      {app.details}
                    </div>

                    {/* Existing Review Remark if any */}
                    {app.admin_remark && (
                      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs mb-4">
                        <span className="text-slate-400 font-bold block mb-0.5">Current Admin Remark:</span>
                        <p className="text-slate-200 italic">{app.admin_remark}</p>
                        {app.reviewed_by && (
                          <p className="text-[10px] text-slate-500 mt-1">
                            Updated by {app.reviewed_by} on {app.reviewed_at}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Review Form - strictly matching PHP */}
                    <div className="pt-3 border-t border-slate-800/80 bg-slate-900/40 p-4 rounded-xl">
                      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider whitespace-nowrap">
                              Decision:
                            </label>
                            <select
                              name="status"
                              value={currentSelectValue}
                              onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                              required
                              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                            >
                              <option value="Approved">Approve</option>
                              <option value="Rejected">Reject</option>
                              <option value="Pending">Keep Pending</option>
                            </select>
                          </div>

                          <div className="flex-1">
                            <input
                              type="text"
                              value={currentRemarkValue}
                              onChange={(e) => handleRemarkChange(app.id, e.target.value)}
                              placeholder="Add administrative remark (e.g. Approved. Collect ID from Room 204)..."
                              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            name="review"
                            onClick={() => handleUpdate(app)}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow"
                          >
                            Update Status
                          </button>

                          {app.status === 'Pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleQuickDecision(app.id, 'Approved')}
                                className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white border border-emerald-500/40 transition-all"
                              >
                                Quick Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickDecision(app.id, 'Rejected')}
                                className="px-3 py-2 rounded-xl text-xs font-semibold bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/40 transition-all"
                              >
                                Quick Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              <FileText className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No applications submitted yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Any application submitted by students will appear here for review.
              </p>
            </div>
          )}
        </div>
      )}

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
