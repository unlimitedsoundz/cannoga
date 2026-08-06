'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { File01Icon as FileText, CreditCardIcon as CreditCard } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

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

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
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
    }, []);

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
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-700 transition-colors">
                    <HugeiconsIcon icon={CreditCard} size={14} strokeWidth={2.5} />
                    Pay Now
                </button>
            )}
        </div>
    );
}