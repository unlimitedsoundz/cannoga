'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { HugeiconsIcon } from '@hugeicons/react';
import { FileTypeIcon as FileText, Download02Icon as Download, ArrowLeftIcon as ArrowLeft } from '@hugeicons/core-free-icons';
import { createClient } from '@/utils/supabase/client';

interface ApplicationDocument {
    id: string;
    application_id: string;
    type: string;
    url: string;
    name: string;
    uploaded_at: string;
}

interface AdmissionOffer {
    id: string;
    document_url: string | null;
    status: string;
}

interface ApplicationInfo {
    id: string;
    status: string;
    submitted_at: string;
    user?: {
        first_name: string;
        last_name: string;
        email: string;
        student_id?: string;
        date_of_birth?: string;
    };
    course?: {
        title: string;
        degreeLevel?: string;
    };
}

const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
        TRANSCRIPT: 'Academic Transcript',
        CERTIFICATE: 'Certificate',
        PASSPORT: 'Passport',
        CV: 'Curriculum Vitae',
        MOTIVATION_LETTER: 'Motivation Letter',
        LANGUAGE_CERT: 'Language Certificate',
        OTHER: 'Other Document',
        pal: 'Provincial Attestation Letter (PAL)',
        loa: 'Letter of Acceptance (LOA)',
        tuition_invoice: 'Tuition Invoice',
        tuition_receipt: 'Tuition Receipt',
        enrollment_confirmation: 'Confirmation of Enrolment (COE)',
        transcript: 'Transcript',
    };
    return labels[type] || type;
};

export default function AdminDocumentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [application, setApplication] = useState<ApplicationInfo | null>(null);
    const [applicationDocuments, setApplicationDocuments] = useState<ApplicationDocument[]>([]);
    const [admissionOffer, setAdmissionOffer] = useState<AdmissionOffer | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError('Application ID is required');
                setLoading(false);
                return;
            }

            try {
                const supabase = createClient();

                const { data: appData, error: appError } = await supabase
                    .from('applications')
                    .select('id, status, submitted_at, user:profiles(first_name, last_name, email), course:Course(title, degreeLevel)')
                    .eq('id', id)
                    .single();

                if (appError || !appData) {
                    setError('Application not found');
                    setLoading(false);
                    return;
                }

                setApplication({
                    ...appData,
                    user: Array.isArray(appData.user) ? appData.user[0] : appData.user,
                    course: Array.isArray(appData.course) ? appData.course[0] : appData.course,
                } as ApplicationInfo);

                const { data: docsData, error: docsError } = await supabase
                    .from('application_documents')
                    .select('id, application_id, type, url, name, uploaded_at')
                    .eq('application_id', id)
                    .order('uploaded_at', { ascending: false });

                if (docsError) {
                    console.error('Error fetching application documents:', docsError);
                }

                setApplicationDocuments(docsData || []);

                const { data: offerData, error: offerError } = await supabase
                    .from('admission_offers')
                    .select('id, document_url, status')
                    .eq('application_id', id)
                    .maybeSingle();

                if (offerError) {
                    console.error('Error fetching admission offer:', offerError);
                }

                setAdmissionOffer(offerData || null);
            } catch (err: any) {
                console.error('Error fetching data:', err);
                setError(err.message || 'Failed to load application documents');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div>
                    <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 hover:text-white transition-colors cursor-pointer">
                        <HugeiconsIcon icon={ArrowLeft} size={14} strokeWidth={2} />
                        Back
                    </button>
                </div>
                <PageHeader title="Application Not Found" subtitle="The requested application could not be loaded." />
                <div className="p-8 bg-red-950/60 rounded-2xl text-center">
                    <p className="text-red-300 font-medium mb-4 text-sm">{error}</p>
                    <button
                        onClick={() => router.push('/sis/admin/documents')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-700 transition-colors cursor-pointer"
                    >
                        <HugeiconsIcon icon={ArrowLeft} size={14} strokeWidth={2} />
                        Back to Documents
                    </button>
                </div>
            </div>
        );
    }

    const formatDegreeLevel = (level?: string) => {
        if (!level) return '';
        return level.charAt(0) + level.slice(1).toLowerCase();
    };

    const allDocuments: ApplicationDocument[] = [
        ...applicationDocuments,
        ...(admissionOffer?.document_url ? [{
            id: `loa-${admissionOffer.id}`,
            application_id: id,
            type: 'loa',
            url: admissionOffer.document_url,
            name: `Letter of Acceptance - ${application?.course?.title || 'Program'}`,
            uploaded_at: admissionOffer.status === 'ACCEPTED' ? new Date().toISOString() : '',
        }] : []),
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 hover:text-white transition-colors cursor-pointer">
                    <HugeiconsIcon icon={ArrowLeft} size={14} strokeWidth={2} />
                    Back to Documents
                </button>
            </div>

            <PageHeader
                title={application?.course?.title || 'Application Documents'}
                subtitle={`Application ID: ${application?.id?.slice(0, 8)}`}
            />

            <div className="bg-neutral-900 rounded-2xl p-6 text-white shadow-sm">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Application Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-neutral-800 rounded-xl">
                        <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Student Name</p>
                        <p className="text-sm font-bold text-white mt-1">
                            {application?.user?.first_name} {application?.user?.last_name}
                        </p>
                    </div>
                    <div className="p-3 bg-neutral-800 rounded-xl">
                        <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Email</p>
                        <p className="text-xs font-mono text-neutral-300 mt-1">{application?.user?.email}</p>
                    </div>
                    <div className="p-3 bg-neutral-800 rounded-xl">
                        <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Programme</p>
                        <p className="text-xs font-bold text-neutral-200 mt-1">{application?.course?.title}{application?.course?.degreeLevel ? ` — ${formatDegreeLevel(application.course.degreeLevel)}` : ''}</p>
                    </div>
                    <div className="p-3 bg-neutral-800 rounded-xl">
                        <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-1">Status</p>
                        <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${application?.status === 'ADMITTED' ? 'bg-emerald-950 text-emerald-300' : application?.status === 'REJECTED' ? 'bg-red-950 text-red-300' : 'bg-neutral-700 text-neutral-200'}`}>
                            {application?.status?.replace('_', ' ')}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-neutral-900 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Uploaded Documents</h3>
                        <p className="text-xs text-neutral-500 mt-0.5">{allDocuments.length} document(s) for this application</p>
                    </div>
                </div>
                <div className="p-4 space-y-2 bg-black/20">
                    {allDocuments.length > 0 ? (
                        allDocuments.map((doc) => (
                            <div key={doc.id} className="p-4 bg-neutral-800 rounded-xl flex items-center justify-between hover:bg-neutral-800/80 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-neutral-900 text-purple-400 rounded-xl">
                                        <HugeiconsIcon icon={FileText} size={18} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white">{doc.name}</p>
                                        <p className="text-[10px] text-slate-800 font-mono mt-0.5">{getDocumentTypeLabel(doc.type)}</p>
                                    </div>
                                </div>
                                <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#9c27b3] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-purple-700 transition-colors no-underline"
                                >
                                    <HugeiconsIcon icon={Download} size={12} strokeWidth={2.5} />
                                    View
                                </a>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-neutral-500 text-xs font-bold uppercase tracking-wider">No documents uploaded for this application</div>
                    )}
                </div>
            </div>
        </div>
    );
}
