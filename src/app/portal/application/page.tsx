'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Application } from '@/types/database';
import { Link } from "@aalto-dx/react-components";
import { CheckCircle as CheckCircle2, CaretRight as ChevronRight } from "@phosphor-icons/react/dist/ssr";
import PersonalInfoForm from '@/components/portal/wizard/PersonalInfoForm';
import ContactDetailsForm from '@/components/portal/wizard/ContactDetailsForm';
import AcademicHistoryForm from '@/components/portal/wizard/AcademicHistoryForm';
import MotivationForm from '@/components/portal/wizard/MotivationForm';
import DocumentsForm from '@/components/portal/wizard/DocumentsForm';
import ReviewStep from '@/components/portal/wizard/ReviewStep';
import WelcomeStep from '@/components/portal/wizard/WelcomeStep';
import { getProgrammeInstructions } from '@/utils/programme-instructions';
import { ensureStudentId } from '../profile-actions';
import { ProgressIndicator } from "@aalto-dx/react-components";

function ApplicationWizardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const stepParam = searchParams.get('step');

    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [application, setApplication] = useState<(Application & {
        user: { email: string },
        documents: any[],
        course: any
    }) | null>(null);

    useEffect(() => {
        if (!id) {
            router.push('/portal/dashboard');
            return;
        }

        const fetchApplicationData = async () => {
            try {
                // 1. Primary Auth Check (Supabase)
                const { data: { user: currentUser } } = await supabase.auth.getUser();

                if (!currentUser) {
                    console.log('[ApplicationWizard] No active session, redirecting to login');
                    router.push('/portal/account/login');
                    return;
                }

                const currentUserId = currentUser.id;

                const { data: applicationRaw, error: appError } = await supabase
                    .from('applications')
                    .select(`
                        *,
                        course:Course(*, school:School(*)),
                        user:profiles(email, student_id),
                        documents:application_documents(*)
                    `)
                    .eq('id', id)
                    .eq('user_id', currentUserId || '')
                    .single();

                if (appError || !applicationRaw) {
                    if (appError?.code === 'PGRST116' || !applicationRaw) {
                        console.warn(`[ApplicationWizard] Application not found. ID: ${id}, User: ${currentUserId}`);
                    } else {
                        console.error('[ApplicationWizard] Error fetching application:', appError);
                    }
                    router.push('/portal/dashboard');
                    return;
                }

                setApplication(applicationRaw as any);

                // ENSURE STUDENT ID
                if (applicationRaw.user && !(applicationRaw.user as any).student_id) {
                    await ensureStudentId();
                }

            } catch (err) {
                console.error('CRITICAL: Fetching application failed', err);
                router.push('/portal/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationData();
    }, [id, stepParam, router, supabase]);

    const refreshApplication = async () => {
        setLoading(true);
        try {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) return;

            const { data: applicationRaw } = await supabase
                .from('applications')
                .select(`
                    *,
                    course:Course(*, school:School(*)),
                    user:profiles(email, student_id),
                    documents:application_documents(*)
                `)
                .eq('id', id)
                .eq('user_id', currentUser.id)
                .single();

            if (applicationRaw) {
                setApplication(applicationRaw as any);
                if (applicationRaw.user && !(applicationRaw.user as any).student_id) {
                    await ensureStudentId();
                }
            }

        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <ProgressIndicator size={32} />
            </div>
        );
    }

    if (!application) return null;

    // Define Base Steps
    const stepsConf = [
        { id: 1, name: 'Instructions', key: 'instructions' },
        { id: 2, name: 'Personal Info', key: 'personal_info' },
        { id: 3, name: 'Contact Details', key: 'contact_details' },
        { id: 4, name: 'Academic History', key: 'education_history' },
        { id: 5, name: 'Motivation Letter / Statement of Purpose', key: 'motivation' },
        { id: 6, name: 'Documents', key: 'documents' },
        { id: 7, name: 'Review', key: 'review' },
    ];

    // Calculate Progress and Allowed Step
    const getStepStatus = (index: number) => {
        const step = stepsConf[index];
        if (step.key === 'instructions') return true;
        if (step.key === 'documents') {
            const baseRequired = ['PASSPORT', 'TRANSCRIPT', 'CERTICACATE', 'CV', 'MOTIVATION_LETTER'];
            const requested = application.requested_documents || [];
            const allRequired = Array.from(new Set([...baseRequired, ...requested]));
            const uploadedTypes = application.documents?.map(d => d.type) || [];
            return allRequired.every(type => uploadedTypes.includes(type));
        }
        if (step.key === 'review') return false;
        return (application as any)[step.key] != null;
    };

    // Find the latest step reached
    let maxAllowedStep = 1;
    const hasStartedFilling = application.personal_info != null;

    for (let i = 0; i < stepsConf.length - 1; i++) {
        if (getStepStatus(i)) {
            maxAllowedStep = i + 2;
        } else {
            break;
        }
    }

    // Determine requested step vs allowed step
    const defaultStep = application.status === 'DOCS_REQUIRED' ? 6 : (hasStartedFilling ? maxAllowedStep : 1);
    const requestedStep = stepParam ? parseInt(stepParam) : defaultStep;
    const currentStepId = Math.min(requestedStep, maxAllowedStep);
    const currentStep = stepsConf.find(s => s.id === currentStepId) || stepsConf[0];

    // Instructions for the current course
    const programmeInstructions = getProgrammeInstructions(application.course?.slug);

    const steps = stepsConf.map((step) => {
        const isCompleted = getStepStatus(step.id - 1);
        let status = 'upcoming';
        if (step.id === currentStepId) {
            status = 'current';
        } else if (isCompleted || step.id < currentStepId) {
            status = 'completed';
        }
        return { ...step, status, isLocked: step.id > maxAllowedStep };
    });

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8 border-b border-neutral-200 pb-6 text-black">
                <div className="flex items-center gap-2 text-[11px] text-black mb-2 font-bold">
                    <Link href="/portal/dashboard" className="hover:text-black transition-colors">Dashboard</Link>
                    <ChevronRight size={10} weight="bold" />
                    <span className="text-black">Application #{application.application_number || application.user?.student_id || 'Generating...'}</span>
                    {application.user?.student_id && (
                        <>
                            <span className="text-neutral-300">|</span>
                            <span className="text-black">Student ID: {application.user.student_id}</span>
                        </>
                    )}
                </div>
                <h1 className="text-2xl font-black tracking-tighter leading-none mb-1">
                    {application.course?.title}
                    {application.course?.programType && (
                        <span className="text-black font-bold"> — {application.course.programType}</span>
                    )}
                    {application.course?.duration && (
                        <span className="text-black font-bold"> — {application.course.duration}</span>
                    )}
                    {application.course?.school && (
                        <span className="text-black font-bold"> — {application.course.school.name}</span>
                    )}
                </h1>
                <div className="flex items-center justify-between gap-4">
                    <p className="text-black font-bold text-[11px]">Step {currentStepId} / {stepsConf.length}: {currentStep.name}</p>
                    <span className="text-[11px] font-black text-black">{Math.round((currentStepId / stepsConf.length) * 100)}% Complete</span>
                </div>
                <div className="mt-3 w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                    <div
                        className="bg-[#9c27b3] h-full transition-all duration-700 ease-in-out"
                        style={{ width: `${(currentStepId / stepsConf.length) * 100}%` }}
                    />
                </div>
            </div>

            {application.status === 'ADMITTED' && (
                <div className="mb-8 bg-neutral-50 border border-neutral-100 p-6 rounded-sm flex items-center justify-between">
                    <div>
                        <h3 className="text-neutral-900 font-bold tracking-tight text-sm mb-1">Congratulations! You have an admission offer.</h3>
                        <p className="text-neutral-700 text-xs font-medium">Please review your Letter of Acceptance (LOA) and accept it to proceed with your enrollment.</p>
                    </div>
                    <Link
                        href={`/portal/application/letter?id=${application.id}`}
                        className="bg-neutral-600 text-white px-6 py-2 rounded-sm text-[11px] font-bold hover:bg-neutral-700 transition-all shadow-sm flex items-center gap-2"
                    >
                        <CheckCircle2 size={16} weight="bold" />
                        View Letter of Acceptance (LOA)
                    </Link>
                </div>
            )}

            {application.status === 'OFFER_ACCEPTED' && (
                <div className="mb-8 bg-blue-50 border border-blue-100 p-6 rounded-sm flex items-center justify-between">
                    <div>
                        <h3 className="text-blue-900 font-bold tracking-tight text-sm mb-1">Offer Accepted</h3>
                        <p className="text-blue-700 text-xs font-medium">You have accepted the offer. Please finalize your tuition payment to complete enrollment.</p>
                    </div>
                    <Link
                        href={`/portal/application/payment?id=${application.id}`}
                        className="bg-blue-600 text-white px-6 py-2 rounded-sm text-[11px] font-bold hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2"
                    >
                        Proceed to Payment
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-2 space-y-0.5">
                    {steps.map((step) => {
                        const isClickable = !step.isLocked;
                        const content = (
                            <div
                                className={`flex items-center gap-3 p-3 rounded-sm text-[13px] font-bold transition-all ${step.status === 'current' ? 'bg-[#9c27b3] text-white shadow-sm' :
                                    step.status === 'completed' ? 'text-black hover:bg-neutral-50' : 'text-neutral-400'
                                    } ${!isClickable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <div className={`shrink-0 flex items-center justify-center ${step.status === 'current' ? 'text-white' : 'text-current'
                                    }`}>
                                    <ChevronRight size={14} weight="bold" />
                                </div>
                                <span className="font-black leading-none">{step.name}</span>
                            </div>
                        );

                        if (isClickable) {
                            return <Link key={step.id} href={`?id=${id}&step=${step.id}`}>{content}</Link>;
                        }
                        return <div key={step.id}>{content}</div>;
                    })}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-7 bg-white p-6 rounded-sm border border-neutral-100 h-fit space-y-6">
                    <div className="flex-1">
                        <h2 className="text-sm font-semibold mb-6 pb-2 border-b border-neutral-100 text-black leading-none">
                            {currentStep.name}
                        </h2>

                        {currentStep.id === 1 && (
                            <WelcomeStep
                                instructions={programmeInstructions}
                                nextStepHref={`?id=${id}&step=2`}
                            />
                        )}

                        {currentStep.id === 2 && (
                            <PersonalInfoForm
                                applicationId={application.id}
                                initialData={application.personal_info}
                                onUpdate={refreshApplication}
                            />
                        )}

                        {currentStep.id === 3 && (
                            <ContactDetailsForm
                                applicationId={application.id}
                                initialData={application.contact_details}
                                defaultEmail={application.user?.email}
                                onUpdate={refreshApplication}
                            />
                        )}

                        {currentStep.id === 4 && (
                            <AcademicHistoryForm
                                applicationId={application.id}
                                initialData={application.education_history}
                                onUpdate={refreshApplication}
                            />
                        )}

                        {currentStep.id === 5 && (
                            <MotivationForm
                                applicationId={application.id}
                                initialData={application.motivation}
                                onUpdate={refreshApplication}
                            />
                        )}

                        {currentStep.id === 6 && (
                            <DocumentsForm
                                applicationId={application.id}
                                existingDocuments={application.documents}
                                requestedDocuments={application.requested_documents}
                                documentRequestNote={application.document_request_note}
                                onUpdate={refreshApplication}
                            />
                        )}

                        {currentStep.id === 7 && (
                            <ReviewStep application={application} />
                        )}
                    </div>
                </div>

                {/* Summary Sidebar (Always On) */}
                <div className="lg:col-span-3">
                    <div className="bg-white p-6 rounded-sm border border-neutral-100 lg:sticky lg:top-8">
                        <h3 className="text-[13px] font-semibold text-black mb-4">Application Summary</h3>

                        <div className="space-y-4">
                            {application.personal_info && (
                                <div className="space-y-1">
                                    <p className="text-[13px] font-semibold text-black tracking-tight">Applicant</p>
                                    <p className="text-sm font-semibold text-black leading-tight">
                                        {application.personal_info.firstName} {application.personal_info.lastName}
                                    </p>
                                </div>
                            )}

                            {application.contact_details && (
                                <div className="space-y-1">
                                    <p className="text-[13px] font-semibold text-black tracking-tight">Contact</p>
                                    <p className="text-sm font-semibold text-black leading-tight">{application.contact_details.email}</p>
                                    <p className="text-sm font-semibold text-black leading-tight">{application.contact_details.phone}</p>
                                    {(application.contact_details.city || application.contact_details.country) && (
                                        <p className="text-xs text-black mt-1">
                                            {[application.contact_details.city, application.contact_details.country].filter(Boolean).join(', ')}
                                        </p>
                                    )}
                                </div>
                            )}

                            {application.motivation && application.motivation.statementOfPurpose && (
                                <div className="space-y-1">
                                    <p className="text-[13px] font-semibold text-black tracking-tight">Statement</p>
                                    <p className="text-xs font-medium text-black line-clamp-2">
                                        {application.motivation.statementOfPurpose}
                                    </p>
                                </div>
                            )}

                            {application.education_history?.education?.[0] && (
                                <div className="space-y-1">
                                    <p className="text-[13px] font-semibold text-black tracking-tight">Latest Education</p>
                                    <p className="text-sm font-semibold text-black leading-tight">
                                        {application.education_history.education[0].institution}
                                    </p>
                                    <p className="text-xs text-black font-medium">
                                        {application.education_history.education[0].degree}
                                    </p>
                                </div>
                            )}

                            <div className="pt-4 border-t border-neutral-100 mt-2">
                                <div className="flex items-center justify-between text-[11px] font-black text-black">
                                    <span>Documents</span>
                                    <span className="flex items-center gap-1.5">
                                        {(() => {
                                            const baseRequired = ['PASSPORT', 'TRANSCRIPT', 'CERTICACATE', 'CV', 'MOTIVATION_LETTER'];
                                            const requested = application.requested_documents || [];
                                            const allRequired = Array.from(new Set([...baseRequired, ...requested]));
                                            const uploadedCount = application.documents?.filter(d => allRequired.includes(d.type)).length || 0;
                                            const totalRequired = allRequired.length;
                                            return (
                                                <>
                                                    <span className={uploadedCount >= totalRequired ? 'text-neutral-600' : 'text-black'}>
                                                        {uploadedCount}
                                                    </span>
                                                    <span className="text-neutral-400">/</span>
                                                    <span>{totalRequired}</span>
                                                </>
                                            );
                                        })()}
                                    </span>
                                </div>
                                <div className="mt-2 w-full bg-neutral-100 h-1 rounded-full overflow-hidden">
                                    <div
                                        className="bg-[#9c27b3] h-full transition-all duration-500"
                                        style={{
                                            width: `${Math.min(100, (
                                                (() => {
                                                    const baseRequired = ['PASSPORT', 'TRANSCRIPT', 'CERTICACATE', 'CV', 'MOTIVATION_LETTER'];
                                                    const requested = application.requested_documents || [];
                                                    const allRequired = Array.from(new Set([...baseRequired, ...requested]));
                                                    const uploadedCount = application.documents?.filter(d => allRequired.includes(d.type)).length || 0;
                                                    return (uploadedCount / allRequired.length) * 100;
                                                })()
                                            ))}%`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ApplicationWizardPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin"></div>
            </div>
        }>
            <ApplicationWizardContent />
        </Suspense>
    );
}

