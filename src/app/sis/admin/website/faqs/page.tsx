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

interface FaqRow {
    id: string;
    question: string;
    category: string | null;
    status: string;
    display_order: number;
    updated_at: string;
}

export default function WebsiteFaqsPage() {
    const [search, setSearch] = React.useState('');
    const [categoryFilter, setCategoryFilter] = React.useState('');
    const [faqs, setFaqs] = useState<FaqRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async (id: string) => {
        setDeleting(true);
        try {
            const response = await fetch(`/api/sis/admin/faqs?id=${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete');
            setFaqs(faqs.filter(f => f.id !== id));
            setDeleteId(null);
        } catch (e: any) {
            alert(e.message);
        } finally {
            setDeleting(false);
        }
    };

    const rowActions = (row: FaqRow) => (
        <div className="flex items-center gap-2">
            <Link href={`/sis/admin/website/faqs/${row.id}`} className="text-xs font-bold text-[#0a151a] hover:underline no-underline">
                Edit
            </Link>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this FAQ?')) {
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
        const fetchFaqs = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/sis/admin/faqs');
                if (response.ok) {
                    const data = await response.json();
                    setFaqs(data.faqs || []);
                }
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, []);

    const filtered = faqs.filter(f => {
        const matchesSearch = f.question.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !categoryFilter || f.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const columns = [
        {
            key: 'question',
            header: 'Question',
            render: (f: FaqRow) => <span className="text-sm font-medium text-neutral-900 line-clamp-1">{f.question}</span>,
        },
        {
            key: 'category',
            header: 'Category',
            render: (f: FaqRow) => <span className="text-xs text-neutral-500">{f.category || 'General'}</span>,
        },
        {
            key: 'status',
            header: 'Status',
            render: (f: FaqRow) => <StatusBadge status={f.status} />,
        },
        {
            key: 'display_order',
            header: 'Order',
            render: (f: FaqRow) => <span className="text-xs font-mono text-neutral-500">{f.display_order}</span>,
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader title="FAQs" subtitle="Manage frequently asked questions" />
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="FAQs"
                subtitle="Manage frequently asked questions"
                actions={
                    <Link href="/sis/admin/website/faqs/new" className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors no-underline">
                        <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> New FAQ
                    </Link>
                }
            />

            <ActionToolbar
                search={<SearchBar value={search} onChange={setSearch} placeholder="Search questions..." />}
                filter={
                    <FilterBar
                        filters={[
                            { key: 'category', label: 'Category', value: categoryFilter, onChange: setCategoryFilter, options: [
                                { value: '', label: 'All Categories' },
                                { value: 'Admissions', label: 'Admissions' },
                                { value: 'Tuition', label: 'Tuition' },
                                { value: 'Programs', label: 'Programs' },
                                { value: 'Campus', label: 'Campus' },
                                { value: 'General', label: 'General' },
                            ]},
                        ]}
                    />
                }
            />

            <DataTable
                columns={columns}
                data={filtered}
                keyField="id"
                emptyMessage="No FAQs found"
                rowActions={rowActions}
            />
        </div>
    );
}
