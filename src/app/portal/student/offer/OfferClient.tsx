'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CircleNotch as Loader2 } from "@phosphor-icons/react/dist/ssr";
import { acceptApplicationOffer } from './actions';
import { createClient } from '@/utils/supabase/client';
import { format } from 'date-fns';
import { 
    getProgramYears, 
    getAnnualFeeFromTotal, 
    calculateTuitionDeposit, 
    mapSchoolToTuitionField 
} from '@/utils/tuition';

interface OfferClientProps {
    admission: any;
}

export function OfferClient({ admission }: OfferClientProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [decisionFeedback, setDecisionFeedback] = useState<string | null>(null);
    const [generatingLetter, setGeneratingLetter] = useState(false);

    // Harden status detection: handle both legacy 'offer_status' and new 'status' from admission_offers table
    const currentStatus = admission.offer_status || admission.status;
    const hasResponded = (currentStatus && currentStatus !== 'PENDING') || admission.application_status === 'DOCS_REQUIRED';
    const isAccepted = currentStatus === 'ACCEPTED' || currentStatus === 'PAID' || admission.application_status === 'DOCS_REQUIRED';
    const isRejected = currentStatus === 'REJECTED';

    const isOfferAcceptedOnly = isAccepted && (admission.application_status === 'OFFER_ACCEPTED' || admission.application_status === 'DOCS_REQUIRED');
    const isEnrolled = admission.application_status === 'ENROLLED';

    const handleDecision = async (decision: 'ACCEPTED' | 'REJECTED') => {
        if (!confirm(`Are you sure you want to ${decision.toLowerCase()} this admission offer? This action cannot be undone.`)) {
            return;
        }

        setError(null);
        startTransition(async () => {
            try {
                if (decision === 'ACCEPTED') {
                    const result = await acceptApplicationOffer(admission.application_id);
                    if (result.success) {
                        setDecisionFeedback('Offer Accepted! Redirecting to dashboard...');
                        window.scrollTo({ top: 0, behavior: 'smooth' });

                        // Redirect to dashboard after a short delay
                        setTimeout(() => {
                            window.location.href = `/portal/dashboard`;
                        }, 2000);
                    }
                } else {
                    alert("Please contact admissions to decline your offer.");
                }
            } catch (err: any) {
                setError(err.message || 'Failed to process decision');
            }
        });
    };

    const handlePayment = () => {
        router.push(`/portal/application/payment/?id=${admission.application_id}`);
    };

    // Calculate dynamic fee details based on annual fee
    const app = admission.application || {};
    const course = app.course || {};
    const school = course.school || {};

    const years = getProgramYears(course.duration || '', course.degreeLevel);
    const field = mapSchoolToTuitionField(school.slug || 'technology');

    const nationality = app.personal_info?.nationality;
    const isDomestic = nationality ? (nationality.toLowerCase().trim() === 'canada' || nationality.toLowerCase().trim() === 'canadian' || nationality.toLowerCase().trim() === 'domestic') : false;

    const annualFee = getAnnualFeeFromTotal(admission.tuition_fee || 0, 0, years);
    const depositAmount = calculateTuitionDeposit(annualFee, field, false, course.degreeLevel, isDomestic);
    const remainingBalance = annualFee - depositAmount;

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column: PDF Preview */}
            <div className="lg:col-span-2 space-y-3">
                <div className="bg-white border-2 border-neutral-200 rounded-xl overflow-hidden min-h-[500px] md:min-h-[700px] flex flex-col shadow-sm">
                    <div className="p-2 md:p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-neutral-500">
                                {isEnrolled ? 'Official Admission Letter' : 'Letter of Acceptance (LOA)'} - {admission.student_id}
                            </span>
                        </div>
                        <a
                            href={admission.application_status === 'PAYMENT_SUBMITTED' ? '#' : admission.document_url}
                            target={admission.application_status === 'PAYMENT_SUBMITTED' ? undefined : "_blank"}
                            rel={admission.application_status === 'PAYMENT_SUBMITTED' ? undefined : "noopener noreferrer"}
                            download={admission.application_status !== 'PAYMENT_SUBMITTED'}
                            className={`p-1.5 md:p-2 rounded-lg transition-colors ${admission.application_status === 'PAYMENT_SUBMITTED'
                                ? 'text-neutral-300 cursor-not-allowed'
                                : 'text-neutral-600 hover:text-black hover:bg-white'
                                }`}
                            title={admission.application_status === 'PAYMENT_SUBMITTED' ? "Access Locked" : "View Letter"}
                            onClick={(e) => {
                                if (admission.application_status === 'PAYMENT_SUBMITTED') {
                                    e.preventDefault();
                                }
                            }}
                        >
                            View
                        </a>
                    </div>

                    <div className="flex-1 bg-neutral-100">
                        {admission.document_url ? (
                            <iframe
                                src={`${admission.document_url}#toolbar=0`}
                                className="w-full h-full border-none min-h-[600px]"
                                title={isEnrolled ? "Official Admission Letter" : "Letter of Acceptance"}
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-12 text-center text-neutral-400">
                                <p className="font-medium">File not found. Please contact admissions.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Actions & Status */}
            <div className="space-y-6">
                {/* Financial Summary - Only show if not enrolled and not paid */}
                {!(isOfferAcceptedOnly || admission.offer_status === 'PAID' || isEnrolled) && (
                    <div className="bg-[#0a151a] text-white p-6 rounded-2xl shadow-xl overflow-hidden relative">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-6">Financial Summary</h3>

                        <div className="space-y-5 relative z-10">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[9px] font-black uppercase text-neutral-400 mb-1">Tuition Deposit</p>
                                    <p className="text-3xl font-black tracking-tight leading-none text-neutral-900">
                                        ${depositAmount.toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black uppercase text-neutral-400 mb-1">Remaining (1st Year)</p>
                                    <p className="text-sm font-black text-white">
                                        ${remainingBalance.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-tight">
                                        {admission.payment_deadline ? `Due by ${format(new Date(admission.payment_deadline), 'dd MMM yyyy')}` : 'Payment Pending'}
                                    </p>
                                    <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5">Deposit to Secure Place</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Decision Banner / Form */}
                {hasResponded || decisionFeedback ? (
                    <div className="p-6 rounded-2xl border-2 flex flex-col items-center text-center gap-4 animate-in zoom-in-95 duration-500 bg-white border-neutral-200 text-neutral-900">
                        {isAccepted || decisionFeedback === 'Offer Accepted' ? (
                            <div className="flex flex-col items-center">
                                <div className="space-y-6 max-w-2xl w-full">
                                    <div className="text-center space-y-2 border-b border-neutral-200 pb-6">
                                        <h2 className="text-2xl font-bold text-neutral-900">Welcome to Cannoga College!</h2>
                                        <p className="text-sm text-neutral-600">
                                            Your Journey Starts Here
                                        </p>
                                    </div>

                                    <div className="text-left bg-neutral-50 p-8 rounded-lg space-y-6 border border-neutral-200">
                                        {(isOfferAcceptedOnly || generatingLetter) ? (
                                            <div className="flex flex-col items-center py-4">
                                                <Loader2 size={32} className="animate-spin text-neutral-400 mb-3" />
                                                <p className="text-sm font-bold uppercase tracking-widest text-neutral-600">Generating Admission Letter...</p>
                                                <p className="text-[10px] text-neutral-400 mt-2 text-center uppercase font-bold tracking-tight">Please wait while we finalize your enrollment documents.</p>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-sm leading-relaxed text-neutral-700">
                                                    Congratulations, <span className="font-semibold text-neutral-900">{admission.full_name}</span>! Your official admission letter has been issued.
                                                </p>

                                                <div className="space-y-4 pt-2">
                                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Next Steps for Enrollment:</h4>
                                                    <div className="grid gap-4">
                                                        <WelcomeStep number="01" title="Tuition Clearance" description="Proceed to the finance section to settle your initial tuition fees." />
                                                        <WelcomeStep number="02" title="IT Credentials" description="You will receive your Cannoga credentials once the payment is confirmed." />
                                                        <WelcomeStep number="03" title="Orientation" description="Check your portal for the upcoming orientation schedule." />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Action Buttons Based on Status */}
                                    <div className="space-y-3">
                                        {isOfferAcceptedOnly && (
                                            <button
                                                onClick={handlePayment}
                                                 className="w-full bg-neutral-600 text-white font-bold py-4 rounded-xl hover:bg-neutral-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-neutral-200 group active:scale-[0.98]"
                                            >
                                                Pay Tuition Fees
                                            </button>
                                        )}

                                        {admission.application_status === 'PAYMENT_SUBMITTED' && (
                                            <div className="space-y-3">
                                                <div className="w-full bg-amber-50 text-amber-800 font-bold py-3 rounded-lg flex items-center justify-center gap-2 border border-amber-200 text-center px-4 mb-3">
                                                    <Loader2 size={14} className="animate-spin text-amber-600" />
                                                    <span className="text-[9px] uppercase tracking-wider">Verification Pending</span>
                                                </div>

                                                <button disabled className="w-full bg-neutral-50 text-neutral-400 font-bold py-3 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed text-[10px] uppercase tracking-widest border border-neutral-100">
                                                    Admission Letter <span className="text-[9px] opacity-60">(Locked)</span>
                                                </button>

                                                <button disabled className="w-full bg-neutral-50 text-neutral-400 font-bold py-3 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed text-[10px] uppercase tracking-widest border border-neutral-100">
                                                    View Receipt <span className="text-[9px] opacity-60">(Locked)</span>
                                                </button>

                                                <button disabled className="w-full bg-neutral-50 text-neutral-400 font-bold py-3 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed text-[10px] uppercase tracking-widest border border-neutral-100">
                                                    Enter Portal <span className="text-[9px] opacity-60">(Locked)</span>
                                                </button>
                                            </div>
                                        )}

                                        {/* Download Offer Letter button - Disable if Pending */}
                                        {admission.document_url && (
                                            <a
                                                href={admission.application_status === 'PAYMENT_SUBMITTED' ? '#' : admission.document_url}
                                                target={admission.application_status === 'PAYMENT_SUBMITTED' ? undefined : "_blank"}
                                                rel={admission.application_status === 'PAYMENT_SUBMITTED' ? undefined : "noopener noreferrer"}
                                                download={admission.application_status !== 'PAYMENT_SUBMITTED'}
                                                className={`w-full font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 text-xs uppercase tracking-widest ${admission.application_status === 'PAYMENT_SUBMITTED'
                                                    ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                                    : 'bg-[#0a151a] text-white hover:bg-neutral-800'
                                                    }`}
                                                onClick={(e) => {
                                                    if (admission.application_status === 'PAYMENT_SUBMITTED') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            >
                                                View Letter of Acceptance (LOA)
                                                {admission.application_status === 'PAYMENT_SUBMITTED' && ' (Locked)'}
                                            </a>
                                        )}
                                    </div>

                                    <div className="text-center text-xs text-neutral-500 mt-6 font-bold uppercase tracking-widest">
                                        {isEnrolled ? 'Enrollment Complete - Portal Access Granted' : `Accepted on: ${admission.accepted_at ? format(new Date(admission.accepted_at), 'PPP pp') : 'Just now'}`}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tight">Offer Rejected</h2>
                                    <p className="text-sm font-medium opacity-80 mt-1">
                                        You have declined this offer of admission. Your application has been permanently closed.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white border-2 border-[#0a151a] p-4 md:p-6 rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3 md:space-y-4">
                        <div className="space-y-1">
                            <h2 className="text-base md:text-lg font-black uppercase tracking-tight">Decision Required</h2>
                            <p className="text-[9px] md:text-[10px] text-neutral-500 font-bold uppercase tracking-tight leading-relaxed">
                                Review the formal Letter of Offer carefully. Selecting &quot;Accept&quot; or &quot;Reject&quot; is a one-time final action.
                            </p>
                        </div>

                        {error && (
                            <div className="p-2 md:p-3 bg-red-50 text-red-700 text-[10px] md:text-xs font-bold uppercase tracking-widest border border-red-100 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 md:grid-cols-1 md:gap-2 pt-1 md:pt-2">
                            <button
                                onClick={() => handleDecision('ACCEPTED')}
                                disabled={isPending}
                                className="bg-[#0a151a] text-white font-bold py-2.5 md:py-3 rounded-lg hover:bg-neutral-800 transition-all flex items-center justify-center gap-1.5 md:gap-2 disabled:opacity-50 active:scale-95 text-[10px] md:text-xs uppercase tracking-wider md:tracking-widest"
                            >
                                {isPending ? <Loader2 className="animate-spin" size={14} weight="bold" /> : <>Accept<span className="hidden md:inline"> Offer</span></>}
                            </button>

                            <button
                                onClick={() => handleDecision('REJECTED')}
                                disabled={isPending}
                                className="bg-white text-red-600 border-2 border-red-500/10 font-bold py-2.5 md:py-3 rounded-lg hover:bg-red-50 transition-all flex items-center justify-center gap-1.5 md:gap-2 disabled:opacity-50 active:scale-95 text-[10px] md:text-xs uppercase tracking-wider md:tracking-widest"
                            >
                                {isPending ? <Loader2 className="animate-spin" size={14} weight="bold" /> : <>Reject<span className="hidden md:inline"> Offer</span></>}
                            </button>
                        </div>

                        {/* Print Letter */}
                        {admission.document_url && (
                            <a
                                href={admission.document_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-neutral-100 text-neutral-700 font-bold py-2 md:py-2.5 rounded-lg hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 active:scale-95 text-[10px] md:text-xs uppercase tracking-wider"
                            >
                                View Letter
                            </a>
                        )}

                        <div className="pt-3 md:pt-4 border-t border-neutral-100">
                            <div className="flex items-start gap-2">
                                <p className="text-[8px] md:text-[9px] font-bold text-neutral-400 uppercase leading-snug tracking-wider md:tracking-widest">
                                    BY ACCEPTING, YOU AGREE TO THE CODE OF CONDUCT, ACADEMIC REGULATIONS, AND TERMS OUTLINED IN THE OFFICIAL OFFER LETTER.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Card - show for pending, and a compact version for accepted */}
                {(isAccepted || decisionFeedback === 'Offer Accepted') ? (
                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Your Documents</h3>
                        <ul className="space-y-3">
                            <li className="flex gap-3">
                                <div className="w-5 h-5 bg-neutral-100 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black">📄</div>
                                <p className="text-xs font-medium text-neutral-600">Your official Letter of Offer is available above for viewing and download at any time.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-5 h-5 bg-neutral-100 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black">📋</div>
                                <p className="text-xs font-medium text-neutral-600">You may need this letter for visa applications, study permit, or financial documentation.</p>
                            </li>
                        </ul>
                    </div>
                ) : (!isRejected && !decisionFeedback) && (
                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Next Steps</h3>
                        <ul className="space-y-3">
                            <li className="flex gap-3">
                                <div className="w-5 h-5 bg-neutral-100 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black">1</div>
                                <p className="text-xs font-medium text-neutral-600">Download and save a copy of your Letter of Acceptance (LOA) for your records.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-5 h-5 bg-neutral-100 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black">2</div>
                                <p className="text-xs font-medium text-neutral-600">Provide your decision before the deadline stated in the letter.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-5 h-5 bg-neutral-100 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black">3</div>
                                <p className="text-xs font-medium text-neutral-600">Upon acceptance, you will receive an invitation to settle your initial tuition fees.</p>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

function WelcomeStep({ number, title, description }: { number: string, title: string, description: string }) {
    return (
        <div className="flex gap-4">
            <div className="text-lg font-bold text-neutral-300 leading-none shrink-0">{number}</div>
            <div className="space-y-1">
                <p className="text-sm font-semibold text-neutral-900 leading-none">{title}</p>
                <p className="text-sm text-neutral-600 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

