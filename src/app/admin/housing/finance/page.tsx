'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Link } from "@aalto-dx/react-components";
import { CaretLeft as ArrowLeft, CircleNotch as Loader2 } from "@phosphor-icons/react/dist/ssr";
import FinanceManagementClient from './FinanceManagementClient';

export default function AdminHousingFinancePage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{
        invoices: any[];
        payments: any[];
        students: any[];
    }>({
        invoices: [],
        payments: [],
        students: []
    });

    const router = useRouter();


    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();

            // Check authentication
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/portal/account/login');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile?.role !== 'ADMIN') {
                router.push('/portal/dashboard');
                return;
            }

            // Fetch data
            const [invoicesRes, paymentsRes, studentsRes] = await Promise.all([
                supabase
                    .from('housing_invoices')
                    .select('*, student:students(id, student_id, user:profiles(*)), items:housing_invoice_items(*)')
                    .order('created_at', { ascending: false }),
                supabase
                    .from('housing_payments')
                    .select('*, student:students(id, user:profiles(first_name, last_name)), invoice:housing_invoices(reference_number)')
                    .order('created_at', { ascending: false }),
                supabase
                    .from('students')
                    .select('*, user:profiles(first_name, last_name)')
                    .limit(100)
            ]);

            setData({
                invoices: invoicesRes.data || [],
                payments: paymentsRes.data || [],
                students: studentsRes.data || []
            });
            setLoading(false);
        };

        fetchData();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50/50 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/admin/housing"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-black transition-colors"
                    >
                        <ArrowLeft size={14} /> Back to Housing Management
                    </Link>
                </div>

                <FinanceManagementClient
                    initialInvoices={data.invoices}
                    initialPayments={data.payments}
                    students={data.students}
                />
            </div>
        </div>
    );
}
