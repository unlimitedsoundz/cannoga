'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { createClient } from '@/utils/supabase/client';

export default function MyStudentRecordPage() {
    const router = useRouter();
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyRecord = async () => {
            try {
                const supabase = createClient();
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                
                if (authError || !user) {
                    router.replace('/portal/account/login');
                    return;
                }

                const { data: studentData, error: studentError } = await supabase
                    .from('students')
                    .select(`
                        *,
                        profiles(first_name, last_name, email),
                        course:Course(title, code)
                    `)
                    .eq('user_id', user.id)
                    .single();

                if (studentError || !studentData) {
                    console.log('No student record found');
                    router.replace('/portal/dashboard');
                    return;
                }

                setStudent(studentData);
            } catch (e) {
                console.error('Error fetching student record:', e);
                router.replace('/portal/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchMyRecord();
    }, [router]);

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="My Record"
                    subtitle="Loading..."
                />
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
                </div>
            </div>
        );
    }

    if (!student) {
        return null;
    }

    const firstName = student.profiles?.first_name || '';
    const lastName = student.profiles?.last_name || '';
    const studentId = student.student_id || '';
    const email = student.profiles?.email || '';
    const program = student.course?.title || student.program_id || 'N/A';
    const status = student.enrollment_status || 'Active';
    const academicStanding = status === 'ACTIVE' ? 'Good Standing' : status === 'ON_LEAVE' ? 'On Leave' : 'Probation';
    const registrationStatus = student.enrollment_status || 'Active';

    const tabs = [
        { label: 'Overview', href: '/sis/me' },
        { label: 'Personal', href: '/sis/me/personal' },
        { label: 'Admissions', href: '/sis/me/admissions' },
        { label: 'Academics', href: '/sis/me/academics' },
        { label: 'Grades', href: '/sis/grades' },
        { label: 'Finance', href: '/sis/me/finance' },
        { label: 'Documents', href: '/sis/me/documents' },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="My Student Record"
                subtitle={`${firstName} ${lastName} • ${studentId}`}
                actions={
                    <>
                        <button className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors">
                            <HugeiconsIcon icon={Edit} size={14} strokeWidth={2.5} /> Edit
                        </button>
                        <button className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors">
                            <HugeiconsIcon icon={FileText} size={14} strokeWidth={2.5} /> Print
                        </button>
                    </>
                }
            />

            <Tabs tabs={tabs} />

            <StudentHeader student={{
      id: (student as any).id || '1',
      enrollmentStatus: student.enrollment_status,
                firstName,
                lastName,
                studentId: student.student_id,
                email: student.profiles?.email || email,
                phone: '',
                dateOfBirth: new Date(student.start_date)?.toLocaleDateString('en-CA') || '',
                address: '',
                program,
                school: '',
                academicLevel: '',
                startTerm: new Date(student.start_date)?.toLocaleDateString('en-CA') || '',
                status,
                institutionalEmail: email,
                creditsCompleted: 0,
                creditsRemaining: 0,
            }} actions={
                <div className="flex gap-2">
                    <button className="p-2 text-slate-800 hover:text-neutral-600" title="View Documents"><HugeiconsIcon icon={FileText} size={16} strokeWidth={2} /></button>
                    <button className="p-2 text-slate-800 hover:text-neutral-600" title="View Application"><HugeiconsIcon icon={Eye} size={16} strokeWidth={2} /></button>
                    <button className="p-2 text-slate-800 hover:text-neutral-600" title="View Finance"><HugeiconsIcon icon={ShieldCheck} size={16} strokeWidth={2} /></button>
                    <button className="p-2 text-slate-800 hover:text-neutral-600" title="View Academic Record"><HugeiconsIcon icon={GraduationCap} size={16} strokeWidth={2} /></button>
                </div>
            } />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AcademicSummary
                    summary={{
                        currentProgram: program,
                        academicStanding,
                        creditsCompleted: 0,
                        creditsRequired: 120,
                        termGpa: 0,
                        cumulativeGpa: 0,
                        registrationStatus,
                        currentCourses: 0,
                        upcomingDeadline: 'N/A',
                    }}
                />

                <FinanceSummary
                    summary={{
                        currentBalance: 0,
                        nextDueDate: '',
                        nextDueAmount: 0,
                        lastPaymentDate: '',
                        lastPaymentAmount: 0,
                        paymentStatus: 'N/A',
                    }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-neutral-200 p-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Personal Information</h3>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-800">Student ID</dt><dd className="font-medium text-neutral-900 mt-1 font-mono">{studentId}</dd></div>
                            <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-800">Email</dt><dd className="font-medium text-neutral-900 mt-1 font-mono text-xs">{email}</dd></div>
                            <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-800">Program</dt><dd className="font-medium text-neutral-900 mt-1">{program}</dd></div>
                            <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-800">Enrollment Status</dt><dd className="font-medium text-neutral-900 mt-1"><StatusBadge status={status} /></dd></div>
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
                            <button className="w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">Place Hold</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}