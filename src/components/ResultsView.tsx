import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NADIYA_ACADEMIC_RESULTS } from '../mockData';
import {
  Award,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  GraduationCap,
  Printer,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const ResultsView: React.FC = () => {
  const { currentUser, language } = useApp();
  const [expandedSemester, setExpandedSemester] = useState<number | null>(0);

  // Target CGPA calculator state
  const [targetCreditHours, setTargetCreditHours] = useState(16);
  const [projectedGpa, setProjectedGpa] = useState(3.9);

  const currentCgpa = currentUser?.cgpa || 3.88;
  const currentCredits = currentUser?.creditsCompleted || 96;
  const totalRequired = currentUser?.totalCredits || 144;

  // Calculate simulated overall CGPA
  const simulatedTotalCredits = currentCredits + targetCreditHours;
  const simulatedCgpa = (
    (currentCgpa * currentCredits + projectedGpa * targetCreditHours) /
    simulatedTotalCredits
  ).toFixed(2);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {language === 'bn' ? 'একাডেমিক ফলাফল ও সিজিপিএ রিপোর্ট' : 'Academic Results & CGPA Transcript'}
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Dean's List
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Official grade history, credit completion, and projected performance calculator
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>Print Transcript</span>
        </button>
      </div>

      {/* Top Academic Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Cumulative GPA Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Cumulative CGPA
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white">{currentCgpa}</span>
            <span className="text-xs font-mono text-slate-400">/ 4.00</span>
          </div>
          <p className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>First Class Honors Standing</span>
          </p>
        </div>

        {/* Credits Completed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Degree Progress
            </span>
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white">{currentCredits}</span>
            <span className="text-xs font-mono text-slate-400">/ {totalRequired} Credits</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-950 h-2 rounded-full mt-3 overflow-hidden border border-slate-800">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${(currentCredits / totalRequired) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 text-right font-mono">
            {((currentCredits / totalRequired) * 100).toFixed(0)}% Completed
          </p>
        </div>

        {/* Current Standing */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Academic Standing
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-1">Excellent</div>
          <p className="text-xs text-slate-400 mt-2">
            Student: <b className="text-slate-200">{currentUser?.name}</b> • ID: <b className="text-emerald-400 font-mono">{currentUser?.student_id}</b>
          </p>
        </div>
      </div>

      {/* Semester Wise Transcript History */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-emerald-400" />
          <span>Semester-wise Grade Sheets</span>
        </h2>

        <div className="space-y-4">
          {NADIYA_ACADEMIC_RESULTS.map((sem, idx) => {
            const isExpanded = expandedSemester === idx;
            return (
              <div
                key={sem.semesterName}
                className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedSemester(isExpanded ? null : idx)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-900/60 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base">
                        {sem.semesterName}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Credits: {sem.credits} • SGPA: <b className="text-emerald-300 font-mono">{sem.gpa}</b>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                      GPA: {sem.gpa}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-slate-800/80">
                    <div className="overflow-x-auto mt-3">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-900 text-slate-300 uppercase text-[10px] font-bold border-b border-slate-800">
                            <th className="py-2.5 px-3">Course Code</th>
                            <th className="py-2.5 px-3">Course Title</th>
                            <th className="py-2.5 px-3 text-center">Credit Hours</th>
                            <th className="py-2.5 px-3 text-center">Letter Grade</th>
                            <th className="py-2.5 px-3 text-right">Grade Point</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-200 font-sans">
                          {sem.courses.map((c) => (
                            <tr key={c.code} className="hover:bg-slate-900/40">
                              <td className="py-2.5 px-3 font-mono font-semibold text-emerald-400">
                                {c.code}
                              </td>
                              <td className="py-2.5 px-3">{c.title}</td>
                              <td className="py-2.5 px-3 text-center font-mono">{c.credits}</td>
                              <td className="py-2.5 px-3 text-center">
                                <span className="font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                                  {c.grade}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold">
                                {c.gradePoint.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Target CGPA Simulator Tool */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Target CGPA Simulator</h2>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Predict your graduation CGPA based on expected future semester performance
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Upcoming Credits ({targetCreditHours} Hours)
            </label>
            <input
              type="range"
              min={3}
              max={48}
              value={targetCreditHours}
              onChange={(e) => setTargetCreditHours(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
              <span>3 Cr</span>
              <span>24 Cr</span>
              <span>48 Cr</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Expected SGPA ({projectedGpa.toFixed(2)})
            </label>
            <input
              type="range"
              min={2.0}
              max={4.0}
              step={0.05}
              value={projectedGpa}
              onChange={(e) => setProjectedGpa(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
              <span>2.00</span>
              <span>3.00</span>
              <span>4.00</span>
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 uppercase font-semibold">Projected Final CGPA</span>
            <div className="text-3xl font-extrabold text-cyan-400 font-mono mt-1">
              {simulatedCgpa}
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              On completing {simulatedTotalCredits} credits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
