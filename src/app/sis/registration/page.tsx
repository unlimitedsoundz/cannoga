'use client';

import React from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { CourseTable } from '@/components/sis/CourseTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { FilterBar } from '@/components/sis/FilterBar';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { 
  Calendar01Icon as Calendar, 
  Add01Icon as Plus,
  Alert01Icon as AlertTriangle, 
  CreditCardIcon as CreditCard 
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const mockRegisteredCourses = [
  { id: '1', code: 'NURS 301', title: 'Advanced Nursing Practice', subject: 'Nursing', credits: 3, term: 'Fall 2026', instructor: 'Dr. A. Thompson', schedule: 'Mon/Wed 9:00-10:30', location: 'HS-201', capacity: 30, enrolled: 28, status: 'Registered', waitlist: 2 },
  { id: '2', code: 'NURS 302', title: 'Clinical Pharmacology', subject: 'Nursing', credits: 3, term: 'Fall 2026', instructor: 'Prof. M. Chen', schedule: 'Tue/Thu 10:00-11:30', location: 'HS-205', capacity: 25, enrolled: 25, status: 'Registered', waitlist: 5 },
  { id: '3', code: 'BIOL 310', title: 'Pathophysiology', subject: 'Biology', credits: 4, term: 'Fall 2026', instructor: 'Dr. R. Patel', schedule: 'Mon 1:00-4:00', location: 'SC-101', capacity: 40, enrolled: 35, status: 'Registered', waitlist: 0 },
  { id: '4', code: 'NURS 303', title: 'Community Health Nursing', subject: 'Nursing', credits: 3, term: 'Fall 2026', instructor: 'Prof. J. Rodriguez', schedule: 'Wed 8:00-12:00', location: 'CLINIC-A', capacity: 20, enrolled: 18, status: 'Registered', waitlist: 0 },
  { id: '5', code: 'ETHC 200', title: 'Healthcare Ethics', subject: 'Ethics', credits: 3, term: 'Fall 2026', instructor: 'Dr. K. Williams', schedule: 'Fri 9:00-12:00', location: 'HS-100', capacity: 35, enrolled: 30, status: 'Registered', waitlist: 0 },
];

const mockAvailableCourses = [
  { id: '6', code: 'NURS 401', title: 'Leadership in Nursing', subject: 'Nursing', credits: 3, term: 'Fall 2026', instructor: 'Dr. A. Thompson', schedule: 'Mon 2:00-5:00', location: 'HS-100', capacity: 30, enrolled: 15, status: 'Open', waitlist: 0 },
  { id: '7', code: 'NURS 304', title: 'Pediatric Nursing', subject: 'Nursing', credits: 4, term: 'Fall 2026', instructor: 'Dr. R. Patel', schedule: 'Tue/Thu 1:00-3:00', location: 'HS-201', capacity: 25, enrolled: 20, status: 'Open', waitlist: 0 },
  { id: '8', code: 'STAT 201', title: 'Statistics for Health Sciences', subject: 'Statistics', credits: 3, term: 'Fall 2026', instructor: 'Dr. K. Williams', schedule: 'Mon/Wed 11:00-12:30', location: 'SC-101', capacity: 40, enrolled: 32, status: 'Open', waitlist: 0 },
];

export default function RegistrationPage() {
  const [activeTab, setActiveTab] = React.useState<'registered' | 'search'>('registered');
  const [selectedTerm, setSelectedTerm] = React.useState('Fall 2026');
  const [search, setSearch] = React.useState('');
  const [subjectFilter, setSubjectFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [page, setPage] = React.useState(1);

  const filteredAvailable = mockAvailableCourses.filter(c => {
    const matchesSearch = c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = !subjectFilter || c.subject === subjectFilter;
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const availableSubjects = ['Nursing', 'Statistics'];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Registration"
        subtitle={`Term: ${selectedTerm} • Registration Status: Open • Window: Oct 15 - Nov 15, 2026 • Current Credits: ${mockRegisteredCourses.reduce((s, c) => s + c.credits, 0)} / 18`}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 p-4 bg-white border border-neutral-200">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Term:</label>
          <select
            value={selectedTerm}
            onChange={e => setSelectedTerm(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-neutral-200 bg-white focus:border-neutral-400 focus:outline-none"
          >
            {['Fall 2026', 'Winter 2027'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 p-2 bg-emerald-50">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Registration Open</span>
          </div>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Calendar} size={14} strokeWidth={2.5} className="text-neutral-400" />
            <span className="text-neutral-600">Deadline: Nov 15, 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={AlertTriangle} size={14} strokeWidth={2} className="text-amber-600" />
            <span className="text-amber-700 text-xs font-bold">Holds: 0</span>
          </div>
        </div>
      </div>

      <div className="border-b border-neutral-200 mb-4">
        <div className="flex gap-0">
          {[
            { id: 'registered', label: 'My Courses', icon: Calendar },
            { id: 'search', label: 'Add Courses', icon: Plus },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'registered' | 'search')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab.id
                ? 'border-[#9c27b3] text-[#9c27b3]'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'registered' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Registered Courses ({mockRegisteredCourses.length})</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Credits:</span>
              <span className="font-bold text-neutral-900">{mockRegisteredCourses.reduce((s, c) => s + c.credits, 0)}</span>
            </div>
          </div>
          <CourseTable
            courses={mockRegisteredCourses}
            pagination={undefined}
            
          />
          <div className="p-4 bg-neutral-50 border border-neutral-200">
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Schedule Conflict Check</h4>
            <p className="text-sm text-neutral-600">No schedule conflicts detected for current registration.</p>
            <div className="mt-2 flex gap-2">
              <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-neutral-200 text-neutral-700 hover:bg-neutral-100">View Weekly Schedule</button>
              <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-neutral-200 text-neutral-700 hover:bg-neutral-100">Export to Calendar</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'search' && (
        <>
          <ActionToolbar
            search={<SearchBar value={search} onChange={setSearch} placeholder="Search courses by code, title, subject..." />}
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
                  ]},
                ]}
              />}
          />

          <CourseTable
            courses={filteredAvailable}
            onRegister={(course) => {
              alert(`Registering for ${course.code} - ${course.title}`);
            }}
            showRegister
            pagination={{
              page,
              pageSize: 10,
              total: filteredAvailable.length,
              onPageChange: setPage,
            }}
          />
        </>
      )}
    </div>
  );
}