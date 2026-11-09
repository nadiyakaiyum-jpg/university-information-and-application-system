import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NoticeCategory } from '../types';
import {
  Bell,
  PlusCircle,
  Trash2,
  Search,
  Filter,
  Calendar,
  UserCheck,
  Printer,
  X,
  AlertTriangle,
  Pin,
  Share2,
} from 'lucide-react';

export const NoticeView: React.FC = () => {
  const { currentUser, notices, addNotice, deleteNotice, language } = useApp();
  const isAdmin = currentUser?.role === 'admin';

  // Form states for Admin
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('Academic');
  const [priority, setPriority] = useState<'Urgent' | 'Important' | 'Normal'>('Normal');
  const [isPinned, setIsPinned] = useState(false);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedNoticeForModal, setSelectedNoticeForModal] = useState<any | null>(null);

  const categories: (string | NoticeCategory)[] = [
    'All',
    'Examination',
    'Academic',
    'Financial',
    'Administrative',
    'Events',
  ];

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    addNotice({
      title: title.trim(),
      body: body.trim(),
      category,
      priority,
      isPinned,
    });

    // Reset form
    setTitle('');
    setBody('');
    setCategory('Academic');
    setPriority('Normal');
    setIsPinned(false);
    setShowPublishForm(false);
  };

  const handleDelete = (id: number, noticeTitle: string) => {
    if (window.confirm(`Are you sure you want to delete this notice?\n"${noticeTitle}"`)) {
      deleteNotice(id);
    }
  };

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-md">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Official University Notices
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Central circulars and bulletins issued by University Administration
              </p>
            </div>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowPublishForm(!showPublishForm)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/40 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showPublishForm ? 'Close Notice Form' : 'Publish New Notice'}</span>
          </button>
        )}
      </div>

      {/* Admin Publish Form (Collapsible / Prominent) */}
      {isAdmin && showPublishForm && (
        <div className="bg-slate-900 border-2 border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-xl animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              Publish New Notice
            </h2>
            <span className="text-xs font-mono text-emerald-400">Admin Mode</span>
          </div>

          <form onSubmit={handlePublish} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Notice Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Schedule for Midterm Examination Spring 2026"
                required
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Academic">Academic</option>
                  <option value="Examination">Examination</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Financial">Financial / Accounts</option>
                  <option value="Events">Events & Co-curricular</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Normal">Normal</option>
                  <option value="Important">Important</option>
                  <option value="Urgent">Urgent / Immediate Action</option>
                </select>
              </div>

              <div className="flex items-center sm:pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-950 border-slate-700"
                  />
                  <span>Pin to Top of Notice Board</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Notice Details <span className="text-rose-400">*</span>
              </label>
              <textarea
                name="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                placeholder="Write the full circular body, instructions, dates, requirements..."
                required
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed font-sans"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPublishForm(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all"
              >
                Publish Notice
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-slate-900 border rounded-2xl p-6 transition-all hover:border-slate-700 shadow-md ${
                notice.isPinned
                  ? 'border-emerald-500/40 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/20'
                  : 'border-slate-800'
              }`}
            >
              {/* Notice Meta Line */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {notice.isPinned && (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <Pin className="w-3 h-3 rotate-45" />
                      Pinned
                    </span>
                  )}

                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-slate-800 uppercase tracking-wider">
                    {notice.category}
                  </span>

                  {notice.priority === 'Urgent' && (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      <AlertTriangle className="w-3 h-3" />
                      Urgent
                    </span>
                  )}
                  {notice.priority === 'Important' && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Important
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Published: {notice.created_at}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-3">
                {language === 'bn' && notice.title_bn ? notice.title_bn : notice.title}
              </h2>

              {/* Body with line breaks (nl2br) */}
              <div className="text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line mb-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
                {language === 'bn' && notice.body_bn ? notice.body_bn : notice.body}
              </div>

              {/* Notice Footer with Issuer & Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
                <div className="text-slate-400 flex items-center gap-1.5">
                  <span className="text-slate-500">Issued By:</span>
                  <span className="font-semibold text-slate-200">{notice.publishedBy}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedNoticeForModal(notice)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Notice</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(notice.id, notice.title)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-800/50 transition-colors font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Notice</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            <Bell className="w-10 h-10 mx-auto text-slate-600 mb-3" />
            <p className="text-base font-semibold text-slate-300">No notices available.</p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search criteria or category filter.
            </p>
          </div>
        )}
      </div>

      {/* Printable Notice Modal */}
      {selectedNoticeForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedNoticeForModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official University Letterhead */}
            <div className="text-center pb-4 border-b-2 border-slate-900 mb-6">
              <h2 className="text-xl font-bold tracking-tight uppercase text-slate-900">
                University Information & Application System
              </h2>
              <p className="text-xs text-slate-600 uppercase font-semibold tracking-wider">
                Office of the Registrar & Controller of Examinations
              </p>
              <div className="mt-2 text-[11px] font-mono text-slate-500">
                Notice Reference: UIAS/NOT/{selectedNoticeForModal.id}/2026 • Date: {selectedNoticeForModal.created_at}
              </div>
            </div>

            {/* Notice Content */}
            <div className="space-y-4">
              <div className="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider">
                Category: {selectedNoticeForModal.category}
              </div>

              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {selectedNoticeForModal.title}
              </h3>

              <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed font-serif pt-2 border-t border-slate-200">
                {selectedNoticeForModal.body}
              </div>

              <div className="pt-8 flex justify-between items-end text-xs text-slate-600 border-t border-slate-200 mt-6">
                <div>
                  <p className="font-semibold text-slate-800">Seal of the Institution</p>
                  <p className="text-[10px] text-slate-500">Verified Electronic Circular</p>
                </div>
                <div className="text-right">
                  <div className="w-32 border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-800">
                    M. Rahman
                  </div>
                  <p className="font-bold text-slate-900">{selectedNoticeForModal.publishedBy}</p>
                  <p className="text-[10px] text-slate-500">Office of Administration</p>
                </div>
              </div>
            </div>

            {/* Print trigger button */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => setSelectedNoticeForModal(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
