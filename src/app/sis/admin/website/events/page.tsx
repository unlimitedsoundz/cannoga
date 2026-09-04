'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon as Plus, Calendar01Icon as Calendar } from '@hugeicons/core-free-icons';
import Link from 'next/link';

interface EventRow {
    id: string;
    title: string;
    slug: string;
    category: string;
    date: string;
    location: string;
    published: boolean;
    imageUrl?: string;
    updatedAt?: string;
}

export default function WebsiteEventsPage() {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [events, setEvents] = useState<EventRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/sis/admin/events');
            if (res.ok) {
                const data = await res.json();
                setEvents(data.events || []);
            }
        } catch (err) {
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/sis/admin/events?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete event');
            setEvents(events.filter(e => e.id !== id));
        } catch (e: any) {
            alert(e.message);
        } finally {
            setDeletingId(null);
        }
    };

    const categories = Array.from(new Set(events.map(e => e.category).filter(Boolean)));

    const filtered = events.filter(e => {
        const matchesSearch = (e.title || '').toLowerCase().includes(search.toLowerCase()) ||
            (e.location || '').toLowerCase().includes(search.toLowerCase()) ||
            (e.slug || '').toLowerCase().includes(search.toLowerCase());
        const matchesCat = !categoryFilter || e.category === categoryFilter;
        return matchesSearch && matchesCat;
    });

    const columns = [
        {
            key: 'title',
            header: 'Event',
            render: (e: EventRow) => (
                <div>
                    <span className="font-bold text-neutral-900 block">{e.title}</span>
                    <span className="font-mono text-xs text-neutral-500">/{e.slug}</span>
                </div>
            ),
        },
        {
            key: 'category',
            header: 'Category',
            render: (e: EventRow) => (
                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded text-xs font-bold uppercase tracking-wider">
                    {e.category || 'General'}
                </span>
            ),
        },
        {
            key: 'date',
            header: 'Date & Time',
            render: (e: EventRow) => {
                const d = new Date(e.date);
                return (
                    <div className="text-xs">
                        <span className="font-medium text-neutral-900 block">{d.toLocaleDateString('en-CA')}</span>
                        <span className="text-neutral-500">{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                );
            },
        },
        {
            key: 'location',
            header: 'Location',
            render: (e: EventRow) => (
                <span className="text-xs text-neutral-700">{e.location || 'Ottawa Campus'}</span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (e: EventRow) => <StatusBadge status={e.published ? 'published' : 'draft'} />,
        },
    ];

    const rowActions = (row: EventRow) => (
        <div className="flex items-center gap-3">
            <Link
                href={`/sis/admin/website/events/${row.id}/`}
                className="text-xs font-bold text-neutral-900 hover:underline no-underline"
            >
                Edit
            </Link>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(row.id);
                }}
                disabled={deletingId === row.id}
                className="text-xs font-bold text-red-600 hover:text-red-800 disabled:opacity-50"
            >
                {deletingId === row.id ? 'Deleting...' : 'Delete'}
            </button>
        </div>
    );

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader title="Events" subtitle="Manage campus events, webinars, and open days" />
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Events"
                subtitle="Manage campus events, webinars, and open days"
                actions={
                    <Link
                        href="/sis/admin/website/events/new/"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors no-underline"
                    >
                        <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> New Event
                    </Link>
                }
            />

            <ActionToolbar
                search={<SearchBar value={search} onChange={setSearch} placeholder="Search events by title, slug, location..." />}
                filter={
                    categories.length > 0 ? (
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="text-xs font-bold bg-white border border-neutral-200 rounded-md px-3 py-2 outline-none"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    ) : undefined
                }
            />

            <DataTable
                columns={columns}
                data={filtered}
                keyField="id"
                rowActions={rowActions}
                emptyMessage="No events found"
            />
        </div>
    );
}
