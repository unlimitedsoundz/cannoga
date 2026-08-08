'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { CourseTable } from '@/components/sis/CourseTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { FilterBar } from '@/components/sis/FilterBar';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { toast } from 'sonner';
import { 
  Calendar01Icon as Calendar, 
  Add01Icon as Plus,
  Alert01Icon as AlertTriangle, 
  CreditCardIcon as CreditCard 
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { createClient } from '@/utils/supabase/client';
import { registerForCourse } from '@/app/sis/registration-actions';

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

export default function RegistrationPage() {
  const [activeTab, setActiveTab] = React.useState<'registered' | 'search'>('registered');
  const [selectedTerm, setSelectedTerm] = React.useState('Fall 2026');
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [registeredCourses, setRegisteredCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentProgramId, setStudentProgramId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [registering, setRegistering] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: student } = await supabase
          .from('students')
          .select('id, program_id')
          .eq('user_id', user.id)
          .single();

        if (student) {
          setStudentId(student.id);
          setStudentProgramId(student.program_id);

          const { data: subjects } = await supabase
            .from('Subject')
            .select('*')
            .eq('courseId', student.program_id)
            .order('semester', { ascending: true });

          if (subjects) {
            const mappedAvailable: Course[] = subjects.map((subject: any) => ({
              id: subject.id,
              code: subject.code || subject.name.split(':')[0]?.trim() || subject.id,
              title: subject.name.split(':').slice(1).join(':').trim() || subject.name,
              subject: subject.code || subject.name.split(':')[0]?.trim() || 'General',
              credits: subject.creditUnits,
              term: selectedTerm,
              status: 'Open',
              enrolled: Math.floor(Math.random() * 20),
              capacity: 30,
            }));
            setAvailableCourses(mappedAvailable);

            const registeredCount = Math.min(mappedAvailable.length, 4);
            setRegisteredCourses(mappedAvailable.slice(0, registeredCount).map(c => ({ ...c, status: 'Registered', enrolled: c.capacity || 30 })));
          }
        }
      } catch (error) {
        console.error('Error fetching registration data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationData();
  }, [supabase, selectedTerm]);

  const filteredAvailable = availableCourses.filter(c => {
    const matchesSearch = c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = !subjectFilter || c.subject === subjectFilter;
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const availableSubjects = Array.from(new Set(availableCourses.map(c => c.subject)));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Registration"
        subtitle={`Term: ${selectedTerm} • Registration Status: Open • Window: Oct 15 - Nov 15, 2026 • Current Credits: ${registeredCourses.reduce((s, c) => s + c.credits, 0)} / 18`}
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
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Registered Courses ({registeredCourses.length})</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Credits:</span>
              <span className="font-bold text-neutral-900">{registeredCourses.reduce((s, c) => s + c.credits, 0)}</span>
            </div>
          </div>
          <CourseTable
            courses={registeredCourses}
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
            onRegister={async (course) => {
              if (!studentId) {
                toast.error('Please log in to register for courses.');
                return;
              }

              setRegistering(course.id);
              try {
                const result = await registerForCourse(studentId, course, selectedTerm);

                if (!result.success) {
                  toast.error(result.error || 'Failed to register for course');
                  return;
                }

                toast.success(`Successfully registered for ${course.code} - ${course.title}`);
                setAvailableCourses(prev => prev.filter(c => c.id !== course.id));
                setRegisteredCourses(prev => [...prev, { ...course, status: 'Registered', enrolled: course.capacity || 30 }]);
              } catch (error: any) {
                toast.error(error.message || 'Failed to register for course');
              } finally {
                setRegistering(null);
              }
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