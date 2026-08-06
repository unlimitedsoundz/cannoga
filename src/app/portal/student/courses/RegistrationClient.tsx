
'use client';

import { useState, useTransition, useEffect } from 'react';
import { registerForModule, dropModule } from '@/app/portal/registration-actions';
import {
    BookOpen,
    Calendar,
    CheckCircle,
    WarningCircle as AlertCircle,
    MagnifyingGlass as Search,
    Plus,
    Trash,
    Clock,
    User,
    GraduationCap
} from "@phosphor-icons/react/dist/ssr";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatToDDMMYYYY } from '@/utils/date';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { SearchField } from '@/components/ui/SearchField';

interface RegistrationClientProps {
    student: any;
    window: any;
    modules: any[];
    initialEnrollments: any[];
    onRefresh: () => Promise<void>;
}

export default function RegistrationClient({
    student,
    window,
    modules,
    initialEnrollments,
    onRefresh
}: RegistrationClientProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const totalCredits = initialEnrollments.reduce((sum, e) => sum + (e.module?.credits || e.subject?.creditUnits || 0), 0);
    const MAX_CREDITS = 35;
    const creditProgress = (totalCredits / MAX_CREDITS) * 100;

    const filteredModules = modules.filter(m =>
        m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isEnrolled = (moduleId: string) =>
        initialEnrollments.some(e => e.module_id === moduleId && e.status === 'REGISTERED');

    const handleRegister = async (moduleId: string) => {
        setError(null);
        startTransition(async () => {
            const result = await registerForModule(moduleId);
            if (!result.success) {
                setError(result.error || 'Registration failed');
            } else {
                await onRefresh();
            }
        });
    };

    const handleDrop = async (moduleId: string) => {
        const enrollment = initialEnrollments.find(e => e.module_id === moduleId);
        if (!enrollment) return;

        if (!confirm('Are you sure you want to drop this module? Academic rules may apply.')) return;

        setError(null);
        startTransition(async () => {
            const result = await dropModule(enrollment.id);
            if (!result.success) {
                setError(result.error);
            } else {
                await onRefresh();
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-50 p-6 rounded-none border-none">
                <div>
                    <div className="flex items-center gap-2 text-black font-medium text-[10px] uppercase tracking-widest mb-1 leading-none">
                        <GraduationCap size={14} weight="bold" />
                        Academic Systems • Course Registration
                    </div>
                    <h1 className="text-2xl font-black text-black mb-1 leading-none">Course Enrollment</h1>
                    <p className="text-black font-medium">
                        {(() => {
                            const name = window?.semester?.name || 'Academic Term';
                            const year = window?.semester?.start_date ? new Date(window.semester.start_date).getFullYear() : null;
                            return year && !name.includes(String(year)) ? `${name} ${year}` : name;
                        })()} • Registration Window:
                        <span className="text-black ml-1">
                            {window?.status || 'Closed'}
                        </span>
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-black uppercase tracking-widest leading-none mb-1">Student</p>
                        <p className="font-bold text-black">{student.user?.first_name} {student.user?.last_name}</p>
                        <p className="text-[10px] text-black font-mono">{student.user?.student_id || student.student_id}</p>
                    </div>
                    <UserAvatar
                        src={undefined}
                        firstName={student.user?.first_name}
                        email={student.user?.email}
                        size="md"
                    />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={20} className="mt-0.5 shrink-0" />
                    <div className="text-sm font-medium">{error}</div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Credit Counter */}
                <div className="space-y-4">
                    <div className="bg-neutral-50 p-5 rounded-none border-none">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-black mb-4">Study Load</h2>

                        <div className="flex justify-between items-end mb-2">
                            <span className="text-3xl font-black text-black">{totalCredits}</span>
                            <span className="text-sm font-bold text-black">/ {MAX_CREDITS} Credits</span>
                        </div>

                        <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden mb-4">
                            <div
                                className="h-full transition-all duration-500 rounded-none bg-[#9c27b3]"
                                style={{ width: `${Math.min(creditProgress, 100)}%` }}
                            />
                        </div>

                        <ul className="space-y-4 pt-4 border-t border-[#9c27b3]/5">
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-black/60">Registered Courses</span>
                                <span className="font-bold text-black">{initialEnrollments.length}</span>
                            </li>
                            <li className="flex items-center justify-between text-sm">
                                <span className="text-black/60">Status</span>
                                <span className="text-black font-bold flex items-center gap-1">
                                    <CheckCircle size={14} weight="bold" /> Active
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-[#9c27b3] text-white p-5 rounded-xl shadow-xl space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <Clock size={20} weight="bold" className="text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-white uppercase tracking-widest opacity-70">Window Ends</p>
                                <p className="font-bold text-white">
                                    {window ? (isMounted ? formatToDDMMYYYY(window.close_at) : '...') : 'N/A'}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-white leading-relaxed">
                            Registration window is open. You can add or drop subjects freely until the deadline.
                        </p>
                    </div>
                </div>

                {/* Right Column: Module List */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Search Bar */}
                    <SearchField
                        placeholder="Search by code or title..."
                        value={searchQuery}
                        onChange={(v) => setSearchQuery(v)}
                    />

                    {/* Modules Grid */}
                    <div className="space-y-4">
                        {filteredModules.map(module => {
                            const enrolled = isEnrolled(module.id);

                            return (
                                <div
                                    key={module.id}
                                    className={`bg-neutral-50 border-none p-5 rounded-none transition-all group flex flex-col md:flex-row gap-4 ${enrolled
                                        ? 'bg-neutral-100'
                                        : 'hover:bg-neutral-100'
                                        }`}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-mono font-bold bg-[#9c27b3] text-white px-2 py-0.5 rounded-none">
                                                {module.code}
                                            </span>
                                            <span className="text-[10px] font-bold bg-[#9c27b3] text-white px-2 py-0.5 rounded-none uppercase">
                                                {module.credits} Credits
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-black group-hover:underline mb-1">
                                            {module.title}
                                        </h3>
                                        <p className="text-sm text-black mb-4 line-clamp-2">
                                            {module.description}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-black/60">
                                            <span className="flex items-center gap-1.5">
                                                <User size={14} /> {module.instructor}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <BookOpen size={14} /> {module.academic_level}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-black">
                                                <AlertCircle size={14} /> Prereq: {module.prerequisites || 'None'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-between items-end gap-4 min-w-[120px]">
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1">Availability</p>
                                            <p className="text-xs font-bold text-black">
                                                {module.capacity} Seats Total
                                            </p>
                                        </div>

                                        {enrolled ? (
                                            <button
                                                onClick={() => handleDrop(module.id)}
                                                disabled={isPending}
                                                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-[#9c27b3] text-black rounded-none text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 transition-all disabled:opacity-50"
                                            >
                                                <Trash size={14} weight="bold" /> Drop
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleRegister(module.id)}
                                                disabled={isPending || window?.status !== 'OPEN'}
                                                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#9c27b3] transition-all disabled:opacity-50"
                                            >
                                                <Plus size={14} weight="bold" /> Register
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {filteredModules.length === 0 && (
                            <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
                                <Search className="mx-auto text-neutral-300 mb-4" size={48} />
                                <p className="text-black font-medium">No subjects found matching your search.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

