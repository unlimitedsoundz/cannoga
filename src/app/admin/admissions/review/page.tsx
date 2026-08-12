'use client';

import { createClient } from '@/utils/supabase/client';
import { invokeEdgeFunction } from '@/utils/supabase/invoke';
import {
    getAdmissionsApplicationById,
    updateApplicationInternalNotesAdmin
} from '@/app/admin/actions';
import {
    updateApplicationStatus,
    regenerateOfferLetter,
    generateAdmissionLetterAction
} from '../actions';
import { togglePortalAccess } from '@/app/admin/user-actions';
import { Link } from "@aalto-dx/react-components";
import { useState, useEffect, use, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    CaretLeft as ChevronLeft, User, Envelope as Mail, Phone, Globe, Calendar, MapPin,
    GraduationCap, Trophy as Award, FileText, DownloadSimple as Download,
    CheckCircle as CheckCircle2, XCircle, WarningCircle as AlertCircle, Clock,
    ArrowCounterClockwise as RotateCcw, CircleNotch as Loader2, Info
} from "@phosphor-icons/react";
import { formatToDDMMYYYY } from '@/utils/date';
import { getTuitionFee, mapSchoolToTuitionField, getProgramYears } from '@/utils/tuition';
import { FinancialOfferForm } from '../FinancialOfferForm';

function ApplicationReviewContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const supabase = createClient();

    const [app, setApp] = useState<any>(null);
    const [admissionRecord, setAdmissionRecord] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showDocsModal, setShowDocsModal] = useState(false);
    const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
    const [docsNote, setDocsNote] = useState('');

    const DOC_TYPES = [
        { id: 'PASSPORT', label: 'International Passport' },
        { id: 'TRANSCRIPT', label: 'Academic Transcript' },
        { id: 'CERTICACATE', label: 'Degree Certificate' },
        { id: 'LANGUAGE_CERT', label: 'Language Proficiency' },
    ];

    const fetchData = async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const result = await getAdmissionsApplicationById(id) as any;

            if (result.success && result.data) {
                setApp(result.data);
                setAdmissionRecord(result.admissions);
            } else {
                console.error("Error fetching application details:", result.error);
                setError(result.error || "Application not found");
            }
        } catch (err: any) {
            console.error("Error fetching application details:", err);
            setError(err.message || "Failed to load application");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) {
            router.push('/admin/admissions');
            return;
        }
        fetchData();
    }, [id, router, supabase]);

    const handleUpdateStatus = async (status: string) => {
        if (!id) return;
        setUpdating(true);
        try {
            const result = await updateApplicationStatus(id, status as any) as any;
            if (!result.success) throw new Error(result.error);
            await fetchData();
        } catch (error: any) {
            alert("Error updating status: " + error.message);
        } finally {
            setUpdating(false);
        }
    };

    const handleSaveNotes = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) return;
        const formData = new FormData(e.currentTarget);
        const notes = formData.get('notes') as string;
        setUpdating(true);
        try {
            const result = await updateApplicationInternalNotesAdmin(id, notes);
            if (!result.success) throw new Error(result.error);
            await fetchData();
            alert("Notes saved successfully!");
        } catch (error: any) {
            alert("Error saving notes: " + error.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 min-h-[60vh]">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center bg-white border border-neutral-100 rounded-3xl">
                <XCircle size={48} className="text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-black uppercase tracking-tight text-neutral-900">Application Not Found</h2>
                <p className="text-neutral-500 text-sm mt-2 mb-6">{error}</p>
                <Link
                    href="/admin/admissions"
                    className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-neutral-800 transition-all"
                >
                    <ChevronLeft size={14} weight="bold" /> Back to Admissions
                </Link>
            </div>
        );
    }

    if (!app) return null;

    const user = app.user || {};
    const personal = app.personal_info || {};
    const contact = app.contact_details || {};

    return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link href="/admin/admissions" className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
                    <ChevronLeft size={24} weight="bold" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-tight text-neutral-900 border-l-4 border-[#9c27b3] pl-4">Application Review</h1>
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mt-1">Viewing details for {user.first_name} {user.last_name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm">
                        <div className="bg-neutral-900 p-8 text-white flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center font-black text-2xl border border-white/20">
                                    {(user.first_name?.[0] || 'A').toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tight">
                                        {user.first_name} {user.last_name}
                                    </h2>
                                    <p className="text-neutral-400 text-[10px] font-black uppercase tracking-widest mt-1">Student ID: {user.student_id || 'Generating...'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block mb-1">Applying For</span>
                                <span className="text-sm font-black uppercase tracking-tight text-amber-500">{app.course?.title}</span>
                                {app.course?.degreeLevel && (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block mt-1">
                                        {app.course.degreeLevel === 'BACHELOR' ? 'Bachelor' : app.course.degreeLevel === 'MASTER' ? 'Master' : app.course.degreeLevel}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2 border-b border-neutral-50 pb-2">Personal Information</h3>
                                <div className="space-y-4">
                                    <InfoItem icon={Calendar} label="Date of Birth" value={user.date_of_birth ? formatToDDMMYYYY(user.date_of_birth) : undefined} />
                                    <InfoItem icon={User} label="Gender" value={user.gender} isCapitalized />
                                    <InfoItem icon={Globe} label="Country of Residence" value={user.country_of_residence} />
                                    <InfoItem icon={Globe} label="Citizenship" value={user.citizenship} />
                                    <InfoItem icon={FileText} label="Passport Number" value={user.passport_number} />
                                    <InfoItem icon={Phone} label="Phone" value={user.phone_number ? `${user.phone_code} ${user.phone_number}` : undefined} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2 border-b border-neutral-50 pb-2">Contact Details</h3>
                                <div className="space-y-4">
                                    <InfoItem icon={Mail} label="Email Address" value={user.email} />
                                    <InfoItem icon={MapPin} label="Address" value={[user.address, user.city, user.state_province, user.zipcode].filter(Boolean).join(', ') || undefined} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-neutral-100 p-8 shadow-sm space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2 border-b border-neutral-50 pb-2">
                            <FileText size={16} weight="bold" /> Application Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoItem label="Application ID" value={app.application_number || app.id.slice(0, 8)} />
                            <InfoItem label="Status" value={app.status.replace(/_/g, ' ')} />
                            <InfoItem label="Program" value={app.course?.title} />
                            <InfoItem label="Intake" value={app.intake} />
                            <InfoItem label="Program Type" value={app.program_type || app.course?.programType} />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-neutral-100 p-8 shadow-sm space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2 border-b border-neutral-50 pb-2">
                            <FileText size={16} weight="bold" /> Attached Documents
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {app.documents?.length > 0 ? (
                                app.documents.map((doc: any) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100 group hover:border-[#9c27b3] transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                                                <FileText size={18} weight="regular" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-tight">{doc.type.replace('_', ' ')}</div>
                                                <div className="text-[10px] font-bold text-neutral-400 truncate max-w-[150px]">{doc.name}</div>
                                            </div>
                                        </div>
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-[#9c27b3] hover:text-white rounded-lg transition-all">
                                            <Download size={16} weight="bold" />
                                        </a>
                                    </div>
                                ))
                            ) : (
                                <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest italic col-span-2">No documents uploaded yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-lg sticky top-8">
                        <div className="mb-6">
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-3">Current Status</span>
                            <StatusDisplay status={app.status} />
                        </div>

                        <div className="space-y-3 pt-6 border-t border-neutral-100">
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-2">Update Pipeline</span>
                            <div className="grid grid-cols-1 gap-2">
                                <StatusBtn
                                    label="Request Documents"
                                    status="DOCS_REQUIRED"
                                    currentStatus={app.status}
                                    variant="success"
                                    onClick={() => setShowDocsModal(true)}
                                    disabled={updating}
                                />
                                <StatusBtn label="Admit Student" status="ADMITTED" currentStatus={app.status} variant="success" onClick={() => handleUpdateStatus('ADMITTED')} disabled={updating} />
                                {(app.status === 'PAYMENT_SUBMITTED' || app.status === 'OFFER_ACCEPTED' || app.status === 'ADMISSION_LETTER_GENERATED') && (
                                    <StatusBtn label="Finalize Enrollment" status="ENROLLED" currentStatus={app.status} variant="success" onClick={() => handleUpdateStatus('ENROLLED')} disabled={updating} />
                                )}
                                <StatusBtn label="Reject Application" status="REJECTED" currentStatus={app.status} variant="danger" onClick={() => handleUpdateStatus('REJECTED')} disabled={updating} />
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-neutral-100">
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-3">Internal Notes</span>
                            <form onSubmit={handleSaveNotes} className="space-y-3">
                                <textarea
                                    name="notes"
                                    rows={4}
                                    defaultValue={admissionRecord?.internal_notes || ''}
                                    placeholder="Add internal notes here..."
                                    className="w-full rounded-xl border border-neutral-200 p-3 text-xs focus:border-[#9c27b3] focus:outline-none resize-none"
                                />
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="w-full bg-neutral-900 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#9c27b3] transition-all disabled:opacity-50"
                                >
                                    Save Notes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value, icon: Icon, isCapitalized = false }: { label: string; value?: any; icon?: any; isCapitalized?: boolean }) {
    const displayValue = value || '—';
    return (
        <div>
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1">{label}</span>
            {Icon && <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">{displayValue}</div>}
            {!Icon && <div className="text-neutral-900 font-semibold text-sm">{isCapitalized && typeof displayValue === 'string' ? displayValue.toUpperCase() : displayValue}</div>}
        </div>
    );
}

function StatusDisplay({ status }: { status: string }) {
    const variants: Record<string, string> = {
        'DRAFT': 'bg-neutral-100 text-neutral-400 border-neutral-200',
        'SUBMITTED': 'bg-blue-50 text-blue-600 border-blue-100',
        'PAYMENT_SUBMITTED': 'bg-cyan-50 text-cyan-600 border-cyan-100',
        'ENROLLED': 'bg-neutral-900 text-white border-neutral-900',
        'UNDER_REVIEW': 'bg-amber-50 text-amber-600 border-amber-100',
        'DOCS_REQUIRED': 'bg-neutral-50 text-neutral-600 border-neutral-100',
        'ADMITTED': 'bg-neutral-50 text-neutral-600 border-neutral-100',
        'OFFER_ACCEPTED': 'bg-neutral-900 text-white border-neutral-900',
        'ADMISSION_LETTER_GENERATED': 'bg-teal-50 text-teal-700 border-teal-200',
        'REJECTED': 'bg-red-50 text-red-600 border-red-100',
        'OFFER_DECLINED': 'bg-red-900 text-white border-red-900',
    };

    const labels: Record<string, string> = {
        'ADMISSION_LETTER_GENERATED': 'LETTER ISSUED',
        'PAYMENT_SUBMITTED': 'PAYMENT SENT',
        'OFFER_ACCEPTED': 'OFFER ACCEPTED',
        'OFFER_DECLINED': 'OFFER DECLINED',
        'DOCS_REQUIRED': 'DOCS NEEDED',
        'UNDER_REVIEW': 'REVIEWING',
    };

    const s = status || 'DRAFT';

    return (
        <span className={`px-2 py-1 rounded-none text-[10px] font-black uppercase tracking-tighter border ${variants[s] || variants['DRAFT']}`}>
            {labels[s] || s.replace(/_/g, ' ')}
        </span>
    );
}

function StatusBtn({ label, status, currentStatus, variant, onClick, disabled }: {
    label: string;
    status: string;
    currentStatus: string;
    variant: 'success' | 'danger';
    onClick: () => void;
    disabled: boolean;
}) {
    const isActive = currentStatus === status;
    return (
        <button
            onClick={onClick}
            disabled={disabled || isActive}
            className={`w-full px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed ${variant === 'success'
                ? 'bg-neutral-900 text-white hover:bg-[#9c27b3]'
                : 'bg-red-600 text-white hover:bg-red-700'
                } ${isActive ? 'ring-2 ring-[#9c27b3]' : ''}`}
        >
            {label} {isActive && '✓'}
        </button>
    );
}

export default function ApplicationReviewPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center py-20 min-h-[60vh]">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        }>
            <ApplicationReviewContent />
        </Suspense>
    );
}
