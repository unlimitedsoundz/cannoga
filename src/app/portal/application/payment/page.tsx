'use client';

import { useState, useEffect, use, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import PaymentView from './PaymentView';

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const paymentType = searchParams.get('type');

    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<{
        application: any;
        offer: any;
    } | null>(null);

    useEffect(() => {
        if (!id) {
            router.push('/portal/dashboard');
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
                    router.push('/portal/account/login');
                    return;
                }

                // If explicitly paying housing deposit or id starts with hdep
                const isHousing = paymentType === 'housing' || id.toLowerCase().startsWith('hdep');

                if (isHousing) {
                    const cleanHousingAppId = id.replace(/^hdep-/, '');

                    // Fetch student ID from students table if currentUserId is profile user
                    const { data: studentRec } = await supabase
                        .from('students')
                        .select('id')
                        .eq('user_id', currentUserId || '')
                        .maybeSingle();

                    const queryIds = [currentUserId, studentRec?.id].filter(Boolean);

                    const { data: housingApp } = await supabase
                        .from('housing_applications')
                        .select(`
                            *,
                            assigned_room:assigned_room_id(*),
                            building:building_id(name),
                            homestay_host:homestay_host_id(host_name)
                        `)
                        .or(`id.eq.${cleanHousingAppId},student_id.in.(${queryIds.join(',')})`)
                        .maybeSingle();

                    const bName = (housingApp?.building as any)?.name ?? (housingApp?.homestay_host as any)?.host_name ?? 'Cannoga Residence';
                    const rCode = (housingApp?.assigned_room as any)?.full_room_code ?? '';

                    const syntheticOffer = {
                        id: `hdep-${housingApp?.id || id}`,
                        tuition_fee: 500.00,
                        invoice_type: 'HOUSING_DEPOSIT',
                        invoice_pushed: true,
                        payment_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                        ancillary_charged: true,
                    };

                    const syntheticApp = {
                        id: housingApp?.id || id,
                        user_id: currentUserId,
                        course: { title: `Housing Security Deposit (${bName}${rCode ? ` · Room ${rCode}` : ''})`, duration: 'Academic Year' },
                        status: housingApp?.status || 'contract_signed'
                    };

                    setData({ application: syntheticApp, offer: syntheticOffer });
                    return;
                }

                // Academic tuition application query
                const { data: applicationRaw, error: appError } = await supabase
                    .from('applications')
                    .select(`
                        *,
                        offer:admission_offers(*),
                        course:Course(duration)
                    `)
                    .eq('id', id)
                    .eq('user_id', currentUserId || '')
                    .maybeSingle();

                if (applicationRaw) {
                    const application = applicationRaw;
                    const offer = Array.isArray(application.offer) ? application.offer[0] : application.offer;

                    if (!offer || !offer.invoice_pushed) {
                        setError('No payment invoice available yet. Your tuition invoice is being prepared by the finance office.');
                        setLoading(false);
                        return;
                    }

                    setData({ application, offer });
                    return;
                }

                console.error('Application or offer not found', appError);
                router.push('/sis/payments');
                return;
            } catch (err) {
                console.error('CRITICAL: Fetching payment data failed', err);
                setError(err instanceof Error ? err.message : 'Failed to load payment data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentData();
    }, [id, router, supabase]);

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

    if (!data || !id) {
        if (error) {
            return (
                <div className="max-w-md mx-auto mt-6 md:mt-12 bg-white p-6 md:p-12 rounded-4px text-center shadow-sm">
                    <div className="w-20 h-20 bg-neutral-50 border border-neutral-100 text-black force-circle flex items-center justify-center mx-auto mb-8">
                    </div>
                    <h2 className="text-2xl font-normal text-black mb-4 tracking-tighter">Payment Unavailable</h2>
                    <p className="text-sm text-black mb-8 max-w-[280px] mx-auto leading-relaxed">{error}</p>
                    <button
                        onClick={() => router.push('/portal/dashboard')}
                        className="w-fit min-w-[240px] h-[48px] bg-[#0a151a] text-white px-8 rounded-4px text-[11px] font-normal uppercase tracking-widest transition-all hover:bg-neutral-800 shadow-lg shadow-black/5"
                    >
                        Return to Dashboard
                    </button>
                </div>
            );
        }
        return null;
    }

    return (
        <PaymentView
            params={{ id }}
            application={data.application}
            admissionOffer={data.offer}
        />
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-neutral-100 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-sm font-medium uppercase tracking-widest text-neutral-400">Securing Payment Gateway... (Suspense)</p>
                </div>
            </div>
        }>
            <PaymentContent />
        </Suspense>
    );
}
