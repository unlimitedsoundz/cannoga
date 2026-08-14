'use client';

export const dynamic = 'force-dynamic';

import { createClient } from '@/utils/supabase/client';
import { getDocumentUrl } from '@/utils/document';
import { redirect, useSearchParams, useRouter } from 'next/navigation';
import { Link } from "@aalto-dx/react-components";
import { CaretRight as ChevronRight, CircleNotch as Loader2, UploadSimple, Trash, CheckCircle, Receipt, WarningCircle as AlertCircle, Clock } from "@phosphor-icons/react";
import { formatToDDMMYYYY } from '@/utils/date';
import { useState, useEffect, Suspense } from 'react';
import { addApplicationDocument, deleteApplicationDocument, updateApplicationStatus, regenerateLOA } from '@/app/portal/actions';
import { toast } from 'sonner';

function ViewApplicationContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [application, setApplication] = useState<any>(null);
    const [offer, setOffer] = useState<any>(null);
    const [payments, setPayments] = useState<any[]>([]);
    const [isOfferAccepted, setIsOfferAccepted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadingType, setUploadingType] = useState<string | null>(null);
    const [refreshFlag, setRefreshFlag] = useState(0);
    const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [selectedRequirementId, setSelectedRequirementId] = useState('ACADEMIC_DOCUMENTS');
    const [offerExpanded, setOfferExpanded] = useState(true);
    const [invoicesExpanded, setInvoicesExpanded] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [palDocument, setPalDocument] = useState<any>(null);
    const [receiptDocument, setReceiptDocument] = useState<any>(null);

    useEffect(() => {
        async function loadData() {
            if (!id) {
                redirect('/portal/dashboard');
                return;
            }

            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                redirect('/portal/account/login');
                return;
            }

            try {
                const { data: applicationRaw, error: appError } = await supabase
                    .from('applications')
                    .select(`
                        *,
                        course:Course(*, school:School(*)),
                        alternate_course:Course(*) ,
                        user:profiles(*),
                        documents:application_documents(*)
                    `)
                    .eq('id', id)
                    .eq('user_id', user.id)
                    .single();

                if (appError || !applicationRaw) {
                    setError("Application not found.");
                    return;
                }

                setApplication(applicationRaw);

                const { data: offerData } = await supabase
                    .from('admission_offers')
                    .select('*')
                    .eq('application_id', id)
                    .maybeSingle();

                setOffer(offerData);

                const accepted = offerData?.status === 'ACCEPTED' ||
                    applicationRaw.status === 'PAYMENT_SUBMITTED' ||
                    applicationRaw.status === 'ENROLLED';
                setIsOfferAccepted(accepted);

                const { data: paymentsData } = await supabase
                    .from('tuition_payments')
                    .select('*')
                    .eq('offer_id', offerData?.id)
                    .order('created_at', { ascending: false });

                setPayments(paymentsData || []);

                const { data: studentData } = await supabase
                    .from('students')
                    .select('id')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (studentData) {
                    const { data: palData } = await supabase
                        .from('document_records')
                        .select('*')
                        .eq('student_id', studentData.id)
                        .eq('document_type', 'pal')
                        .eq('is_student_visible', true)
                        .maybeSingle();

                    setPalDocument(palData);

                    const { data: receiptData } = await supabase
                        .from('document_records')
                        .select('*')
                        .eq('student_id', studentData.id)
                        .eq('document_type', 'tuition_receipt')
                        .eq('is_student_visible', true)
                        .order('issue_date', { ascending: false })
                        .limit(1)
                        .maybeSingle();

                    setReceiptDocument(receiptData);
                }

                if (offerData && ['OFFER_ACCEPTED', 'PAYMENT_SUBMITTED', 'ENROLLED'].includes(applicationRaw.status)) {
                    try {
                        await regenerateLOA(applicationRaw.id);
                    } catch (loaError) {
                        console.error('Failed to sync LOA on view page:', loaError);
                    }
                }
            } catch (err: any) {
                console.error("Error loading application:", err);
                setError(err.message || "Failed to load application");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id, refreshFlag]);

    useEffect(() => {
        if (application?.status === 'ENROLLED') {
            router.push('/sis');
        }
    }, [application?.status, router]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                setRefreshFlag(prev => prev + 1);
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);
        return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [id]);

    useEffect(() => {
        const pollInterval = setInterval(() => {
            setRefreshFlag(prev => prev + 1);
        }, 5000);

        return () => clearInterval(pollInterval);
    }, [id]);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert('Please upload a file smaller than 10MB.');
            return;
        }

        setUploadingType(type);
        setUploadError(null);

        try {
            const fileExt = file.name.split('.').pop();
            const storagePath = `${id}/${type}_${Date.now()}.${fileExt}`;

            const supabase = createClient();

            // Step 1: Upload to storage
            const { error: uploadError } = await supabase.storage
                .from('application-documents')
                .upload(storagePath, file);

            if (uploadError) {
                console.error('Storage upload error:', uploadError);
                throw new Error(`Storage upload failed: ${uploadError.message}`);
            }

            // Step 2: Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('application-documents')
                .getPublicUrl(storagePath);

            if (!publicUrl) {
                throw new Error('Could not get public URL for uploaded file');
            }

            // Step 3: Save document metadata via server action
            let docMetaResult;
            try {
                docMetaResult = await addApplicationDocument(id!, type, publicUrl, file.name);
            } catch (metaError: any) {
                console.error('Server action error:', metaError);
                throw new Error(`Failed to save document record: ${metaError?.message || 'Unknown error'}`);
            }

            if (!docMetaResult?.success) {
                throw new Error('Failed to save document record');
            }

            // Step 4: Verify the document was saved by querying client-side
            const { data: docs, error: docsError } = await supabase
                .from('application_documents')
                .select('type')
                .eq('application_id', id!);

            if (docsError) {
                console.error('Client-side query error:', docsError);
                throw new Error(`Failed to verify upload: ${docsError.message}`);
            }

            const requiredAcademicTypes = ['TRANSCRIPT', 'CERTIFICATE'];
            const uploadedTypes = new Set((docs || []).map((d: any) => (d.type || '').toUpperCase()));
            const academicDocsUploaded = requiredAcademicTypes.some(t => uploadedTypes.has(t));
            const passportUploaded = uploadedTypes.has('PASSPORT');
            const allRequiredUploaded = academicDocsUploaded && passportUploaded;

            // Step 5: Update status if all required docs uploaded
            if (allRequiredUploaded && application.status === 'DRAFT') {
                const { updateApplicationStatus } = await import('@/app/portal/actions');
                await updateApplicationStatus(id!, 'UNDER_REVIEW');
            }

            setRefreshFlag((count) => count + 1);
            setUploadError(null);

        } catch (err: any) {
            console.error('Document upload failed:', err);
            const message = err?.message || 'Upload failed. Please try again.';
            alert(`Upload failed: ${message}`);
            setUploadError(message);
        } finally {
            setUploadingType(null);
        }
    };

    const handleAcceptOffer = async () => {
        if (!id) return;
        setActionLoading('accept');
        try {
            const response = await fetch(`/api/portal/application/accept?id=${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to accept offer');
            }

            toast.success('Congratulations! Your offer has been accepted. Next step: Tuition Deposit and PAL Issue.');
            setIsOfferAccepted(true);
            setRefreshFlag((count) => count + 1);
        } catch (err: any) {
            toast.error(err.message || 'Failed to accept offer');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectOffer = async () => {
        if (!id) return;
        setActionLoading('reject');
        try {
            const response = await fetch(`/api/portal/application/reject?id=${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to decline offer');
            }

            toast.success('You have declined the offer.');
            setIsOfferAccepted(false);
            setRefreshFlag((count) => count + 1);
        } catch (err: any) {
            toast.error(err.message || 'Failed to decline offer');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center">
                <h2 className="text-xl font-bold text-black mb-4">{error || "Application not found"}</h2>
                <Link href="/portal/dashboard" className="text-[13px] font-bold text-black hover:underline">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const sectionHeader = (title: string) => (
        <h3 className="text-[11px] font-black text-black mb-4 pb-1 border-b border-neutral-100">
            {title}
        </h3>
    );

    const dataRow = (label: string, value: any) => (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-1 py-2" style={{ borderTop: '1px solid #d4d4d4' }}>
            <span className="text-[11px] font-semibold text-black">{label}</span>
            <span className="md:col-span-2 text-[13px] font-semibold text-black">
                {value || <span className="text-neutral-300 italic">Not provided</span>}
            </span>
        </div>
    );

    const requirements = [
        {
            id: 'ACADEMIC_DOCUMENTS',
            title: 'Academic Documents',
            description: [
                'Academic Documents:',
                'Important Note 1: Electronic copies must be officially translated and certified documents. You may be asked, at any point during the admissions process or during your studies, to provide us with original documents and/or certified translations.',
                'Important Note 2: Please ensure academic documents are consolidated in one PDF file, and arranged from oldest to most recent.',
                '1. Transcripts (Subjects & Grades) and',
                '2. Proof of Graduation (Diploma, Degree or Certificate of Enrolment) OR Proof of final year registration of High School for admission to a Diploma, Certificate or Bachelor Degree program or University Degree or College Diploma for admission to a Graduate Certificate program.',
                'SOUTH ASIA OFF-SHORE applicants:',
                '- Admission to a Diploma, Certificate or Bachelor Degree program: Class X & Class XII marksheets.',
                '- Admission to a Graduate Certificate program: Bachelors/Undergraduate all semester/year marksheets & Degree or provisional certificate.',
                '- Masters all semester/year marksheets and Degree/ Provisional certificate (if applicable).',
                '- Bachelor Backlog Letter or No Backlog Letter from College/ University (if applicable).',
                '3. Copy of Passport first page.',
            ],
            uploadType: 'TRANSCRIPT',
            submitted: !!application.documents?.some((doc: any) => ['TRANSCRIPT', 'CERTIFICATE'].includes(doc.type)),
        },
        {
            id: 'PASSPORT_COPY',
            title: 'Valid Passport Copy',
            description: [
                'Valid Passport Copy:',
                'Please upload a clear scan or photo of the first page of your passport.',
                'Your passport must be valid for the full duration of your intended program.',
            ],
            uploadType: 'PASSPORT',
            submitted: !!application.documents?.some((doc: any) => doc.type === 'PASSPORT'),
        },
    ];

    const selectedRequirement = requirements.find((req) => req.id === selectedRequirementId) || requirements[0];
    const selectedDocs = application.documents?.filter((doc: any) => {
        if (selectedRequirement.uploadType === 'TRANSCRIPT') {
            return ['TRANSCRIPT', 'CERTIFICATE'].includes(doc.type);
        }
        return doc.type === selectedRequirement.uploadType;
    }) || [];

    const handleDelete = async (doc: any) => {
        if (!doc || !window.confirm('Delete this file?')) return;
        setDeletingDocId(doc.id);

        try {
            const path = doc.url.split('application-documents/').pop();
            if (!path) throw new Error('Invalid file URL');
            await deleteApplicationDocument(id!, doc.id, path);
            setRefreshFlag((count) => count + 1);
        } catch (deleteError) {
            console.error('Delete failed:', deleteError);
            alert('Delete failed. Please try again.');
        } finally {
            setDeletingDocId(null);
        }
    };

    const documentCount = selectedDocs.length;

    const requiredAcademicTypes = ['TRANSCRIPT', 'CERTIFICATE'];
    const uploadedDocTypes = new Set((application.documents || []).map((d: any) => (d.type || '').toUpperCase()));
    const academicDocsUploaded = requiredAcademicTypes.some(type => uploadedDocTypes.has(type));
    const passportUploaded = uploadedDocTypes.has('PASSPORT');
    const allRequiredUploaded = academicDocsUploaded && passportUploaded;

    const steps = [
        { title: 'Submit Requirements' },
        { title: 'Under Review' },
        { title: 'Admission Started' },
        { title: 'Pre Orientation' },
    ];

    const progressIndex = ['SUBMITTED', 'DOCS_REQUIRED'].includes(application.status) ? 0
        : ['UNDER_REVIEW'].includes(application.status) ? 1
            : ['ADMITTED', 'OFFER_ACCEPTED', 'PAYMENT_SUBMITTED'].includes(application.status) ? 2
                : ['ENROLLED'].includes(application.status) ? 3
                    : 0;

    const hasOffer = !!offer;
    const hasInvoice = !!offer?.invoice_pushed;
    const hasPayments = payments.length > 0;
    const showOfferButton = hasOffer || ['ADMITTED', 'OFFER_ACCEPTED', 'PAYMENT_SUBMITTED', 'ENROLLED'].includes(application.status);

    return (
        <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-black mb-3">
                        <Link href="/portal/dashboard" className="hover:text-black transition-colors">Dashboard</Link>
                        <ChevronRight size={10} weight="bold" />
                        <span>Student Portal</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-black">
                        Welcome, {application.user?.first_name || 'Student'}
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        Manage your application, documents, payments, and more.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {hasInvoice && !hasPayments && application.status !== 'PAYMENT_SUBMITTED' && (
                        <Link
                            href={`/portal/application/payment?id=${application.id}`}
                            className="px-4 py-2 bg-neutral-900 text-white border border-neutral-900 rounded-sm text-[11px] font-bold hover:bg-neutral-800 transition-all"
                        >
                            Pay Invoice
                        </Link>
                    )}
                </div>
            </div>

            {/* Notifications */}
            <div className="space-y-2">
                {application.status === 'DOCS_REQUIRED' && (
                    <div className="border border-red-200 bg-red-50 p-3 rounded-xl flex items-start gap-3">
                        <div className="text-red-600 mt-0.5">
                            <AlertCircle size={16} weight="bold" />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-red-900 uppercase tracking-wider">Action Required</p>
                            <p className="text-[11px] text-red-800 font-medium mt-0.5">Additional documents have been requested. Please upload the required documents to continue processing your application.</p>
                        </div>
                    </div>
                )}

                {application.status === 'ADMITTED' && !isOfferAccepted && (
                    <div className="p-3">
                        <p className="text-[13px] font-bold text-black">Offer Pending Acceptance</p>
                        <p className="text-[11px] text-black font-medium mt-0.5">You have been admitted! Please accept your offer letter to proceed with enrollment.</p>
                        <div className="flex gap-2 mt-3">
                            <Link
                                href={`/portal/application/letter?id=${application.id}`}
                                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors inline-flex items-center"
                            >
                                View Offer
                            </Link>
                            <button
                                onClick={handleAcceptOffer}
                                disabled={actionLoading === 'accept'}
                                className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50"
                            >
                                {actionLoading === 'accept' ? 'Accepting...' : 'Accept Offer'}
                            </button>
                            <button
                                onClick={handleRejectOffer}
                                disabled={actionLoading === 'reject'}
                                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors disabled:opacity-50"
                            >
                                {actionLoading === 'reject' ? 'Declining...' : 'Decline Offer'}
                            </button>
                        </div>
                    </div>
                )}

                {application.status === 'OFFER_ACCEPTED' && (
                    <div>
                        <p>Congratulations! Your offer has been accepted.</p>
                        <p>Next steps: Tuition Deposit and PAL Issue. You will be notified once the invoice is sent.</p>
                    </div>
                )}

                                        {hasInvoice && !hasPayments && application.status !== 'PAYMENT_SUBMITTED' && (
                    <div className="p-3">
                        <p className="text-[13px] font-bold text-black">Your invoice has been generated. Please complete your payment to secure your enrollment.</p>
                        <p className="text-[11px] text-neutral-700 font-medium mt-0.5">Please note: After tuition deposit has been paid and verified, please allow 6-12 days for Provincial Attestation Letter (PAL) issuance.</p>
                    </div>
                )}

                {application.status === 'PAYMENT_SUBMITTED' && (
                    <div>
                        <p className="text-[13px] font-bold text-black">Your payment has been recorded. The finance office is currently verifying the transfer and you will be notified once it is confirmed.</p>
                    </div>
                )}

                {palDocument && (
                    <div className="border border-emerald-200 bg-emerald-50 p-3 rounded-xl flex items-start gap-3">
                        <div className="text-emerald-600 mt-0.5">
                            <CheckCircle size={16} weight="bold" />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-emerald-900 uppercase tracking-wider">PAL Issued</p>
                            <p className="text-[11px] text-emerald-800 font-medium mt-0.5">Your Provincial Attestation Letter (PAL) has been issued.</p>
                            <div className="flex gap-2 mt-2">
                                <a
                                    href={palDocument.storage_path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 bg-neutral-900 text-white text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors inline-flex items-center"
                                >
                                    View PAL
                                </a>
                                <a
                                    href={palDocument.storage_path}
                                    download
                                    className="px-3 py-1.5 border border-neutral-300 text-neutral-700 text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors inline-flex items-center"
                                >
                                    Download
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {receiptDocument && (
                    <div className="border border-blue-200 bg-blue-50 p-3 rounded-xl flex items-start gap-3">
                        <div className="text-blue-600 mt-0.5">
                            <Receipt size={16} weight="bold" />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-blue-900 uppercase tracking-wider">Payment Receipt</p>
                            <p className="text-[11px] text-blue-800 font-medium mt-0.5">Your tuition payment has been verified. Receipt is available.</p>
                            <div className="flex gap-2 mt-2">
                                <a
                                    href={getDocumentUrl(receiptDocument)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 bg-neutral-900 text-white text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors inline-flex items-center"
                                >
                                    View Receipt
                                </a>
                                <a
                                    href={getDocumentUrl(receiptDocument)}
                                    download
                                    className="px-3 py-1.5 border border-neutral-300 text-neutral-700 text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors inline-flex items-center"
                                >
                                    Download
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Progress Tracker */}
            <section className="bg-white border border-neutral-200 rounded-xl shadow-sm p-3 md:p-4">
                <div className="relative">
                    {steps.map((step, index) => {
                        const isComplete = index < progressIndex;
                        const isActive = index === progressIndex;
                        const isLast = index === steps.length - 1;
                        return (
                            <div key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
                                {!isLast && (
                                    <div className="absolute left-[7px] top-[18px] w-[2px] h-full bg-neutral-200">
                                        {isComplete && <div className="absolute inset-0 bg-emerald-500" />}
                                    </div>
                                )}
                                <div className={`h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0 z-10 ${isComplete ? 'bg-emerald-500 text-white' : isActive ? 'bg-blue-500 text-white' : 'bg-neutral-100 text-neutral-500'}`}>
                                    {isComplete ? <CheckCircle size={10} weight="bold" /> : index + 1}
                                </div>
                                <div className="flex-1 pt-0.5">
                                    <p className={`text-[11px] font-bold ${isActive ? 'text-blue-600' : isComplete ? 'text-emerald-600' : 'text-neutral-600'}`}>{step.title}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-[2.5fr_1fr] gap-4">
                <main className="space-y-4">
                    {/* Offer Details */}
                    {hasOffer && (
                        <section className="bg-white border border-neutral-100 rounded-xl shadow-sm p-5">
                            <button
                                onClick={() => setOfferExpanded(!offerExpanded)}
                                className="w-full flex items-center justify-between mb-4"
                            >
                                <h3 className="text-[11px] font-black text-black mb-0 pb-2 border-b border-black flex-1 text-left">
                                    Admission Offer Details
                                </h3>
                                <span className={`ml-2 transition-transform duration-200 ${offerExpanded ? 'rotate-90' : ''}`}>
                                    <ChevronRight size={12} weight="bold" />
                                </span>
                            </button>
                            {offerExpanded && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-neutral-500 mb-1">Program</p>
                                        <p className="text-sm font-bold text-black">{application.course?.title}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-neutral-500 mb-1">Offer Type</p>
                                        <p className="text-sm font-bold text-black">{offer.offer_type?.replace(/_/g, ' ') || 'Full Tuition'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-neutral-500 mb-1">
                                            {offer.offer_type === 'TUITION_DEPOSIT' ? 'Tuition Deposit' : 'Annual Tuition'}
                                        </p>
                                        <p className="text-sm font-bold text-black">${Number(offer.tuition_fee).toLocaleString()} CAD</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-neutral-500 mb-1">Payment Deadline</p>
                                        <p className="text-sm font-bold text-black">{offer.payment_deadline ? formatToDDMMYYYY(offer.payment_deadline) : 'TBD'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-neutral-500 mb-1">Status</p>
                                        <p className="text-sm font-bold text-black">{offer.status?.replace(/_/g, ' ') || 'Pending'}</p>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Invoice & Payment History */}
                    {(hasInvoice || hasPayments) && (
                        <section className="bg-white border border-neutral-100 rounded-xl shadow-sm p-5">
                            <button
                                onClick={() => setInvoicesExpanded(!invoicesExpanded)}
                                className="w-full flex items-center justify-between mb-4"
                            >
                                <h3 className="text-[11px] font-black text-black mb-0 pb-2 border-b border-black flex-1 text-left">
                                    Invoices & Payments
                                </h3>
                                <span className={`ml-2 transition-transform duration-200 ${invoicesExpanded ? 'rotate-90' : ''}`}>
                                    <ChevronRight size={12} weight="bold" />
                                </span>
                            </button>
                            {invoicesExpanded && (
                                <>
                                    {hasInvoice && application.status !== 'PAYMENT_SUBMITTED' && application.status !== 'ENROLLED' && (
                                        <div className="mb-4 p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-neutral-500 mb-1">Current Invoice</p>
                                                    <p className="text-sm font-bold text-black">{offer.invoice_type?.replace(/_/g, ' ') || 'Tuition Deposit'}</p>
                                                    {offer.invoice_sent_at && (
                                                        <p className="text-xs text-neutral-500 mt-1">Sent: {formatToDDMMYYYY(offer.invoice_sent_at)}</p>
                                                    )}
                                                </div>
                                                <Link
                                                    href={`/portal/application/payment?id=${application.id}`}
                                                    className="px-4 py-2 bg-neutral-900 text-white border border-neutral-900 rounded-sm text-[11px] font-bold hover:bg-neutral-800 transition-all"
                                                >
                                                    Pay Now
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                    {hasPayments && (
                                        <div className="space-y-2">
                                            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-neutral-500 mb-2">Payment History</p>
                                            {payments.map((payment: any) => (
                                                <div key={payment.id} className="flex items-center justify-between p-3 border border-neutral-200 rounded-xl">
                                                    <div>
                                                        <p className="text-sm font-bold text-black">{payment.invoice_type?.replace(/_/g, ' ') || 'Payment'}</p>
                                                        <p className="text-xs text-neutral-500">{formatToDDMMYYYY(payment.created_at)}</p>
                                                    </div>
                                                    <div className="text-right flex items-center gap-3">
                                                        <div>
                                                            <p className="text-sm font-bold text-black">${Number(payment.amount).toLocaleString()} {payment.currency || 'CAD'}</p>
                                                            <p className="text-xs text-neutral-500">{payment.status?.replace(/_/g, ' ') || 'Pending'}</p>
                                                        </div>
                                                        {payment.status === 'verified' && receiptDocument && (
                                                            <a
                                                                href={getDocumentUrl(receiptDocument)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="px-2 py-1 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors inline-flex items-center"
                                                            >
                                                                Receipt
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </section>
                    )}

                    {/* Document Upload */}
                    {!allRequiredUploaded && application.status !== 'ENROLLED' && (
                        <section className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden p-4">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                                <div>
                                    <p className="text-[11px] font-black text-black uppercase tracking-[0.22em] mb-2">Portal / Application Upload</p>
                                    <h2 className="text-2xl font-bold text-black">Upload Required Documents</h2>
                                    <p className="max-w-2xl mt-2 text-sm text-neutral-700">
                                        Upload your supporting documents for Cannoga College. Please review each requirement and submit the requested files so we can continue processing your application.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-[1.25fr_0.85fr]">
                                <div className="space-y-4">
                                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                                        <div className="flex items-center justify-between gap-4 mb-3">
                                            <div>
                                                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-neutral-500">Selected Requirement</p>
                                                <h3 className="mt-1 text-lg font-bold text-black">{selectedRequirement.title}</h3>
                                            </div>
                                            <span className="rounded-full bg-[#0a151a] px-3 py-1 text-[11px] font-bold text-white uppercase tracking-[0.2em]">
                                                {selectedRequirement.submitted ? 'Submitted' : 'Pending'}
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm text-neutral-700">
                                            {selectedRequirement.description.map((line, idx) => (
                                                <p key={idx}>{line}</p>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-neutral-200 p-4">
                                        <div className="flex items-center justify-between gap-3 mb-3">
                                            <div>
                                                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-neutral-500">Upload your file</p>
                                                <h3 className="mt-1 text-base font-bold text-black">Add a document</h3>
                                            </div>
                                            <div className="text-right text-xs text-neutral-500">
                                                <p>Max file size 10MB</p>
                                                <p>Accepted format: PDF, JPG, PNG</p>
                                            </div>
                                        </div>

                                        <label htmlFor="document-upload" className="group flex min-h-[140px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white p-6 text-center transition hover:border-black hover:bg-neutral-100 cursor-pointer">
                                            <UploadSimple className="text-neutral-400 group-hover:text-black" size={28} />
                                            <p className="mt-3 text-sm font-semibold text-black">Drag & drop your file here, or click to browse</p>
                                            <p className="mt-1 text-xs text-neutral-500">Once uploaded, we will save it to your application and make it available for review.</p>
                                            <input
                                                id="document-upload"
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                className="sr-only"
                                                onChange={(event) => handleUpload(event, selectedRequirement.uploadType)}
                                                disabled={!!uploadingType}
                                            />
                                        </label>

                                        {uploadingType && (
                                            <div className="mt-3 rounded-lg bg-[#f8fafc] px-3 py-2 text-sm text-neutral-700">
                                                Uploading {uploadingType === 'TRANSCRIPT' ? 'academic documents' : 'passport copy'}...
                                            </div>
                                        )}

                                        {uploadError && (
                                            <div className="mt-3 rounded-lg bg-[#fff1f2] px-3 py-2 text-sm text-red-600">
                                                {uploadError}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <aside className="space-y-4">
                                    <div className="rounded-2xl border border-neutral-200 p-4 bg-white">
                                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-neutral-500 mb-2">Requirements</p>
                                        <div className="space-y-2">
                                            {requirements.map((requirement) => (
                                                <button
                                                    key={requirement.id}
                                                    type="button"
                                                    onClick={() => setSelectedRequirementId(requirement.id)}
                                                    className={`w-full text-left rounded-xl border p-3 transition ${selectedRequirement.id === requirement.id ? 'border-black bg-[#f8fafc]' : 'border-neutral-200 bg-white hover:border-black hover:bg-neutral-50'}`}
                                                >
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div>
                                                            <p className="text-sm font-bold text-black">{requirement.title}</p>
                                                            <p className="mt-0.5 text-xs text-neutral-500">{requirement.submitted ? 'Document uploaded' : 'Upload required'}</p>
                                                        </div>
                                                        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] bg-[#0a151a] text-white">
                                                            {requirement.submitted ? 'Completed' : 'Required'}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-neutral-200 p-4 bg-white">
                                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-neutral-500 mb-2">Your uploaded file{documentCount !== 1 ? 's' : ''}</p>
                                        {documentCount > 0 ? (
                                            <div className="space-y-2">
                                                {selectedDocs.map((doc: any) => (
                                                    <div key={doc.id} className="rounded-xl border border-neutral-200 p-3">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <p className="text-sm font-bold text-black">{doc.name || doc.filename || 'Uploaded document'}</p>
                                                                <a href={doc.url} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-2 text-xs text-[#1d4ed8] hover:underline">
                                                                    View document
                                                                </a>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(doc)}
                                                                disabled={deletingDocId === doc.id}
                                                                className="inline-flex items-center gap-1 rounded-full border border-neutral-200 px-2 py-1 text-[10px] font-bold text-neutral-600 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                            >
                                                                <Trash size={12} />
                                                                {deletingDocId === doc.id ? 'Deleting...' : 'Delete'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="rounded-2xl border border-dashed border-neutral-200 p-6 text-sm text-neutral-500 text-center">
                                                No documents uploaded yet for this requirement.
                                            </div>
                                        )}
                                    </div>
                                </aside>
                            </div>
                        </section>
                    )}

                    {/* Application Details */}
                    <section className="bg-white border border-neutral-200 rounded-xl shadow-sm">
                        <div className="px-5 py-3 border-b border-neutral-100">
                            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#2d2d2d]">Application & Applicant Detail</h2>
                        </div>
                        <div>
                            {dataRow('Admission Name', application.application_number || application.id.slice(0, 8))}
                            {dataRow('Contact Name', application.user?.first_name && application.user?.last_name ? `${application.user.first_name}${application.user.middle_name ? ` ${application.user.middle_name}` : ''} ${application.user.last_name}` : application.personal_info?.firstName && application.personal_info?.lastName ? `${application.personal_info.firstName}${application.personal_info.middleName ? ` ${application.personal_info.middleName}` : ''} ${application.personal_info.lastName}` : application.user?.email)}
                            {dataRow('Email Address', application.user?.email)}
                            {dataRow('Gender', application.user?.gender)}
                            {dataRow('Date of Birth', application.user?.date_of_birth)}
                            {dataRow('Citizenship', application.user?.citizenship)}
                            {dataRow('Passport Number', application.user?.passport_number)}
                            {dataRow('Phone', application.user?.phone_number ? `${application.user.phone_code || ''} ${application.user.phone_number}` : null)}
                            {dataRow('Permanent Address', application.user?.address ? `${application.user.address}, ${application.user.city || ''}, ${application.user.state_province || ''}, ${application.user.country_of_residence || ''} ${application.user.zipcode || ''}` : null)}
                            {dataRow('Local/Canadian Address', application.user?.local_address ? `${application.user.local_address}, ${application.user.local_city || ''}, ${application.user.local_state_province || ''}, ${application.user.local_country || ''} ${application.user.local_zipcode || ''}` : application.user?.address ? 'Same as permanent address' : null)}
                            {dataRow('19 Years or Older?', application.user?.is_19_or_older)}
                            {dataRow('Emergency / Guardian Contact', application.user?.contact_first_name ? `${application.user.contact_first_name} ${application.user.contact_last_name}` : null)}
                            {dataRow('Emergency / Guardian Phone', application.user?.contact_phone)}
                            {dataRow('Emergency / Guardian Email', application.user?.contact_email)}
                            {dataRow('Siblings at Cannoga College?', application.user?.has_siblings_at_college)}
                            {dataRow('Who Completed Form?', application.user?.completing_form_person)}
                            {dataRow('Housing Requirements', application.user?.housing_required)}
                            {dataRow('How Did You Hear About Us?', application.user?.how_did_you_hear)}
                            {dataRow('Questions / Comments', application.user?.questions_comments)}
                            {dataRow('Academic Program Choice', application.course?.title)}
                            {dataRow('Alternate Program Choice', application.alternate_course?.title || 'Not selected')}
                            {dataRow('Desired Academic Term', application.intake || 'Not provided')}
                            {dataRow('Program Type', application.program_type || application.course?.programType || 'Not provided')}
                        </div>
                    </section>
                </main>

                <aside className="space-y-4">
                    {/* Quick Links */}
                    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5">
                        {sectionHeader('Quick Links')}
                    <div className="space-y-1">
                        {application.status !== 'PAYMENT_SUBMITTED' && application.status !== 'ENROLLED' && (
                            <Link href={`/portal/application/payment?id=${application.id}`} className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl hover:border-black transition-colors block">
                                <div>
                                    <p className="text-sm font-bold text-blue-600 underline">Tuition Payment</p>
                                    <p className="text-xs text-neutral-500">View and pay fees</p>
                                </div>
                            </Link>
                        )}
                        <Link href="/portal/student/housing" className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl hover:border-black transition-colors block">
                            <div>
                                <p className="text-sm font-bold text-blue-600 underline">Housing</p>
                                <p className="text-xs text-neutral-500">Find accommodation</p>
                            </div>
                        </Link>
                        <Link href="/portal/student/courses" className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl hover:border-black transition-colors block">
                            <div>
                                <p className="text-sm font-bold text-blue-600 underline">Student Portal</p>
                                <p className="text-xs text-neutral-500">Courses & resources</p>
                            </div>
                        </Link>
                        <Link href="/portal/student" className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl hover:border-black transition-colors block">
                            <div>
                                <p className="text-sm font-bold text-blue-600 underline">Academic Dashboard</p>
                                <p className="text-xs text-neutral-500">Your enrollment portal</p>
                            </div>
                        </Link>
                    </div>
                    </div>

                    </aside>
            </div>
        </div>
    );
}

export default function ViewApplicationPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        }>
            <ViewApplicationContent />
        </Suspense>
    );
}

