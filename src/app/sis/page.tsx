'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    FileTypeIcon as FileText,
    BookOpenIcon as BookOpen,
    Calendar01Icon as Calendar,
    CreditCardIcon as CreditCard,
    BellIcon as Bell,
    UserIcon as User,
    SearchIcon as Search,
    Menu01Icon as Menu,
    CircleIcon as XCircle,
    ChevronRightIcon as ChevronRight,
    Clock01Icon as Clock,
    CheckmarkCircle01Icon as CheckCircle,
    UserWarning02Icon as Warning,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';

interface Announcement {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    priority: string;
    status: string;
    publish_start: string;
    publish_end: string;
    created_at: string;
}

interface Student {
    id: string;
    user_id: string;
    student_id: string;
    application_id: string;
    program_id: string;
    enrollment_status: string;
    institutional_email: string;
    personal_email: string;
    start_date: string;
    expected_graduation_date: string;
    lms_access_data: any;
    course?: { title: string };
    created_at: string;
    updated_at: string;
}

interface Enrollment {
    id: string;
    module_id: string;
    semester_id: string;
    status: string;
    grade: number | null;
    grade_status: string | null;
    module: {
        code: string;
        title: string;
        credits: number;
    };
    semester?: {
        name: string;
        start_date: string;
        end_date: string;
    };
}

interface Invoice {
    id: string;
    invoice_number: string;
    type: string;
    term: string;
    amount: number;
    paid: number;
    balance: number;
    due_date: string;
    status: string;
    issued_date: string;
}

interface Payment {
    id: string;
    transaction_reference: string;
    amount: number;
    status: string;
    payment_date: string;
    payment_method: string;
    invoice_type?: string;
}

interface Hold {
    id: string;
    hold_type: string;
    reason: string;
    status: string;
    restrictions: any;
    expires_at: string | null;
    released_at: string | null;
    created_at: string;
    student_message: string | null;
}

interface Task {
    id: string;
    title: string;
    description: string;
    task_type: string;
    priority: string;
    status: string;
    due_date: string | null;
    action_url: string | null;
    action_label: string | null;
}

interface DocumentRecord {
    id: string;
    document_type: string;
    title: string;
    programme: string | null;
    status: string;
    storage_path: string | null;
    version: number;
    issue_date: string | null;
    is_official: boolean;
    is_student_visible: boolean;
    metadata: any;
}

interface Faculty {
    id: string;
    name: string;
    role: string;
    bio: string | null;
    email: string | null;
    imageUrl: string | null;
    department: {
        name: string;
        school?: {
            name: string;
        };
    };
}

type PageId = 'dashboard' | 'documents' | 'academics' | 'registration' | 'financials' | 'grades' | 'holds' | 'news' | 'directory' | 'profile';

interface GradeRecord {
    module_code: string;
    module_title: string;
    credits: number;
    grade: number | null;
    grade_status: string;
    semester_name: string;
}

const documentTypeLabels: Record<string, string> = {
    pal: 'Provincial Attestation Letter (PAL)',
    loa: 'Letter of Acceptance (LOA)',
    tuition_invoice: 'Tuition Invoice',
    tuition_receipt: 'Tuition Receipt',
    enrollment_confirmation: 'Letter of Acceptance (LOA)',
    transcript: 'Transcript',
    application_document: 'Application Document',
    other: 'Document',
};

const getDocumentStatusColor = (status: string) => {
    switch (status) {
        case 'active': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
        case 'archived': return 'text-slate-700 bg-slate-100 border-slate-200';
        case 'revoked': return 'text-red-700 bg-red-50 border-red-200';
        default: return 'text-slate-700 bg-slate-100 border-slate-200';
    }
};

export default function SISStudentDashboard() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [student, setStudent] = useState<Student | null>(null);
    const [studentCourse, setStudentCourse] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<PageId>('dashboard');

    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [grades, setGrades] = useState<GradeRecord[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [tuitionFee, setTuitionFee] = useState<number>(0);
    const [paymentDeadline, setPaymentDeadline] = useState<string>('');
    const [holds, setHolds] = useState<Hold[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [documents, setDocuments] = useState<DocumentRecord[]>([]);
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [news, setNews] = useState<Announcement[]>([]);

    const [activeModals, setActiveModals] = useState<Record<string, boolean>>({});
    const [profileForm, setProfileForm] = useState({ fullName: '', preferredName: '', phone: '', address: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const supabase = createClient();
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                if (authError || !user) {
                    window.location.href = '/portal/account/login';
                    return;
                }

                const { data: prof, error: profError } = await supabase
                    .from('profiles')
                    .select('id, email, first_name, last_name, role, student_id, phone_code, phone_number, address, city, state_province, zipcode, country_of_residence, date_of_birth, avatar_url')
                    .eq('id', user.id)
                    .single();

                if (profError || !prof) {
                    setError('Unable to load profile');
                    setLoading(false);
                    return;
                }

                if (prof.role !== 'STUDENT' && prof.role !== 'APPLICANT') {
                    window.location.href = '/portal/account/login';
                    return;
                }

                setProfile(prof);
                setProfileForm({
                    fullName: `${prof.first_name || ''}`.trim(),
                    preferredName: prof.first_name || '',
                    phone: prof.phone_code ? `+${prof.phone_code}` : (prof.phone_number || ''),
                    address: [prof.address, prof.city, prof.state_province, prof.zipcode, prof.country_of_residence].filter(Boolean).join(', '),
                });

                const { data: studentData } = await supabase
                    .from('students')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (studentData) {
                    setStudent(studentData);

                    // Fetch course details for program name and directory filtering
                    if (studentData.program_id) {
                        const { data: courseData } = await supabase
                            .from('Course')
                            .select('id, title, degreeLevel, schoolId, departmentId')
                            .eq('id', studentData.program_id)
                            .single();

                        if (courseData) {
                            setStudentCourse(courseData);
                        }
                    }
                }

                const studentId = studentData?.id || '';

                const { data: enrollmentData } = await supabase
                    .from('module_enrollments')
                    .select('*, module:modules(code, title, credits), semester:semesters(name, start_date, end_date)')
                    .eq('student_id', studentId);

                if (enrollmentData) {
                    setEnrollments(enrollmentData);
                    const gradeRecords: GradeRecord[] = enrollmentData
                        .filter((e: any) => e.grade !== null)
                        .map((e: any) => ({
                            module_code: e.module?.code || 'N/A',
                            module_title: e.module?.title || 'Unknown',
                            credits: e.module?.credits || 0,
                            grade: e.grade,
                            grade_status: e.grade_status || 'PROVISIONAL',
                            semester_name: e.semester?.name || 'N/A',
                        }));
                    setGrades(gradeRecords);
                }

                const { data: invoiceData } = await supabase
                    .from('invoices')
                    .select('*')
                    .eq('student_id', studentId)
                    .order('issued_date', { ascending: false });

                if (invoiceData) setInvoices(invoiceData);

                let tuitionPayments: any[] = [];
                let fetchedTuitionFee = 0;
                let fetchedPaymentDeadline = '';
                try {
                    const { data: studentApp } = await supabase
                        .from('students')
                        .select('application_id')
                        .eq('id', studentId)
                        .single();

                    if (studentApp?.application_id) {
                        const { data: offerData } = await supabase
                            .from('admission_offers')
                            .select('id, tuition_fee, payment_deadline')
                            .eq('application_id', studentApp.application_id)
                            .maybeSingle();

                        if (offerData) {
                            fetchedTuitionFee = Number(offerData.tuition_fee || 0);
                            fetchedPaymentDeadline = offerData.payment_deadline || '';
                        }

                        const offerIds = offerData ? [offerData.id] : [];
                        if (offerIds.length > 0) {
                            const { data: tpData } = await supabase
                                .from('tuition_payments')
                                .select('*')
                                .in('offer_id', offerIds)
                                .order('created_at', { ascending: false });

                            tuitionPayments = tpData || [];
                        }
                    }
                } catch (paymentErr) {
                    console.error('Error fetching tuition payments:', paymentErr);
                }

                if (tuitionPayments.length > 0) setPayments(tuitionPayments);
                setTuitionFee(fetchedTuitionFee);
                setPaymentDeadline(fetchedPaymentDeadline);

                const { data: holdData } = await supabase
                    .from('student_holds')
                    .select('*')
                    .eq('student_id', studentId)
                    .order('created_at', { ascending: false });

                if (holdData) setHolds(holdData);

                const { data: taskData } = await supabase
                    .from('student_tasks')
                    .select('*')
                    .eq('student_id', studentId)
                    .order('due_date', { ascending: true });

                if (taskData) setTasks(taskData);

                const { data: docData } = await supabase
                    .from('document_records')
                    .select('*')
                    .eq('student_id', studentId)
                    .eq('is_student_visible', true)
                    .order('issue_date', { ascending: false });

                if (docData) setDocuments(docData);

                let facultyQuery = supabase
                    .from('Faculty')
                    .select('*, department:Departments(name, school:Schools(name))')
                    .limit(20);

                if (studentCourse?.schoolId) {
                    facultyQuery = facultyQuery.eq('schoolId', studentCourse.schoolId);
                }

                if (studentCourse?.departmentId) {
                    facultyQuery = facultyQuery.eq('departmentId', studentCourse.departmentId);
                }

                const { data: facultyData } = await facultyQuery;

                if (facultyData) setFaculty(facultyData);

                const { data: announcementData } = await supabase
                    .from('announcements')
                    .select('*')
                    .eq('status', 'published')
                    .order('display_order', { ascending: true })
                    .limit(5);

                if (announcementData) setAnnouncements(announcementData);

                const { data: newsData } = await supabase
                    .from('announcements')
                    .select('id, title, excerpt, content, priority, status, publish_start, publish_end, display_order, created_at')
                    .eq('status', 'published')
                    .order('publish_start', { ascending: false })
                    .limit(10);

                if (newsData) setNews(newsData);

            } catch (e) {
                console.error('Error fetching data:', e);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const searchParams = useSearchParams();
    const pageParam = searchParams.get('page');

    useEffect(() => {
        if (pageParam && ['dashboard', 'documents', 'academics', 'registration', 'financials', 'grades', 'holds', 'news', 'directory', 'profile'].includes(pageParam)) {
            setCurrentPage(pageParam as PageId);
        }
    }, [pageParam]);

    useEffect(() => {
        const onPopState = () => {
            const params = new URLSearchParams(window.location.search);
            const page = params.get('page');
            if (page && ['dashboard', 'documents', 'academics', 'registration', 'financials', 'grades', 'holds', 'news', 'directory', 'profile'].includes(page)) {
                setCurrentPage(page as PageId);
            }
        };
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    const navigateTo = (pageId: PageId) => {
        setCurrentPage(pageId);
        setSidebarOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const url = new URL(window.location.href);
        url.searchParams.set('page', pageId);
        window.history.pushState({}, '', url);
    };

    const toggleModal = (id: string) => {
        setActiveModals(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const closeModal = (id: string) => {
        setActiveModals(prev => ({ ...prev, [id]: false }));
    };

    const displayName = profile?.first_name || profile?.last_name
        ? `${profile?.first_name || ''}`.trim()
        : profile?.email || 'Student';

    const studentId = student?.student_id || profile?.student_id || 'N/A';
    const programName = studentCourse?.title
        ? `${studentCourse.title} — ${studentCourse.degreeLevel?.charAt(0) + studentCourse.degreeLevel?.slice(1).toLowerCase() || ''}`
        : student?.program_id || 'Your Program';

    const totalPaid = payments
        .filter((p: any) => p.status === 'COMPLETED' || p.status === 'verified')
        .reduce((sum: number, p: any) => sum + Number(p.amount), 0);

    let totalBalance = invoices.reduce((sum, inv) => sum + (inv.balance || 0), 0);

    if (invoices.length === 0 && tuitionFee > 0) {
        totalBalance = Math.max(0, tuitionFee - totalPaid);
    }
    const activeHolds = holds.filter(h => h.status === 'active');
    const activeTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
    const activeEnrollments = enrollments.filter(e => e.status === 'REGISTERED' || e.status === 'ACTIVE');
    const totalCredits = activeEnrollments.reduce((sum, e) => sum + (e.module?.credits || 0), 0);
    const gpa = grades.length > 0 ? (grades.reduce((sum, g) => sum + (g.grade || 0), 0) / grades.length).toFixed(2) : '0.00';

    const navItems = [
        { label: 'DASHBOARD', pageId: 'dashboard' as PageId },
        { label: 'MY DOCUMENTS', pageId: 'documents' as PageId },
        { label: 'ACADEMIC PROFILE', pageId: 'academics' as PageId },
        { label: 'REGISTRATION', pageId: 'registration' as PageId },
        { label: 'FINANCIAL AID & PAY', pageId: 'financials' as PageId },
        { label: 'TRANSCRIPTS & GRADES', pageId: 'grades' as PageId },
        { label: 'HOLDS & TASKS', pageId: 'holds' as PageId },
        { label: 'NEWS', pageId: 'news' as PageId },
        { label: 'DIRECTORY', pageId: 'directory' as PageId },
        { label: 'MY PROFILE', pageId: 'profile' as PageId },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full border-2 border-t-transparent border-slate-900 h-8 w-8"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center p-6">
                    <p className="text-neutral-600 mb-4">{error}</p>
                    <button onClick={() => window.location.href = '/portal/account/login'} className="px-6 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700">Return to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="font-sans" data-theme="sis">
            {/* TOP HEADER */}
            <header className="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                        <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-300 hover:text-white focus:outline-none md:hidden">
                            <HugeiconsIcon icon={Menu} size={20} strokeWidth={2} />
                        </button>
                        <Link href="/sis" className="flex items-center space-x-2.5 py-1 shrink-0">
                            <img src="/images/logo-cannoga.png" alt="Cannoga College" className="h-9 w-auto object-contain brightness-0 invert" />
                            <div className="hidden sm:block border-l border-slate-700 pl-3">
                                <span className="font-bold text-xs sm:text-sm tracking-tight block leading-none text-slate-100">CANNOGA COLLEGE</span>
                                <span className="text-[10px] text-slate-400 font-medium">Student Portal</span>
                            </div>
                        </Link>
                    </div>
                    <div className="flex-1 max-w-md relative hidden sm:block">
                        <div className="relative w-full">
                            <input type="text" placeholder="Search documents, courses, staff..." className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-slate-500 focus:bg-slate-800/90 placeholder-slate-400 shadow-inner" />
                            <HugeiconsIcon icon={Search} size={16} strokeWidth={2.5} className="absolute left-3 top-2.5 text-slate-400" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                        <button type="button" onClick={() => navigateTo('holds')} className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition flex items-center justify-center">
                            <HugeiconsIcon icon={Bell} size={18} strokeWidth={2} />
                            {activeHolds.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full"></span>}
                        </button>
                        <div className="h-5 w-px bg-slate-800 mx-1"></div>
                        <div className="flex items-center space-x-2 cursor-pointer hover:bg-slate-800 p-1.5 rounded-lg transition" onClick={() => navigateTo('profile')}>
                            <div className="w-7 h-7 bg-slate-700 rounded-full flex items-center justify-center">
                                <HugeiconsIcon icon={User} size={14} strokeWidth={2.5} className="text-slate-300" />
                            </div>
                            <div className="hidden lg:block text-left">
                                <p className="text-xs font-semibold leading-tight text-slate-200">{displayName}</p>
                                <p className="text-[10px] text-slate-400">{studentId}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* SECONDARY TABS */}
            <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-1 sm:space-x-3 overflow-x-auto no-scrollbar text-xs font-medium text-slate-600">
                        {navItems.map(item => {
                            const isActive = currentPage === item.pageId;
                            return (
                                <button key={item.pageId} type="button" onClick={() => navigateTo(item.pageId)} className={`border-b-2 py-3 px-3 whitespace-nowrap flex items-center space-x-1.5 transition ${isActive ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent hover:text-slate-900'}`}>
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* SIDEBAR + MAIN CONTENT */}
            <div className="flex flex-1 relative">
                {/* Backdrop */}
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-slate-900 bg-opacity-40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}
                
                {/* Sidebar */}
                <aside className={`fixed md:sticky inset-y-0 md:top-16 left-0 w-60 bg-slate-900 text-slate-300 z-50 transform transition-transform duration-200 ease-in-out flex-shrink-0 flex flex-col justify-between border-r border-slate-800 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                    <div className="p-4 space-y-1">
                        <div className="flex items-center justify-between md:hidden pb-3 mb-2 border-b border-slate-800">
                            <div className="flex items-center space-x-2">
                                <img src="/images/logo-cannoga.png" alt="Cannoga College" className="h-6 w-auto object-contain brightness-0 invert" />
                                <span className="font-bold text-white text-xs">Cannoga College</span>
                            </div>
                            <button type="button" onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                                <HugeiconsIcon icon={XCircle} size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                        <nav className="space-y-0.5">
                            {navItems.map(item => {
                                const isActive = currentPage === item.pageId;
                                return (
                                    <button key={item.pageId} type="button" onClick={() => navigateTo(item.pageId)} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-xs font-medium transition text-left ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}>
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500">
                        Cannoga College Student Portal
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
                    {/* ================= DASHBOARD ================= */}
                    {currentPage === 'dashboard' && (
                        <div>
                            <div className="relative rounded-xl overflow-hidden mb-6 bg-slate-900 text-white min-h-[220px] sm:min-h-[260px] flex items-end p-6 sm:p-8 shadow-md border border-slate-800">
                                <img src="/images/home-carousel-3.png" alt="Cannoga College campus" className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                                <div className="relative z-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
                                    <div>
                                        <div className="inline-flex items-center space-x-2 bg-slate-800/80 backdrop-blur-sm border border-slate-700 text-slate-300 text-[11px] font-semibold px-2.5 py-1 rounded mb-2">
                                            <span>Ontario, Canada</span>
                                            <span>•</span>
                                            <span>{programName}</span>
                                        </div>
                                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">Welcome back, {displayName.split(' ')[0]}</h1>
                                        <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">{programName} {student?.enrollment_status === 'ACTIVE' ? '| Active Student' : ''}</p>
                                    </div>
                                    <div className="flex items-center space-x-3 bg-slate-900/80 backdrop-blur-md p-3 rounded-lg border border-slate-700/80 self-start md:self-auto">
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Student ID</p>
                                            <p className="text-xs font-bold text-slate-100">{studentId}</p>
                                        </div>
                                        <div className="h-6 w-px bg-slate-700"></div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Term</p>
                                            <p className="text-xs font-bold text-slate-100">Fall 2026</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {activeHolds.length > 0 && (
                                <div className="mb-6 bg-slate-100 border-l-4 border-slate-700 p-4 rounded-r-md flex items-start justify-between">
                                    <div className="flex items-start space-x-3">
                                        <HugeiconsIcon icon={Bell} size={20} strokeWidth={2} className="text-slate-700 mt-0.5" />
                                        <div>
                                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">Action Required: {activeHolds[0].hold_type.replace(/_/g, ' ')}</h4>
                                            <p className="text-xs text-slate-600 mt-0.5">{activeHolds[0].student_message || activeHolds[0].reason}</p>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => navigateTo('holds')} className="text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded flex-shrink-0 ml-3">Resolve</button>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <div className="p-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-lg">
                                            <div className="flex items-center space-x-2">
                                                <HugeiconsIcon icon={Calendar} size={16} strokeWidth={2} className="text-slate-700" />
                                                <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Today&apos;s Schedule</h3>
                                            </div>
                                            <span className="text-[11px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">{activeEnrollments.length} Classes</span>
                                        </div>
                                        <div className="p-4 space-y-2.5">
                                            {activeEnrollments.slice(0, 3).map(enrollment => (
                                                <div key={enrollment.id} className="p-3 bg-slate-50 rounded border border-slate-200 flex justify-between items-center">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-500 uppercase">{enrollment.semester?.name || 'Current Term'}</p>
                                                        <p className="text-xs font-semibold text-slate-800 mt-0.5">{enrollment.module?.code}: {enrollment.module?.title}</p>
                                                    </div>
                                                    <span className="text-[11px] font-medium text-slate-600 border border-slate-300 bg-white px-2 py-0.5 rounded">{enrollment.module?.credits} cr</span>
                                                </div>
                                            ))}
                                            {activeEnrollments.length === 0 && <div className="text-center py-6 text-xs text-slate-500">No active classes</div>}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-50/50 border-t border-slate-100 rounded-b-lg text-right">
                                        <button type="button" onClick={() => navigateTo('academics')} className="text-xs font-semibold text-slate-800 hover:underline">View Full Schedule &rarr;</button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <div className="p-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-lg">
                                            <div className="flex items-center space-x-2">
                                                <HugeiconsIcon icon={FileText} size={16} strokeWidth={2} className="text-slate-700" />
                                                <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Official Documents</h3>
                                            </div>
                                            <span className="text-[11px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">Verified</span>
                                        </div>
                                        <div className="p-4 space-y-2.5">
                                            {documents.length > 0 ? documents.slice(0, 3).map(doc => (
                                                <div key={doc.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                                                    <div className="flex items-center space-x-2.5">
                                                        <HugeiconsIcon icon={FileText} size={14} strokeWidth={2} className="text-slate-600" />
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-900">{documentTypeLabels[doc.document_type] || doc.title}</p>
                                                            <p className="text-[10px] text-slate-500">{doc.issue_date ? new Date(doc.issue_date).toLocaleDateString('en-CA') : 'Pending'}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[11px] text-slate-700 font-semibold">PDF</span>
                                                </div>
                                            )) : (
                                                <div className="text-center py-6 text-xs text-slate-500">No documents available</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-50/50 border-t border-slate-100 rounded-b-lg text-right">
                                        <button type="button" onClick={() => navigateTo('documents')} className="text-xs font-semibold text-slate-800 hover:underline">All Records & Receipts &rarr;</button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <div className="p-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-lg">
                                            <div className="flex items-center space-x-2">
                                                <HugeiconsIcon icon={CreditCard} size={16} strokeWidth={2} className="text-slate-700" />
                                                <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Account Summary</h3>
                                            </div>
                                            <span className="text-[11px] text-slate-500">Fall 2026</span>
                                        </div>
                                        <div className="p-4">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Balance Due (CAD)</p>
                                            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">${totalBalance.toLocaleString('en-CA', { minimumFractionDigits: 2 })}</p>
                                             {invoices.length > 0 && invoices[0].due_date ? (
                                                 <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
                                                     <strong>Next Due:</strong> {new Date(invoices[0].due_date).toLocaleDateString('en-CA')}
                                                 </div>
                                             ) : paymentDeadline ? (
                                                 <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
                                                     <strong>Next Due:</strong> {new Date(paymentDeadline).toLocaleDateString('en-CA')}
                                                 </div>
                                             ) : null}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-50/50 border-t border-slate-100 rounded-b-lg flex items-center justify-between">
                                        <button type="button" onClick={() => navigateTo('financials')} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded transition">Make Payment</button>
                                        <button type="button" onClick={() => navigateTo('financials')} className="text-xs font-semibold text-slate-800 hover:underline">View Ledger &rarr;</button>
                                    </div>
                                </div>
                            </div>

                            {announcements.length > 0 && (
                                <div className="mt-6 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                                            <HugeiconsIcon icon={Bell} size={18} strokeWidth={2.5} className="text-slate-700" />
                                            Announcements
                                        </h2>
                                    </div>
                                    <div className="space-y-3">
                                        {announcements.map(announcement => (
                                            <div key={announcement.id} className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100">
                                                <div className="w-16 h-16 bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Info</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-bold text-slate-900">{announcement.title}</span>
                                                        {announcement.priority === 'urgent' && <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">Urgent</span>}
                                                        {announcement.priority === 'high' && <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">High</span>}
                                                    </div>
                                                    <p className="text-xs text-slate-500 line-clamp-2">{announcement.excerpt || announcement.content}</p>
                                                    <span className="text-[10px] text-slate-400 mt-1 block">{new Date(announcement.created_at).toLocaleDateString('en-CA')}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {/* ================= DOCUMENTS ================= */}
                    {currentPage === 'documents' && (
                        <div>
                            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Official Student Records, PAL & Tax Certificates</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Verified documents issued by Cannoga College Registrar, Admissions, and Bursar.</p>
                                </div>
                                <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium px-3 py-1.5 rounded">
                                    <span>Digitally Signed PDF System Active</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-6">
                                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Admissions & Visa/IRCC Documents</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {documents.filter(d => ['pal', 'loa'].includes(d.document_type)).length > 0 ? documents.filter(d => ['pal', 'loa'].includes(d.document_type)).map(doc => (
                                        <div key={doc.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">{doc.id.slice(0, 8).toUpperCase()}</span>
                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getDocumentStatusColor(doc.status)}`}>{doc.status}</span>
                                                </div>
                                                <h5 className="font-bold text-slate-900 text-sm">{documentTypeLabels[doc.document_type] || doc.title}</h5>
                                                <p className="text-xs text-slate-500 mt-1">{doc.issue_date ? `Issued: ${new Date(doc.issue_date).toLocaleDateString('en-CA')}` : 'Pending'}</p>
                                                <p className="text-xs text-slate-600 mt-2">{doc.metadata?.description || 'Official document issued by Cannoga College.'}</p>
                                            </div>
                                            <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center">
                                                <span className="text-[11px] text-slate-500">PDF Document</span>
                                                <button type="button" onClick={() => toggleModal(`doc-${doc.id}`)} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded transition">View / Download</button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-full text-center py-8 text-sm text-slate-500">No admissions documents available</div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Tuition Receipts & Tax Certificates</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {documents.filter(d => ['tuition_receipt', 'tuition_invoice', 'transcript'].includes(d.document_type)).length > 0 ? documents.filter(d => ['tuition_receipt', 'tuition_invoice', 'transcript'].includes(d.document_type)).map(doc => (
                                        <div key={doc.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">{doc.id.slice(0, 8).toUpperCase()}</span>
                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getDocumentStatusColor(doc.status)}`}>{doc.status}</span>
                                                </div>
                                                <h5 className="font-bold text-slate-900 text-sm">{documentTypeLabels[doc.document_type] || doc.title}</h5>
                                                <p className="text-xs text-slate-500 mt-1">{doc.issue_date ? `Issued: ${new Date(doc.issue_date).toLocaleDateString('en-CA')}` : 'Pending'}</p>
                                            </div>
                                            <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center">
                                                <span className="text-[11px] text-slate-500">PDF Document</span>
                                                <button type="button" onClick={() => toggleModal(`doc-${doc.id}`)} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded transition">View / Download</button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-full text-center py-8 text-sm text-slate-500">No financial documents available</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Document PDF Modal */}
                    {Object.entries(activeModals).map(([modalId, isOpen]) => {
                        if (!isOpen || !modalId.startsWith('doc-')) return null;
                        const docId = modalId.replace('doc-', '');
                        const doc = documents.find(d => d.id === docId);
                        if (!doc || !doc.storage_path) return null;
                        return (
                            <div key={modalId} className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                <div className="absolute inset-0 bg-black/60" onClick={() => toggleModal(modalId)}></div>
                                <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                                    <div className="flex items-center justify-between p-4 border-b border-slate-200">
                                        <h3 className="font-bold text-slate-900 text-sm">{documentTypeLabels[doc.document_type] || doc.title}</h3>
                                        <div className="flex items-center gap-2">
                                            <a href={doc.storage_path} download target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-3 py-1.5 bg-slate-900 text-white rounded hover:bg-slate-800 transition">Download</a>
                                            <button type="button" onClick={() => toggleModal(modalId)} className="text-slate-400 hover:text-slate-600">
                                                <HugeiconsIcon icon={XCircle} size={20} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-auto p-4">
                                        <iframe src={doc.storage_path} className="w-full h-[70vh] border border-slate-200 rounded" title={documentTypeLabels[doc.document_type] || doc.title}></iframe>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* ================= ACADEMICS ================= */}
                    {currentPage === 'academics' && (
                        <div>
                            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm mb-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Degree Progress: {programName}</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">Cannoga College — Faculty of Technology</p>
                                    </div>
                                    <span className="inline-block bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1 rounded border border-slate-200 self-start md:self-auto">Expected Graduation: {student?.expected_graduation_date ? new Date(student.expected_graduation_date).toLocaleDateString('en-CA') : 'N/A'}</span>
                                </div>
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                                        <span>{totalCredits} Credits Earned</span>
                                        <span>120 Total Required</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                                        <div className="bg-slate-900 h-2.5 rounded-full" style={{ width: `${Math.min((totalCredits / 120) * 100, 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm mb-6">
                                <div className="p-4 border-b border-slate-200 font-bold text-slate-800 text-xs sm:text-sm flex justify-between items-center">
                                    <span>Enrolled Courses</span>
                                    <span className="text-xs bg-slate-100 text-slate-700 font-normal px-2.5 py-1 rounded">{activeEnrollments.length} Courses</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs sm:text-sm text-slate-600">
                                        <thead className="bg-slate-50 text-slate-700 text-xs uppercase border-b border-slate-200">
                                            <tr>
                                                <th className="p-3">Course</th>
                                                <th className="p-3">Title</th>
                                                <th className="p-3">Credits</th>
                                                <th className="p-3">Status</th>
                                                <th className="p-3">Semester</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {activeEnrollments.map(enrollment => (
                                                <tr key={enrollment.id}>
                                                    <td className="p-3 font-semibold text-slate-900">{enrollment.module?.code}</td>
                                                    <td className="p-3">{enrollment.module?.title}</td>
                                                    <td className="p-3">{enrollment.module?.credits}</td>
                                                    <td className="p-3">{enrollment.status}</td>
                                                    <td className="p-3">{enrollment.semester?.name || 'N/A'}</td>
                                                </tr>
                                            ))}
                                            {activeEnrollments.length === 0 && (
                                                <tr><td colSpan={5} className="p-6 text-center text-slate-500">No active enrollments</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* ================= REGISTRATION ================= */}
                    {currentPage === 'registration' && (
                        <div>
                            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm mb-6">
                                <h3 className="text-base font-bold text-slate-900 mb-1">Course Registration</h3>
                                <p className="text-xs text-slate-500 mb-4">Search and register for available courses.</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Subject</label>
                                        <select className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm">
                                            <option>Computer Science (CS)</option>
                                            <option>Mathematics (MATH)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Course Number</label>
                                        <input type="text" placeholder="e.g. 490" className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm" />
                                    </div>
                                    <div className="flex items-end">
                                        <button type="button" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded text-xs sm:text-sm transition">Search Catalog</button>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Available Courses</h4>
                                <div className="text-center py-8 text-slate-500 text-sm">No additional courses available for registration at this time.</div>
                            </div>
                        </div>
                    )}

                    {/* ================= FINANCIAL AID & PAY ================= */}
                    {currentPage === 'financials' && (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Charges (Fall 2026)</p>
                                    <p className="text-2xl font-bold text-slate-900 mt-1">${invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })} CAD</p>
                                </div>
                                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Payments Received</p>
                                    <p className="text-2xl font-bold text-slate-900 mt-1">${payments.reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })} CAD</p>
                                </div>
                                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-slate-900">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Net Balance Due</p>
                                    <p className="text-2xl font-bold text-slate-900 mt-1">${totalBalance.toLocaleString('en-CA', { minimumFractionDigits: 2 })} CAD</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-slate-800 text-sm">Itemized Student Account Ledger</h3>
                                </div>
                                <table className="w-full text-left text-xs sm:text-sm text-slate-600">
                                    <thead className="bg-slate-50 text-slate-700 text-xs uppercase border-b border-slate-200">
                                        <tr>
                                            <th className="p-3">Description</th>
                                            <th className="p-3">Date</th>
                                            <th className="p-3 text-right">Amount (CAD)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {invoices.map(invoice => (
                                            <tr key={invoice.id}>
                                                <td className="p-3 font-medium text-slate-800">{invoice.type} - {invoice.term}</td>
                                                <td className="p-3">{invoice.issued_date ? new Date(invoice.issued_date).toLocaleDateString('en-CA') : 'N/A'}</td>
                                                <td className="p-3 text-right font-medium">${invoice.amount.toLocaleString('en-CA', { minimumFractionDigits: 2 })}</td>
                                            </tr>
                                        ))}
                                        {invoices.length === 0 && (
                                            <tr><td colSpan={3} className="p-6 text-center text-slate-500">No invoices available</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ================= TRANSCRIPTS & GRADES ================= */}
                    {currentPage === 'grades' && (
                        <div>
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-base">Academic Grade History & Transcript</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Cumulative GPA: <strong>{gpa}</strong> | {grades.length} Courses Recorded</p>
                                </div>
                                <button type="button" className="border border-slate-300 hover:bg-slate-50 font-medium text-xs px-3.5 py-1.5 rounded flex items-center space-x-1.5">
                                    <span>Download Official PDF Transcript</span>
                                </button>
                            </div>
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm mb-6">
                                <div className="p-4 border-b border-slate-200 font-bold text-slate-800 text-xs sm:text-sm flex justify-between items-center">
                                    <span>Grade History</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs sm:text-sm text-slate-600">
                                        <thead className="bg-slate-50 text-slate-700 text-xs uppercase border-b border-slate-200">
                                            <tr>
                                                <th className="p-3">Course</th>
                                                <th className="p-3">Title</th>
                                                <th className="p-3">Credits</th>
                                                <th className="p-3">Grade</th>
                                                <th className="p-3">Status</th>
                                                <th className="p-3">Semester</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {grades.map((grade, idx) => (
                                                <tr key={idx}>
                                                    <td className="p-3 font-semibold text-slate-900">{grade.module_code}</td>
                                                    <td className="p-3">{grade.module_title}</td>
                                                    <td className="p-3">{grade.credits}</td>
                                                    <td className="p-3">{grade.grade !== null ? grade.grade.toFixed(1) : 'N/A'}</td>
                                                    <td className="p-3">{grade.grade_status}</td>
                                                    <td className="p-3">{grade.semester_name}</td>
                                                </tr>
                                            ))}
                                            {grades.length === 0 && (
                                                <tr><td colSpan={6} className="p-6 text-center text-slate-500">No grades recorded</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ================= HOLDS & TASKS ================= */}
                    {currentPage === 'holds' && (
                        <div>
                            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm mb-6">
                                <div className="flex items-center space-x-2 border-b pb-3 mb-4">
                                    <HugeiconsIcon icon={Bell} size={20} strokeWidth={2} className="text-slate-700" />
                                    <h3 className="text-base font-bold text-slate-900">Active Holds</h3>
                                </div>
                                {activeHolds.length > 0 ? (
                                    <div className="space-y-3">
                                        {activeHolds.map(hold => (
                                            <div key={hold.id} className="p-4 bg-slate-50 border border-slate-200 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{hold.hold_type}</span>
                                                    <h4 className="font-bold text-slate-900 text-sm mt-1">{hold.reason}</h4>
                                                    <p className="text-xs text-slate-500 mt-0.5">{hold.student_message || 'Please resolve this hold to continue.'}</p>
                                                </div>
                                                <button type="button" className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-3.5 py-1.5 rounded self-start md:self-center">Upload Document</button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-500">No active holds</div>
                                )}
                            </div>

                            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                                <div className="flex items-center space-x-2 border-b pb-3 mb-4">
                                    <HugeiconsIcon icon={Clock} size={20} strokeWidth={2} className="text-slate-700" />
                                    <h3 className="text-base font-bold text-slate-900">Pending Tasks</h3>
                                </div>
                                {activeTasks.length > 0 ? (
                                    <div className="space-y-3">
                                        {activeTasks.map(task => (
                                            <div key={task.id} className="p-4 bg-slate-50 border border-slate-200 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-sm">{task.title}</h4>
                                                    <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
                                                    {task.due_date && <p className="text-xs text-slate-500 mt-1">Due: {new Date(task.due_date).toLocaleDateString('en-CA')}</p>}
                                                </div>
                                                {task.action_url && (
                                                    <button type="button" onClick={() => window.open(task.action_url!, '_blank')} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-3.5 py-1.5 rounded self-start md:self-center">{task.action_label || 'Take Action'}</button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-500">No pending tasks</div>
                                )}
                            </div>
                        </div>
                    )}
                    {/* ================= NEWS ================= */}
                    {currentPage === 'news' && (
                        <div>
                            <div className="mb-6">
                                <h3 className="text-base font-bold text-slate-900">Campus News Feed</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Latest announcements and news from Cannoga College.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {news.length > 0 ? news.map(item => (
                                    <div key={item.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 cursor-pointer transition">
                                        <span className="text-[10px] font-bold text-slate-600 uppercase bg-slate-100 px-2 py-0.5 rounded">{item.priority || 'News'}</span>
                                        <h3 className="text-sm font-bold text-slate-900 mt-2">{item.title}</h3>
                                        <p className="text-xs text-slate-400 mt-1">{item.publish_start ? new Date(item.publish_start).toLocaleDateString('en-CA') : ''}</p>
                                    </div>
                                )) : (
                                    <div className="col-span-full text-center py-8 text-slate-500">No news available</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ================= DIRECTORY ================= */}
                    {currentPage === 'directory' && (
                        <div>
                            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm mb-6">
                                <h3 className="text-base font-bold text-slate-900 mb-2">Faculty & Campus Directory</h3>
                                <input type="text" placeholder="Search by professor name, department, or office..." className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-xs sm:text-sm focus:outline-none focus:border-slate-500" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {faculty.length > 0 ? faculty.map(member => (
                                    <div key={member.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center shrink-0">
                                            <HugeiconsIcon icon={User} size={20} strokeWidth={2} className="text-slate-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{member.name}</h4>
                                            <p className="text-xs text-slate-500">{member.role}</p>
                                            <p className="text-xs text-slate-600 mt-1">{member.department?.name}{member.department?.school?.name ? `, ${member.department.school.name}` : ''}</p>
                                            {member.email && <p className="text-xs text-slate-500 mt-1">{member.email}</p>}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full text-center py-8 text-slate-500">No faculty members found</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ================= PROFILE ================= */}
                    {currentPage === 'profile' && (
                        <div>
                            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm mb-6">
                                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">My Profile & Contact Information</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="flex flex-col items-center text-center border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-8">
                                        <div className="relative group cursor-pointer mb-3">
                                            <div className="w-28 h-28 rounded-full border-2 border-slate-300 bg-slate-100 flex items-center justify-center">
                                                <HugeiconsIcon icon={User} size={40} strokeWidth={2} className="text-slate-400" />
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-slate-900 text-base">{profileForm.fullName}</h4>
                                        <p className="text-xs text-slate-500">Student ID: {studentId}</p>
                                        <p className="text-xs text-slate-600 mt-1">Cannoga College — {programName}</p>
                                    </div>
                                    <div className="lg:col-span-2 space-y-4">
                                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Edit Contact Info</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                            <div>
                                                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                                                <input type="text" value={profileForm.fullName} readOnly className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded p-2 text-xs cursor-not-allowed" />
                                            </div>
                                            <div>
                                                <label className="block font-semibold text-slate-700 mb-1">Preferred Name</label>
                                                <input type="text" value={profileForm.preferredName} readOnly className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded p-2 text-xs cursor-not-allowed" />
                                            </div>
                                            <div>
                                                <label className="block font-semibold text-slate-700 mb-1">Student Email</label>
                                                <input type="email" value={profile?.email || ''} readOnly className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded p-2 text-xs cursor-not-allowed" />
                                            </div>
                                            <div>
                                                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                                                <input type="tel" value={profileForm.phone} readOnly className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded p-2 text-xs cursor-not-allowed" />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="block font-semibold text-slate-700 mb-1">Mailing Address</label>
                                                <input type="text" value={profileForm.address} readOnly className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded p-2 text-xs cursor-not-allowed" />
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-slate-100">
                                            <p className="text-xs text-slate-500">Contact the registrar office to update profile information.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
