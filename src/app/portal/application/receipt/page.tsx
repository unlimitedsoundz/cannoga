'use client';

import { createClient } from '@/utils/supabase/client';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { Link } from "@aalto-dx/react-components";
import { CaretLeft as ChevronLeft } from "@phosphor-icons/react/dist/ssr";
import { formatToDDMMYYYY } from '@/utils/date';
import PrintButton from '@/components/portal/PrintButton';
import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { getTuitionFeeSync, ANCILLARY_FEES, ANCILLARY_FEES_TOTAL } from '@/utils/tuition';

function ReceiptContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [admission, setAdmission] = useState<any>(null);

    useEffect(() => {
        if (!id) {
            router.push('/portal/dashboard');
            return;
        }

        const fetchData = async () => {
            const supabase = createClient();
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/portal/account/login');
                    return;
                }

                const { data: applicationRaw, error } = await supabase
                    .from('applications')
                    .select(`
                        *,
                        course:Course(*),
                        offer:admission_offers(*, payments:tuition_payments(*))
                    `)
                    .eq('id', id)
                    .eq('user_id', user.id)
                    .single();

                if (error || !applicationRaw) {
                    setData(null);
                    setLoading(false);
                    return;
                }

                const application = applicationRaw;
                const offer = Array.isArray(application.offer) ? application.offer[0] : application.offer;

                // Fallback: if the join didn't return payments, fetch them directly
                if (offer && (!offer.payments || offer.payments.length === 0)) {
                    const { data: paymentsData } = await supabase
                        .from('tuition_payments')
                        .select('*')
                        .eq('offer_id', offer.id)
                        .order('created_at', { ascending: false });

                    if (paymentsData && paymentsData.length > 0) {
                        offer.payments = paymentsData;
                    }
                }

                setData(applicationRaw);

                // Fetch admission details for intake info
                const { data: admissionData } = await supabase
                    .from('admissions')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('program', applicationRaw.course?.title)
                    .maybeSingle();

                if (admissionData) setAdmission(admissionData);

            } catch (e) {
                console.error('Error fetching receipt data:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-neutral-200 border-t-black rounded-full animate-spin"></div>
                    <p className="text-[13px] font-normal text-black">Loading Receipt...</p>
                </div>
            </div>
        );
    }

    if (!data) return notFound();

    const application = data;
    // Safely extract offer (handles both object and single-item array)
    const offer = Array.isArray(application?.offer)
        ? application.offer[0]
        : application?.offer;

 // Safely extract payment
    const payments = offer?.payments || [];
    // Prefer a completed full-tuition payment; otherwise the latest payment on record
    const payment =
        payments.find((p: any) => p.invoice_type === 'TUITION_FULL' && p.status === 'COMPLETED') ||
        payments[payments.length - 1] ||
        payments[0];

    if (!payment || (application.status !== 'ENROLLED' && application.status !== 'PAYMENT_SUBMITTED')) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-xl font-normal text-black">Receipt Not Available</p>
                <p className="text-sm text-neutral-500 max-w-md text-center">Your payment receipt is not available yet. This may be because the payment is still being processed.</p>
                <div className="flex gap-4">
                    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#0a151a] text-white border border-white text-[11px] font-normal rounded-sm hover:bg-neutral-800 transition-all">Retry</button>
                    <Link href="/portal/dashboard" className="px-6 py-2 bg-[#0a151a] text-white border border-white text-[11px] font-normal rounded-sm hover:bg-neutral-800 transition-all">Dashboard</Link>
                </div>
            </div>
        );
    }

    // Calculate deposit status and other needed values
    const level = application.course?.level || 'BACHELOR';
    const field = application.course?.field || 'TECHNOLOGY';
    const isDomestic = application.personal_info?.studentType === 'domestic';
    const tuitionFee = getTuitionFeeSync(level, field, isDomestic);
    const depositAmount = 2000;
    const isDeposit = Math.round(payment.amount) === depositAmount;
    const isPending = application.status === 'PAYMENT_SUBMITTED';

    // Payment type sourced from the actual tuition_payments.invoice_type (deposit vs full)
    const paymentTypeRaw = payment?.invoice_type || (isDeposit ? 'TUITION_DEPOSIT' : 'TUITION_FULL');
    const paymentTypeLabel = paymentTypeRaw === 'TUITION_FULL' ? 'Full Tuition' : 'Tuition Deposit';

    // Locks the receipt page if passing through verification
    if (application.status === 'PAYMENT_SUBMITTED') {
        return (
            <div className="flex items-center justify-center min-h-[60vh] font-rubik px-4">
                <div className="max-w-md w-full bg-white border border-neutral-200 p-8 rounded-sm text-center shadow-sm">
                    <div className="w-12 h-12 bg-neutral-50 text-black rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-200">
                        <div className="w-5 h-5 border-2 border-[#0a151a] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h2 className="text-lg font-normal text-black mb-2">Payment Under Review</h2>
                    <p className="text-xs text-neutral-500 font-normal leading-relaxed mb-8">
                        Your transaction has been recorded (Ref: <span className="font-mono text-black">{payment?.transaction_reference || 'N/A'}</span>).<br />
                        The official receipt will be available here once our finance team confirms the funds.
                    </p>
                    <Link
                        href="/portal/dashboard"
                        className="block w-full bg-[#0a151a] text-white px-6 py-3 rounded-sm text-[11px] font-normal hover:bg-neutral-800 transition-all border border-[#0a151a]"
                    >
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const ancillaryFees = ANCILLARY_FEES;
    // Ancillary fees are only charged on the first invoice; reflect what was actually paid
    const includeAncillary = payment?.ancillary_included ?? true;
    const totalAncillary = includeAncillary ? ANCILLARY_FEES_TOTAL : 0;
    const receiptTotal = (payment?.amount || 0);
    const intake = admission?.intake || 'Fall 2026';
    const academicYear = admission?.academic_year || '2026/2027';

    const formatPaymentMethod = (methodId: string | undefined) => {
        if (!methodId) return 'N/A';
        const methods: Record<string, string> = {
            'upi': 'UPI',
            'in_bank': 'Net Banking',
            'sepa': 'SEPA Transfer',
            'nordea': 'Nordea Online',
            'ng_bank': 'Bank Transfer',
            'flutterwave_uae': 'Flutterwave',
            'flutterwave_cm_momo': 'Mobile Money (Cameroon)',
            'ach': 'ACH Direct Debit',
            'wire': 'International Wire',
            'paygowire': 'Flywire' // fallback
        };
        const name = methods[methodId.toLowerCase()] || methodId.replace(/_/g, ' ');
        return `Flywire - ${name}`;
    };

    return (
        <div className="min-h-screen bg-neutral-50 py-6 md:py-12 px-4 sm:px-6 font-sans">
            {/* Control Bar (Hidden on Print) */}
            <div className="max-w-[210mm] mx-auto mb-8 flex items-center justify-between print:hidden">
                <Link
                    href="/portal/dashboard"
                    className="flex items-center gap-2 text-[11px] font-normal text-black hover:text-black transition-colors"
                >
                    <ChevronLeft size={14} weight="bold" />
                    Back to Dashboard
                </Link>
                <PrintButton />
            </div>

            {/* Document Container */}
            <div className="w-full max-w-[210mm] mx-auto p-6 md:p-8 print:p-0 relative z-10 text-black">
                
                {/* Header */}
                <div className="mb-12">
                    <div className="relative w-32 h-8 mb-4">
                        <Image
                            src="/images/logo-cannoga.png"
                            alt="Cannoga College"
                            fill
                            style={{ objectFit: 'contain', objectPosition: 'left center' }}
                        />
                    </div>
                    <div className="text-[13px] uppercase tracking-wider mb-1">Official Tuition Receipt</div>
                    <div className="text-[11px] leading-relaxed">
                        Cannoga College noga College  Ottawa campus<br />
                        81 Montreal Rd, K1L 6E8 Ottawa, Ontario, Canada<br />
                        financial.services@cannogacollege.ca
                    </div>
                </div>

                {/* Transaction Info */}
                <div className="mb-10 space-y-4">
                    <div>
                        <div className="text-[10px] uppercase text-neutral-500 mb-1">Receipt Information</div>
                        <div className="text-sm">
                            Transaction ID: <span className="font-mono">{payment?.transaction_reference || 'N/A'}</span><br />
                            Date: {formatToDDMMYYYY(payment?.created_at)}<br />
                            Payment Type: {paymentTypeLabel}<br />
                            Status: {isPending ? 'Pending Verification' : 'Verified & Completed'}
                        </div>
                    </div>

                    <div>
                        <div className="text-[10px] uppercase text-neutral-500 mb-1">Student Details</div>
                        <div className="text-base">
                            {application.personal_info?.firstName} {application.personal_info?.middleName ? `${application.personal_info.middleName} ` : ''}{application.personal_info?.lastName}<br />
                            Passport: {application.personal_info?.passportNumber || 'N/A'}<br />
                            {application.contact_details?.city}, {application.contact_details?.country}
                        </div>
                    </div>
                </div>

                {/* Breakdown */}
                <div className="mb-10">
                    <div className="text-[10px] uppercase text-neutral-500 mb-2">Payment Details</div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2 border-b border-neutral-100">
                            <span>Description</span>
                            <span>Amount</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>
                                {paymentTypeLabel} - {application.course?.title}<br />
                                <span className="text-[11px] text-neutral-500">Academic Year {academicYear}</span>
                            </span>
                            <span>$ {payment.amount.toLocaleString()}</span>
                        </div>
                        {includeAncillary && ancillaryFees.map((fee) => (
                            <div key={fee.name} className="flex justify-between py-2">
                                <span>{fee.name}</span>
                                <span>$ {fee.amount.toLocaleString()}</span>
                            </div>
                        ))}
                        <div className="flex justify-between pt-4 border-t-2 border-[#0a151a] text-lg">
                            <span>Total Paid</span>
                            <span>$ {receiptTotal.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-20">
                    <div className="flex flex-col items-start gap-1">
                        <div className="relative w-72 h-36 -ml-8 -mb-4">
                            <Image
                                src="/registrar-signature.png"
                                alt="Registrar Signature"
                                fill
                                style={{ objectFit: 'contain', objectPosition: 'left center' }}
                                className="mix-blend-multiply"
                            />
                        </div>
                        <div className="text-sm font-bold">Alek Laimer</div>
                        <div className="text-[10px] text-neutral-500 uppercase tracking-widest">College Registrar</div>
                    </div>
                    
                    <p className="text-[10px] text-neutral-500 leading-relaxed max-w-prose mt-8">
                        This is an official document of Cannoga College. Verified through the Cannoga SIS Gateway.
                    </p>
                </div>

            </div>
            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 15mm; size: A4; }
                    body { background: white !important; padding: 0 !important; margin: 0 !important; }
                    header, nav, footer,
                    [data-theme="portal"] > header,
                    [data-theme="portal"] > footer,
                    .print\\:hidden { display: none !important; }
                    [data-theme="portal"] { min-height: 0 !important; }
                    [data-theme="portal"] > main { padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
                    .min-h-screen { min-height: 0 !important; background: white !important; padding: 0 !important; }
                    .min-h-\\[297mm\\] { min-height: 0 !important; }
                    .max-w-\\[210mm\\] { max-width: 100% !important; margin: 0 !important; padding: 15mm 0 !important; }
                    .shadow-xl, .shadow-sm, .print\\:shadow-none { box-shadow: none !important; }
                    .print\\:border-0 { border: none !important; }
                    .print-header-row { display: flex !important; flex-direction: row !important; justify-content: space-between !important; }
                    .print-right { text-align: right !important; align-items: flex-end !important; }
                    * { color: black !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    a { text-decoration: none !important; }
                }
            ` }} />
        </div>
    );
}

export default function TuitionReceiptPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-neutral-200 border-t-black rounded-full animate-spin"></div>
                    <p className="text-[13px] font-normal text-black">Loading Receipt...</p>
                </div>
            </div>
        }>
            <ReceiptContent />
        </Suspense>
    );
}


