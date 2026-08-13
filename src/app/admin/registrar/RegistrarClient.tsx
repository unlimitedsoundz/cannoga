
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
    ShieldCheck,
    Calendar,
    Gear as Settings,
    Users,
    ArrowRight,
    WarningCircle as AlertCircle,
    CheckCircle,
    Clock,
    Funnel as Filter,
    Pulse as Activity,
    Trash,
    CaretLeft as ChevronLeft,
    CaretRight as ChevronRight,
    CaretDoubleLeft as ChevronsLeft,
    CaretDoubleRight as ChevronsRight,
    CreditCard,
    X,
    CircleNotch as Loader2,
    MagnifyingGlass as Search,
    Plus
} from "@phosphor-icons/react/dist/ssr";
import { SearchField } from '@/components/ui/SearchField';
import {
    updateWindowStatus,
    saveWindow,
    saveSemester,
    updateSemesterStatus,
    finalizeGrade,
    updateStudentStatusRegistrar,
    saveSession,
    deleteSession,
    deleteWindow,
    deleteSemester
} from './actions';

interface RegistrarClientProps {
    semesters: any[];
    windows: any[];
    moduleStats: any[];
    provisionalGrades: any[];
    students: any[];
    buildings: any[];
    sessions: any[];
    auditLogs: any[];
    tuitionPayments?: any[];
}

export default function RegistrarClient({
    semesters,
    windows,
    moduleStats,
    provisionalGrades,
    students,
    buildings,
    sessions,
    auditLogs,
    tuitionPayments = []
}: RegistrarClientProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'windows' | 'enrollments' | 'grades' | 'students' | 'calendar' | 'housing' | 'audit' | 'timetable' | 'tuition'>('windows');
    const [searchTerm, setSearchTerm] = useState('');
    const [moduleSearchTerm, setModuleSearchTerm] = useState('');
    const [enrollmentPage, setEnrollmentPage] = useState(1);
    const [showSessionModal, setShowSessionModal] = useState(false);
    const [editingSession, setEditingSession] = useState<any>(null);
    const [sessionFormData, setSessionFormData] = useState({
        module_id: '',
        semester_id: '',
        day_of_week: 1,
        start_time: '09:00',
        end_time: '11:00',
        location_type: 'CAMPUS' as 'CAMPUS' | 'ONLINE',
        location_detail: ''
    });

    const [showSemesterModal, setShowSemesterModal] = useState(false);
    const [editingSemester, setEditingSemester] = useState<any>(null);
    const [semesterFormData, setSemesterFormData] = useState({
        name: '',
        start_date: '',
        end_date: '',
        status: 'UPCOMING' as 'ACTIVE' | 'COMPLETED' | 'UPCOMING'
    });

    const [showWindowModal, setShowWindowModal] = useState(false);
    const [editingWindow, setEditingWindow] = useState<any>(null);
    const [windowFormData, setWindowFormData] = useState({
        semester_id: '',
        status: 'CLOSED' as 'OPEN' | 'CLOSED',
        open_at: '',
        close_at: '',
        add_drop_deadline: ''
    });
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        setEnrollmentPage(1);
    }, [moduleSearchTerm]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleStatusUpdate = async (windowId: string, status: any) => {
        setIsLoading(true);
        try {
            await updateWindowStatus(windowId, status);
            window.location.reload();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinalizeGrade = async (enrollmentId: string) => {
        setIsLoading(true);
        try {
            await finalizeGrade(enrollmentId);
            window.location.reload();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStudentStatus = async (studentId: string, status: string) => {
        setIsLoading(true);
        try {
            await updateStudentStatusRegistrar(studentId, status);
            window.location.reload();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateSemesterStatus = async (semesterId: string, status: any) => {
        setIsLoading(true);
        try {
            await updateSemesterStatus(semesterId, status);
            window.location.reload();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveSemester = async () => {
        setIsLoading(true);
        try {
            await saveSemester(semesterFormData, editingSemester?.id);
            setShowSemesterModal(false);
            window.location.reload();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveWindow = async () => {
        setIsLoading(true);
        try {
            await saveWindow(windowFormData, editingWindow?.id);
            setShowWindowModal(false);
            window.location.reload();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveSession = async () => {
        setIsLoading(true);
        try {
            await saveSession(sessionFormData, editingSession?.id);
            setShowSessionModal(false);
            setEditingSession(null);
            setSessionFormData({
                module_id: '',
                semester_id: '',
                day_of_week: 1,
                start_time: '09:00',
                end_time: '11:00',
                location_type: 'CAMPUS',
                location_detail: ''
            });
            window.location.reload();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteWindow = async (id: string) => {
        if (!confirm('Are you sure you want to delete this registration window?')) return;
        setIsLoading(true);
        try {
            await deleteWindow(id);
            window.location.reload();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSemester = async (id: string) => {
        if (!confirm('Are you sure you want to delete this semester? This may affect linked data.')) return;
        setIsLoading(true);
        try {
            await deleteSemester(id);
            window.location.reload();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredStudents = students.filter(s =>
        s.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.institutional_email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tabs = [
        { id: 'windows', label: 'Windows', icon: Clock },
        { id: 'enrollments', label: 'Modules', icon: Activity },
        { id: 'grades', label: 'Grades', icon: ShieldCheck },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'calendar', label: 'Semester', icon: Calendar },
        { id: 'tuition', label: 'Tuition', icon: CreditCard },
        { id: 'timetable', label: 'Schedule', icon: Calendar },
        { id: 'housing', label: 'Housing', icon: Settings },
        { id: 'audit', label: 'Logs', icon: AlertCircle },
    ] as const;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center text-white">
                        <ShieldCheck size={32} weight="bold" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-neutral-400 font-bold text-[10px] uppercase tracking-widest mb-1">
                            Office of the Registrar
                        </div>
                        <h1 className="text-3xl font-bold text-neutral-900">Academic Administration</h1>
                    </div>
                </div>

                <div className="flex flex-wrap bg-neutral-100 p-1 rounded-xl overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'
                                }`}
                        >
                            <tab.icon size={14} weight={activeTab === tab.id ? "bold" : "regular"} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'windows' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-neutral-900">Registration Windows</h2>
                            <button
                                onClick={() => {
                                    setEditingWindow(null);
                                    setWindowFormData({
                                        semester_id: semesters[0]?.id || '',
                                        status: 'CLOSED',
                                        open_at: new Date().toISOString().split('T')[0],
                                        close_at: '',
                                        add_drop_deadline: ''
                                    });
                                    setShowWindowModal(true);
                                }}
                                className="px-4 py-2 bg-[#0a151a] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center gap-2"
                            >
                                <Plus size={14} weight="bold" /> Configure Window
                            </button>
                        </div>
                        <div className="space-y-4">
                            {windows.length === 0 ? (
                                <div className="bg-white border border-neutral-200 p-12 rounded-2xl text-center text-neutral-400 font-bold uppercase text-[10px] tracking-widest">
                                    No registration windows configured.
                                </div>
                            ) : (
                                windows.map(window => (
                                    <div key={window.id} className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm hover:border-neutral-300 transition-all relative group">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                                                    {(() => {
                                                        const name = window.semester?.name || '';
                                                        const year = window.semester?.start_date ? new Date(window.semester.start_date).getFullYear() : null;
                                                        return year && !name.includes(String(year)) ? `${name} ${year}` : name;
                                                    })()}
                                                </p>
                                                <h3 className="text-lg font-bold text-neutral-900">Course Selection Period</h3>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${window.status === 'OPEN' ? 'bg-blue-100 text-primary' : 'bg-neutral-100 text-neutral-500'}`}>
                                                    {window.status}
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setEditingWindow(window);
                                                        setWindowFormData({
                                                            semester_id: window.semester_id,
                                                            status: window.status,
                                                            open_at: window.open_at?.split('T')[0] || '',
                                                            close_at: window.close_at?.split('T')[0] || '',
                                                            add_drop_deadline: window.add_drop_deadline?.split('T')[0] || ''
                                                        });
                                                        setShowWindowModal(true);
                                                    }}
                                                    className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-all"
                                                >
                                                    <Settings size={16} weight="bold" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 border-y border-neutral-50">
                                            <div>
                                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Opens On</p>
                                                <p className="text-sm font-bold text-neutral-900">{window.open_at ? new Date(window.open_at).toLocaleDateString() : 'Not set'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Closes On</p>
                                                <p className="text-sm font-bold text-neutral-900">{window.close_at ? new Date(window.close_at).toLocaleDateString() : 'Not set'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Drop Deadline</p>
                                                <p className="text-sm font-bold text-neutral-900">{window.add_drop_deadline ? new Date(window.add_drop_deadline).toLocaleDateString() : 'Not set'}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-6">
                                            <button
                                                onClick={() => handleStatusUpdate(window.id, 'OPEN')}
                                                disabled={isLoading || window.status === 'OPEN'}
                                                className="px-4 py-2 bg-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50"
                                            >
                                                Open Now
                                            </button>
                                            <button
                                                onClick={() => handleDeleteWindow(window.id)}
                                                disabled={isLoading}
                                                className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-red-100 transition-all disabled:opacity-50 flex items-center gap-2"
                                            >
                                                <Trash size={14} weight="bold" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-neutral-900 text-white p-8 rounded-3xl shadow-xl">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                                <Activity size={16} weight="bold" /> Load Overview
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-3xl font-black mb-1">{provisionalGrades.length}</p>
                                    <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">Pending Approvals</p>
                                </div>
                                <div className="pt-6 border-t border-white/10">
                                    <p className="text-2xl font-black mb-1">{students.length}</p>
                                    <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">Enrolled Students</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : activeTab === 'enrollments' ? (
                <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                        <h2 className="text-lg font-bold">Module Enrollment Oversight</h2>
                        <div className="w-64">
                            <SearchField
                                placeholder="Filter modules..."
                                value={moduleSearchTerm}
                                onChange={(v) => setModuleSearchTerm(v)}
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-neutral-50/20">
                                    <th className="px-6 py-4">Code</th>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Current / Capacity</th>
                                    <th className="px-6 py-4">Students</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {(() => {
                                    const filteredModules = moduleStats
                                        .filter(stat =>
                                            stat.code.toLowerCase().includes(moduleSearchTerm.toLowerCase()) ||
                                            stat.title.toLowerCase().includes(moduleSearchTerm.toLowerCase())
                                        );

                                    const totalPages = Math.ceil(filteredModules.length / ITEMS_PER_PAGE);
                                    const paginatedModules = filteredModules.slice(
                                        (enrollmentPage - 1) * ITEMS_PER_PAGE,
                                        enrollmentPage * ITEMS_PER_PAGE
                                    );

                                    return (
                                        <>
                                            {paginatedModules.map(stat => {
                                                const registeredStudents = (stat.module_enrollments as any[])?.filter((e) => e.status === 'REGISTERED') || [];
                                                const registeredCount = registeredStudents.length;

                                                return (
                                                    <tr key={stat.id} className="hover:bg-neutral-50/50 transition-all text-sm group">
                                                        <td className="px-6 py-4 font-mono font-bold text-xs text-neutral-500">{stat.code}</td>
                                                        <td className="px-6 py-4 font-bold text-neutral-900">{stat.title}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`font-bold ${registeredCount >= stat.capacity ? 'text-red-600' : 'text-neutral-900'}`}>
                                                                    {registeredCount}
                                                                </span>
                                                                <span className="text-neutral-400 mx-1">/</span>
                                                                <span className="text-neutral-500">{stat.capacity}</span>
                                                                {registeredCount >= stat.capacity && (
                                                                    <span className="text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">FULL</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex -space-x-2 overflow-hidden">
                                                                {(registeredStudents as any[]).slice(0, 3).map((e) => (
                                                                    <div key={e.id} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-neutral-200 flex items-center justify-center text-[8px] font-bold text-neutral-600" title={`${e.student?.user?.first_name} ${e.student?.user?.last_name}`}>
                                                                        {e.student?.user?.first_name?.[0]}{e.student?.user?.last_name?.[0]}
                                                                    </div>
                                                                ))}
                                                                {registeredCount > 3 && (
                                                                    <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-neutral-100 flex items-center justify-center text-[8px] font-bold text-neutral-400">
                                                                        +{registeredCount - 3}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-all">
                                                                <Settings size={16} weight="bold" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {filteredModules.length > ITEMS_PER_PAGE && (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-4 border-t border-neutral-100">
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-xs text-neutral-400 font-medium">
                                                                Page {enrollmentPage} of {totalPages}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => setEnrollmentPage(1)}
                                                                    disabled={enrollmentPage === 1}
                                                                    className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded disabled:opacity-30"
                                                                >
                                                                    <ChevronsLeft size={16} weight="bold" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setEnrollmentPage(prev => Math.max(1, prev - 1))}
                                                                    disabled={enrollmentPage === 1}
                                                                    className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded disabled:opacity-30"
                                                                >
                                                                    <ChevronLeft size={16} weight="bold" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setEnrollmentPage(prev => Math.min(totalPages, prev + 1))}
                                                                    disabled={enrollmentPage === totalPages}
                                                                    className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded disabled:opacity-30"
                                                                >
                                                                    <ChevronRight size={16} weight="bold" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setEnrollmentPage(totalPages)}
                                                                    disabled={enrollmentPage === totalPages}
                                                                    className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded disabled:opacity-30"
                                                                >
                                                                    <ChevronsRight size={16} weight="bold" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })()}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : activeTab === 'grades' ? (
                <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-neutral-900">Provisional Grades Approval</h2>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                                {provisionalGrades.length} Pending
                            </span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-neutral-50/20">
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Module</th>
                                    <th className="px-6 py-4">Instructor Grade</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {provisionalGrades.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-neutral-400 font-bold uppercase text-[10px] tracking-widest">
                                            No provisional grades awaiting approval.
                                        </td>
                                    </tr>
                                ) : (
                                    provisionalGrades.map((grade) => (
                                        <tr key={grade.id} className="hover:bg-neutral-50/50 transition-all text-sm group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-neutral-900">{grade.student?.student_id}</div>
                                                <div className="text-[10px] text-neutral-500 uppercase font-medium">{grade.student?.user?.first_name} {grade.student?.user?.last_name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-mono font-bold text-xs text-neutral-500">{grade.module?.code}</div>
                                                <div className="font-bold text-neutral-900 truncate max-w-[200px]">{grade.module?.title}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-2xl font-black text-neutral-900">{grade.grade}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleFinalizeGrade(grade.id)}
                                                    disabled={isLoading}
                                                    className="px-4 py-2 bg-[#0a151a] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all disabled:opacity-50 inline-flex items-center gap-2"
                                                >
                                                    <ShieldCheck size={14} weight="bold" /> Approve & Seal
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : activeTab === 'students' ? (
                <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold text-neutral-900">Student Registry</h2>
                        <div className="w-full md:w-64">
                            <SearchField
                                placeholder="Search students..."
                                value={searchTerm}
                                onChange={(v) => setSearchTerm(v)}
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[900px]">
                            <thead>
                                <tr className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-neutral-50/20">
                                    <th className="px-6 py-4">Student ID / Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Housing</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-neutral-400 font-bold uppercase text-[10px] tracking-widest">
                                            No students found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-neutral-50/50 transition-all text-sm group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-neutral-900">{student.student_id}</div>
                                                <div className="text-[10px] text-neutral-500 uppercase font-medium">{student.user?.first_name} {student.user?.last_name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-mono text-neutral-500">
                                                {student.institutional_email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {(() => {
                                                    const activeHousing = (student.housing_assignments as any[])?.find((a) => a.status === 'ACTIVE' || a.status === 'ASSIGNED');
                                                    if (activeHousing) {
                                                        return (
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-bold text-neutral-900">{activeHousing.room?.building?.name}</span>
                                                                <span className="text-[9px] text-neutral-500 uppercase font-black tracking-tighter">Room {activeHousing.room?.room_number}</span>
                                                            </div>
                                                        );
                                                    }
                                                    return <span className="text-neutral-300 text-[10px] font-bold uppercase tracking-widest">Unassigned</span>;
                                                })()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight ${student.enrollment_status === 'ACTIVE' ? 'bg-neutral-50 text-neutral-600' : 'bg-red-50 text-red-600'}`}>
                                                    {student.enrollment_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleUpdateStudentStatus(student.id, student.enrollment_status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                                                        disabled={isLoading}
                                                        className={`p-2 rounded-lg transition-all ${student.enrollment_status === 'ACTIVE' ? 'text-red-400 hover:bg-red-50' : 'text-neutral-400 hover:bg-neutral-50'}`}
                                                    >
                                                        <ShieldCheck size={16} weight="bold" />
                                                    </button>
                                                    <button className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-all">
                                                        <ArrowRight size={16} weight="bold" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : activeTab === 'calendar' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-neutral-900">Academic Semesters</h2>
                            <button
                                onClick={() => {
                                    setEditingSemester(null);
                                    setSemesterFormData({
                                        name: '',
                                        start_date: '',
                                        end_date: '',
                                        status: 'UPCOMING'
                                    });
                                    setShowSemesterModal(true);
                                }}
                                className="px-4 py-2 bg-[#0a151a] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center gap-2"
                            >
                                <Plus size={14} weight="bold" /> Add Term
                            </button>
                        </div>
                        <div className="divide-y divide-neutral-50">
                            {semesters.length === 0 ? (
                                <div className="p-12 text-center text-neutral-400 font-bold uppercase text-[10px] tracking-widest">
                                    No semesters defined.
                                </div>
                            ) : (
                                semesters.map(semester => (
                                    <div key={semester.id} className="p-6 flex items-center justify-between hover:bg-neutral-50/50 transition-all">
                                        <div>
                                            <h3 className="font-bold text-neutral-900">{semester.name}</h3>
                                            <p className="text-xs text-neutral-500">
                                                {new Date(semester.start_date).toLocaleDateString()} - {new Date(semester.end_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight ${semester.status === 'ACTIVE' ? 'bg-blue-50 text-blue-600' : semester.status === 'COMPLETED' ? 'bg-neutral-100 text-neutral-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {semester.status}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    setEditingSemester(semester);
                                                    setSemesterFormData({
                                                        name: semester.name,
                                                        start_date: semester.start_date.split('T')[0],
                                                        end_date: semester.end_date.split('T')[0],
                                                        status: semester.status
                                                    });
                                                    setShowSemesterModal(true);
                                                }}
                                                className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-all"
                                            >
                                                <Settings size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            ) : activeTab === 'tuition' ? (
                <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-neutral-900 leading-none">Tuition Payment Log</h2>
                            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Audit trail for all student financial transactions</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total: {tuitionPayments.length}</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-neutral-50 border-b border-neutral-100">
                                    <th className="p-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Date</th>
                                    <th className="p-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Student</th>
                                    <th className="p-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Reference</th>
                                    <th className="p-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Amount</th>
                                    <th className="p-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Method</th>
                                    <th className="p-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {tuitionPayments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-neutral-400 font-bold uppercase text-[10px] tracking-widest">
                                            No payment records found.
                                        </td>
                                    </tr>
                                ) : (
                                    tuitionPayments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-neutral-50/50 transition-all">
                                            <td className="p-4 text-xs font-mono text-neutral-400">
                                                {new Date(payment.created_at).toLocaleString()}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-neutral-900 text-sm">
                                                    {payment.offer?.application?.user?.first_name} {payment.offer?.application?.user?.last_name}
                                                </div>
                                                <div className="text-[10px] text-neutral-400 font-medium">#{payment.offer?.application?.application_number}</div>
                                            </td>
                                            <td className="p-4 text-xs font-mono text-neutral-600">
                                                {payment.transaction_reference || 'N/A'}
                                            </td>
                                            <td className="p-4 text-sm font-bold text-neutral-900">
                                                ${payment.amount?.toLocaleString()}
                                            </td>
                                            <td className="p-4">
                                                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest bg-neutral-100 px-2 py-1 rounded">
                                                    {payment.payment_method?.replace('_', ' ') || 'BANK_TRANSFER'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${payment.status === 'COMPLETED' ? 'bg-neutral-100 text-neutral-700' :
                                                    payment.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {payment.status === 'COMPLETED' ? <CheckCircle size={10} weight="bold" /> : <Clock size={10} weight="bold" />} {payment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : activeTab === 'timetable' ? (
                <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
                        <h2 className="text-lg font-bold">Class Timetable</h2>
                        <button
                            onClick={() => {
                                setEditingSession(null);
                                setSessionFormData({
                                    module_id: '',
                                    semester_id: '',
                                    day_of_week: 1,
                                    start_time: '09:00',
                                    end_time: '11:00',
                                    location_type: 'CAMPUS',
                                    location_detail: ''
                                });
                                setShowSessionModal(true);
                            }}
                            className="bg-[#0a151a] text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center gap-2"
                        >
                            <Calendar size={14} weight="bold" /> Add Session
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead className="bg-neutral-50 border-b border-neutral-100">
                                <tr className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                    <th className="px-6 py-4">Day</th>
                                    <th className="px-6 py-4">Time</th>
                                    <th className="px-6 py-4">Module</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50 text-sm">
                                {sessions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-neutral-400 font-bold uppercase text-[10px] tracking-widest">
                                            No class sessions scheduled.
                                        </td>
                                    </tr>
                                ) : (
                                    sessions.map(session => (
                                        <tr key={session.id} className="hover:bg-neutral-50/50 transition-all">
                                            <td className="px-6 py-4 font-bold text-neutral-900">
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][session.day_of_week - 1]}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-neutral-600 font-medium">
                                                    <Clock size={12} weight="bold" /> {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-neutral-900">{session.module?.title}</div>
                                                <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{session.module?.code}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${session.location_type === 'CAMPUS' ? 'bg-teal-50 text-teal-700' : 'bg-blue-50 text-blue-700'}`}>
                                                    {session.location_type}
                                                </span>
                                                <p className="text-[10px] text-neutral-400 font-medium mt-1 truncate max-w-[150px]">{session.location_detail}</p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 text-neutral-400">
                                                    <button
                                                        onClick={() => {
                                                            setEditingSession(session);
                                                            setSessionFormData({
                                                                module_id: session.module_id,
                                                                semester_id: session.semester_id,
                                                                day_of_week: session.day_of_week,
                                                                start_time: session.start_time.slice(0, 5),
                                                                end_time: session.end_time.slice(0, 5),
                                                                location_type: session.location_type,
                                                                location_detail: session.location_detail || ''
                                                            });
                                                            setShowSessionModal(true);
                                                        }}
                                                        className="p-1 hover:text-black hover:bg-neutral-100 rounded"
                                                    >
                                                        <Settings size={14} weight="bold" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteSession(session.id)}
                                                        className="p-1 hover:text-red-600 hover:bg-neutral-100 rounded"
                                                    >
                                                        <Trash size={14} weight="bold" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : activeTab === 'housing' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {buildings.length === 0 ? (
                        <div className="col-span-full bg-white border border-neutral-200 p-12 rounded-2xl text-center text-neutral-400 font-bold uppercase text-[10px] tracking-widest">
                            No housing buildings registered.
                        </div>
                    ) : (
                        buildings.map(building => {
                            const totalRooms = building.housing_rooms?.[0]?.count || 0;
                            return (
                                <div key={building.id} className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm hover:border-[#0a151a] transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-all">
                                            <Settings size={24} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Rooms</p>
                                            <p className="text-xl font-black text-neutral-900">{totalRooms}</p>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-neutral-900 mb-1">{building.name}</h3>
                                    <p className="text-xs text-neutral-500 uppercase font-bold tracking-widest">{building.campus_location}</p>
                                </div>
                            );
                        })
                    )}
                </div>
            ) : (
                <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-neutral-100 bg-neutral-50/50">
                        <h2 className="text-lg font-bold text-neutral-900">System Audit Logs</h2>
                    </div>
                    <div className="divide-y divide-neutral-50">
                        {auditLogs.length === 0 ? (
                            <div className="p-12 text-center text-neutral-400 font-bold uppercase text-[10px] tracking-widest">
                                No audit logs found.
                            </div>
                        ) : (
                            auditLogs.map((log) => (
                                <div key={log.id} className="p-6 hover:bg-neutral-50/50 transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${log.action === 'INSERT' ? 'bg-neutral-100 text-neutral-700' : log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                                {log.action}
                                            </span>
                                            <span className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-tight">{log.entity_table}</span>
                                        </div>
                                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                    <p className="text-xs text-neutral-400 truncate font-mono">ID: {log.entity_id}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Session Modal */}
            {showSessionModal && (
                <div className="fixed inset-0 bg-[#0a151a]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-neutral-900">{editingSession ? 'Edit Class Session' : 'Schedule New Session'}</h3>
                                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Class Timetable Management</p>
                            </div>
                            <button onClick={() => setShowSessionModal(false)} className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
                                <X size={20} weight="bold" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block ml-1">Academic Module</label>
                                    <select
                                        value={sessionFormData.module_id}
                                        onChange={(e) => setSessionFormData({ ...sessionFormData, module_id: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-100 p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                    >
                                        <option value="">Select Module...</option>
                                        {moduleStats.map(m => (
                                            <option key={m.id} value={m.id}>{m.code} - {m.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block ml-1">Semester</label>
                                    <select
                                        value={sessionFormData.semester_id}
                                        onChange={(e) => setSessionFormData({ ...sessionFormData, semester_id: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-100 p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                    >
                                        <option value="">Select Semester...</option>
                                        {semesters.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block ml-1">Day</label>
                                    <select
                                        value={sessionFormData.day_of_week}
                                        onChange={(e) => setSessionFormData({ ...sessionFormData, day_of_week: parseInt(e.target.value) })}
                                        className="w-full bg-neutral-50 border border-neutral-100 p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                    >
                                        {[
                                            { v: 1, l: 'Monday' }, { v: 2, l: 'Tuesday' }, { v: 3, l: 'Wednesday' },
                                            { v: 4, l: 'Thursday' }, { v: 5, l: 'Friday' }, { v: 6, l: 'Saturday' }, { v: 7, l: 'Sunday' }
                                        ].map(d => (
                                            <option key={d.v} value={d.v}>{d.l}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block ml-1">Start Time</label>
                                    <input
                                        type="time"
                                        value={sessionFormData.start_time}
                                        onChange={(e) => setSessionFormData({ ...sessionFormData, start_time: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-100 p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block ml-1">End Time</label>
                                    <input
                                        type="time"
                                        value={sessionFormData.end_time}
                                        onChange={(e) => setSessionFormData({ ...sessionFormData, end_time: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-100 p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block ml-1">Location Type</label>
                                    <div className="flex gap-2">
                                        {['CAMPUS', 'ONLINE'].map(t => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setSessionFormData({ ...sessionFormData, location_type: t as any })}
                                                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sessionFormData.location_type === t ? 'bg-[#0a151a] text-white' : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block ml-1">Detail (Room/Link)</label>
                                    <input
                                        type="text"
                                        placeholder={sessionFormData.location_type === 'CAMPUS' ? 'e.g. Room 402' : 'e.g. Microsoft Teams Link'}
                                        value={sessionFormData.location_detail}
                                        onChange={(e) => setSessionFormData({ ...sessionFormData, location_detail: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-100 p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-neutral-300"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-neutral-50/50 flex gap-4">
                            <button
                                onClick={() => setShowSessionModal(false)}
                                className="flex-1 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-neutral-200 hover:bg-neutral-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveSession}
                                disabled={isLoading || !sessionFormData.module_id || !sessionFormData.semester_id}
                                className="flex-1 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-[#0a151a] text-white hover:bg-neutral-800 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={14} weight="bold" /> : (editingSession ? 'Update Session' : 'Save Session')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Semester Modal */}
            {showSemesterModal && (
                <div className="fixed inset-0 bg-[#0a151a]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-neutral-900">{editingSemester ? 'Edit Academic Term' : 'Add New Term'}</h3>
                                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Calendar Configuration</p>
                            </div>
                            <button onClick={() => setShowSemesterModal(false)} className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
                                <X size={20} weight="bold" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block ml-1">Term Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Fall Semester 2026"
                                    value={semesterFormData.name}
                                    onChange={(e) => setSemesterFormData({ ...semesterFormData, name: e.target.value })}
                                    className="w-full bg-neutral-50 border border-neutral-100 p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block ml-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={semesterFormData.start_date}
                                        onChange={(e) => setSemesterFormData({ ...semesterFormData, start_date: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-100 p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block ml-1">End Date</label>
                                    <input
                                        type="date"
                                        value={semesterFormData.end_date}
                                        onChange={(e) => setSemesterFormData({ ...semesterFormData, end_date: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-100 p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block ml-1">Initial Status</label>
                                <select
                                    value={semesterFormData.status}
                                    onChange={(e) => setSemesterFormData({ ...semesterFormData, status: e.target.value as any })}
                                    className="w-full bg-neutral-50 border border-neutral-100 p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                >
                                    <option value="UPCOMING">Upcoming</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-8 bg-neutral-50/50 flex gap-4">
                            <button onClick={() => setShowSemesterModal(false)} className="flex-1 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-neutral-200 hover:bg-neutral-100 transition-all">Cancel</button>
                            <button onClick={handleSaveSemester} disabled={isLoading || !semesterFormData.name} className="flex-1 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-[#0a151a] text-white hover:bg-neutral-800 transition-all flex items-center justify-center gap-2">
                                {isLoading ? <Loader2 className="animate-spin" size={14} weight="bold" /> : (editingSemester ? 'Update Term' : 'Save Term')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Window Modal */}
            {showWindowModal && (
                <div className="fixed inset-0 bg-[#0a151a]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-neutral-900">{editingWindow ? 'Edit Selection Period' : 'Configure Selection Period'}</h3>
                                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Course Registration Rules</p>
                            </div>
                            <button onClick={() => setShowWindowModal(false)} className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
                                <X size={20} weight="bold" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block ml-1">Academic Semester</label>
                                <select
                                    value={windowFormData.semester_id}
                                    onChange={(e) => setWindowFormData({ ...windowFormData, semester_id: e.target.value })}
                                    className="w-full bg-neutral-50 border border-neutral-100 p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                >
                                    <option value="">Select Term...</option>
                                    {semesters.map(s => (
                                        <option key={s.id} value={s.id}>{(() => {
                                            const name = s.name;
                                            const year = s.start_date ? new Date(s.start_date).getFullYear() : null;
                                            return year && !name.includes(String(year)) ? `${name} ${year}` : name;
                                        })()}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block ml-1">Window Opens</label>
                                    <input
                                        type="date"
                                        value={windowFormData.open_at}
                                        onChange={(e) => setWindowFormData({ ...windowFormData, open_at: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-100 p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block ml-1">Window Closes</label>
                                    <input
                                        type="date"
                                        value={windowFormData.close_at}
                                        onChange={(e) => setWindowFormData({ ...windowFormData, close_at: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-100 p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block ml-1">Add/Drop Deadline</label>
                                <input
                                    type="date"
                                    value={windowFormData.add_drop_deadline}
                                    onChange={(e) => setWindowFormData({ ...windowFormData, add_drop_deadline: e.target.value })}
                                    className="w-full bg-neutral-50 border border-neutral-100 p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block ml-1">Window Status</label>
                                <div className="flex gap-2">
                                    {['OPEN', 'CLOSED'].map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setWindowFormData({ ...windowFormData, status: t as any })}
                                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${windowFormData.status === t ? 'bg-[#0a151a] text-white' : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-8 bg-neutral-50/50 flex gap-4">
                            <button onClick={() => setShowWindowModal(false)} className="flex-1 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-neutral-200 hover:bg-neutral-100 transition-all">Cancel</button>
                            <button onClick={handleSaveWindow} disabled={isLoading || !windowFormData.semester_id || !windowFormData.open_at || !windowFormData.close_at} className="flex-1 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-[#0a151a] text-white hover:bg-neutral-800 transition-all flex items-center justify-center gap-2">
                                {isLoading ? <Loader2 className="animate-spin" size={14} weight="bold" /> : (editingWindow ? 'Update Window' : 'Create Window')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

