'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { FilterBar } from '@/components/sis/FilterBar';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { Add01Icon as Plus, FilterHorizontalIcon as Filter, Download01Icon as Download } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';

interface SchoolRow {
    id: string;
    name: string;
    slug: string;
    description: string;
    imageUrl: string | null;
    status: string;
    updated_at: string;
}

export default function WebsiteSchoolsPage() {
    const [search, setSearch] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('');
    const [schools, setSchools] = useState<SchoolRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async (id: string) => {
        setDeleting(true);
        try {
            const response = await fetch(`/api/sis/admin/schools?id=${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete');
            setSchools(schools.filter(s => s.id !== id));
            setDeleteId(null);
        } catch (e: any) {
            alert(e.message);
        } finally {
            setDeleting(false);
        }
    };

    const rowActions = (row: SchoolRow) => (
        <div className="flex items-center gap-2">
            <Link href={`/sis/admin/website/schools/${row.id}`} className="text-xs font-bold text-[#9c27b3] hover:underline no-underline">
                Edit
            </Link>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this school?')) {
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
        const fetchSchools = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/sis/admin/schools');
                if (response.ok) {
                    const data = await response.json();
                    setSchools(data.schools || []);
                }
            } catch (error) {
                console.error('Error fetching schools:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchools();
    }, []);

    const filtered = schools.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.slug.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !statusFilter || s.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const columns = [
        {
            key: 'name',
            header: 'School',
            render: (s: SchoolRow) => <span className="font-bold text-neutral-900">{s.name}</span>,
        },
        {
            key: 'slug',
            header: 'Slug',
            render: (s: SchoolRow) => <span className="font-mono text-sm text-neutral-500">/{s.slug}</span>,
        },
        {
            key: 'status',
            header: 'Status',
            render: (s: SchoolRow) => <StatusBadge status={s.status === 'published' ? 'published' : 'draft'} />,
        },
        {
            key: 'updated_at',
            header: 'Updated',
            render: (s: SchoolRow) => new Date(s.updated_at).toLocaleDateString('en-CA'),
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader title="Schools" subtitle="Manage schools" />
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Schools"
                subtitle="Manage academic schools"
                actions={
                    <Link href="/sis/admin/website/schools/new" className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors no-underline">
                        <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> New School
                    </Link>
                }
            />

            <ActionToolbar
                search={<SearchBar value={search} onChange={setSearch} placeholder="Search by name or slug..." />}
                filter={
                    <FilterBar
                        filters={[
                            { key: 'status', label: 'Status', value: statusFilter, onChange: setStatusFilter, options: [
                                { value: '', label: 'All Statuses' },
                                { value: 'published', label: 'Published' },
                                { value: 'draft', label: 'Draft' },
                            ]},
                        ]}
                    />
                }
            />

            <DataTable
                columns={columns}
                data={filtered}
                keyField="id"
                emptyMessage="No schools found"
                rowActions={rowActions}
            />
        </div>
    );
}
