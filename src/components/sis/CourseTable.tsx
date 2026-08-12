'use client';

import React from 'react';
import { DataTable } from './DataTable';
import { StatusBadge } from './StatusBadge';

interface Course {
  id: string;
  code: string;
  title: string;
  subject: string;
  credits: number;
  term: string;
  instructor?: string;
  schedule?: string;
  location?: string;
  capacity?: number;
  enrolled?: number;
  status: string;
  waitlist?: number;
}

interface CourseTableProps {
  courses: Course[];
  onView?: (course: Course) => void;
  onRegister?: (course: Course) => void;
  showRegister?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  emptyMessage?: string;
}

export function CourseTable({ courses, onView, onRegister, showRegister = false, pagination, emptyMessage }: CourseTableProps) {
  const columns = [
    {
      key: 'code',
      header: 'Course Code',
      render: (course: Course) => (
        <div className="font-mono font-medium text-neutral-900">{course.code}</div>
      ),
    },
    {
      key: 'title',
      header: 'Course Title',
      render: (course: Course) => (
        <div>
          <div className="font-medium text-neutral-900">{course.title}</div>
          <div className="text-xs text-neutral-500">{course.subject}</div>
        </div>
      ),
    },
    {
      key: 'credits',
      header: 'Credits',
      className: 'text-center',
    },
    {
      key: 'term',
      header: 'Term',
    },
    {
      key: 'instructor',
      header: 'Instructor',
      render: (course: Course) => course.instructor || '—',
    },
    {
      key: 'schedule',
      header: 'Schedule',
      render: (course: Course) => course.schedule || '—',
    },
    {
      key: 'location',
      header: 'Location',
      render: (course: Course) => course.location || '—',
    },
    {
      key: 'enrollment',
      header: 'Enrollment',
      className: 'text-center',
      render: (course: Course) => (
        <div className="text-sm font-mono text-neutral-600">{(course.enrolled || 0)} / {(course.capacity || 0)}</div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (course: Course) => <StatusBadge status={course.status} />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={courses}
      keyField="id"
      pagination={pagination}
      rowActions={showRegister ? (course) => (
        <button
          onClick={() => onRegister?.(course)}
          disabled={(course.enrolled || 0) >= (course.capacity || 0) || course.status !== 'Open'}
          className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-neutral-900 text-white hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Register
        </button>
      ) : undefined}
      emptyMessage={emptyMessage || "No courses found"}
    />
  );
}