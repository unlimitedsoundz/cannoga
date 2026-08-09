'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { StudentHeader } from '@/components/sis/StudentHeader';
import { GradeTable } from '@/components/sis/GradeTable';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { Download01Icon as Download } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export const dynamic = 'force-dynamic';

export default function AcademicRecordPage() {
  const { id } = useParams();
  const mockGrades = [
    { id: '1', courseCode: 'NURS 101', courseTitle: 'Introduction to Nursing', subject: 'Nursing', credits: 3, term: 'Fall 2024', grade: 'A', gradePoints: 12.0, status: 'Posted', instructor: 'Dr. A. Thompson' },
    { id: '2', courseCode: 'BIOL 101', courseTitle: 'Human Anatomy & Physiology I', subject: 'Biology', credits: 4, term: 'Fall 2024', grade: 'A-', gradePoints: 14.8, status: 'Posted', instructor: 'Dr. R. Patel' },
    { id: '3', courseCode: 'CHEM 101', courseTitle: 'General Chemistry I', subject: 'Chemistry', credits: 4, term: 'Fall 2024', grade: 'B+', gradePoints: 13.2, status: 'Posted', instructor: 'Prof. M. Chen' },
    { id: '4', courseCode: 'NURS 102', courseTitle: 'Nursing Fundamentals', subject: 'Nursing', credits: 4, term: 'Winter 2025', grade: 'A-', gradePoints: 14.8, status: 'Posted', instructor: 'Dr. A. Thompson' },
    { id: '5', courseCode: 'NURS 201', courseTitle: 'Health Assessment', subject: 'Nursing', credits: 3, term: 'Fall 2025', grade: 'A', gradePoints: 12.0, status: 'Posted', instructor: 'Prof. J. Rodriguez' },
    { id: '6', courseCode: 'NURS 301', courseTitle: 'Advanced Nursing Practice', subject: 'Nursing', credits: 3, term: 'Fall 2026', grade: 'IP', gradePoints: 0, status: 'In Progress', instructor: 'Dr. A. Thompson' },
  ];

  const termSummary = [
    { term: 'Fall 2024', attempted: 11, completed: 11, gpa: 3.64 },
    { term: 'Winter 2025', attempted: 11, completed: 11, gpa: 3.64 },
    { term: 'Fall 2025', attempted: 6, completed: 6, gpa: 3.83 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Academic Record" subtitle="Student transcript and grade history" />
      <div className="bg-white border border-neutral-200 p-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Term Summary</h3>
        <div className="space-y-2">
          {termSummary.map((ts) => (
            <div key={ts.term} className="flex justify-between items-center p-2 bg-neutral-50">
              <span className="text-sm font-medium text-neutral-900">{ts.term}</span>
              <div className="flex items-center gap-4 text-xs text-neutral-500">
                <span>{ts.attempted} credits attempted</span>
                <span>{ts.completed} credits completed</span>
                <span className="font-bold text-neutral-900">GPA: {ts.gpa.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-neutral-200">
        <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Grade History</h3>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors">
            <HugeiconsIcon icon={Download} size={14} strokeWidth={2.5} /> Download PDF
          </button>
        </div>
        <GradeTable grades={mockGrades} />
      </div>
    </div>
  );
}