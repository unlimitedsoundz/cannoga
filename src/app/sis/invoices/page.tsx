'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { File01Icon as FileText, CreditCardIcon as CreditCard } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { createClient } from '@/utils/supabase/client';

interface Invoice {
    id: string;
    reference_number: string;
    amount: number;
    status: string;
    due_date: string;
    created_at: string;
}

export default function InvoicesPage() {
    const router = useRouter();
    const [search, setSearch] = React.useState('');
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [applicationId, setApplicationId] = useState<string | null>(null);
    const [invoicePushed, setInvoicePushed] = useState(false);

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
                const supabase = createClient();
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                if (authError || !user) {
                    router.replace('/portal/account/login');
                    return;
                }

                const { data: studentData, error: studentError } = await supabase
                    .from('students')
                    .select('application_id')
                    .eq('user_id', user.id)
                    .single();

                if (studentError || !studentData) {
                    return;
                }

                setApplicationId(studentData.application_id);

                if (studentData.application_id) {
                    const { data: offerData } = await supabase
                        .from('admission_offers')
                        .select('invoice_pushed')
                        .eq('application_id', studentData.application_id)
                        .maybeSingle();

                    if (offerData) {
                        setInvoicePushed(offerData.invoice_pushed || false);
                    }
                }

                const response = await fetch('/api/sis/student-invoices');
                if (response.ok) {
                    const data = await response.json();
                    setInvoices(data.invoices || []);
                }
            } catch (error) {
                console.error('Error fetching invoices:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [router]);

    const filtered = invoices.filter(s =>
        s.reference_number.toLowerCase().includes(search.toLowerCase()) ||
        s.status.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        {
            key: 'reference_number',
            header: 'Invoice #',
            render: (s: Invoice) => <span className="font-mono text-sm text-neutral-900">{s.reference_number}</span>,
        },
        {
            key: 'amount',
            header: 'Amount',
            render: (s: Invoice) => <span className="font-medium text-neutral-900">${s.amount.toFixed(2)}</span>,
        },
        {
            key: 'status',
            header: 'Status',
        },
        {
            key: 'due_date',
            header: 'Due Date',
            render: (s: Invoice) => new Date(s.due_date).toLocaleDateString('en-CA'),
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Invoices"
                    subtitle="View and pay your tuition invoices"
                />
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Invoices"
                subtitle="View and pay your tuition invoices"
            />

            <div className="bg-white border border-neutral-200 p-4 rounded-lg">
                <SearchBar value={search} onChange={setSearch} placeholder="Search by invoice number..." />
            </div>

            <DataTable
                columns={columns}
                data={filtered}
                keyField="id"
                emptyMessage="No invoices found"
            />

            {filtered.length > 0 && (
                <button 
                    onClick={() => {
                        if (invoicePushed && applicationId) {
                            window.location.href = `/portal/application/payment?id=${applicationId}`;
                        }
                    }}
                    disabled={!invoicePushed}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
                        invoicePushed
                            ? 'bg-[#0a151a] text-white hover:bg-neutral-800 cursor-pointer'
                            : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                    }`}
                >
                    <HugeiconsIcon icon={CreditCard} size={14} strokeWidth={2.5} />
                    {invoicePushed ? 'Pay Now' : 'Invoice Not Ready'}
                </button>
            )}
        </div>
    );
}