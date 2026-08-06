'use client';

import React from 'react';
import { DataTable } from './DataTable';
import { StatusBadge } from './StatusBadge';

interface Grade {
  id: string;
  courseCode: string;
  courseTitle: string;
  subject: string;
  credits: number;
  term: string;
  grade: string;
  gradePoints: number;
  status: string;
  instructor?: string;
}

interface GradeTableProps {
  grades: Grade[];
  onView?: (grade: Grade) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

const gradeColors: Record<string, string> = {
  'A+': 'text-emerald-600 bg-emerald-50',
  'A': 'text-emerald-600 bg-emerald-50',
  'A-': 'text-emerald-600 bg-emerald-50',
  'B+': 'text-blue-600 bg-blue-50',
  'B': 'text-blue-600 bg-blue-50',
  'B-': 'text-blue-600 bg-blue-50',
  'C+': 'text-amber-600 bg-amber-50',
  'C': 'text-amber-600 bg-amber-50',
  'C-': 'text-amber-600 bg-amber-50',
  'D': 'text-orange-600 bg-orange-50',
  'F': 'text-red-600 bg-red-50',
  'W': 'text-neutral-500 bg-neutral-100',
  'I': 'text-amber-600 bg-amber-50',
  'P': 'text-emerald-600 bg-emerald-50',
  'NP': 'text-red-600 bg-red-50',
};

export function GradeTable({ grades, onView, pagination }: GradeTableProps) {
  const columns = [
    {
      key: 'term',
      header: 'Term',
    },
    {
      key: 'courseCode',
      header: 'Course',
      render: (grade: Grade) => (
        <div>
          <div className="font-mono font-medium text-neutral-900">{grade.courseCode}</div>
          <div className="text-xs text-neutral-500">{grade.courseTitle}</div>
        </div>
      ),
    },
    {
      key: 'credits',
      header: 'Credits',
      className: 'text-center',
    },
    {
      key: 'grade',
      header: 'Grade',
      render: (grade: Grade) => (
        <span className={`px-2 py-1 text-xs font-bold rounded-none ${gradeColors[grade.grade] || 'text-neutral-600 bg-neutral-100'}`}>
          {grade.grade}
        </span>
      ),
    },
    {
      key: 'gradePoints',
      header: 'Grade Points',
      className: 'text-right',
      render: (grade: Grade) => (
        <div className="font-mono text-right text-neutral-900">{grade.gradePoints.toFixed(2)}</div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (grade: Grade) => <StatusBadge status={grade.status} />,
    },
    {
      key: 'instructor',
      header: 'Instructor',
      render: (grade: Grade) => grade.instructor || '—',
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={grades}
      keyField="id"
      pagination={pagination}
      emptyMessage="No grades found"
    />
  );
}