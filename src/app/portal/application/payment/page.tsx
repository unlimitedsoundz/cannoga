'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import PaymentView from './PaymentView';

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const invoiceId = searchParams.get('invoice_id') || searchParams.get('inv_id');
    const invoiceNumberParam = searchParams.get('invoice_number');
    const amountParam = searchParams.get('amount');
    const invoiceTypeParam = searchParams.get('invoice_type');
    const paymentType = searchParams.get('type');

    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<{
        application: any;
        offer: any;
    } | null>(null);

    useEffect(() => {
        if (!id && !invoiceId && !invoiceNumberParam) {
            router.push('/portal/dashboard/');
            return;
        }

        const fetchPaymentData = async () => {
            try {
                // 1. Primary Auth Check (Supabase)
                const { data: { user: sbUser } } = await supabase.auth.getUser();
                let currentUserEmail = sbUser?.email;
                let currentUserId = sbUser?.id;

                // 2. Secondary Auth Check (LocalStorage Fallback)
                if (!sbUser) {
                    const savedUser = localStorage.getItem('Cannoga_user');
                    if (savedUser) {
                        const localProfile = JSON.parse(savedUser);
                        currentUserEmail = localProfile.email;
                        currentUserId = localProfile.id;
                    }
                }

                if (!currentUserEmail) {
                    router.push('/portal/account/login/');
                    return;
                }

                // Check if user is an active enrolled student in SIS
                let currentUserIsEnrolled = false;
                if (currentUserId) {
                    const { data: currentStudent } = await supabase
                        .from('students')
                        .select('id')
                        .eq('user_id', currentUserId)
                        .maybeSingle();
                    if (currentStudent) currentUserIsEnrolled = true;
                }

                // 3. PRIORITY 1: Check formal institutional invoices table directly.
                // This covers all custom invoices issued by admin for enrolled students.
                const candidateInvoiceIds = [invoiceId, id, invoiceNumberParam].filter(Boolean) as string[];
                for (const candidate of candidateInvoiceIds) {
                    const isUUID = candidate.length === 36 && candidate.includes('-');
                    let invQuery = supabase.from('invoices').select('*');
                    if (isUUID) {
                        invQuery = invQuery.or(`id.eq.${candidate},invoice_number.eq.${candidate}`);
                    } else {
                        invQuery = invQuery.eq('invoice_number', candidate);
                    }
                    const { data: dbInv } = await invQuery.maybeSingle();

                    if (dbInv) {
                        // Determine the exact payable balance or amount pushed by admin
                        const exactAmount = Number(
                            (dbInv.balance !== null && dbInv.balance !== undefined && Number(dbInv.balance) > 0)
                                ? dbInv.balance
                                : dbInv.amount
                        );

                        // Look up the linked student record
                        const { data: studentRec } = await supabase
                            .from('students')
                            .select(`
                                id,
                                user_id,
                                application_id,
                                course:Course(title, duration),
                                application:applications(
                                    id,
                                    course:Course(title, duration),
                                    offer:admission_offers(id, status, created_at)
                                )
                            `)
                            .eq('id', dbInv.student_id)
                            .maybeSingle();

                        const progTitle = studentRec?.course?.title || (studentRec?.application as any)?.course?.title || dbInv.description || 'Program Tuition';
                        const progDuration = studentRec?.course?.duration || (studentRec?.application as any)?.course?.duration || dbInv.term || 'Academic Term';
                        const targetAppId = studentRec?.application_id || (studentRec?.application as any)?.id || id || dbInv.student_id;

                        // Resolve real admission_offers UUID if available for foreign key consistency
                        let realOfferId = dbInv.id;
                        const linkedOffers = (studentRec?.application as any)?.offer;
                        if (linkedOffers) {
                            const rawArr = Array.isArray(linkedOffers) ? linkedOffers : [linkedOffers];
                            if (rawArr.length > 0) {
                                realOfferId = rawArr[0].id;
                            }
                        } else if (targetAppId && targetAppId.length === 36) {
                            const { data: fallbackOfferRec } = await supabase
                                .from('admission_offers')
                                .select('id')
                                .eq('application_id', targetAppId)
                                .order('created_at', { ascending: false })
                                .limit(1)
                                .maybeSingle();
                            if (fallbackOfferRec?.id) realOfferId = fallbackOfferRec.id;
                        }

                        // Derive clean invoice type label
                        let cleanType = dbInv.type || 'CUSTOM_INVOICE';
                        if (dbInv.invoice_number && dbInv.invoice_number.includes('-')) {
                            const parts = dbInv.invoice_number.split('-');
                            if (parts.length >= 3) {
                                cleanType = parts.slice(2).join('-').trim();
                            }
                        }

                        const syntheticOffer = {
                            id: realOfferId,
                            invoice_id: dbInv.id,
                            invoice_number: dbInv.invoice_number,
                            tuition_fee: exactAmount,
                            invoice_type: cleanType,
                            invoice_pushed: true,
                            payment_deadline: dbInv.due_date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                            ancillary_charged: true, // Don't add extra ancillary fees onto custom invoices
                        };

                        const syntheticApp = {
                            id: targetAppId,
                            user_id: studentRec?.user_id || currentUserId,
                            course: {
                                title: `${progTitle} (${dbInv.invoice_number})`,
                                duration: progDuration
                            },
                            status: 'enrolled',
                            is_enrolled: true
                        };

                        setData({ application: syntheticApp, offer: syntheticOffer });
                        return;
                    }
                }

                // 4. PRIORITY 2: Check housing_invoices table for custom housing invoices
                for (const candidate of candidateInvoiceIds) {
                    const isUUID = candidate.length === 36 && candidate.includes('-');
                    let hQuery = supabase.from('housing_invoices').select(`
                        *,
                        application:housing_applications(
                            *,
                            assigned_room:assigned_room_id(*),
                            building:building_id(name),
                            homestay_host:homestay_host_id(host_name)
                        )
                    `);
                    if (isUUID) {
                        hQuery = hQuery.or(`id.eq.${candidate},reference_number.eq.${candidate}`);
                    } else {
                        hQuery = hQuery.eq('reference_number', candidate);
                    }
                    const { data: hInv } = await hQuery.maybeSingle();

                    if (hInv) {
                        const exactAmount = Number((hInv.total_amount - (hInv.paid_amount || 0)) || hInv.total_amount);
                        const bName = (hInv.application?.building as any)?.name ?? (hInv.application?.homestay_host as any)?.host_name ?? 'Cannoga Residence';
                        const rCode = (hInv.application?.assigned_room as any)?.full_room_code ?? '';

                        const syntheticOffer = {
                            id: `hdep-${hInv.application_id || hInv.id}`,
                            invoice_id: hInv.id,
                            invoice_number: hInv.reference_number,
                            tuition_fee: exactAmount,
                            invoice_type: 'HOUSING_DEPOSIT',
                            invoice_pushed: true,
                            payment_deadline: hInv.due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                            ancillary_charged: true,
                        };

                        const syntheticApp = {
                            id: hInv.application_id || id,
                            user_id: currentUserId,
                            course: {
                                title: `Housing Invoice (${bName}${rCode ? ` · Room ${rCode}` : ''})`,
                                duration: 'Academic Year'
                            },
                            status: currentUserIsEnrolled ? 'enrolled' : 'contract_signed',
                            is_enrolled: currentUserIsEnrolled
                        };

                        setData({ application: syntheticApp, offer: syntheticOffer });
                        return;
                    }
                }

                // 5. Check if this is an explicit housing flow
                const isHousing = paymentType === 'housing' || id?.toLowerCase().startsWith('hdep') || searchParams.get('invoice_type') === 'HOUSING_DEPOSIT';

                if (isHousing && id) {
                    const cleanHousingAppId = id.replace(/^hdep-/, '');

                    let housingApp: any = null;

                    if (cleanHousingAppId.length > 20) {
                        const { data: byId } = await supabase
                            .from('housing_applications')
                            .select(`
                                *,
                                assigned_room:assigned_room_id(*),
                                building:building_id(name),
                                homestay_host:homestay_host_id(host_name)
                            `)
                            .eq('id', cleanHousingAppId)
                            .maybeSingle();
                        if (byId) housingApp = byId;
                    }

                    if (!housingApp) {
                        const { data: studentRec } = await supabase
                            .from('students')
                            .select('id')
                            .eq('user_id', currentUserId || '')
                            .maybeSingle();

                        const queryIds = [currentUserId, studentRec?.id].filter(Boolean);

                        const { data: byUser } = await supabase
                            .from('housing_applications')
                            .select(`
                                *,
                                assigned_room:assigned_room_id(*),
                                building:building_id(name),
                                homestay_host:homestay_host_id(host_name)
                            `)
                            .in('student_id', queryIds)
                            .order('created_at', { ascending: false })
                            .limit(1)
                            .maybeSingle();
                        if (byUser) housingApp = byUser;
                    }

                    // Check if an actual invoice exists for this housing application to fetch its exact amount
                    let housingFee = 500.00;
                    if (amountParam && Number(amountParam) > 0) {
                        housingFee = Number(amountParam);
                    } else if (housingApp?.id) {
                        const { data: hInvForApp } = await supabase
                            .from('housing_invoices')
                            .select('total_amount, paid_amount')
                            .eq('application_id', housingApp.id)
                            .order('created_at', { ascending: false })
                            .limit(1)
                            .maybeSingle();
                        if (hInvForApp) {
                            housingFee = Number((hInvForApp.total_amount - (hInvForApp.paid_amount || 0)) || hInvForApp.total_amount);
                        }
                    }

                    const bName = (housingApp?.building as any)?.name ?? (housingApp?.homestay_host as any)?.host_name ?? 'Cannoga Residence';
                    const rCode = (housingApp?.assigned_room as any)?.full_room_code ?? '';

                    const syntheticOffer = {
                        id: `hdep-${housingApp?.id || id}`,
                        tuition_fee: housingFee,
                        invoice_type: 'HOUSING_DEPOSIT',
                        invoice_pushed: true,
                        payment_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                        ancillary_charged: true,
                    };

                    const syntheticApp = {
                        id: housingApp?.id || id,
                        user_id: currentUserId,
                        course: { title: `Housing Security Deposit (${bName}${rCode ? ` · Room ${rCode}` : ''})`, duration: 'Academic Year' },
                        status: currentUserIsEnrolled ? 'enrolled' : (housingApp?.status || 'contract_signed'),
                        is_enrolled: currentUserIsEnrolled
                    };

                    setData({ application: syntheticApp, offer: syntheticOffer });
                    return;
                }

                // 6. Academic tuition application query
                if (id) {
                    const { data: applicationRaw } = await supabase
                        .from('applications')
                        .select(`
                            *,
                            offer:admission_offers(*),
                            course:Course(duration)
                        `)
                        .eq('id', id)
                        .maybeSingle();

                    if (applicationRaw && applicationRaw.offer) {
                        const application = applicationRaw;
                        const rawOffers = Array.isArray(application.offer) ? application.offer : [application.offer];
                        const sortedOffers = rawOffers.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
                        const offer = sortedOffers[0];

                        if (!offer || !offer.invoice_pushed) {
                            setError('No payment invoice available yet. Your tuition invoice is being prepared by the finance office.');
                            setLoading(false);
                            return;
                        }

                        // If amountParam was passed, use it directly (e.g. for custom invoice part-payments)
                        if (amountParam && Number(amountParam) > 0) {
                            offer.tuition_fee = Number(amountParam);
                            offer.ancillary_charged = true;
                        }
                        if (invoiceTypeParam) {
                            offer.invoice_type = invoiceTypeParam;
                        }

                        if (currentUserIsEnrolled) {
                            application.status = 'enrolled';
                            application.is_enrolled = true;
                        }

                        setData({ application, offer });
                        return;
                    }
                }

                // Fallback: check if id belongs to any housing application before failing
                if (id) {
                    const { data: fallbackHousing } = await supabase
                        .from('housing_applications')
                        .select(`
                            *,
                            assigned_room:assigned_room_id(*),
                            building:building_id(name),
                            homestay_host:homestay_host_id(host_name)
                        `)
                        .eq('id', id)
                        .maybeSingle();

                    if (fallbackHousing) {
                        const bName = (fallbackHousing?.building as any)?.name ?? (fallbackHousing?.homestay_host as any)?.host_name ?? 'Cannoga Residence';
                        const rCode = (fallbackHousing?.assigned_room as any)?.full_room_code ?? '';
                        const housingFee = (amountParam && Number(amountParam) > 0) ? Number(amountParam) : 500.00;

                        const syntheticOffer = {
                            id: `hdep-${fallbackHousing.id}`,
                            tuition_fee: housingFee,
                            invoice_type: 'HOUSING_DEPOSIT',
                            invoice_pushed: true,
                            payment_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                            ancillary_charged: true,
                        };

                        const syntheticApp = {
                            id: fallbackHousing.id,
                            user_id: currentUserId,
                            course: { title: `Housing Security Deposit (${bName}${rCode ? ` · Room ${rCode}` : ''})`, duration: 'Academic Year' },
                            status: fallbackHousing.status || 'contract_signed'
                        };

                        setData({ application: syntheticApp, offer: syntheticOffer });
                        return;
                    }
                }

                // If no invoice matches, do not throw or redirect abruptly; show clean invoice error
                setError('Payment invoice details could not be found. Please return to the payments portal.');
                return;
            } catch (err) {
                console.error('CRITICAL: Fetching payment data failed', err);
                setError(err instanceof Error ? err.message : 'Failed to load payment data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentData();
    }, [id, invoiceId, invoiceNumberParam, amountParam, invoiceTypeParam, paymentType, router, supabase]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-neutral-100 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-sm font-medium uppercase tracking-widest text-neutral-400">Securing Payment Gateway...</p>
                </div>
            </div>
        );
    }

    if (!data || (!id && !invoiceId && !invoiceNumberParam)) {
        if (error) {
            return (
                <div className="max-w-md mx-auto mt-6 md:mt-12 bg-white p-6 md:p-12 rounded-4px text-center shadow-sm">
                    <div className="w-20 h-20 bg-neutral-50 border border-neutral-100 text-black force-circle flex items-center justify-center mx-auto mb-8">
                    </div>
                    <h2 className="text-2xl font-normal text-black mb-4 tracking-tighter">Payment Unavailable</h2>
                    <p className="text-sm text-black mb-8 max-w-[280px] mx-auto leading-relaxed">{error}</p>
                    <button
                        onClick={() => router.push('/sis/payments/')}
                        className="w-fit min-w-[240px] h-[48px] bg-[#0a151a] text-white px-8 rounded-4px text-[11px] font-normal uppercase tracking-widest transition-all hover:bg-neutral-800 shadow-lg shadow-black/5"
                    >
                        Return to Payments
                    </button>
                </div>
            );
        }
        return null;
    }

    const returnToParam = searchParams.get('return_to');
    const isStudentEnrolled = data.application?.is_enrolled || data.application?.status === 'enrolled' || Boolean(invoiceId) || Boolean(invoiceNumberParam);

    return (
        <PaymentView
            params={{ id: id || invoiceId || '' }}
            application={data.application}
            admissionOffer={data.offer}
            returnTo={returnToParam || (isStudentEnrolled ? '/sis' : undefined)}
            isFromSis={Boolean(isStudentEnrolled || returnToParam)}
        />
    );
}

export default function PaymentPage() {
    return (
        <div className="font-rubik" data-font="rubik">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-neutral-100 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-sm font-medium uppercase tracking-widest text-neutral-400 font-rubik">Securing Payment Gateway... (Suspense)</p>
                    </div>
                </div>
            }>
                <PaymentContent />
            </Suspense>
        </div>
    );
}
