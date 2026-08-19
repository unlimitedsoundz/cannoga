'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { House as Home, Bed, CurrencyEur as DollarSign, CheckCircle, Clock, Warning as AlertTriangle, Calendar, Building as Building2, CreditCard, CaretRight as ChevronRight } from "@phosphor-icons/react/dist/ssr";
import { formatToDDMMYYYY } from '@/utils/date';
import { HousingApplication, HousingAssignment, HousingDeposit, HousingBuilding, Semester, HousingInvoice, PaymentMethod } from '@/types/database';
import { submitHousingApplication } from '@/services/housing';
import { initiatePayment } from '@/services/payment';
import PayGoWireCheckout from '../../application/payment/PayGoWireCheckout';
import HousingCatalogView, { BUILDINGS_CATALOG } from './HousingCatalogView';

interface HousingDashboardClientProps {
    student: any;
    application: (HousingApplication & { deposit?: HousingDeposit }) | null;
    assignment: (HousingAssignment & { room: any, building: any }) | null;
    buildings: HousingBuilding[];
    semesters: Semester[];
    invoices: HousingInvoice[];
}

const COUNTRIES = ['Ottawa, Ontario, Canada', 'United States', 'United Kingdom', 'Germany', 'France', 'China', 'India', 'Nigeria', 'Other'];

export default function HousingDashboardClient({ student, application, assignment, buildings, semesters, invoices }: HousingDashboardClientProps) {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Catalog State
    const [showCatalog, setShowCatalog] = useState(false);
    const [catalogBuildingId, setCatalogBuildingId] = useState<string | null>(null);
    const [catalogApartmentId, setCatalogApartmentId] = useState<string | null>(null);
    const [catalogLeaseDuration, setCatalogLeaseDuration] = useState<number>(6);


    // Payment State
    const [selectedInvoice, setSelectedInvoice] = useState<HousingInvoice | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD');
    const [billingCountry, setBillingCountry] = useState('');
    const [paying, setPaying] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [checkoutAmount, setCheckoutAmount] = useState<number>(0);
    const [mounted, setMounted] = useState(false);

    // Calculate actual total paid from database invoices
    const totalPaid = invoices
        .filter(inv => {
            // Include if explicitly linked to application or assignment
            const isLinked = inv.application_id === application?.id || inv.application_id === assignment?.application_id;
            // Also include if it's a housing invoice for this student (even if not linked)
            // This handles manually created invoices by admin that might have missed the linkage
            const isStudentHousingInvoice = inv.student_id === student.id;

            return isLinked || isStudentHousingInvoice;
        })
        .reduce((sum, inv) => sum + (inv.paid_amount || 0), 0);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        if (!catalogBuildingId || !catalogApartmentId) {
            setError('Mandatory Action: Please browse the catalog and select a specific property before submitting your application.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);
        setError('');

        const rentingMode = formData.get('rentingMode') as string;

        let formattedNotes = `Housing Preference: ${rentingMode}`;

        let totalContractValue = 0;
        const b = BUILDINGS_CATALOG.find(x => x.id === catalogBuildingId);
        const a = b?.apartments.find(x => x.id === catalogApartmentId);
        totalContractValue = (a?.price || 0) * catalogLeaseDuration;
        formattedNotes += `\nSelected Property: ${b?.name} - ${a?.type} (${a?.size}, $${a?.price}/mo)`;
        formattedNotes += `\nLease Duration: ${catalogLeaseDuration} months`;
        formattedNotes += `\nTotal Contract Value: $${totalContractValue}`;

        const baseNotes = formData.get('notes') as string;
        if (baseNotes) {
            formattedNotes += `\n\nAdditional Notes:\n${baseNotes}`;
        }

        try {
            const b = BUILDINGS_CATALOG.find(x => x.id === catalogBuildingId);
            const a = b?.apartments.find(x => x.id === catalogApartmentId);

            const result = await submitHousingApplication({
                semesterId: formData.get('semester') as string,
                preferredBuildingId: null, // Using catalog string for now since mock IDs don't match DB UUIDs
                moveInDate: formData.get('moveInDate') as string,
                moveOutDate: formData.get('moveOutDate') as string,
                leaseDuration: catalogLeaseDuration,
                totalContractValue: totalContractValue,
                roomType: a?.type || 'Standard',
                notes: formattedNotes
            });

            if (result.success) {
                setSuccess(true);
                setShowForm(false);
                // Reload after a short delay to show success message
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                setError(result.error || 'Application failed');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!selectedInvoice || !billingCountry) return;

        if (paymentMethod === 'BANK_TRANSFER') {
            setCheckoutAmount(selectedInvoice.total_amount - (selectedInvoice.paid_amount || 0));
            setShowCheckout(true);
            return;
        }

        setPaying(true);
        try {
            const result = await initiatePayment(selectedInvoice.id, paymentMethod, billingCountry);
            if (result.success && result.transactionId) {
                // Redirect to the finance page so the student can track pending
                // verification — admin will settle it from the wire queue.
                window.location.href = '/sis/payments';
            } else {
                alert('Payment failed: ' + result.error);
            }
        } catch (err: any) {
            alert('Error: ' + err.message);
        } finally {
            setPaying(false);
            setSelectedInvoice(null);
        }
    };

    const handlePayGoWireComplete = async (details: any) => {
        if (!selectedInvoice) return;
        setPaying(true);
        try {
            const result = await initiatePayment(selectedInvoice.id, 'BANK_TRANSFER', details.country || 'Ottawa, Ontario, Canada');
            if (result.success && result.transactionId) {
                // Redirect to the finance page — admin will settle the payment
                // from the wire verification queue in /admin/finance/invoices.
                window.location.href = '/sis/payments';
            } else {
                alert('Payment failed: ' + result.error);
                setPaying(false);
            }
        } catch (err: any) {
            alert('Error: ' + err.message);
            setPaying(false);
        }
    };

    // Find pending invoice (e.g., Deposit)
    const pendingInvoice = invoices.find(inv => inv.status !== 'PAID' && inv.status !== 'CANCELLED');

    return (
        <div className={`space-y-8 ${showReceipt ? 'print:hidden' : ''}`}>
            {showReceipt && (
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @media print {
                        body > *:not(#receipt-root) {
                            display: none !important;
                        }
                        #receipt-root {
                            display: block !important;
                        }
                    }
                ` }} />
            )}
            <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter mb-0.5 leading-none">Housing & Accommodation</h1>
                <p className="text-[10px] font-bold text-black uppercase tracking-widest">
                    Campus Residences
                </p>
            </div>

            {/* PAYMENT ALERT / INVOICE SECTION */}
            {pendingInvoice && (
                <div className="bg-neutral-50 p-5 rounded-none">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-black uppercase text-black mb-2">Payment Required</h3>
                            <p className="text-sm font-medium text-black mb-4">
                                You have a pending invoice: <strong>{pendingInvoice.reference_number}</strong>
                            </p>
                            <div className="text-2xl font-black text-black mb-4">
                                ${(pendingInvoice.total_amount - (pendingInvoice.paid_amount || 0)).toFixed(2)}
                            </div>

                            <button
                                onClick={() => {
                                    setSelectedInvoice(pendingInvoice);
                                    setCheckoutAmount(pendingInvoice.total_amount - (pendingInvoice.paid_amount || 0));
                                    setShowCheckout(true);
                                }}
                                className="px-6 py-2 bg-[#0a151a] text-white text-[10px] font-black uppercase tracking-widest rounded-none hover:bg-neutral-800"
                            >
                                Pay Now <ChevronRight size={14} weight="bold" className="inline ml-1" />
                            </button>
                        </div>
                        <CreditCard className="text-black" size={48} weight="regular" />
                    </div>
                </div>
            )}

            {showCheckout && selectedInvoice && (
                <div className="fixed inset-0 bg-[#0a151a]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-none relative">
                        <button
                            onClick={() => setShowCheckout(false)}
                            className="absolute right-6 top-6 z-10 p-2 bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors"
                        >
                            ✕
                        </button>
                        <div className="p-6 md:p-10">
                            <PayGoWireCheckout
                                amount={checkoutAmount}
                                currency="USD"
                                onPaymentComplete={handlePayGoWireComplete}
                                isProcessing={paying}
                                paymentReference={selectedInvoice.reference_number}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Receipt Modal */}
            {mounted && showReceipt && application && createPortal(
                <div id="receipt-root" className="fixed inset-0 bg-white z-[10000] flex flex-col overflow-y-auto font-sans print:overflow-visible">
                    {/* Top Bar for Mobile/Desktop Navigation */}
                    <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-neutral-100 p-4 flex justify-end no-print">
                        <button
                            onClick={() => setShowReceipt(false)}
                            className="text-[10px] font-black uppercase tracking-widest underline text-black px-4 py-2"
                        >
                            Back to Dashboard
                        </button>
                    </div>

                    <div className="p-6 md:p-16 print:p-0 print:m-0">
                        <div className="max-w-xl mx-auto w-full space-y-8 print:space-y-4 break-inside-avoid">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#0a151a] pb-6 gap-6 print:pb-4">
                                <div className="space-y-4 print:space-y-2">
                                    <img
                                        src="/images/logo-cannoga.png"
                                        alt="Cannoga College"
                                        className="h-10 w-auto"
                                    />
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-black text-black">Housing Office Receipt</p>
                                        <p className="text-[10px] font-bold text-black opacity-60">Cannoga College Official Document</p>
                                    </div>
                                </div>
                                <div className="text-left md:text-right space-y-1">
                                    <p className="text-[10px] font-black uppercase text-black">Receipt No: KU-HS-{application.id.slice(0, 8).toUpperCase()}</p>
                                    <p className="text-[10px] font-black uppercase text-black">Date: {new Date().toLocaleDateString('en-GB')}</p>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-8 print:space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:gap-4">
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black uppercase text-black opacity-50">Student Details</p>
                                        <p className="text-base font-black uppercase text-black leading-tight">
                                            {student.user?.first_name} {student.user?.last_name}
                                        </p>
                                        <p className="text-xs font-bold text-black">Student ID: {student.user?.student_number || student.student_id}</p>
                                    </div>
                                    <div className="space-y-2 md:text-right">
                                        <p className="text-[9px] font-black uppercase text-black opacity-50">Accommodation</p>
                                        <p className="text-sm font-black uppercase text-black leading-tight">
                                            {assignment ? assignment.room?.building?.name : 'Pending Assignment'}
                                        </p>
                                        {assignment && (
                                            <p className="text-xs font-bold text-black">Room #{assignment.room?.room_number} | {assignment.room?.room_type}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 print:pt-2">
                                    <p className="text-[9px] font-black uppercase text-black opacity-50 border-b border-[#0a151a]/10 pb-1">Payment Breakdown</p>
                                    <div className="space-y-3 print:space-y-1">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-bold uppercase text-black">Verified Payments Received</span>
                                            <span className="font-black text-black">${totalPaid.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="font-bold uppercase text-black opacity-60">Balance Due</span>
                                            <span className="font-black text-black">$0.00</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t-2 border-[#0a151a] print:pt-4">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black uppercase text-black">Total Paid Amount</p>
                                            <p className="text-[10px] font-black uppercase text-black">Confirmed & Verified by Finance Office</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-black text-black">${totalPaid.toFixed(2)}</p>
                                            <p className="text-[9px] font-black uppercase text-black opacity-40">Currency: CAD</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-16 space-y-6 print:pt-8 print:space-y-2">
                                <div className="pt-8 flex justify-between items-center no-print">
                                    <button
                                        onClick={() => window.print()}
                                        className="px-8 py-3 bg-[#0a151a] text-white text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all"
                                    >
                                        Print Official Receipt
                                    </button>
                                    <p className="text-[9px] font-black uppercase text-black">Cannoga College Housing Office</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Current Status Card */}
            {assignment ? (
                <div className="bg-card p-6 rounded-none shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-black uppercase text-black leading-none">Room Assignment</h2>
                            <p className="text-[10px] font-bold text-black uppercase mt-1">Confirmed & Active</p>
                        </div>
                        <CheckCircle className="text-green-600" size={40} weight="bold" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div>
                            {assignment.room?.images?.[0] ? (
                                <img
                                    src={assignment.room.images[0]}
                                    alt="Room"
                                    className="w-full aspect-video object-cover mb-4"
                                />
                            ) : (
                                <div className="w-full aspect-video flex items-center justify-center mb-4">
                                    <Bed size={48} className="text-black" />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="py-4">
                                    <p className="text-[10px] font-black uppercase text-black mb-1">Building</p>
                                    <p className="font-bold text-black">{assignment.room?.building?.name}</p>
                                    <p className="text-[9px] text-black uppercase">{assignment.room?.building?.campus_location}</p>
                                </div>
                                <div className="py-4">
                                    <p className="text-[10px] font-black uppercase text-black mb-1">Room Details</p>
                                    <p className="font-bold text-black">#{assignment.room?.room_number}</p>
                                    <p className="text-[9px] text-black uppercase">{assignment.room?.room_type} | {assignment.room?.size}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-black uppercase text-black mb-3 pb-1">Lease Information</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-[10px] font-bold uppercase text-black">Period</span>
                                        <span className="text-xs font-black">{formatToDDMMYYYY(assignment.start_date)} - {formatToDDMMYYYY(assignment.end_date)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[10px] font-bold uppercase text-black">Monthly Rent</span>
                                        <span className="text-xs font-black">{assignment.room?.monthly_rate > 0 ? `$${assignment.room.monthly_rate}` : 'See Admin'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold uppercase text-black">Status</span>
                                        <span className="text-[9px] font-black uppercase bg-[#0a151a] text-white px-3 py-1 rounded-full tracking-wider">{assignment.status}</span>
                                    </div>
                                </div>
                            </div>

                            {assignment.room?.amenities && assignment.room.amenities.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-black uppercase text-black mb-3 pb-1">Amenities</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {assignment.room.amenities.map((amenity: string, idx: number) => (
                                            <span key={idx} className="text-[9px] px-2 py-1 text-black font-bold uppercase border border-[#0a151a]/10">
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end pb-4">
                                <button
                                    onClick={() => setShowReceipt(true)}
                                    className="px-6 py-2.5 bg-[#0a151a] text-white text-[9px] font-black uppercase tracking-widest hover:bg-[#0a151a]/90 transition-all shadow-none"
                                >
                                    View Receipt
                                </button>
                            </div>

                            <div className="py-4 rounded-none">
                                <p className="text-[10px] font-black uppercase mb-1 text-black">Arrival Instructions</p>
                                <p className="text-[11px] leading-relaxed text-black font-medium">
                                    Pick up your keys from the Housing Office (Mon-Fri 09:00-16:00).
                                    Please bring your ID and Admission Letter.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : application ? (
                <div className="bg-white py-8 rounded-none">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-white border border-[#0a151a] rounded-none">
                            <Clock className="text-black" size={32} weight="bold" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase text-black leading-none mb-1">
                                {application.status === 'APPROVED' || application.status === 'ASSIGNED' || totalPaid > 0 ? 'Payment Received' : 'Application Pending'}
                            </h2>
                            <p className="text-[10px] font-black uppercase text-black">
                                {application.status === 'APPROVED' || application.status === 'ASSIGNED' || totalPaid > 0
                                    ? 'Awaiting Confirmation from Housing Office'
                                    : 'Currently Under Review'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-amber-50 border border-amber-200">
                            <p className="text-sm font-medium text-amber-900 leading-relaxed">
                                {application.status === 'APPROVED' || totalPaid > 0
                                    ? "Your payment has been successfully received. The Student Housing Office is now finalizing your room assignment. You will receive an update here once a room is assigned."
                                    : "We have received your application. Once reviewed, you will be notified to pay the housing deposit to secure your spot."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-100">
                            <div>
                                <p className="text-[9px] font-black uppercase text-neutral-400 mb-1">Reference</p>
                                <p className="text-[10px] font-bold text-black">#{application.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase text-neutral-400 mb-1">Submitted</p>
                                <p className="text-[10px] font-bold text-black">{formatToDDMMYYYY(application.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase text-neutral-400 mb-1">Lease</p>
                                <p className="text-[10px] font-bold text-black">{application.lease_duration} Months</p>
                            </div>
                            <div>
                                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-wider ${application.status === 'APPROVED' || application.status === 'ASSIGNED' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                                    {application.status === 'ASSIGNED' ? 'ASSIGNED & CONCARMED' : application.status}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setShowReceipt(true)}
                                className="px-6 py-2.5 border-2 border-[#0a151a] text-black text-[9px] font-black uppercase tracking-widest hover:bg-[#0a151a] hover:text-white transition-all shadow-none"
                            >
                                View Payment Receipt
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {!showForm ? (
                        <div className="bg-neutral-50 border border-neutral-200 p-6 rounded-none">
                            <div className="flex items-start gap-4 mb-6">
                                <AlertTriangle className="text-black" size={32} weight="bold" />
                                <div>
                                    <h2 className="text-xl font-black uppercase text-black mb-2">No Housing Application</h2>
                                    <p className="text-sm text-black">
                                        You have not yet submitted a housing application for this semester. Click the button below to begin.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowForm(true)}
                                className="px-5 py-2.5 bg-[#0a151a] text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all"
                            >
                                <Home size={14} weight="bold" className="inline mr-2" /> Apply for Housing
                            </button>
                        </div>
                    ) : (
                        <div className="bg-card p-6 rounded-none">
                            <h2 className="text-xl font-black uppercase text-black mb-6">Housing Application Form</h2>

                            <div className="bg-neutral-50 p-4 rounded-none mb-6">
                                <p className="text-sm text-black">
                                    <strong>Application Process:</strong> Select your preferred semester and building below.
                                    After submission, you will receive an invoice for the <strong>First Month Deposit</strong>.
                                    <br className="mb-1" />Room assignment will be finalized once the deposit is paid.
                                </p>
                            </div>

                            {success && (
                                <div className="bg-neutral-50 p-4 rounded-none mb-6">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-black">Application submitted! Generating invoice...</p>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="bg-neutral-50 p-4 rounded-none mb-6">
                                    <p className="text-sm text-black font-medium">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-black mb-2">
                                        Semester *
                                    </label>
                                    <select
                                        name="semester"
                                        required
                                        className="w-full px-4 py-3 border border-neutral-200 rounded-none focus:border-[#0a151a] focus:outline-none text-black"
                                    >
                                        <option value="">Select Semester</option>
                                        {semesters.map(sem => (
                                            <option key={sem.id} value={sem.id}>{sem.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={`p-4 border rounded-none mb-6 transition-colors ${(!catalogBuildingId || !catalogApartmentId) ? 'border-amber-400 bg-amber-50/30' : 'border-neutral-200 bg-neutral-50'}`}>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-2">Selected Property *</h3>
                                    {catalogBuildingId && catalogApartmentId ? (
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-sm text-black">{BUILDINGS_CATALOG.find(b => b.id === catalogBuildingId)?.name}</p>
                                                <p className="text-xs text-neutral-600">{BUILDINGS_CATALOG.find(b => b.id === catalogBuildingId)?.apartments.find(a => a.id === catalogApartmentId)?.type}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowCatalog(true)}
                                                className="text-[10px] font-black uppercase tracking-widest underline text-black hover:text-neutral-600"
                                            >
                                                Change
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-neutral-500">No property selected</p>
                                            <button
                                                type="button"
                                                onClick={() => setShowCatalog(true)}
                                                className="px-4 py-2 bg-[#0a151a] text-white text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                                            >
                                                Browse Catalog
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-black mb-2">
                                            Move-In Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="moveInDate"
                                            required
                                            className="w-full px-4 py-3 border border-neutral-200 rounded-none focus:border-[#0a151a] focus:outline-none text-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-black mb-2">
                                            Move-Out Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="moveOutDate"
                                            required
                                            className="w-full px-4 py-3 border border-neutral-200 rounded-none focus:border-[#0a151a] focus:outline-none text-black"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-neutral-200">
                                    <div>
                                        <h3 className="text-sm font-black uppercase text-black mb-1">Housing preference</h3>
                                        <p className="text-xs text-black">You can apply for an apartment as soon as you are admitted to Cannoga College.</p>
                                        <p className="text-[10px] text-black mt-1">*Mandatory field</p>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-black mb-2">
                                            I want to rent a student apartment*
                                        </label>
                                        <div className="space-y-2 text-sm text-black">
                                            <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="rentingMode" value="Alone" required /> Alone</label>
                                            <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="rentingMode" value="With my spouse or a friend" required /> With my spouse or a friend</label>
                                            <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="rentingMode" value="Same shared apartment with my friend" required /> Same shared apartment with my friend</label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-black mb-2">
                                        Additional Notes
                                    </label>
                                    <textarea
                                        name="notes"
                                        rows={4}
                                        className="w-full px-4 py-3 border border-neutral-200 rounded-none focus:border-[#0a151a] focus:outline-none text-black"
                                        placeholder="Any special requirements or preferences..."
                                    />
                                </div>

                                <div className="flex items-start gap-2 p-3 bg-neutral-50 border border-neutral-200 rounded-none">
                                    <input type="checkbox" required id="refundPolicyAgree" className="mt-0.5 border-2 border-neutral-300 rounded-sm checked:bg-[#0a151a] checked:border-[#0a151a] w-4 h-4" />
                                    <label htmlFor="refundPolicyAgree" className="text-[10px] text-black leading-tight">
                                        I adhere to the <a href="/refund-withdrawal-policy" target="_blank" className="underline font-bold text-black">Refund & Withdrawal Policy</a> and understand the terms regarding deposit forfeiture and lease cancellation.
                                    </label>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-3 bg-[#0a151a] text-white rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-6 py-3 border border-neutral-200 rounded-none text-[10px] font-black uppercase tracking-widest hover:border-[#0a151a] transition-all text-black"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </>
            )}

            {showCatalog && (
                <HousingCatalogView
                    onSelectBuilding={(id) => setCatalogBuildingId(id)}
                    onSelectApartment={(id, duration) => {
                        setCatalogApartmentId(id);
                        setCatalogLeaseDuration(duration);
                    }}
                    onClose={() => setShowCatalog(false)}
                />
            )}
        </div>
    );
}


