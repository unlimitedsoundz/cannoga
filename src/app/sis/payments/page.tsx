'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { CreditCardIcon as CreditCard } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface Payment {
    id: string;
    transaction_reference: string;
    amount: number;
    status: string;
    created_at: string;
    invoice_id: string;
}

export default function PaymentsPage() {
    const router = useRouter();
    const [search, setSearch] = React.useState('');
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/sis/student-payments');
                if (response.ok) {
                    const data = await response.json();
                    setPayments(data.payments || []);
                }
            } catch (error) {
                console.error('Error fetching payments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const filtered = payments.filter(s =>
        s.transaction_reference.toLowerCase().includes(search.toLowerCase()) ||
        s.status.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        {
            key: 'transaction_reference',
            header: 'Transaction #',
            render: (s: Payment) => <span className="font-mono text-sm text-neutral-900">{s.transaction_reference}</span>,
        },
        {
            key: 'amount',
            header: 'Amount',
            render: (s: Payment) => <span className="font-medium text-neutral-900">${s.amount.toFixed(2)}</span>,
        },
        {
            key: 'status',
            header: 'Status',
        },
        {
            key: 'created_at',
            header: 'Date',
            render: (s: Payment) => new Date(s.created_at).toLocaleDateString('en-CA'),
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Payments"
                    subtitle="View your payment history"
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
                title="Payments"
                subtitle="View your payment history"
            />

            <div className="bg-white border border-neutral-200 p-4 rounded-lg">
                <SearchBar value={search} onChange={setSearch} placeholder="Search by transaction number..." />
            </div>

            <DataTable
                columns={columns}
                data={filtered}
                keyField="id"
                emptyMessage="No payments found"
            />
        </div>
    );
}