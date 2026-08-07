'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { Tabs } from '@/components/sis/Tabs';
import { StudentHeader } from '@/components/sis/StudentHeader';
import { AcademicSummary } from '@/components/sis/AcademicSummary';
import { FinanceSummary } from '@/components/sis/FinanceSummary';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { 
  Edit01Icon as Edit, 
  File01Icon as FileText, 
  Download01Icon as Download, 
  EyeIcon as Eye, 
  Mail01Icon as Envelope, 
  SmartPhone01Icon as Phone, 
  MapPinIcon as MapPin, 
  Calendar01Icon as Calendar, 
  GraduationCapIcon as GraduationCap, 
  Shield01Icon as ShieldCheck 
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const mockStudent = {
  id: '1',
  firstName: 'Sarah',
  middleName: 'Elizabeth',
  lastName: 'Mitchell',
  preferredName: 'Sarah',
  studentId: 'CC10231',
  email: 's.mitchell@cannogacollege.ca',
  phone: '(613) 555-0123',
  dateOfBirth: '1998-05-15',
  address: '123 College Ave, Ottawa, ON K1L 6E8',
  program: 'Bachelor of Science in Nursing',
  school: 'School of Health and Community Services',
  academicLevel: 'Undergraduate',
  startTerm: 'Fall 2024',
  status: 'Active',
  enrollmentStatus: 'Enrolled',
  institutionalEmail: 's.mitchell@student.cannogacollege.ca',
  creditsCompleted: 87,
  creditsRemaining: 33,
  academicStanding: 'Good Standing',
  termGpa: 3.68,
  cumulativeGpa: 3.52,
  registrationStatus: 'Active',
  currentCourses: 5,
  upcomingDeadline: 'Nov 15, 2026',
  currentBalance: 2850.00,
  nextDueDate: 'Dec 1, 2026',
  nextDueAmount: 1425.00,
  lastPaymentDate: 'Aug 15, 2026',
  lastPaymentAmount: 1425.00,
  paymentStatus: 'Outstanding',
};

const tabs = [
  { label: 'Overview', href: '/sis/students/1' },
  { label: 'Personal', href: '/sis/students/1/personal' },
  { label: 'Admissions', href: '/sis/students/1/admissions' },
  { label: 'Academics', href: '/sis/students/1/academics' },
  { label: 'Registration', href: '/sis/students/1/registration' },
  { label: 'Grades', href: '/sis/students/1/grades' },
  { label: 'Finance', href: '/sis/students/1/finance' },
  { label: 'Documents', href: '/sis/students/1/documents' },
  { label: 'Notes', href: '/sis/students/1/notes' },
  { label: 'Communications', href: '/sis/students/1/communications' },
];

export default function StudentDetailPage() {
  const params = useParams();
  const resolvedParams = React.use(params);
  const studentId = resolvedParams.id as string;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Record"
        subtitle={`${mockStudent.firstName} ${mockStudent.lastName} • ${mockStudent.studentId}`}
        actions={
          <>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors">
              <HugeiconsIcon icon={Edit} size={14} strokeWidth={2.5} /> Edit
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors">
              <HugeiconsIcon icon={FileText} size={14} strokeWidth={2.5} /> Print
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors">
              <HugeiconsIcon icon={Download} size={14} strokeWidth={2.5} /> Export
            </button>
          </>
        }
      />

      <Tabs tabs={tabs} />

      <StudentHeader student={mockStudent} actions={
        <div className="flex gap-2">
          <button className="p-2 text-neutral-400 hover:text-neutral-600" title="View Documents"><HugeiconsIcon icon={FileText} size={16} strokeWidth={2} /></button>
          <button className="p-2 text-neutral-400 hover:text-neutral-600" title="View Application"><HugeiconsIcon icon={Eye} size={16} strokeWidth={2} /></button>
          <button className="p-2 text-neutral-400 hover:text-neutral-600" title="View Finance"><HugeiconsIcon icon={ShieldCheck} size={16} strokeWidth={2} /></button>
          <button className="p-2 text-neutral-400 hover:text-neutral-600" title="View Academic Record"><HugeiconsIcon icon={GraduationCap} size={16} strokeWidth={2} /></button>
        </div>
      } />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Personal Information</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Legal First Name</dt><dd className="font-medium text-neutral-900 mt-1">{mockStudent.firstName}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Legal Middle Name</dt><dd className="font-medium text-neutral-900 mt-1">{mockStudent.middleName}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Legal Last Name</dt><dd className="font-medium text-neutral-900 mt-1">{mockStudent.lastName}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Preferred Name</dt><dd className="font-medium text-neutral-900 mt-1">{mockStudent.preferredName}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Date of Birth</dt><dd className="font-medium text-neutral-900 mt-1">{mockStudent.dateOfBirth}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Address</dt><dd className="font-medium text-neutral-900 mt-1">{mockStudent.address}</dd></div>
            </dl>
          </div>

          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Contact Information</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2"><HugeiconsIcon icon={Envelope} size={14} strokeWidth={2.5} className="text-neutral-400" /><div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Email</dt><dd className="font-medium text-neutral-900 mt-1 font-mono text-xs">{mockStudent.email}</dd></div></div>
              <div className="flex items-center gap-2"><HugeiconsIcon icon={Phone} size={14} strokeWidth={2.5} className="text-neutral-400" /><div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Phone</dt><dd className="font-medium text-neutral-900 mt-1">{mockStudent.phone}</dd></div></div>
              <div className="flex items-center gap-2"><HugeiconsIcon icon={MapPin} size={14} strokeWidth={2.5} className="text-neutral-400" /><div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Address</dt><dd className="font-medium text-neutral-900 mt-1">{mockStudent.address}</dd></div></div>
              <div className="flex items-center gap-2"><HugeiconsIcon icon={Calendar} size={14} strokeWidth={2.5} className="text-neutral-400" /><div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Institutional Email</dt><dd className="font-medium text-neutral-900 mt-1 font-mono text-xs">{mockStudent.institutionalEmail}</dd></div></div>
            </dl>
          </div>

          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Academic Information</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Program</dt><dd className="font-medium text-neutral-900 mt-1">{mockStudent.program}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">School</dt><dd className="font-medium text-neutral-900 mt-1">{mockStudent.school}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Credential</dt><dd className="font-medium text-neutral-900 mt-1">Bachelor of Science</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Academic Level</dt><dd className="font-medium text-neutral-900 mt-1">{mockStudent.academicLevel}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Start Term</dt><dd className="font-medium text-neutral-900 mt-1">{mockStudent.startTerm}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Expected Graduation</dt><dd className="font-medium text-neutral-900 mt-1">Spring 2028</dd></div>
            </dl>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 p-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors"><HugeiconsIcon icon={FileText} size={14} strokeWidth={2} /> View Transcript</button>
              <button className="w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors"><HugeiconsIcon icon={GraduationCap} size={14} strokeWidth={2} /> Degree Progress</button>
              <button className="w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors"><HugeiconsIcon icon={Calendar} size={14} strokeWidth={2} /> Class Schedule</button>
              <button className="w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors"><HugeiconsIcon icon={ShieldCheck} size={14} strokeWidth={2} /> Financial Account</button>
              <button className="w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors"><HugeiconsIcon icon={FileText} size={14} strokeWidth={2} /> Documents</button>
              <button className="w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">Place Hold</button>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-3">Status Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-neutral-50">
                <span className="text-xs text-neutral-500">Enrollment Status</span>
                <StatusBadge status={mockStudent.enrollmentStatus} size="sm" />
              </div>
              <div className="flex justify-between items-center p-2 bg-neutral-50">
                <span className="text-xs text-neutral-500">Academic Standing</span>
                <StatusBadge status={mockStudent.academicStanding} size="sm" />
              </div>
              <div className="flex justify-between items-center p-2 bg-neutral-50">
                <span className="text-xs text-neutral-500">Registration Status</span>
                <StatusBadge status={mockStudent.registrationStatus} size="sm" />
              </div>
              <div className="flex justify-between items-center p-2 bg-neutral-50">
                <span className="text-xs text-neutral-500">Financial Status</span>
                <StatusBadge status={mockStudent.paymentStatus} size="sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}