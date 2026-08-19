'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import PayGoWireCheckout from './PayGoWireCheckout';
import { getProgramYears, ANCILLARY_FEES, ANCILLARY_FEES_TOTAL } from '@/utils/tuition';
import Image from 'next/image';
import { FileText, Clock, CheckCircle, CreditCard, ArrowLeft, CaretDown } from "@phosphor-icons/react";
import { formatToDDMMYYYY } from '@/utils/date';

export default function TuitionPaymentPage({ admissionOffer, application }: {
    params: { id: string },
    admissionOffer: any,
    application: any
}) {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
    
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
        trackingRef: string;
        fxMetadata: any;
    }) => {
        // Payment initialization and proof submission are handled inside PayGoWireCheckout.
        // By the time this callback fires, the payment record already exists and proof has
        // been submitted — we just redirect to the application view.
        console.log('PaymentView: proof submitted, redirecting', details.trackingRef);
        window.location.href = `/portal/application/view?id=${application.id}`;
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

    const isHousingPayment = rawInvoiceType === 'HOUSING_DEPOSIT' || rawInvoiceType?.toLowerCase().includes('housing') || admissionOffer?.id?.startsWith('hdep');

    return (
        <div className="max-w-6xl mx-auto py-8 md:py-12 px-4 font-rubik text-slate-900" style={{ fontFamily: "'Rubik', sans-serif" }}>
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap');
                .font-rubik,
                .font-rubik * {
                    font-family: 'Rubik', sans-serif !important;
                }
            ` }} />
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-normal rounded-lg border border-red-100 flex items-center gap-3">
                    {error}
                </div>
            )}

            {/* Payment History & Receipts (if any) */}
            {(() => {
                const verifiedPayments = payments.filter((p: any) => 
                    p.status && !['pending_proof', 'PENDING_PROOF', 'CANCELLED', 'FAILED'].includes(p.status)
                );
                if (verifiedPayments.length === 0) return null;

                return (
                    <div className="mb-8">
                        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5">
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-3">Payment History & Receipts</h3>
                            <div className="space-y-2">
                                {verifiedPayments.map((payment: any) => (
                                    <div key={payment.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{payment.invoice_type?.replaceAll('_', ' ') || 'Payment'}</p>
                                            <p className="text-xs text-slate-500">{formatToDDMMYYYY(payment.created_at)}</p>
                                        </div>
                                        <div className="text-right flex items-center justify-end gap-3">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">
                                                    {payment.fx_metadata?.localAmount
                                                        ? `${payment.currency || 'CAD'} ${Number(payment.fx_metadata.localAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                        : `${Number(payment.amount).toLocaleString()} ${payment.currency || 'CAD'}`}
                                                </p>
                                                <p className="text-xs text-slate-500 capitalize">{(payment.status?.replaceAll('_', ' ') || 'Pending').replace('VERICACATION', 'VERIFICATION')}</p>
                                            </div>
                                            {(payment.status === 'COMPLETED' || payment.status === 'verified') && (
                                                <button
                                                    onClick={() => router.push(`/portal/application/receipt?id=${application.id}&paymentId=${payment.id}`)}
                                                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                                                    title="View Receipt"
                                                >
                                                    <FileText size={18} weight="bold" className="text-slate-700" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* 2-Column Exact Layout */}
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left Column: Payment Form */}
                <div className="lg:col-span-7 space-y-6">
                    <PayGoWireCheckout
                        amount={invoiceTotal}
                        currency="CAD"
                        offerId={admissionOffer.id}
                        applicationId={application.id}
                        invoiceType={rawInvoiceType}
                        onPaymentComplete={handlePaymentComplete}
                        isProcessing={isProcessing}
                    />
                </div>

                {/* Right Column: Flywire Info Cards */}
                <div className="lg:col-span-5 space-y-4">
                    {/* Blue Top Partnership Card */}
                    <div className="flex flex-row p-4 gap-3 bg-blue-50 border border-blue-600 rounded-lg" style={{ borderRadius: '8px' }}>
                        <div className="text-blue-600 mt-0.5 shrink-0">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                            </svg>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-[16px] font-bold text-slate-900">
                                Cannoga College - Ontario, CA partners with Flywire
                            </h3>
                            <p className="text-sm leading-5 text-slate-800 m-0">
                                Pay securely. Cannoga College - Ontario, CA receives your payment in CAD with no hidden fees.
                            </p>
                        </div>
                    </div>

                    {/* Why use Flywire? Feature Card */}
                    <div className="bg-white border border-slate-200 rounded-lg p-5 md:p-6 space-y-5 shadow-xs">
                        <h4 className="text-[16px] font-bold text-slate-900">
                            Why use Flywire?
                        </h4>

                        <div className="space-y-4">
                            {/* Feature 1 */}
                            <div className="flex items-start gap-3">
                                <div className="text-[#0066cc] mt-0.5 shrink-0">
                                    <Clock size={18} weight="bold" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[14px] font-bold text-slate-900">Real-time payment tracking</p>
                                    <p className="text-[13px] text-slate-500 leading-relaxed">
                                        See your payment status every step of the way, we keep you informed.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="flex items-start gap-3">
                                <div className="text-[#0066cc] mt-0.5 shrink-0">
                                    <CheckCircle size={18} weight="bold" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[14px] font-bold text-slate-900">No hidden fees</p>
                                    <p className="text-[13px] text-slate-500 leading-relaxed">
                                        See your total before you commit. The amount you confirm is what you pay.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="flex items-start gap-3">
                                <div className="text-[#0066cc] mt-0.5 shrink-0">
                                    <span className="font-bold text-[15px] leading-none">文A</span>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[14px] font-bold text-slate-900">Get help anytime, in your preferred language</p>
                                    <p className="text-[13px] text-slate-500 leading-relaxed">
                                        Our global team supports payers in English, Hindi, Mandarin, and many more.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Security Footer */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 px-1 pt-1">
                        <svg className="w-3.5 h-3.5 fill-current text-slate-400" viewBox="0 0 24 24">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                        </svg>
                        <span>Encrypted, verified, and secure payments, trusted by millions.</span>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <button
                    onClick={() => router.push('/portal/dashboard')}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft size={14} weight="bold" />
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}

