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

                // Fetch application with user and course info
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

                // Fetch all documents uploaded during application
                const { data: docsData, error: docsError } = await supabase
                    .from('application_documents')
                    .select('id, application_id, type, url, name, uploaded_at')
                    .eq('application_id', id)
                    .order('uploaded_at', { ascending: false });

                if (docsError) {
                    console.error('Error fetching application documents:', docsError);
                }

                setApplicationDocuments(docsData || []);

                // Fetch admission offer for LOA PDF
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="mb-4">
                    <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors">
                        <HugeiconsIcon icon={ArrowLeft} size={14} strokeWidth={2} />
                        Back
                    </button>
                </div>
                <PageHeader title="Application Not Found" subtitle="The requested application could not be loaded." />
                <div className="mt-6 p-8 bg-red-50 border border-red-100 text-center">
                    <p className="text-red-600 font-medium mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/sis/admin/documents')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded hover:bg-neutral-800 transition-colors"
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

    // Combine uploaded documents with LOA from admission offer
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
        <div className="p-8">
            <PageHeader
                title={application?.course?.title || 'Application Documents'}
                subtitle={`Application ID: ${application?.id?.slice(0, 8)}`}
            />

            <div className="mt-6 bg-white border border-neutral-200 rounded-lg p-6 mb-6">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Application Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-[10px] font-medium text-neutral-400 uppercase">Student Name</p>
                        <p className="text-sm font-medium text-neutral-900">
                            {application?.user?.first_name} {application?.user?.last_name}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-medium text-neutral-400 uppercase">Email</p>
                        <p className="text-sm text-neutral-700">{application?.user?.email}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-medium text-neutral-400 uppercase">Programme</p>
                        <p className="text-sm text-neutral-700">{application?.course?.title}{application?.course?.degreeLevel ? ` â€” ${formatDegreeLevel(application.course.degreeLevel)}` : ''}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-medium text-neutral-400 uppercase">Status</p>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${application?.status === 'ADMITTED' ? 'bg-emerald-50 text-emerald-700' : application?.status === 'REJECTED' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                            {application?.status?.replace('_', ' ')}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Uploaded Documents</h3>
                        <p className="text-xs text-neutral-400 mt-1">{allDocuments.length} document(s) for this application</p>
                    </div>
                </div>
                {allDocuments.length > 0 ? (
                    <div className="divide-y divide-neutral-100">
                        {allDocuments.map((doc) => (
                            <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-neutral-50">
                                <div className="flex items-center gap-3">
                                    <HugeiconsIcon icon={FileText} size={20} strokeWidth={2} className="text-neutral-400" />
                                    <div>
                                        <p className="text-sm font-medium text-neutral-900">{doc.name}</p>
                                        <p className="text-xs text-neutral-500">{getDocumentTypeLabel(doc.type)}</p>
                                    </div>
                                </div>
                                <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded hover:bg-neutral-800 transition-colors"
                                >
                                    <HugeiconsIcon icon={Download} size={12} strokeWidth={2} />
                                    View
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-neutral-500 text-sm">No documents uploaded for this application</div>
                )}
            </div>
        </div>
    );
}

