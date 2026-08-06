'use client';

import React from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { Tabs } from '@/components/sis/Tabs';
import { GradeTable } from '@/components/sis/GradeTable';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { 
  Download01Icon as Download,
  ClipboardIcon as ClipboardText 
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const mockGrades = [
  { id: '1', courseCode: 'NURS 101', courseTitle: 'Introduction to Nursing', subject: 'Nursing', credits: 3, term: 'Fall 2024', grade: 'A', gradePoints: 12.0, status: 'Posted', instructor: 'Dr. A. Thompson' },
  { id: '2', courseCode: 'BIOL 101', courseTitle: 'Human Anatomy & Physiology I', subject: 'Biology', credits: 4, term: 'Fall 2024', grade: 'A-', gradePoints: 14.8, status: 'Posted', instructor: 'Dr. R. Patel' },
  { id: '3', courseCode: 'CHEM 101', courseTitle: 'General Chemistry I', subject: 'Chemistry', credits: 4, term: 'Fall 2024', grade: 'B+', gradePoints: 13.2, status: 'Posted', instructor: 'Prof. M. Chen' },
  { id: '4', courseCode: 'PSYC 101', courseTitle: 'Introduction to Psychology', subject: 'Psychology', credits: 3, term: 'Winter 2025', grade: 'A', gradePoints: 12.0, status: 'Posted', instructor: 'Dr. K. Williams' },
  { id: '5', courseCode: 'NURS 102', courseTitle: 'Nursing Fundamentals', subject: 'Nursing', credits: 4, term: 'Winter 2025', grade: 'A-', gradePoints: 14.8, status: 'Posted', instructor: 'Dr. A. Thompson' },
  { id: '6', courseCode: 'BIOL 102', courseTitle: 'Human Anatomy & Physiology II', subject: 'Biology', credits: 4, term: 'Winter 2025', grade: 'B+', gradePoints: 13.2, status: 'Posted', instructor: 'Dr. R. Patel' },
  { id: '7', courseCode: 'NURS 201', courseTitle: 'Health Assessment', subject: 'Nursing', credits: 3, term: 'Fall 2025', grade: 'A', gradePoints: 12.0, status: 'Posted', instructor: 'Prof. J. Rodriguez' },
  { id: '8', courseCode: 'PHAR 201', courseTitle: 'Pharmacology for Nurses', subject: 'Pharmacology', credits: 3, term: 'Fall 2025', grade: 'A-', gradePoints: 11.1, status: 'Posted', instructor: 'Dr. M. Chen' },
  { id: '9', courseCode: 'NURS 202', courseTitle: 'Medical-Surgical Nursing I', subject: 'Nursing', credits: 6, term: 'Winter 2026', grade: 'A', gradePoints: 24.0, status: 'Posted', instructor: 'Dr. A. Thompson' },
  { id: '10', courseCode: 'NURS 301', courseTitle: 'Advanced Nursing Practice', subject: 'Nursing', credits: 3, term: 'Fall 2026', grade: 'IP', gradePoints: 0, status: 'In Progress', instructor: 'Dr. A. Thompson' },
  { id: '11', courseCode: 'NURS 302', courseTitle: 'Clinical Pharmacology', subject: 'Nursing', credits: 3, term: 'Fall 2026', grade: 'IP', gradePoints: 0, status: 'In Progress', instructor: 'Prof. M. Chen' },
  { id: '12', courseCode: 'BIOL 310', courseTitle: 'Pathophysiology', subject: 'Biology', credits: 4, term: 'Fall 2026', grade: 'IP', gradePoints: 0, status: 'In Progress', instructor: 'Dr. R. Patel' },
];

const termSummary = [
  { term: 'Fall 2024', attempted: 11, completed: 11, gpa: 3.64 },
  { term: 'Winter 2025', attempted: 11, completed: 11, gpa: 3.64 },
  { term: 'Fall 2025', attempted: 6, completed: 6, gpa: 3.67 },
  { term: 'Winter 2026', attempted: 6, completed: 6, gpa: 4.0 },
  { term: 'Fall 2026', attempted: 10, completed: 0, gpa: 0 },
];

const overallStats = {
  totalAttempted: 44,
  totalCompleted: 34,
  cumulativeGpa: 3.71,
  degreeProgress: 87,
};

const tabs = [
  { label: 'All Grades', href: '/sis/grades' },
  { label: 'By Term', href: '/sis/grades/by-term' },
  { label: 'GPA Summary', href: '/sis/grades/gpa' },
  { label: 'Degree Progress', href: '/sis/grades/progress' },
];

export default function GradesPage() {
  const [selectedTerm, setSelectedTerm] = React.useState('All Terms');
  const [page, setPage] = React.useState(1);

  const termGrades = selectedTerm === 'All Terms' 
    ? mockGrades 
    : mockGrades.filter(g => g.term === selectedTerm);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Grades & Academic Record"
        subtitle="View grades, GPA, and degree progress"
        actions={
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors">
              <HugeiconsIcon icon={Download} size={14} strokeWidth={2} /> Unofficial Transcript
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors">
              <HugeiconsIcon icon={ClipboardText} size={14} strokeWidth={2} /> Official Transcript
            </button>
          </div>
        }
      />

      <Tabs tabs={tabs} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Term:</label>
          <select
            value={selectedTerm}
            onChange={e => setSelectedTerm(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-neutral-200 bg-white focus:border-neutral-400 focus:outline-none"
          >
            <option value="All Terms">All Terms</option>
            {['Fall 2026', 'Winter 2026', 'Fall 2025', 'Winter 2025', 'Fall 2024'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Cumulative GPA:</span>
            <span className="font-bold text-neutral-900 text-lg">{overallStats.cumulativeGpa.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Credits Earned:</span>
            <span className="font-bold text-neutral-900">{overallStats.totalCompleted} / {overallStats.totalAttempted}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Degree Progress:</span>
            <span className="font-bold text-[#9c27b3]">{overallStats.degreeProgress}%</span>
          </div>
        </div>
      </div>

      <GradeTable
        grades={termGrades}
        pagination={{
          page,
          pageSize: 15,
          total: termGrades.length,
          onPageChange: setPage,
        }}
      />

      <div className="border-t border-neutral-200 pt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Term GPA Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="p-3 text-xs font-bold uppercase tracking-wider text-neutral-600">Term</th>
                <th className="p-3 text-xs font-bold uppercase tracking-wider text-neutral-600 text-center">Credits Attempted</th>
                <th className="p-3 text-xs font-bold uppercase tracking-wider text-neutral-600 text-center">Credits Completed</th>
                <th className="p-3 text-xs font-bold uppercase tracking-wider text-neutral-600 text-center">Term GPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {termSummary.map(t => (
                <tr key={t.term} className="hover:bg-neutral-50">
                  <td className="p-3 font-medium text-neutral-900">{t.term}</td>
                  <td className="p-3 text-center font-mono text-neutral-600">{t.attempted}</td>
                  <td className="p-3 text-center font-mono text-neutral-600">{t.completed}</td>
                  <td className="p-3 text-center font-bold text-neutral-900">{t.gpa > 0 ? t.gpa.toFixed(2) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}