'use client';

import React from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { CourseTable } from '@/components/sis/CourseTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { FilterBar } from '@/components/sis/FilterBar';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon as Plus } from '@hugeicons/core-free-icons';
import Link from 'next/link';

const mockCourses = [
  { id: '1', code: 'NURS 301', title: 'Advanced Nursing Practice', subject: 'Nursing', credits: 3, term: 'Fall 2026', instructor: 'Dr. A. Thompson', schedule: 'Mon/Wed 9:00-10:30', location: 'HS-201', capacity: 30, enrolled: 28, status: 'Open', waitlist: 2 },
  { id: '2', code: 'NURS 302', title: 'Clinical Pharmacology', subject: 'Nursing', credits: 3, term: 'Fall 2026', instructor: 'Prof. M. Chen', schedule: 'Tue/Thu 10:00-11:30', location: 'HS-205', capacity: 25, enrolled: 25, status: 'Full', waitlist: 5 },
  { id: '3', code: 'BIOL 310', title: 'Pathophysiology', subject: 'Biology', credits: 4, term: 'Fall 2026', instructor: 'Dr. R. Patel', schedule: 'Mon 1:00-4:00', location: 'SC-101', capacity: 40, enrolled: 35, status: 'Open', waitlist: 0 },
  { id: '4', code: 'NURS 303', title: 'Community Health Nursing', subject: 'Nursing', credits: 3, term: 'Fall 2026', instructor: 'Prof. J. Rodriguez', schedule: 'Wed 8:00-12:00', location: 'CLINIC-A', capacity: 20, enrolled: 18, status: 'Open', waitlist: 0 },
  { id: '5', code: 'ETHC 200', title: 'Healthcare Ethics', subject: 'Ethics', credits: 3, term: 'Fall 2026', instructor: 'Dr. K. Williams', schedule: 'Fri 9:00-12:00', location: 'HS-100', capacity: 35, enrolled: 30, status: 'Open', waitlist: 0 },
  { id: '6', code: 'NURS 401', title: 'Leadership in Nursing', subject: 'Nursing', credits: 3, term: 'Winter 2027', instructor: 'Dr. A. Thompson', schedule: 'TBD', location: 'TBD', capacity: 30, enrolled: 0, status: 'Open', waitlist: 0 },
  { id: '7', code: 'NURS 402', title: 'Capstone Practicum', subject: 'Nursing', credits: 6, term: 'Winter 2027', instructor: 'Prof. J. Rodriguez', schedule: 'TBD', location: 'CLINIC-A', capacity: 15, enrolled: 0, status: 'Open', waitlist: 0 },
  { id: '8', code: 'BUSI 101', title: 'Introduction to Business', subject: 'Business', credits: 3, term: 'Fall 2026', instructor: 'Prof. M. Chen', schedule: 'Mon/Wed 11:00-12:30', location: 'BUS-101', capacity: 50, enrolled: 45, status: 'Open', waitlist: 3 },
  { id: '9', code: 'CS 101', title: 'Introduction to Programming', subject: 'Computer Science', credits: 4, term: 'Fall 2026', instructor: 'Dr. R. Patel', schedule: 'Tue/Thu 1:00-3:00', location: 'TECH-200', capacity: 40, enrolled: 38, status: 'Open', waitlist: 2 },
  { id: '10', code: 'MATH 101', title: 'Calculus I', subject: 'Mathematics', credits: 4, term: 'Fall 2026', instructor: 'Dr. K. Williams', schedule: 'Mon/Wed/Fri 9:00-10:00', location: 'SC-101', capacity: 60, enrolled: 55, status: 'Open', waitlist: 1 },
];

export default function CoursesPage() {
  const [search, setSearch] = React.useState('');
  const [subjectFilter, setSubjectFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [termFilter, setTermFilter] = React.useState('Fall 2026');
  const [page, setPage] = React.useState(1);

  const termCourses = mockCourses.filter(c => c.term === termFilter);
  const filteredCourses = termCourses.filter(c => {
    const matchesSearch = c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = !subjectFilter || c.subject === subjectFilter;
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const availableSubjects = ['Nursing', 'Biology', 'Ethics', 'Business', 'Computer Science', 'Mathematics'];
  const availableTerms = ['Fall 2026', 'Winter 2027'];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Catalog"
        subtitle="Search and manage course offerings"
        actions={
          <Link href="/sis/courses/new/" className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors no-underline">
            <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> Add Course
          </Link>
        }
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 p-4 sm:p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800">Term:</label>
          <select
            value={termFilter}
            onChange={e => setTermFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-slate-300 rounded-lg bg-white focus:border-slate-900 focus:outline-none"
          >
            {availableTerms.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Offered:</span>
            <span className="font-extrabold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full text-xs">{termCourses.length} courses</span>
          </div>
        </div>
      </div>

      <ActionToolbar
        search={<SearchBar value={search} onChange={setSearch} placeholder="Search courses by code, title, subject, instructor..." />}
        filter={
          <FilterBar
            filters={[
              { key: 'subject', label: 'Subject', value: subjectFilter, onChange: setSubjectFilter, options: [
                { value: '', label: 'All Subjects' },
                ...availableSubjects.map(s => ({ value: s, label: s })),
              ]},
              { key: 'status', label: 'Status', value: statusFilter, onChange: setStatusFilter, options: [
                { value: '', label: 'All Statuses' },
                { value: 'Open', label: 'Open' },
                { value: 'Full', label: 'Full' },
                { value: 'Waitlist', label: 'Waitlist' },
                { value: 'Closed', label: 'Closed' },
                { value: 'Cancelled', label: 'Cancelled' },
              ]},
            ]}
          />}
      />

      <CourseTable
        courses={filteredCourses}
        onView={(course) => alert(`Viewing ${course.code} - ${course.title}`)}
        pagination={{
          page,
          pageSize: 10,
          total: filteredCourses.length,
          onPageChange: setPage,
        }}
      />
    </div>
  );
}