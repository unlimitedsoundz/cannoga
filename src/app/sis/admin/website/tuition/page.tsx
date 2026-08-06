'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { FilterBar } from '@/components/sis/FilterBar';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { Add01Icon as Plus, FilterHorizontalIcon as Filter } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';

interface TuitionRow {
    id: string;
    credential_type: string;
    domestic_tuition: number | null;
    international_tuition: number | null;
    application_fee: number | null;
    status: string;
    effective_from: string | null;
    updated_at: string;
}

export default function WebsiteTuitionPage() {
    const [search, setSearch] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('');
    const [tuition, setTuition] = useState<TuitionRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async (id: string) => {
        setDeleting(true);
        try {
            const response = await fetch(`/api/sis/admin/tuition?id=${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete');
            setTuition(tuition.filter(t => t.id !== id));
            setDeleteId(null);
        } catch (e: any) {
            alert(e.message);
        } finally {
            setDeleting(false);
        }
    };

    const rowActions = (row: TuitionRow) => (
        <div className="flex items-center gap-2">
            <Link href={`/sis/admin/website/tuition/${row.id}`} className="text-xs font-bold text-[#9c27b3] hover:underline no-underline">
                Edit
            </Link>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this tuition entry?')) {
                        handleDelete(row.id);
                    }
                }}
                className="text-xs font-bold text-red-600 hover:text-red-800"
            >
                Delete
            </button>
        </div>
    );

    useEffect(() => {
        const fetchTuition = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/sis/admin/tuition');
                if (response.ok) {
                    const data = await response.json();
                    setTuition(data.tuition || []);
                }
            } catch (error) {
                console.error('Error fetching tuition:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTuition();
    }, []);

    const filtered = tuition.filter(t => {
        const matchesSearch = t.credential_type.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !statusFilter || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const columns = [
        {
            key: 'credential_type',
            header: 'Credential',
            render: (t: TuitionRow) => <span className="font-bold text-neutral-900">{t.credential_type}</span>,
        },
        {
            key: 'domestic_tuition',
            header: 'Domestic',
            render: (t: TuitionRow) => t.domestic_tuition ? `$${t.domestic_tuition.toLocaleString()}` : '—',
        },
        {
            key: 'international_tuition',
            header: 'International',
            render: (t: TuitionRow) => t.international_tuition ? `$${t.international_tuition.toLocaleString()}` : '—',
        },
        {
            key: 'status',
            header: 'Status',
            render: (t: TuitionRow) => <StatusBadge status={t.status} />,
        },
        {
            key: 'effective_from',
            header: 'Effective From',
            render: (t: TuitionRow) => t.effective_from ? new Date(t.effective_from).toLocaleDateString('en-CA') : '—',
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader title="Tuition" subtitle="Manage tuition information" />
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Tuition"
                subtitle="Manage tuition and fee information"
                actions={
                    <Link href="/sis/admin/website/tuition/new" className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors no-underline">
                        <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> New Entry
                    </Link>
                }
            />

            <ActionToolbar
                search={<SearchBar value={search} onChange={setSearch} placeholder="Search by credential type..." />}
                filter={
                    <FilterBar
                        filters={[
                            { key: 'status', label: 'Status', value: statusFilter, onChange: setStatusFilter, options: [
                                { value: '', label: 'All Statuses' },
                                { value: 'active', label: 'Active' },
                                { value: 'inactive', label: 'Inactive' },
                            ]},
                        ]}
                    />
                }
            />

            <DataTable
                columns={columns}
                data={filtered}
                keyField="id"
                emptyMessage="No tuition entries found"
                rowActions={rowActions}
            />
        </div>
    );
}
