import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RoutineType } from '../types';
import {
  CalendarDays,
  FileCheck2,
  PlusCircle,
  Trash2,
  Search,
  Filter,
  Clock,
  MapPin,
  User,
  Printer,
  ChevronDown,
  BookOpen,
  LayoutGrid,
  List,
  Sparkles,
} from 'lucide-react';

interface RoutineViewProps {
  type: RoutineType; // 'Class' or 'Exam'
}

export const RoutineView: React.FC<RoutineViewProps> = ({ type }) => {
  const { currentUser, routines, addRoutine, deleteRoutine, setAdmitCardModalOpen, language } = useApp();
  const isAdmin = currentUser?.role === 'admin';

  // Admin form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [dayDate, setDayDate] = useState('');
  const [timeText, setTimeText] = useState('');
  const [course, setCourse] = useState('');
  const [room, setRoom] = useState('');
  const [instructor, setInstructor] = useState('');

  // Filters & Layout mode
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [dayFilter, setDayFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter routines by type ('Class' or 'Exam')
  const typeRoutines = routines.filter((r) => r.type === type);

  // Extract unique departments, semesters & days
  const availableDepts = ['All', ...Array.from(new Set(typeRoutines.map((r) => r.department)))];
  const availableSemesters = ['All', ...Array.from(new Set(typeRoutines.map((r) => r.semester)))];
  const daysList = ['All', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  const handleAddRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!department.trim() || !semester.trim() || !dayDate.trim() || !timeText.trim() || !course.trim()) {
      return;
    }

    addRoutine({
      type,
      department: department.trim(),
      semester: semester.trim(),
      day_date: dayDate.trim(),
      time_text: timeText.trim(),
      course: course.trim(),
      room: room.trim() || (type === 'Exam' ? 'Exam Hall Central' : 'Academic Bldg Room 301'),
      instructor: instructor.trim() || (type === 'Exam' ? 'Invigilation Committee' : 'Faculty Member'),
    });

    // Reset form
    setDepartment('');
    setSemester('');
    setDayDate('');
    setTimeText('');
    setCourse('');
    setRoom('');
    setInstructor('');
    setShowAddForm(false);
  };

  const handleDelete = (id: number, courseName: string) => {
    if (window.confirm(`Delete this routine?\n"${courseName}"`)) {
      deleteRoutine(id);
    }
  };

  // Filtered routines
  const filteredRows = typeRoutines.filter((r) => {
    const matchesDept = departmentFilter === 'All' || r.department === departmentFilter;
    const matchesSem = semesterFilter === 'All' || r.semester === semesterFilter;
    const matchesDay = dayFilter === 'All' || r.day_date.toLowerCase().includes(dayFilter.toLowerCase());
    const matchesSearch =
      r.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.day_date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.room && r.room.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesSem && matchesDay && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-md">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              type === 'Exam'
                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
            }`}
          >
            {type === 'Exam' ? <FileCheck2 className="w-6 h-6" /> : <CalendarDays className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {type} Routine
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {type === 'Exam'
                ? 'Semester examination dates, morning & afternoon shifts, and room assignments'
                : 'Weekly departmental course schedule, class hours, and lecture rooms'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* If Exam Routine, offer 1-click Admit Card generation */}
          {type === 'Exam' && (
            <button
              onClick={() => setAdmitCardModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg transition-all"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Official Admit Card</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print {type} Routine</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{showAddForm ? 'Close Form' : `Add New ${type} Routine`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Add Routine Form */}
      {isAdmin && showAddForm && (
        <div className="bg-slate-900 border-2 border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-xl animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              Add New {type} Routine
            </h2>
            <span className="text-xs font-mono text-emerald-400">Admin Action</span>
          </div>

          <form onSubmit={handleAddRoutine} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Department <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Semester <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="e.g. 6th Semester or Fall 2026"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Day / Date <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="day_date"
                  value={dayDate}
                  onChange={(e) => setDayDate(e.target.value)}
                  placeholder={type === 'Exam' ? 'e.g. 2026-11-20 (Thursday)' : 'e.g. Sunday or Monday'}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Time <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="time_text"
                  value={timeText}
                  onChange={(e) => setTimeText(e.target.value)}
                  placeholder="e.g. 10:00 AM - 01:00 PM"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Course Name & Code <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. Database Management Systems (CSE-311)"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Room / Exam Hall (Optional)
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder={type === 'Exam' ? 'Exam Hall A / Room 402' : 'Lab 3 / Room 402'}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Instructor / Invigilator (Optional)
                </label>
                <input
                  type="text"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  placeholder="e.g. Dr. K. Alam"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                name="add_routine"
                className="px-6 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg"
              >
                Add Routine
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Routine Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {availableDepts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Semester:</span>
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {availableSemesters.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Day Filter (for class routine) */}
          {type === 'Class' && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Day:</span>
              <select
                value={dayFilter}
                onChange={(e) => setDayFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {daysList.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* View mode toggle & Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {type === 'Class' && (
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1 rounded ${
                  viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Table view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${
                  viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Visual Card view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${type} routine...`}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Routine Content: Table or Visual Card Grid */}
      {viewMode === 'grid' && type === 'Class' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRows.length > 0 ? (
            filteredRows.map((r) => (
              <div
                key={r.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/40 transition-all shadow-md relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {r.day_date}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{r.semester}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2 leading-snug">{r.course}</h3>

                  <div className="space-y-1.5 text-xs text-slate-300 pt-1 border-t border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-mono text-cyan-200">{r.time_text}</span>
                    </div>
                    {r.room && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{r.room}</span>
                      </div>
                    )}
                    {r.instructor && (
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>{r.instructor}</span>
                      </div>
                    )}
                  </div>
                </div>

                {isAdmin && (
                  <div className="pt-3 mt-3 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => handleDelete(r.id, r.course)}
                      className="text-xs text-rose-400 hover:text-rose-200"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-500 text-sm">
              No routine available.
            </div>
          )}
        </div>
      ) : (
        /* Routine List Table - matching PHP table layout precisely */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Routine List ({filteredRows.length})</span>
            </h2>
            <span className="text-xs text-slate-400">
              {type} Schedule for Academic Year 2026
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Semester</th>
                  <th className="py-3.5 px-4">Day / Date</th>
                  <th className="py-3.5 px-4">Time</th>
                  <th className="py-3.5 px-4">Course</th>
                  {isAdmin && <th className="py-3.5 px-4 text-center">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredRows.length > 0 ? (
                  filteredRows.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-white">{r.department}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-xs font-mono">
                          {r.semester}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-emerald-300">
                        {r.day_date}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-300 font-mono flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{r.time_text}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-100">{r.course}</div>
                        {(r.room || r.instructor) && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            {r.room && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-500" />
                                {r.room}
                              </span>
                            )}
                            {r.instructor && (
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3 text-slate-500" />
                                {r.instructor}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      {isAdmin && (
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(r.id, r.course)}
                            className="px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-xs font-medium transition-all"
                            title="Delete routine"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={isAdmin ? 6 : 5}
                      className="py-12 text-center text-slate-500 text-sm font-medium"
                    >
                      No routine available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
