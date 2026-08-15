'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { invokeEdgeFunction } from '@/utils/supabase/invoke';
import PayGoWireCheckout from './PayGoWireCheckout';
import { getProgramYears, ANCILLARY_FEES, ANCILLARY_FEES_TOTAL } from '@/utils/tuition';
import Image from 'next/image';
import { FileText, Clock, CheckCircle, CreditCard, ArrowLeft } from "@phosphor-icons/react";
import { formatToDDMMYYYY } from '@/utils/date';

export default function TuitionPaymentPage({ admissionOffer, application }: {
    params: { id: string },
    admissionOffer: any,
    application: any
}) {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Admin-pushed invoice values
    const finalAmount = admissionOffer.tuition_fee || 0;
    const rawInvoiceType = admissionOffer.invoice_type || 'TUITION_DEPOSIT';
    const invoiceTypeLabel = rawInvoiceType.replaceAll('_', ' ');

    const ancillaryFees = ANCILLARY_FEES;
    // Ancillary fees are only charged on the first (initial) invoice
    const includeAncillary = !admissionOffer.ancillary_charged;
    const totalAncillary = includeAncillary ? ANCILLARY_FEES_TOTAL : 0;
    const invoiceTotal = finalAmount + totalAncillary;

    // Track the actual payment records for this offer so we can show the real
    // checkout for additional (2nd, 3rd...) invoices instead of a stuck
    // "payment successful" screen once a student is already enrolled.
    const [payments, setPayments] = useState<any[]>([]);
    const [paymentsLoaded, setPaymentsLoaded] = useState(false);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const supabase = createClient();
                const { data } = await supabase
                    .from('tuition_payments')
                    .select('*')
                    .eq('offer_id', admissionOffer.id)
                    .order('created_at', { ascending: false });
                setPayments(data || []);
            } catch (e) {
                console.error('PaymentView: Error fetching payments', e);
                setPayments([]);
            } finally {
                setPaymentsLoaded(true);
            }
        };
        fetchPayments();
    }, [admissionOffer.id]);

    const handlePaymentComplete = async (details: {
        method: string;
        country: string;
        currency: string;
        fxMetadata: any;
    }) => {
        console.log('PaymentView: handlePaymentComplete called', details);
        setIsProcessing(true);
        setError(null);
        try {
            const supabase = createClient();
            const { data, error: functionError } = await invokeEdgeFunction('process-tuition-payment', {
                body: {
                    offerId: admissionOffer.id,
                    applicationId: application.id,
                    amount: invoiceTotal,
                    invoiceType: rawInvoiceType,
                    details: {
                        method: details.method,
                        country: details.country,
                        currency: details.currency,
                        fxMetadata: details.fxMetadata
                    }
                }
            });

            if (functionError) {
                console.error('PaymentView: Edge function call failed', functionError);
                throw new Error(functionError.message || 'Failed to process payment');
            }

            const result = data;
            console.log('PaymentView: Result from edge function', result);

            if (!result.success) {
                console.error('PaymentView: Processing failed', result.error);
                throw new Error(result.error);
            }

            // Success!!
            console.log('PaymentView: Success! Reinforcing application status update...');

            // Extra safety: Update application status directly from client to ensure DB is in sync
            // before redirecting, just in case edge function update had any replication lag or issue.
            // Do NOT downgrade an already-enrolled student (e.g. when paying a 2nd invoice).
            if (application.status !== 'ENROLLED') {
                await supabase
                    .from('applications')
                    .update({
                        status: 'PAYMENT_SUBMITTED',
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', application.id);
            }

            console.log('PaymentView: Status reinforced. Redirecting to application view...');
            // Redirect to application view with a clear message that the finance
            // office is manually verifying the transfer.
            window.location.href = `/portal/application/view?id=${application.id}`;
        } catch (e: any) {
            console.error('Payment Error (Caught in View):', e);
            const raw = e?.message || '';
            // "Failed to fetch" is a browser-level network error (request never
            // reached the payment server), not a logical error from the function.
            const message = raw.includes('Failed to fetch')
                ? 'We could not reach the payment server. Check your internet connection, disable any ad/privacy blockers, and try again.'
                : (raw || 'Payment failed. Please try again.');
            setError(message);
            setIsProcessing(false);
        }
    };

    // Determine the payment state for the CURRENT invoice (matched by invoice_type).
    // This ensures already-enrolled students can still pay additional (2nd, 3rd…)
    // invoices through the real PayGoWire checkout, and only see the success screen
    // once the current invoice's payment has actually been verified.
    const currentInvoicePayments = payments.filter(
        (p: any) => p.invoice_type === rawInvoiceType
    );
    const currentInvoicePaid = Boolean(admissionOffer?.invoice_pushed) && currentInvoicePayments.some(
        (p: any) => p.status === 'COMPLETED' || p.status === 'verified'
    );
    const currentInvoicePending = Boolean(admissionOffer?.invoice_pushed) && currentInvoicePayments.some(
        (p: any) => p.status === 'PENDING_VERIFICATION'
    );

    if (!paymentsLoaded) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-neutral-100 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-sm font-medium uppercase tracking-widest text-neutral-400">Loading Invoice…</p>
                </div>
            </div>
        );
    }

    if (currentInvoicePaid || currentInvoicePending) {
        const isPaid = currentInvoicePaid;
        return (
            <div className="max-w-md mx-auto mt-6 md:mt-12 bg-white p-6 md:p-12 rounded-4px text-center shadow-sm animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-neutral-50 border border-neutral-100 text-black force-circle flex items-center justify-center mx-auto mb-8">
                </div>
                <h2 className="text-2xl font-normal text-black mb-4 tracking-tighter">
                    {isPaid ? 'Tuition Paid Successfully' : 'Payment Verification Pending'}
                </h2>
                <p className="text-sm text-black mb-8 max-w-[280px] mx-auto leading-relaxed">
                    {isPaid
                        ? <>Your payment for this invoice has been confirmed. Your receipt is available below.</>
                        : <>Your payment has been recorded and is currently under review. <span className="font-semibold text-black">Access to student services is paused</span> until our finance team verifies the transaction.</>
                    }
                </p>
                <div className="flex flex-col items-center gap-3">
                    {isPaid && (
                        <button
                            onClick={() => router.push(`/portal/application/receipt?id=${application.id}`)}
                            className="w-fit min-w-[240px] h-[48px] bg-[#0a151a] text-white px-8 rounded-4px text-[11px] font-normal uppercase tracking-widest transition-all hover:bg-neutral-800 shadow-lg shadow-black/5"
                        >
                            View Receipt
                        </button>
                    )}
                    <button
                        onClick={() => router.push('/portal/dashboard')}
                        className={`w-fit min-w-[240px] h-[48px] px-8 rounded-4px text-[11px] font-normal uppercase tracking-widest transition-all ${isPaid ? 'bg-white text-black border border-neutral-200 hover:bg-neutral-50' : 'bg-[#0a151a] text-white hover:bg-neutral-800 shadow-lg shadow-black/5'}`}
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-6 md:py-12 px-4 font-rubik text-black">
            <div className="mb-6 md:mb-12 text-center md:text-left bg-neutral-50 md:bg-transparent rounded-4px p-6 md:p-0 border-none">
                <div className="mb-4 flex justify-center md:justify-start">
                    <Image
                        src="https://cdn.brandfetch.io/id1L6oKjVX/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1667924686641"
                        alt="Flywire Logo"
                        width={120}
                        height={40}
                        className="h-8 w-auto object-contain"
                    />
                </div>
                <h1 className="text-[20px] md:text-[24px] font-normal text-black leading-tight md:leading-none">Tuition Payment via Flywire</h1>
            </div>

            {/* Payment Summary Header */}
            <div className="mb-12 px-2 md:px-0">
                <div className="p-6 md:p-8 bg-neutral-50 rounded-4px">
                    <h2 className="text-sm font-normal mb-2 uppercase tracking-widest text-neutral-500">Invoice Type</h2>
                    <div className="font-normal text-2xl md:text-3xl mb-1 uppercase tracking-tighter text-black">{invoiceTypeLabel}</div>
                    <p className="text-sm text-neutral-600 leading-relaxed mt-2 max-w-2xl">
                        This invoice has been prepared for your {invoiceTypeLabel.toLowerCase()} by the finance department. 
                        Payment of this amount is required to proceed with your enrollment.
                    </p>
                </div>
            </div>

            {/* Tuition Breakdown */}
            <div className="mb-8 px-2 md:px-0">
                <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
                    <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-4">Tuition Breakdown</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-600">Base Tuition ({invoiceTypeLabel})</span>
                            <span className="font-bold text-black">${Number(finalAmount).toLocaleString()} CAD</span>
                        </div>
                        {includeAncillary && (
                            <>
                                {ancillaryFees.map((fee, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-neutral-600">{fee.name}</span>
                                        <span className="text-black">${fee.amount} CAD</span>
                                    </div>
                                ))}
                                <div className="flex justify-between text-sm pt-2 border-t border-neutral-100">
                                    <span className="text-neutral-600">Total Ancillary Fees</span>
                                    <span className="font-bold text-black">${totalAncillary.toLocaleString()} CAD</span>
                                </div>
                            </>
                        )}
                        <div className="flex justify-between text-base pt-3 border-t-2 border-black">
                            <span className="font-bold text-black">Total Due</span>
                            <span className="font-bold text-black">${invoiceTotal.toLocaleString()} CAD</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Invoices & Payment Dates */}
            <div className="mb-8 px-2 md:px-0">
                <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
                    <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-4">Payment Schedule</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                            <div>
                                <p className="text-xs font-bold text-black uppercase tracking-wider">{invoiceTypeLabel}</p>
                                <p className="text-[11px] text-neutral-500 mt-0.5">Due: {admissionOffer.payment_deadline ? formatToDDMMYYYY(admissionOffer.payment_deadline) : 'TBD'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-black">${invoiceTotal.toLocaleString()} CAD</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-[#0a151a] text-white text-[10px] font-bold uppercase tracking-wider rounded-full">Pending</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment History & Receipts */}
            {payments.length > 0 && (
                <div className="mb-8 px-2 md:px-0">
                    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
                        <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-4">Payment History & Receipts</h3>
                        <div className="space-y-2">
                            {payments.map((payment: any) => (
                                <div key={payment.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl">
                                    <div>
                                        <p className="text-sm font-bold text-black">{payment.invoice_type?.replaceAll('_', ' ') || 'Payment'}</p>
                                        <p className="text-[11px] text-neutral-500">{formatToDDMMYYYY(payment.created_at)}</p>
                                    </div>
                                    <div className="text-right flex items-center justify-end gap-3">
                                        <div>
                                            <p className="text-sm font-bold text-black">
                                                {payment.fx_metadata?.localAmount
                                                    ? `${payment.currency || 'CAD'} ${Number(payment.fx_metadata.localAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                    : `${Number(payment.amount).toLocaleString()} ${payment.currency || 'CAD'}`}
                                            </p>
                                            <p className="text-[11px] text-neutral-500 capitalize">{(payment.status?.replaceAll('_', ' ') || 'Pending').replace('VERICACATION', 'VERIFICATION')}</p>
                                        </div>
                                        {(payment.status === 'COMPLETED' || payment.status === 'verified') && (
                                            <button
                                                onClick={() => router.push(`/portal/application/receipt?id=${application.id}&paymentId=${payment.id}`)}
                                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                                title="View Receipt"
                                            >
                                                <FileText size={18} weight="bold" className="text-neutral-600" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-start">
                {/* Invoice & Summary */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-4 md:p-8 rounded-4px">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                            <div>
                                <div className="text-[11px] font-normal text-black uppercase tracking-widest mb-1">Student Details</div>
                                <div className="font-normal text-black uppercase tracking-tight">{application.personal_info?.firstName} {application.personal_info?.lastName}</div>
                                <div className="text-sm text-black mt-1">{application.contact_details?.email}</div>
                            </div>
                            <div className="sm:text-right w-full sm:w-auto">
                                <div className="text-[11px] font-normal text-black uppercase tracking-widest mb-1">Payment Reference</div>
                                <div className="font-mono text-[13px] text-black bg-neutral-50 px-3 py-1.5 rounded-4px inline-block break-all leading-none">
                                    {(() => {
                                        let hash = 0;
                                        const str = admissionOffer.id;
                                        for (let i = 0; i < str.length; i++) {
                                            hash = ((hash << 5) - hash) + str.charCodeAt(i);
                                            hash |= 0;
                                        }
                                        const positiveHash = Math.abs(hash);
                                        return positiveHash.toString().padEnd(13, '0').slice(0, 13);
                                    })()}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-black font-normal uppercase tracking-wider">{invoiceTypeLabel}</span>
                                <span className="font-normal text-black text-right">$ {invoiceTotal.toLocaleString()}</span>
                            </div>
                            {includeAncillary && (
                                <div className="flex justify-between text-sm text-neutral-500">
                                    <span className="uppercase tracking-wider">Ancillary Fees</span>
                                    <span className="text-right">$ {totalAncillary.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between pt-2 font-normal text-lg text-black">
                                <span>TOTAL</span>
                                <span className="font-normal">$ {invoiceTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checkout Logic */}
                <div className="lg:col-span-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-normal uppercase tracking-widest border border-red-100 flex items-center gap-3">
                            {error}
                        </div>
                    )}

                    <PayGoWireCheckout
                        amount={invoiceTotal}
                        currency="CAD"
                        onPaymentComplete={handlePaymentComplete}
                        isProcessing={isProcessing}
                        paymentReference={(() => {
                            let hash = 0;
                            const str = admissionOffer.id;
                            for (let i = 0; i < str.length; i++) {
                                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                                hash |= 0;
                            }
                            const positiveHash = Math.abs(hash);
                            return positiveHash.toString().padEnd(13, '0').slice(0, 13);
                        })()}
                    />
                </div>
            </div>
            <div className="mt-8">
                <button
                    onClick={() => router.push('/portal/dashboard')}
                    className="flex items-center gap-2 text-[11px] font-normal text-black hover:text-black transition-colors"
                >
                    <ArrowLeft size={14} weight="bold" />
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}

