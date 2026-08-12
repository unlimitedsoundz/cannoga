'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { Tabs } from '@/components/sis/Tabs';
import { StudentHeader } from '@/components/sis/StudentHeader';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { Edit01Icon as Edit, File01Icon as FileText, Download01Icon as Download, EyeIcon as Eye, Mail01Icon as Envelope, SmartPhone01Icon as Phone, MapPinIcon as MapPin, Calendar01Icon as Calendar, GraduationCapIcon as GraduationCap, Shield01Icon as ShieldCheck, UserIcon as User, BellIcon as Bell, Alert01Icon as AlertTriangle, GavelIcon as Gavel, ClipboardIcon as ClipboardText, ArrowRightIcon as ArrowRight } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { getSISStudentDetail } from '../../actions';

interface StudentDetail {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  program: string;
  school: string;
  enrollment_status: string;
  academic_standing: string;
  registration_status: string;
  credits_completed: number;
  credits_remaining: number;
  term_gpa: number;
  cumulative_gpa: number;
  current_balance: number;
  next_due_date: string;
  next_due_amount: number;
  payment_status: string;
  start_date: string;
  expected_graduation: string;
  institutional_email?: string;
  course?: { title: string; school?: { name: string } };
}

export default function AdminStudentDetailPage() {
  const params = useParams();
  const studentId = params.id as string;
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getSISStudentDetail(studentId);
        if (!result.success) throw new Error(result.error);
        if (!result.data) throw new Error('Student not found');
        const s = result.data;
        const courseTitle = s.program?.title || s.program_id || '—';
        const schoolName = s.program?.school?.name || '—';
        setStudent({
          id: s.id,
          student_id: s.student_id,
          first_name: s.user?.first_name || '',
          last_name: s.user?.last_name || '',
          email: s.user?.email || '',
          phone: s.user?.phone_number || '',
          date_of_birth: s.user?.date_of_birth || '',
          address: s.user?.address || '',
          program: courseTitle,
          school: schoolName,
          enrollment_status: s.enrollment_status || 'UNKNOWN',
          academic_standing: 'Good Standing',
          registration_status: 'Active',
          credits_completed: 0,
          credits_remaining: 0,
          term_gpa: 0,
          cumulative_gpa: 0,
          current_balance: 0,
          next_due_date: '',
          next_due_amount: 0,
          payment_status: 'Paid',
          start_date: s.start_date || '',
          expected_graduation: '',
          course: s.program,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load student details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div></div>;
  }

  if (error) {
    return <div className="p-8 bg-red-50 border border-red-100 rounded-none text-center"><p className="text-red-600 font-medium text-sm">{error}</p></div>;
  }

  if (!student) {
    return <div className="p-8 text-center text-slate-400">Student not found</div>;
  }

  const tabs = [
    { label: 'General', href: `/sis/admin/students/${studentId}` },
    { label: 'Admissions', href: `/sis/admin/students/${studentId}/admissions` },
    { label: 'Academics', href: `/sis/admin/students/${studentId}/academics` },
    { label: 'Registration', href: `/sis/admin/students/${studentId}/registration` },
    { label: 'Grades', href: `/sis/admin/students/${studentId}/grades` },
    { label: 'Finance', href: `/sis/admin/students/${studentId}/finance` },
    { label: 'Documents', href: `/sis/admin/students/${studentId}/documents` },
    { label: 'Communications', href: `/sis/admin/students/${studentId}/communications` },
    { label: 'Audit History', href: `/sis/admin/students/${studentId}/audit` },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Record"
        subtitle={`${student.first_name} ${student.last_name} • ${student.student_id}`}
        actions={
          <>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors">
              <HugeiconsIcon icon={Edit} size={14} strokeWidth={2.5} /> Edit Record
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

      <StudentHeader student={{
      id: student.id,
      firstName: student.first_name,
      lastName: student.last_name,
      studentId: student.student_id,
      email: student.email,
      phone: student.phone,
      dateOfBirth: student.date_of_birth,
      address: student.address,
      program: student.program,
      school: student.course?.school?.name || '—',
      academicLevel: student.academic_standing,
      startTerm: student.start_date ? new Date(student.start_date).toLocaleDateString('en-CA') : '',
      status: student.enrollment_status,
      enrollmentStatus: student.enrollment_status,
      institutionalEmail: student.institutional_email || student.email,
      creditsCompleted: student.credits_completed,
      creditsRemaining: student.credits_remaining,
    }} actions={
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 hover:text-neutral-600" title="View Documents"><HugeiconsIcon icon={FileText} size={16} strokeWidth={2} /></button>
          <button className="p-2 text-slate-400 hover:text-neutral-600" title="View Admissions"><HugeiconsIcon icon={Eye} size={16} strokeWidth={2} /></button>
          <button className="p-2 text-slate-400 hover:text-neutral-600" title="View Finance"><HugeiconsIcon icon={ShieldCheck} size={16} strokeWidth={2} /></button>
          <button className="p-2 text-slate-400 hover:text-neutral-600" title="View Academics"><HugeiconsIcon icon={GraduationCap} size={16} strokeWidth={2} /></button>
          <button className="p-2 text-slate-400 hover:text-neutral-600" title="Place Hold"><HugeiconsIcon icon={AlertTriangle} size={16} strokeWidth={2} /></button>
          <button className="p-2 text-slate-400 hover:text-neutral-600" title="Send Message"><HugeiconsIcon icon={Bell} size={16} strokeWidth={2} /></button>
        </div>
      } />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Personal Information</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Legal First Name</dt><dd className="font-medium text-neutral-900 mt-1">{student.first_name}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Legal Last Name</dt><dd className="font-medium text-neutral-900 mt-1">{student.last_name}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date of Birth</dt><dd className="font-medium text-neutral-900 mt-1">{student.date_of_birth}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Address</dt><dd className="font-medium text-neutral-900 mt-1">{student.address}</dd></div>
            </dl>
          </div>

          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Contact Information</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2"><HugeiconsIcon icon={Envelope} size={14} strokeWidth={2.5} className="text-slate-400" /><div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email</dt><dd className="font-medium text-neutral-900 mt-1 font-mono text-xs">{student.email}</dd></div></div>
              <div className="flex items-center gap-2"><HugeiconsIcon icon={Phone} size={14} strokeWidth={2.5} className="text-slate-400" /><div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone</dt><dd className="font-medium text-neutral-900 mt-1">{student.phone}</dd></div></div>
              <div className="flex items-center gap-2"><HugeiconsIcon icon={MapPin} size={14} strokeWidth={2.5} className="text-slate-400" /><div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Address</dt><dd className="font-medium text-neutral-900 mt-1">{student.address}</dd></div></div>
              <div className="flex items-center gap-2"><HugeiconsIcon icon={Calendar} size={14} strokeWidth={2.5} className="text-slate-400" /><div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Start Date</dt><dd className="font-medium text-neutral-900 mt-1">{student.start_date}</dd></div></div>
            </dl>
          </div>

          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Academic Information</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Program</dt><dd className="font-medium text-neutral-900 mt-1">{student.program}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">School</dt><dd className="font-medium text-neutral-900 mt-1">{student.school}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Enrollment Status</dt><dd className="mt-1"><StatusBadge status={student.enrollment_status} /></dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Academic Standing</dt><dd className="mt-1"><StatusBadge status={student.academic_standing} /></dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registration Status</dt><dd className="mt-1"><StatusBadge status={student.registration_status} /></dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Expected Graduation</dt><dd className="font-medium text-neutral-900 mt-1">{student.expected_graduation || '—'}</dd></div>
            </dl>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 p-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-3">Admin Actions</h3>
            <div className="space-y-2">
              <Link href={`/sis/admin/students/${studentId}/academic-record`} className="block text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors no-underline"><HugeiconsIcon icon={FileText} size={14} strokeWidth={2} /> View Transcript</Link>
              <Link href={`/sis/admin/students/${studentId}/academics`} className="block text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors no-underline"><HugeiconsIcon icon={GraduationCap} size={14} strokeWidth={2} /> Degree Audit</Link>
              <Link href={`/sis/admin/students/${studentId}/registration`} className="block text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors no-underline"><HugeiconsIcon icon={Calendar} size={14} strokeWidth={2} /> Class Schedule</Link>
              <Link href={`/sis/admin/students/${studentId}/finance`} className="block text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors no-underline"><HugeiconsIcon icon={ShieldCheck} size={14} strokeWidth={2} /> Financial Account</Link>
              <Link href={`/sis/admin/students/${studentId}/documents`} className="block text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors no-underline"><HugeiconsIcon icon={FileText} size={14} strokeWidth={2} /> Documents</Link>
              <button onClick={() => alert('Place Hold functionality - to be implemented')} className="w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-amber-600 hover:bg-amber-50 flex items-center gap-2 transition-colors"><HugeiconsIcon icon={AlertTriangle} size={14} strokeWidth={2} /> Place Hold</button>
              <button onClick={() => alert('Withdraw Student functionality - to be implemented')} className="w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"><HugeiconsIcon icon={User} size={14} strokeWidth={2} /> Withdraw Student</button>
              <button onClick={() => alert('Academic Action functionality - to be implemented')} className="w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-blue-600 hover:bg-blue-50 flex items-center gap-2 transition-colors"><HugeiconsIcon icon={Gavel} size={14} strokeWidth={2} /> Academic Action</button>
              <button onClick={() => alert('View Audit Log functionality - to be implemented')} className="w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors"><HugeiconsIcon icon={ClipboardText} size={14} strokeWidth={2} /> View Audit Log</button>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-3">Status Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-neutral-50">
                <span className="text-xs text-neutral-500">Enrollment Status</span>
                <StatusBadge status={student.enrollment_status} size="sm" />
              </div>
              <div className="flex justify-between items-center p-2 bg-neutral-50">
                <span className="text-xs text-neutral-500">Academic Standing</span>
                <StatusBadge status={student.academic_standing} size="sm" />
              </div>
              <div className="flex justify-between items-center p-2 bg-neutral-50">
                <span className="text-xs text-neutral-500">Registration Status</span>
                <StatusBadge status={student.registration_status} size="sm" />
              </div>
              <div className="flex justify-between items-center p-2 bg-neutral-50">
                <span className="text-xs text-neutral-500">Financial Status</span>
                <StatusBadge status={student.payment_status} size="sm" />
              </div>
              <div className="flex justify-between items-center p-2 bg-neutral-50">
                <span className="text-xs text-neutral-500">Advisor Hold</span>
                <span className="text-slate-400 text-[10px]">No</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}