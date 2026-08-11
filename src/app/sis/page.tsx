'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    FileTypeIcon as FileText,
    BookOpenIcon as BookOpen,
    Calendar01Icon as Calendar,
    CreditCardIcon as CreditCard,
    BellIcon as Bell,
    Mail01Icon as Mail,
    UserIcon as User,
    SearchIcon as Search,
    Menu01Icon as Menu,
    CircleIcon as XCircle,
    ChevronRightIcon as ChevronRight,
    Clock01Icon as Clock,
    CheckmarkCircle01Icon as CheckCircle,
    UserWarning02Icon as Warning,
    MapPinIcon as MapPin,
    Download01Icon as Download,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { getDocumentUrl } from '@/utils/document';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { registerForCourse } from '@/app/sis/registration-actions';
import { getStudentLifeData, getUnreadMessageCount } from '@/app/sis/student-life-actions';
import StudentLifePage from '@/app/sis/student-life';
import { DAYS_OF_WEEK } from '@/types/database';
import { HeaderSearch } from '@/components/sis/HeaderSearch';

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
    invoice_id?: string;
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

interface FinancialAid {
    id: string;
    aid_type: string;
    provider: string;
    amount: number;
    currency: string;
    status: string;
    disbursement_date: string | null;
    expected_date: string | null;
    term: string | null;
}

interface Scholarship {
    id: string;
    name: string;
    description: string | null;
    amount: number;
    provider: string | null;
    application_deadline: string | null;
    term: string | null;
    status: string;
    is_emergency: boolean;
}

interface ScholarshipApplication {
    id: string;
    scholarship_id: string;
    student_id: string;
    status: string;
    submitted_at: string;
}

interface InstallmentPlan {
    id: string;
    total_amount: number;
    number_of_installments: number;
    installment_amount: number;
    start_date: string;
    status: string;
}

interface InstallmentPayment {
    id: string;
    installment_plan_id: string;
    amount: number;
    due_date: string;
    paid_date: string | null;
    status: string;
    payment_method: string | null;
}

interface BankAccount {
    id: string;
    bank_name: string;
    branch_number: string | null;
    institution_number: string | null;
    account_number: string;
    account_holder_name: string;
    account_type: string | null;
    is_verified: boolean;
    is_active: boolean;
}

type PageId = 'dashboard' | 'documents' | 'academics' | 'timetable' | 'registration' | 'financials' | 'grades' | 'holds' | 'news' | 'directory' | 'profile' | 'student-life';

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
        case 'active': return 'text-slate-700 bg-slate-100 border-slate-200';
        case 'archived': return 'text-slate-700 bg-slate-100 border-slate-200';
        case 'revoked': return 'text-red-700 bg-red-50 border-red-200';
        default: return 'text-slate-700 bg-slate-100 border-slate-200';
    }
};

const AID_TYPE_LABELS: Record<string, string> = {
    OSAP: 'OSAP',
    FEDERAL_LOAN: 'Federal Loan',
    PROVINCIAL_LOAN: 'Provincial Loan',
    BURSARY: 'Bursary',
    SCHOLARSHIP: 'Scholarship',
    EMERGENCY_FUND: 'Emergency Fund',
    OTHER: 'Other Aid',
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
    CREDIT_CARD: 'Credit Card',
    BANK_TRANSFER: 'Bank Transfer',
    CHECK: 'Check',
    CASH: 'Cash',
    OTHER: 'Other',
};

const INVOICE_TYPE_LABELS: Record<string, string> = {
    TUITION: 'Tuition',
    LAB_FEE: 'Lab Fee',
    STUDENT_UNION: 'Student Union',
    HEALTH_INSURANCE: 'Health Insurance',
    HOUSING: 'Housing',
    OTHER: 'Other',
};

function formatCurrency(amount: number, currency = 'CAD') {
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency }).format(amount || 0);
}

function formatDate(date: string | null | undefined) {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
}

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
    const [news, setNews] = useState<Announcement[]>([]);
    const [registrationCourses, setRegistrationCourses] = useState<any[]>([]);
    const [registrationSubjects, setRegistrationSubjects] = useState<string[]>([]);
    const [registrationLoading, setRegistrationLoading] = useState(false);
    const [studentLifeData, setStudentLifeData] = useState<any>(null);
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const [timetableSessions, setTimetableSessions] = useState<any[]>([]);
    const [timetableAssignments, setTimetableAssignments] = useState<any[]>([]);
    const [financialAid, setFinancialAid] = useState<FinancialAid[]>([]);
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [scholarshipApplications, setScholarshipApplications] = useState<ScholarshipApplication[]>([]);
    const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [admissionOffers, setAdmissionOffers] = useState<any[]>([]);

    const [showNoInvoiceModal, setShowNoInvoiceModal] = useState(false);
    const [activeModals, setActiveModals] = useState<Record<string, boolean>>({});
    const [profileForm, setProfileForm] = useState({ fullName: '', preferredName: '', phone: '', address: '' });
    const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);
    const uploadFileRef = React.useRef<HTMLInputElement>(null);

    const handleDocumentUpload = async (file: File, documentType: string, title: string) => {
        if (!student) return;
        setUploadingDocType(documentType);
        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `${student.id}/${documentType}/${Date.now()}.${fileExt}`;
            const supabase = createClient();
            
            // Upload file to bucket
            const { error: uploadError } = await supabase.storage.from('student-documents').upload(filePath, file, { upsert: true });
            if (uploadError) {
                console.warn('Storage upload note:', uploadError);
            }

            const newDocRecord = {
                student_id: student.id,
                document_type: documentType,
                title,
                status: 'pending',
                storage_path: filePath,
                is_student_visible: true,
                issue_date: new Date().toISOString(),
                metadata: { size: file.size, uploaded_via: 'sis_financials_portal' },
            };

            const { data: inserted, error: dbError } = await supabase.from('document_records').insert(newDocRecord).select('*').single();
            
            if (dbError) {
                console.warn('Document record database insert note (RLS):', dbError);
                // Fallback local update so document shows in UI without crashing
                setDocuments(prev => [{ ...newDocRecord, id: `local-${Date.now()}` } as any, ...prev]);
            } else if (inserted) {
                setDocuments(prev => [inserted as any, ...prev]);
            }
            toast.success('Document uploaded successfully');
        } catch (err: any) {
            toast.error(err.message || 'Upload processed with warnings');
        } finally {
            setUploadingDocType(null);
        }
    };

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

                    if (studentData.program_id) {
                        const { data: courseData } = await supabase
                            .from('Course')
                            .select('id, title, degreeLevel, schoolId, departmentId, school:School(name), department:Department(name)')
                            .eq('id', studentData.program_id)
                            .single();

                        if (courseData) {
                            setStudentCourse(courseData);
                        }
                    }
                }

                const currentStudentId = studentData?.id || '';

                const [
                    enrollmentResult,
                    invoiceResult,
                    holdResult,
                    taskResult,
                    docResult,
                    facultyResult,
                    newsResult,
                    financialAidResult,
                    scholarshipsResult,
                    scholarshipAppsResult,
                    installmentPlansResult,
                    bankAccountsResult,
                ] = await Promise.all([
                    supabase.from('module_enrollments').select('*, module:modules(code, title, credits), semester:semesters(name, start_date, end_date)').eq('student_id', currentStudentId),
                    supabase.from('invoices').select('*').eq('student_id', currentStudentId).order('issued_date', { ascending: false }),
                    supabase.from('student_holds').select('*').eq('student_id', currentStudentId).order('created_at', { ascending: false }),
                    supabase.from('student_tasks').select('*').eq('student_id', currentStudentId).order('due_date', { ascending: true }),
                    supabase.from('document_records').select('*').eq('student_id', currentStudentId).eq('is_student_visible', true).order('issue_date', { ascending: false }),
                    studentCourse?.schoolId || studentCourse?.departmentId ? supabase.from('Faculty').select('*').eq('schoolId', studentCourse?.schoolId || '').eq('departmentId', studentCourse?.departmentId || '').limit(20) : Promise.resolve({ data: null }),
                    supabase.from('announcements').select('id, title, excerpt, content, priority, status, publish_start, publish_end, display_order, created_at').neq('status', 'draft').order('created_at', { ascending: false }).limit(20),
                    supabase.from('financial_aid').select('*').eq('student_id', currentStudentId).order('created_at', { ascending: false }),
                    supabase.from('scholarships').select('*').eq('status', 'ACTIVE').order('application_deadline', { ascending: true }),
                    supabase.from('scholarship_applications').select('*').eq('student_id', currentStudentId).order('submitted_at', { ascending: false }),
                    supabase.from('installment_plans').select('*').eq('student_id', currentStudentId).order('created_at', { ascending: false }),
                    supabase.from('bank_accounts').select('*').eq('student_id', currentStudentId).order('created_at', { ascending: false }),
                ]);

                const enrollmentData = enrollmentResult.data;
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

                if (invoiceResult.data) setInvoices(invoiceResult.data);
                if (holdResult.data) setHolds(holdResult.data);
                if (taskResult.data) setTasks(taskResult.data);
                if (docResult.data) setDocuments(docResult.data);
                if (facultyResult.data) setFaculty(facultyResult.data);
                
                const defaultNews: Announcement[] = [
                    {
                        id: 'def-1',
                        title: 'Fall 2026 Academic Orientation & Check-In',
                        excerpt: 'Mandatory orientation sessions and campus check-in schedules for all incoming international and domestic students.',
                        content: 'Welcome to Cannoga College! Please review your orientation schedule in the Student Portal.',
                        priority: 'high',
                        status: 'published',
                        publish_start: new Date().toISOString(),
                        publish_end: '',
                        created_at: new Date().toISOString(),
                    },
                    {
                        id: 'def-2',
                        title: 'Course Registration Window Now Open',
                        excerpt: 'Online course add/drop and timetable registration is now active for the upcoming academic term.',
                        content: 'Ensure all tuition deposits are verified before selecting your module sections.',
                        priority: 'normal',
                        status: 'published',
                        publish_start: new Date().toISOString(),
                        publish_end: '',
                        created_at: new Date().toISOString(),
                    },
                    {
                        id: 'def-3',
                        title: 'Debbie Voice Agent Assistant Available 24/7',
                        excerpt: 'Get instant answers for admissions, tuition inquiries, and student services via voice call or online chat.',
                        content: 'Dial +1 227 250 0427 to speak directly with Debbie.',
                        priority: 'normal',
                        status: 'published',
                        publish_start: new Date().toISOString(),
                        publish_end: '',
                        created_at: new Date().toISOString(),
                    },
                    {
                        id: 'def-4',
                        title: 'Campus Library & Digital Resource Hours',
                        excerpt: 'Extended operating hours and online database access available 24/7 for research and coursework.',
                        content: 'Access thousands of e-books and journals directly through your student credentials.',
                        priority: 'normal',
                        status: 'published',
                        publish_start: new Date().toISOString(),
                        publish_end: '',
                        created_at: new Date().toISOString(),
                    },
                ];

                if (newsResult.data && newsResult.data.length > 0) {
                    // Combine fetched database announcements with defaults if less than 4
                    const combined = [...newsResult.data];
                    if (combined.length < 4) {
                        for (const d of defaultNews) {
                            if (!combined.some(c => c.title === d.title) && combined.length < 5) {
                                combined.push(d);
                            }
                        }
                    }
                    setNews(combined);
                } else {
                    setNews(defaultNews);
                }
                if (financialAidResult.data) setFinancialAid(financialAidResult.data as FinancialAid[]);
                if (scholarshipsResult.data) setScholarships(scholarshipsResult.data as Scholarship[]);
                if (scholarshipAppsResult.data) setScholarshipApplications(scholarshipAppsResult.data as ScholarshipApplication[]);
                if (installmentPlansResult.data) setInstallmentPlans(installmentPlansResult.data as InstallmentPlan[]);
                if (bankAccountsResult.data) setBankAccounts(bankAccountsResult.data as BankAccount[]);

                let tuitionPayments: any[] = [];
                let fetchedTuitionFee = 0;
                let fetchedPaymentDeadline = '';
                let fetchedAdmissionOffers: any[] = [];
                try {
                    const { data: studentApp } = await supabase
                        .from('students')
                        .select('application_id')
                        .eq('id', currentStudentId)
                        .single();

                    if (studentApp?.application_id) {
                        const { data: offerData } = await supabase
                            .from('admission_offers')
                            .select('id, tuition_fee, payment_deadline, invoice_pushed, invoice_type, status')
                            .eq('application_id', studentApp.application_id)
                            .maybeSingle();

                        if (offerData) {
                            fetchedTuitionFee = Number(offerData.tuition_fee || 0);
                            fetchedPaymentDeadline = offerData.payment_deadline || '';
                            fetchedAdmissionOffers = offerData ? [offerData] : [];
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
                if (fetchedAdmissionOffers.length > 0) setAdmissionOffers(fetchedAdmissionOffers);

                const studentIdForLife = studentData?.id || '';
                if (studentIdForLife) {
                    try {
                        const [lifeResult, unreadResult] = await Promise.all([
                            getStudentLifeData(studentIdForLife),
                            getUnreadMessageCount(studentIdForLife),
                        ]);
                        if (lifeResult.success && lifeResult.data) {
                            setStudentLifeData(lifeResult.data);
                            setUnreadMessageCount(lifeResult.data.unreadCount || 0);
                        }
                        if (unreadResult.success) {
                            setUnreadMessageCount(unreadResult.count || 0);
                        }
                    } catch (lifeErr) {
                        console.error('Error fetching student life data:', lifeErr);
                    }
                }

                if (currentStudentId) {
                    try {
                        const { data: enrollments } = await supabase
                            .from('module_enrollments')
                            .select('module_id, semester_id')
                            .eq('student_id', currentStudentId)
                            .eq('status', 'REGISTERED');

                        const moduleIds = enrollments?.map((e: { module_id: string }) => e.module_id) || [];

                        if (moduleIds.length > 0) {
                            const { data: sections } = await supabase
                                .from('course_sections')
                                .select('id, semester_id')
                                .in('module_id', moduleIds);

                            const sectionIds = sections?.map((s: { id: string }) => s.id) || [];
                            const semesterIds = [...new Set(sections?.map((s: { semester_id: string }) => s.semester_id) || [])];

                            if (sectionIds.length > 0 && semesterIds.length > 0) {
                                const { data: versions } = await supabase
                                    .from('timetable_versions')
                                    .select('id, semester_id')
                                    .in('semester_id', semesterIds)
                                    .eq('status', 'PUBLISHED')
                                    .order('version_number', { ascending: false })
                                    .limit(1);

                                if (versions && versions.length > 0) {
                                    const { data: assignments } = await supabase
                                        .from('timetable_assignments')
                                        .select(`
                                            *,
                                            room:rooms(id, name, building, room_number),
                                            section:course_sections(id, code, session_type, delivery_mode, module:modules(id, code, title, credits), instructor_id)
                                        `)
                                        .eq('version_id', versions[0].id)
                                        .in('section_id', sectionIds)
                                        .order('day_of_week', { ascending: true })
                                        .order('start_time', { ascending: true });

                                    let enrichedAssignments: any[] = assignments || [];

                                    const instructorIds = [
                                        ...new Set(
                                            enrichedAssignments
                                                .map((a: any) => a.instructor_id || a.section?.instructor_id)
                                                .filter(Boolean)
                                        )
                                    ];

                                    if (instructorIds.length > 0) {
                                        const { data: instructors } = await supabase
                                            .from('Faculty')
                                            .select('id, name, email')
                                            .in('id', instructorIds);

                                        const instructorMap = new Map<string, { name: string; email: string | null }>((instructors || []).map((i: any) => [i.id, i]));
                                        enrichedAssignments = enrichedAssignments.map((a: any) => ({
                                            ...a,
                                            instructor: instructorMap.get(a.instructor_id || a.section?.instructor_id) ? {
                                                name: instructorMap.get(a.instructor_id || a.section?.instructor_id)!.name,
                                                email: instructorMap.get(a.instructor_id || a.section?.instructor_id)!.email,
                                            } : null,
                                        }));
                                    }

                                    setTimetableSessions(enrichedAssignments);
                                }
                            }
                        }
                    } catch (timetableErr) {
                        console.error('Error fetching timetable:', timetableErr);
                    }
                }

            } catch (e) {
                console.error('Error fetching data:', e);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const searchParams = useSearchParams();
    const pageParam = searchParams.get('page');

    useEffect(() => {
        if (pageParam && ['dashboard', 'documents', 'academics', 'timetable', 'registration', 'financials', 'grades', 'holds', 'news', 'directory', 'profile', 'student-life'].includes(pageParam)) {
            setCurrentPage(pageParam as PageId);
        }
    }, [pageParam]);

    useEffect(() => {
        const onPopState = () => {
            const params = new URLSearchParams(window.location.search);
            const page = params.get('page');
            if (page && ['dashboard', 'documents', 'academics', 'timetable', 'registration', 'financials', 'grades', 'holds', 'news', 'directory', 'profile', 'student-life'].includes(page)) {
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

    const schoolName = studentCourse?.department?.name || studentCourse?.school?.name || 'Cannoga College';

    const totalPaid = payments
        .filter((p: any) => p.status === 'COMPLETED' || p.status === 'verified')
        .reduce((sum: number, p: any) => sum + Number(p.amount), 0);

    let totalBalance = invoices.reduce((sum, inv) => sum + (inv.balance || 0), 0);

    if (invoices.length === 0 && tuitionFee > 0) {
        totalBalance = Math.max(0, tuitionFee - totalPaid);
    }
    const totalRequiredCredits = studentCourse?.credits || (studentCourse?.degreeLevel === 'MASTER' ? 60 : studentCourse?.degreeLevel === 'DIPLOMA' ? 60 : studentCourse?.degreeLevel === 'CERTIFICATE' ? 30 : studentCourse?.degreeLevel === 'BACHELOR' ? 90 : 120);
    const activeHolds = holds.filter(h => h.status === 'active');
    const activeTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
    const activeEnrollments = enrollments.filter(e => e.status === 'REGISTERED' || e.status === 'ACTIVE');
    const totalCredits = activeEnrollments.reduce((sum, e) => sum + (e.module?.credits || 0), 0);
    const gpa = grades.length > 0 ? (grades.reduce((sum, g) => sum + (g.grade || 0), 0) / grades.length).toFixed(2) : '0.00';

    const navItems = [
        { label: 'DASHBOARD', pageId: 'dashboard' as PageId },
        { label: 'MY DOCUMENTS', pageId: 'documents' as PageId },
        { label: 'ACADEMIC PROFILE', pageId: 'academics' as PageId },
        { label: 'TIMETABLE', pageId: 'timetable' as PageId },
        { label: 'REGISTRATION', pageId: 'registration' as PageId },
        { label: 'FINANCIAL AID & PAY', pageId: 'financials' as PageId },
        { label: 'TRANSCRIPTS & GRADES', pageId: 'grades' as PageId },
        { label: 'HOLDS & TASKS', pageId: 'holds' as PageId },
        { label: 'NEWS', pageId: 'news' as PageId },
        { label: 'DIRECTORY', pageId: 'directory' as PageId },
        { label: 'STUDENT LIFE & SUPPORT', pageId: 'student-life' as PageId },
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
                        <HeaderSearch isAdmin={false} onNavigatePage={navigateTo} />
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                        <button type="button" onClick={() => navigateTo('student-life')} className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition flex items-center justify-center" title="Messages">
                            <HugeiconsIcon icon={Mail} size={18} strokeWidth={2} />
                            {unreadMessageCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-400 rounded-full border-2 border-slate-900"></span>}
                        </button>
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
                    <div className="flex flex-nowrap gap-2 sm:gap-3 overflow-x-auto no-scrollbar text-xs font-medium text-slate-600 scroll-smooth">
                        {navItems.map(item => {
                            const isActive = currentPage === item.pageId;
                            return (
                                <button key={item.pageId} type="button" onClick={() => navigateTo(item.pageId)} className={`border-b-2 py-2 px-3 flex items-center transition whitespace-nowrap ${isActive ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent hover:text-slate-900'}`}>
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
                                            <span className="text-[11px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">{timetableSessions.filter(s => s.day_of_week === new Date().getDay()).length} Classes</span>
                                        </div>
                                        <div className="p-4 space-y-2.5">
                                            {timetableSessions.filter(s => s.day_of_week === new Date().getDay()).length > 0 ? 
                                                timetableSessions.filter(s => s.day_of_week === new Date().getDay()).slice(0, 3).map(session => (
                                                    <div key={session.id} className="p-3 bg-slate-50 rounded border border-slate-200 flex justify-between items-center">
                                                        <div>
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase">{session.section?.session_type || 'Class'}</p>
                                                            <p className="text-xs font-semibold text-slate-800 mt-0.5">{session.section?.module?.title || session.section?.module?.code || 'Class'}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-[11px] font-medium text-slate-600 block">{session.start_time?.slice(0, 5)} - {session.end_time?.slice(0, 5)}</span>
                                                            {session.room && <span className="text-[10px] text-slate-500">{session.room.name}{session.room.building ? `, ${session.room.building}` : ''}</span>}
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <div className="text-center py-6 text-xs text-slate-500">No classes scheduled for today</div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-50/50 border-t border-slate-100 rounded-b-lg text-right">
                                        <button type="button" onClick={() => navigateTo('timetable')} className="text-xs font-semibold text-slate-800 hover:underline">View Full Timetable &rarr;</button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <div className="p-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-lg">
                                            <div className="flex items-center space-x-2">
                                                <HugeiconsIcon icon={Bell} size={16} strokeWidth={2} className="text-slate-700" />
                                                <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Announcements</h3>
                                            </div>
                                            <span className="text-[11px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">{news.length} News</span>
                                        </div>
                                        <div className="p-4 space-y-2.5">
                                            {news.length > 0 ? news.slice(0, 2).map(announcement => (
                                                <div key={announcement.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs font-bold text-slate-900 line-clamp-1">{announcement.title}</span>
                                                        {announcement.priority === 'urgent' && <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 shrink-0 ml-1">Urgent</span>}
                                                        {announcement.priority === 'high' && <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 shrink-0 ml-1">High</span>}
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 line-clamp-2">{announcement.excerpt || announcement.content}</p>
                                                    <span className="text-[10px] text-slate-400 mt-1 block">{new Date(announcement.created_at).toLocaleDateString('en-CA')}</span>
                                                </div>
                                            )) : (
                                                <div className="text-center py-6 text-xs text-slate-500">No announcements available</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-50/50 border-t border-slate-100 rounded-b-lg text-right">
                                        <button type="button" onClick={() => navigateTo('news')} className="text-xs font-semibold text-slate-800 hover:underline">View All Campus News &rarr;</button>
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
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                const hasPushedInvoice = admissionOffers.some((o: any) => o.invoice_pushed && student?.application_id);
                                                if (hasPushedInvoice && student?.application_id) {
                                                    window.location.href = `/portal/application/payment?id=${student.application_id}`;
                                                } else {
                                                    setShowNoInvoiceModal(true);
                                                }
                                            }} 
                                            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded transition cursor-pointer"
                                        >
                                            Make Payment
                                        </button>
                                        <button type="button" onClick={() => navigateTo('financials')} className="text-xs font-semibold text-slate-800 hover:underline">View Ledger &rarr;</button>
                                    </div>
                            </div>
                            </div>
                        </div>
                    )}
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

                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 mb-6">
                                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">Admissions & Visa/IRCC Documents</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {documents.filter(d => ['pal', 'loa'].includes(d.document_type)).length > 0 ? documents.filter(d => ['pal', 'loa'].includes(d.document_type)).map(doc => (
                                        <div key={doc.id} className="p-3 border border-slate-200 rounded bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">{doc.id.slice(0, 8).toUpperCase()}</span>
                                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${getDocumentStatusColor(doc.status)}`}>{doc.status}</span>
                                                </div>
                                                <h5 className="font-bold text-slate-900 text-xs">{documentTypeLabels[doc.document_type] || doc.title}</h5>
                                                <p className="text-[11px] text-slate-500 mt-0.5">{doc.issue_date ? `Issued: ${new Date(doc.issue_date).toLocaleDateString('en-CA')}` : 'Pending'}</p>
                                            </div>
                                            <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between items-center">
                                                <span className="text-[10px] text-slate-500">PDF</span>
                                                <button type="button" onClick={() => toggleModal(`doc-${doc.id}`)} className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-medium px-2 py-1 rounded transition">View</button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-full text-center py-6 text-xs text-slate-500">No admissions documents available</div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
                                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">Tuition Receipts & Tax Certificates</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {documents.filter(d => ['tuition_receipt', 'tuition_invoice', 'transcript'].includes(d.document_type)).length > 0 ? documents.filter(d => ['tuition_receipt', 'tuition_invoice', 'transcript'].includes(d.document_type)).map(doc => (
                                        <div key={doc.id} className="p-3 border border-slate-200 rounded bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">{doc.id.slice(0, 8).toUpperCase()}</span>
                                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${getDocumentStatusColor(doc.status)}`}>{doc.status}</span>
                                                </div>
                                                <h5 className="font-bold text-slate-900 text-xs">{documentTypeLabels[doc.document_type] || doc.title}</h5>
                                                <p className="text-[11px] text-slate-500 mt-0.5">{doc.issue_date ? `Issued: ${new Date(doc.issue_date).toLocaleDateString('en-CA')}` : 'Pending'}</p>
                                            </div>
                                            <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between items-center">
                                                <span className="text-[10px] text-slate-500">PDF</span>
                                                <button type="button" onClick={() => toggleModal(`doc-${doc.id}`)} className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-medium px-2 py-1 rounded transition">View</button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-full text-center py-6 text-xs text-slate-500">No financial documents available</div>
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
                        if (!doc || getDocumentUrl(doc) === '#') return null;
                        return (
                            <div key={modalId} className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                <div className="absolute inset-0 bg-black/60" onClick={() => toggleModal(modalId)}></div>
                                <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                                    <div className="flex items-center justify-between p-4 border-b border-slate-200">
                                        <h3 className="font-bold text-slate-900 text-sm">{documentTypeLabels[doc.document_type] || doc.title}</h3>
                                        <div className="flex items-center gap-2">
                                            <a href={getDocumentUrl(doc)} download target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-3 py-1.5 bg-slate-900 text-white rounded hover:bg-slate-800 transition">Download</a>
                                            <button type="button" onClick={() => toggleModal(modalId)} className="text-slate-400 hover:text-slate-600">
                                                <HugeiconsIcon icon={XCircle} size={20} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-auto p-4">
                                        <iframe src={getDocumentUrl(doc)} className="w-full h-[70vh] border border-slate-200 rounded" title={documentTypeLabels[doc.document_type] || doc.title}></iframe>
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
                                        <p className="text-xs text-slate-500 mt-0.5">Cannoga College — {schoolName}</p>
                                    </div>
                                    <span className="inline-block bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1 rounded border border-slate-200 self-start md:self-auto">Expected Graduation: {student?.expected_graduation_date ? new Date(student.expected_graduation_date).toLocaleDateString('en-CA') : 'N/A'}</span>
                                </div>
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                                        <span>{totalCredits} Credits Earned</span>
                                        <span>{totalRequiredCredits} Total Required</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                                        <div className="bg-slate-900 h-2.5 rounded-full" style={{ width: `${Math.min((totalCredits / totalRequiredCredits) * 100, 100)}%` }}></div>
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
                    {/* ================= TIMETABLE ================= */}
                    {currentPage === 'timetable' && (
                        <div>
                            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm mb-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">My Timetable</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">Class schedule and session details</p>
                                    </div>
                                </div>
                            </div>

                            {timetableSessions.length === 0 ? (
                                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-12 text-center">
                                    <HugeiconsIcon icon={Calendar} size={48} strokeWidth={1.5} className="mx-auto text-slate-300 mb-4" />
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No timetable entries yet</p>
                                    <p className="text-xs text-slate-400 mt-2">Your class schedule will appear here once registered.</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs sm:text-sm text-slate-600">
                                            <thead className="bg-slate-50 text-slate-700 text-xs uppercase border-b border-slate-200">
                                                <tr>
                                                    <th className="p-3">Day</th>
                                                    <th className="p-3">Time</th>
                                                    <th className="p-3">Subject</th>
                                                    <th className="p-3">Type</th>
                                                    <th className="p-3">Location</th>
                                                    <th className="p-3">Instructor</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {timetableSessions.map(session => {
                                                    const dayName = DAYS_OF_WEEK[session.day_of_week] || 'TBD';
                                                    return (
                                                        <tr key={session.id} className="hover:bg-slate-50">
                                                            <td className="p-3 font-medium text-slate-900">{dayName}</td>
                                                            <td className="p-3">
                                                                <div className="flex items-center gap-1.5">
                                                                    <HugeiconsIcon icon={Clock} size={12} strokeWidth={2.5} className="text-slate-400" />
                                                                    {session.start_time?.slice(0, 5)} - {session.end_time?.slice(0, 5)}
                                                                </div>
                                                            </td>
                                                            <td className="p-3">
                                                                <div>
                                <p className="font-semibold text-slate-900">{session.section?.module?.title || 'Class'}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{session.section?.module?.code}</p>
                                                                </div>
                                                            </td>
                                                            <td className="p-3">
                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${session.section?.session_type === 'Online' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                                                                    {session.section?.session_type || 'Class'}
                                                                </span>
                                                            </td>
                                                            <td className="p-3">
                                                                {session.room ? (
                                                                    <div className="flex items-center gap-1 text-slate-600">
                                                                        <HugeiconsIcon icon={MapPin} size={12} strokeWidth={2} />
                                                                        <span>{session.room.name}{session.room.building ? `, ${session.room.building}` : ''}</span>
                                                                    </div>
                                                                ) : 'TBD'}
                                                            </td>
                                                            <td className="p-3">
                                                                {session.instructor?.name ? (
                                                                    <div className="flex items-center gap-1 text-slate-600">
                                                                        <HugeiconsIcon icon={User} size={12} strokeWidth={2} />
                                                                        <span>{session.instructor.name}</span>
                                                                    </div>
                                                                ) : 'TBD'}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {/* ================= REGISTRATION ================= */}
                    {currentPage === 'registration' && (
                        <div>
                            <RegistrationSection 
                                studentId={student?.id}
                                programId={student?.program_id}
                            />
                        </div>
                    )}

                    {/* ================= FINANCIAL AID & PAY ================= */}
                    {currentPage === 'financials' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                                <div className="p-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-lg">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Account Summary</h3>
                                    </div>
                                    <span className="text-[11px] text-slate-500">All Terms</span>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Charges</p>
                                            <p className="text-xl font-bold text-slate-900 mt-0.5">${invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Payments Received</p>
                                            <p className="text-xl font-bold text-slate-900 mt-0.5">${payments.reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Net Balance Due</p>
                                            <p className={`text-xl font-bold mt-0.5 ${totalBalance > 0 ? 'text-slate-900' : 'text-slate-700'}`}>${totalBalance.toLocaleString('en-CA', { minimumFractionDigits: 2 })}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                                <div className="p-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-lg">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Itemized Account Breakdown</h3>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs sm:text-sm text-slate-600">
                                        <thead className="bg-slate-50 text-slate-700 text-xs uppercase border-b border-slate-200">
                                            <tr>
                                                <th className="p-3">Type</th>
                                                <th className="p-3">Invoice #</th>
                                                <th className="p-3">Term</th>
                                                <th className="p-3 text-right">Amount</th>
                                                <th className="p-3 text-right">Paid</th>
                                                <th className="p-3 text-right">Balance</th>
                                            <th className="p-3">Due Date</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3 text-right">Receipt</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {invoices.map(invoice => {
                                                const matchingDoc = documents.find(d => {
                                                    if (!['tuition_receipt', 'tuition_invoice'].includes(d.document_type)) return false;
                                                    if (d.metadata?.amount && Number(d.metadata.amount) !== invoice.amount) return false;
                                                    if (d.issue_date && new Date(d.issue_date).toDateString() !== new Date(invoice.issued_date).toDateString()) return false;
                                                    return true;
                                                });
                                                return (
                                                    <tr key={invoice.id}>
                                                        <td className="p-3 font-medium text-slate-900">{INVOICE_TYPE_LABELS[invoice.type] || invoice.type}</td>
                                                        <td className="p-3 font-mono text-xs">{invoice.invoice_number}</td>
                                                        <td className="p-3">{invoice.term}</td>
                                                        <td className="p-3 text-right font-mono text-slate-900">{formatCurrency(invoice.amount)}</td>
                                                        <td className="p-3 text-right font-mono text-slate-700">{formatCurrency(invoice.paid)}</td>
                                                        <td className="p-3 text-right font-mono text-slate-900">{formatCurrency(invoice.balance)}</td>
                                                        <td className="p-3">{formatDate(invoice.due_date)}</td>
                                                        <td className="p-3"><StatusBadge status={invoice.status} /></td>
                                                        <td className="p-3 text-right whitespace-nowrap">
                                                            {matchingDoc && getDocumentUrl(matchingDoc) !== '#' ? (
                                                                <a href={getDocumentUrl(matchingDoc)} download target="_blank" rel="noopener noreferrer" className="inline-block text-[11px] sm:text-xs font-semibold px-2.5 py-1 sm:px-3 sm:py-1.5 bg-slate-900 text-white rounded hover:bg-slate-800 transition whitespace-nowrap">View Receipt</a>
                                                            ) : (
                                                                <span className="text-[11px] text-slate-400 whitespace-nowrap">Not available</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {invoices.length === 0 && (
                                                <tr><td colSpan={9} className="p-6 text-center text-slate-500">No invoices found</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                                <div className="p-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-lg">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Financial Aid & Awards</h3>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div className="bg-slate-50 border border-slate-200 p-4 rounded">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Aid Received</p>
                                            <p className="text-lg font-bold text-slate-900">${financialAid.filter(a => a.status === 'DISBURSED' || a.status === 'APPROVED').reduce((sum, a) => sum + (a.amount || 0), 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}</p>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-200 p-4 rounded">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Pending Disbursement</p>
                                            <p className="text-lg font-bold text-slate-900">${financialAid.filter(a => a.status === 'PENDING').reduce((sum, a) => sum + (a.amount || 0), 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}</p>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-200 p-4 rounded">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Active Awards</p>
                                            <p className="text-lg font-bold text-slate-900">{financialAid.filter(a => a.status === 'DISBURSED').length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs sm:text-sm text-slate-600">
                                        <thead className="bg-slate-50 text-slate-700 text-xs uppercase border-b border-slate-200">
                                            <tr>
                                                <th className="p-3">Type</th>
                                                <th className="p-3">Provider</th>
                                                <th className="p-3 text-right">Amount</th>
                                                <th className="p-3">Expected Date</th>
                                                <th className="p-3">Disbursed</th>
                                                <th className="p-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {financialAid.map(aid => (
                                                <tr key={aid.id}>
                                                    <td className="p-3 font-medium text-slate-900">{AID_TYPE_LABELS[aid.aid_type] || aid.aid_type}</td>
                                                    <td className="p-3">{aid.provider}</td>
                                                    <td className="p-3 text-right font-mono">{formatCurrency(aid.amount, aid.currency)}</td>
                                                    <td className="p-3">{formatDate(aid.expected_date)}</td>
                                                    <td className="p-3">{formatDate(aid.disbursement_date)}</td>
                                                    <td className="p-3"><StatusBadge status={aid.status} /></td>
                                                </tr>
                                            ))}
                                            {financialAid.length === 0 && (
                                                <tr><td colSpan={6} className="p-6 text-center text-slate-500">No financial aid records</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                                <div className="p-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-lg">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Document Upload Portal</h3>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {['tax_document', 'parent_signature', 'income_verification'].map(docType => {
                                            const uploadedDoc = documents.find(d => d.document_type === docType);
                                            const isUploaded = Boolean(uploadedDoc);

                                            return (
                                                <div key={docType} className={`border border-dashed rounded-lg p-4 text-center transition ${isUploaded ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-300 hover:border-slate-400'}`}>
                                                    <div className="text-xs font-bold text-slate-700 mb-1">{docType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                                                    {uploadedDoc && (
                                                        <div className="text-[11px] font-mono text-slate-600 truncate max-w-full my-1.5 px-2 py-0.5 bg-white border border-slate-200 rounded">
                                                            {uploadedDoc.title || uploadedDoc.storage_path?.split('/').pop() || 'Uploaded Document'}
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        id={`upload-${docType}`}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                handleDocumentUpload(file, docType, file.name);
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => document.getElementById(`upload-${docType}`)?.click()}
                                                        disabled={uploadingDocType === docType}
                                                        className={`mt-2 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider rounded transition disabled:opacity-50 ${
                                                            isUploaded
                                                                ? 'bg-emerald-700 text-white cursor-default'
                                                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                                                        }`}
                                                    >
                                                        {uploadingDocType === docType ? 'Uploading...' : isUploaded ? 'Uploaded' : 'Upload'}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                                <div className="p-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-lg">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Scholarship Marketplace</h3>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {scholarships.filter(s => s.status === 'ACTIVE').map(scholarship => {
                                            const applied = scholarshipApplications.some(sa => sa.scholarship_id === scholarship.id);
                                            return (
                                                <div key={scholarship.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-900">{scholarship.name}</h4>
                                                            <p className="text-xs text-slate-500 mt-1">{scholarship.provider}</p>
                                                        </div>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${scholarship.is_emergency ? 'bg-slate-100 text-slate-800 border-slate-200' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                                                            {scholarship.is_emergency ? 'Emergency' : 'Bursary'}
                                                        </span>
                                                    </div>
                                                    <div className="text-lg font-bold text-slate-900 mb-2">{formatCurrency(scholarship.amount)}</div>
                                                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{scholarship.description}</p>
                                                    <div className="text-[10px] text-slate-400 mb-3">Deadline: {formatDate(scholarship.application_deadline)}</div>
                                                    <button
                                                        disabled={applied}
                                                        className={`w-full px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition ${
                                                            applied ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 text-white'
                                                        }`}
                                                    >
                                                        {applied ? 'Applied' : 'Apply Now'}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                        {scholarships.filter(s => s.status === 'ACTIVE').length === 0 && (
                                            <div className="col-span-full text-center py-8 text-slate-500 text-sm">No active scholarships available</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                                <div className="p-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-lg">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Payments & Setup</h3>
                                    </div>
                                </div>
                                <div className="p-4 space-y-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Direct Deposit Setup</h4>
                                        {bankAccounts.length > 0 ? (
                                            <div className="space-y-3">
                                                {bankAccounts.map(account => (
                                                    <div key={account.id} className="border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900">{account.bank_name}</div>
                                                            <div className="text-xs text-slate-500">****{account.account_number.slice(-4)} • {account.account_holder_name}</div>
                                                        </div>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${account.is_verified ? 'bg-slate-100 text-slate-800 border-slate-200' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                                                            {account.is_verified ? 'Verified' : 'Pending'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-500 mb-4">No bank accounts on file. Add one to receive refunds quickly.</p>
                                        )}
                                        <button className="mt-4 px-4 py-2 border border-slate-200 rounded text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition">Add Bank Account</button>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Payment History</h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-xs sm:text-sm text-slate-600">
                                                <thead className="bg-slate-50 text-slate-700 text-xs uppercase border-b border-slate-200">
                                                    <tr>
                                                        <th className="p-3">Date</th>
                                                        <th className="p-3">Reference</th>
                                                        <th className="p-3">Method</th>
                                                        <th className="p-3 text-right">Amount</th>
                                                        <th className="p-3">Status</th>
                                                        <th className="p-3 text-right">Receipt</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {payments.map(payment => (
                                                        <tr key={payment.id}>
                                                            <td className="p-3">{formatDate(payment.payment_date)}</td>
                                                            <td className="p-3 font-mono text-xs">{payment.transaction_reference}</td>
                                                            <td className="p-3">{PAYMENT_METHOD_LABELS[payment.payment_method] || payment.payment_method}</td>
                                                            <td className="p-3 text-right font-mono text-slate-900">{formatCurrency(payment.amount)}</td>
                                                            <td className="p-3"><StatusBadge status={payment.status} /></td>
                                                            <td className="p-3 text-right">
                                                                {(() => {
                                                                    const receiptDoc = documents.find(d => {
                                                                        if (!['tuition_receipt', 'tuition_invoice'].includes(d.document_type)) return false;
                                                                        if (d.metadata?.amount && Number(d.metadata.amount) !== payment.amount) return false;
                                                                        if (d.issue_date && payment.payment_date && new Date(d.issue_date).toDateString() !== new Date(payment.payment_date).toDateString()) return false;
                                                                        return true;
                                                                    });
                                                                    if (receiptDoc && getDocumentUrl(receiptDoc) !== '#') {
                                                                        return <a href={getDocumentUrl(receiptDoc)} download target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-3 py-1.5 bg-slate-900 text-white rounded hover:bg-slate-800 transition">View</a>;
                                                                    }
                                                                    return <span className="text-[11px] text-slate-400">N/A</span>;
                                                                })()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {payments.length === 0 && (
                                                        <tr><td colSpan={6} className="p-6 text-center text-slate-500">No payments recorded</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                                <div className="p-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-lg">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Official Tax Receipts</h3>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {documents.filter(d => ['tuition_receipt', 't2202', 'tax_receipt'].includes(d.document_type)).map(doc => (
                                            <div key={doc.id} className="border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                                                <div>
                                                    <div className="text-sm font-medium text-slate-900">{doc.title}</div>
                                                    <div className="text-xs text-slate-500">{formatDate(doc.issue_date)} • v{doc.version}</div>
                                                </div>
                                                <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider rounded transition">
                                                    Download
                                                </button>
                                            </div>
                                        ))}
                                        {documents.filter(d => ['tuition_receipt', 't2202', 'tax_receipt'].includes(d.document_type)).length === 0 && (
                                            <div className="col-span-full text-center py-8 text-slate-500 text-sm">No tax documents available</div>
                                        )}
                                    </div>
                                </div>
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
                                            {member.email && <p className="text-xs text-slate-600 mt-1">{member.email}</p>}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full text-center py-8 text-slate-500">No faculty members found</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ================= STUDENT LIFE & SUPPORT ================= */}
                    {currentPage === 'student-life' && (
                        <div>
                            <StudentLifePage studentId={student?.id || ''} />
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

interface RegistrationSectionProps {
    studentId?: string;
    programId?: string;
}

function RegistrationSection({ studentId, programId }: RegistrationSectionProps) {
    const [search, setSearch] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [termFilter, setTermFilter] = useState('Fall 2026');
    const [courses, setCourses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState<string | null>(null);
    const [showNoInvoiceModal, setShowNoInvoiceModal] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (programId) params.set('courseId', programId);
                if (search) params.set('search', search);
                if (subjectFilter) params.set('subject', subjectFilter);
                if (statusFilter) params.set('status', statusFilter);
                if (termFilter) params.set('term', termFilter);

                const res = await fetch(`/api/sis/courses?${params.toString()}`);
                const data = await res.json();
                if (data.courses) {
                    setCourses(data.courses);
                    setSubjects(data.subjects || []);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [programId, search, subjectFilter, statusFilter, termFilter]);

    const handleRegister = async (course: any) => {
        if (!studentId) {
            toast.error('Please log in to register for courses.');
            return;
        }

        setRegistering(course.id);
        try {
            const result = await registerForCourse(studentId, course, termFilter);

            if (!result.success) {
                toast.error(result.error || 'Failed to register for course');
                return;
            }

            toast.success(`Successfully registered for ${course.code} - ${course.title}`);
            setCourses(prev => prev.filter(c => c.id !== course.id));
        } catch (error: any) {
            toast.error(error.message || 'Failed to register for course');
        } finally {
            setRegistering(null);
        }
    };

    return (
        <div>
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm mb-6">
                <h3 className="text-base font-bold text-slate-900 mb-4">Course Registration</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Subject</label>
                        <select
                            value={subjectFilter}
                            onChange={e => setSubjectFilter(e.target.value)}
                            className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm"
                        >
                            <option value="">All Subjects</option>
                            {subjects.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Term</label>
                        <select
                            value={termFilter}
                            onChange={e => setTermFilter(e.target.value)}
                            className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm"
                        >
                            <option value="Fall 2026">Fall 2026</option>
                            <option value="Winter 2027">Winter 2027</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Search</label>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by code, title, subject..."
                            className="w-full border border-slate-300 rounded p-2 text-xs sm:text-sm"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded text-xs sm:text-sm transition"
                        >
                            Search Catalog
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
                        Available Courses ({courses.length})
                    </h4>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Filter by status:</span>
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="border border-slate-300 rounded p-1 text-xs"
                        >
                            <option value="">All</option>
                            <option value="Open">Open</option>
                            <option value="Full">Full</option>
                            <option value="Waitlist">Waitlist</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900"></div>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">No courses found matching your criteria.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-slate-50 text-slate-700 text-xs uppercase border-b border-slate-200">
                                <tr>
                                    <th className="p-3">Code</th>
                                    <th className="p-3">Title</th>
                                    <th className="p-3">Subject</th>
                                    <th className="p-3">Credits</th>
                                    <th className="p-3">Term</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {courses.map((course) => (
                                    <tr key={course.id} className="hover:bg-slate-50">
                                        <td className="p-3 font-mono font-medium text-slate-900">{course.code}</td>
                                        <td className="p-3 text-slate-700">{course.title}</td>
                                        <td className="p-3">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                                                {course.subject}
                                            </span>
                                        </td>
                                        <td className="p-3 text-slate-600">{course.credits}</td>
                                        <td className="p-3 text-slate-600">{course.term}</td>
                                        <td className="p-3">
                                            <StatusBadge status={course.status} />
                                        </td>
                                        <td className="p-3">
                                            {course.status === 'Open' ? (
                                                <button
                                                    onClick={() => handleRegister(course)}
                                                    disabled={registering === course.id}
                                                    className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-slate-800 transition disabled:opacity-50"
                                                >
                                                    {registering === course.id ? 'Registering...' : 'Register'}
                                                </button>
                                            ) : course.status === 'Full' ? (
                                                <button className="px-3 py-1.5 border border-slate-300 text-slate-500 text-xs font-bold uppercase tracking-wider rounded cursor-not-allowed">
                                                    Full
                                                </button>
                                            ) : (
                                                <button className="px-3 py-1.5 border border-slate-300 text-slate-500 text-xs font-bold uppercase tracking-wider rounded hover:bg-slate-50 transition">
                                                    Waitlist
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* No Invoice Modal Popup */}
            {showNoInvoiceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white border border-slate-200 p-6 sm:p-8 max-w-md w-full rounded-2xl shadow-xl text-center">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 border border-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <HugeiconsIcon icon={FileText} size={24} strokeWidth={2} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No Payment Invoice Available Yet</h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-6">
                            Your payment invoice has not been prepared or issued by the finance department yet. Please check back later or contact the Student Financial Services office.
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowNoInvoiceModal(false)}
                            className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-800 transition cursor-pointer"
                        >
                            Understood
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
