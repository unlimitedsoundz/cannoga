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

interface AnnouncementRow {
    id: string;
    title: string;
    excerpt: string | null;
    priority: string;
    status: string;
    display_order: number;
    updated_at: string;
}

export default function WebsiteAnnouncementsPage() {
    const [search, setSearch] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('');
    const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async (id: string) => {
        setDeleting(true);
        try {
            const response = await fetch(`/api/sis/admin/announcements?id=${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete');
            setAnnouncements(announcements.filter(a => a.id !== id));
            setDeleteId(null);
        } catch (e: any) {
            alert(e.message);
        } finally {
            setDeleting(false);
        }
    };

    const rowActions = (row: AnnouncementRow) => (
        <div className="flex items-center gap-2">
            <Link href={`/sis/admin/website/announcements/${row.id}`} className="text-xs font-bold text-[#9c27b3] hover:underline no-underline">
                Edit
            </Link>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this announcement?')) {
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
        const fetchAnnouncements = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/sis/admin/announcements');
                if (response.ok) {
                    const data = await response.json();
                    setAnnouncements(data.announcements || []);
                }
            } catch (error) {
                console.error('Error fetching announcements:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    const filtered = announcements.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !statusFilter || a.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const columns = [
        {
            key: 'title',
            header: 'Title',
            render: (a: AnnouncementRow) => <span className="font-bold text-neutral-900">{a.title}</span>,
        },
        {
            key: 'priority',
            header: 'Priority',
            render: (a: AnnouncementRow) => (
                <span className={`text-xs font-bold uppercase ${a.priority === 'urgent' ? 'text-red-600' : a.priority === 'high' ? 'text-orange-600' : 'text-neutral-500'}`}>
                    {a.priority}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (a: AnnouncementRow) => <StatusBadge status={a.status} />,
        },
        {
            key: 'display_order',
            header: 'Order',
            render: (a: AnnouncementRow) => <span className="text-xs font-mono text-neutral-500">{a.display_order}</span>,
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader title="Announcements" subtitle="Manage site announcements" />
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Announcements"
                subtitle="Manage site announcements"
                actions={
                    <Link href="/sis/admin/website/announcements/new" className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors no-underline">
                        <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> New Announcement
                    </Link>
                }
            />

            <ActionToolbar
                search={<SearchBar value={search} onChange={setSearch} placeholder="Search by title..." />}
                filter={
                    <FilterBar
                        filters={[
                            { key: 'status', label: 'Status', value: statusFilter, onChange: setStatusFilter, options: [
                                { value: '', label: 'All Statuses' },
                                { value: 'published', label: 'Published' },
                                { value: 'draft', label: 'Draft' },
                            ]},
                            { key: 'priority', label: 'Priority', value: '', onChange: () => {}, options: [
                                { value: 'low', label: 'Low' },
                                { value: 'normal', label: 'Normal' },
                                { value: 'high', label: 'High' },
                                { value: 'urgent', label: 'Urgent' },
                            ]},
                        ]}
                    />
                }
            />

            <DataTable
                columns={columns}
                data={filtered}
                keyField="id"
                emptyMessage="No announcements found"
                rowActions={rowActions}
            />
        </div>
    );
}
