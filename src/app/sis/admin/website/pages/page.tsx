'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { FilterBar } from '@/components/sis/FilterBar';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon as Plus, FilterHorizontalIcon as Filter, Download01Icon as Download } from '@hugeicons/core-free-icons';
import Link from 'next/link';

interface PageRow {
    id: string;
    slug: string;
    title: string;
    status: string;
    published_at: string | null;
    updated_at: string;
}

export default function WebsitePagesPage() {
    const [search, setSearch] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('');
    const [pages, setPages] = useState<PageRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async (id: string) => {
        setDeleting(true);
        try {
            const response = await fetch(`/api/sis/admin/pages?id=${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete');
            setPages(pages.filter(p => p.id !== id));
            setDeleteId(null);
        } catch (e: any) {
            alert(e.message);
        } finally {
            setDeleting(false);
        }
    };

    const rowActions = (row: PageRow) => (
        <div className="flex items-center gap-2">
            <Link href={`/sis/admin/website/pages/${row.id}/`} className="text-xs font-bold !text-white text-white hover:underline no-underline">
                Edit
            </Link>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this page?')) {
                        handleDelete(row.id);
                    }
                }}
                className="text-xs font-bold text-red-400 hover:text-red-300"
            >
                Delete
            </button>
        </div>
    );

    useEffect(() => {
        const fetchPages = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/sis/admin/pages');
                if (response.ok) {
                    const data = await response.json();
                    setPages(data.pages || []);
                }
            } catch (error) {
                console.error('Error fetching pages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPages();
    }, []);

    const filtered = pages.filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
            s.slug.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !statusFilter || s.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const columns = [
        {
            key: 'title',
            header: 'Title',
            render: (s: PageRow) => <span className="font-bold !text-white text-white">{s.title}</span>,
        },
        {
            key: 'slug',
            header: 'Slug',
            render: (s: PageRow) => <span className="font-mono text-sm !text-slate-300 text-slate-300">/{s.slug}</span>,
        },
        {
            key: 'status',
            header: 'Status',
            render: (s: PageRow) => <StatusBadge status={s.status} />,
        },
        {
            key: 'updated_at',
            header: 'Updated',
            render: (s: PageRow) => new Date(s.updated_at).toLocaleDateString('en-CA'),
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader title="Pages" subtitle="Manage website pages" />
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Pages"
                subtitle="Manage website content pages"
                actions={
                    <Link href="/sis/admin/website/pages/new/" className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors no-underline">
                        <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> New Page
                    </Link>
                }
            />

            <ActionToolbar
                search={<SearchBar value={search} onChange={setSearch} placeholder="Search by title or slug..." />}
                filter={
                    <FilterBar
                        filters={[
                            { key: 'status', label: 'Status', value: statusFilter, onChange: setStatusFilter, options: [
                                { value: '', label: 'All Statuses' },
                                { value: 'published', label: 'Published' },
                                { value: 'draft', label: 'Draft' },
                                { value: 'archived', label: 'Archived' },
                            ]},
                        ]}
                    />
                }
            />

            <DataTable
                columns={columns}
                data={filtered}
                keyField="id"
                emptyMessage="No pages found"
                rowActions={rowActions}
            />
        </div>
    );
}
