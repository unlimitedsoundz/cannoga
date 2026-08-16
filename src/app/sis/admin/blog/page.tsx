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
import { Add01Icon as Plus } from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { createBlogClient } from '@/utils/supabase/blogClient';
import { formatToDDMMYYYY } from '@/utils/date';

interface BlogRow {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    published: boolean;
    publishDate: string;
    imageUrl?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export default function SISAdminBlogPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [posts, setPosts] = useState<BlogRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const supabase = createBlogClient();
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .order('publishDate', { ascending: false });

            if (error) {
                console.error('Error fetching blog posts from DB:', error);
            } else {
                setPosts(data || []);
            }
        } catch (error) {
            console.error('Error fetching blog posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog post from the database?')) return;
        setDeleting(true);
        try {
            const supabase = createBlogClient();
            const { error } = await supabase.from('blogs').delete().eq('id', id);
            if (error) {
                alert('Error deleting post: ' + error.message);
            } else {
                setPosts(posts.filter((p) => p.id !== id));
            }
        } catch (e: any) {
            alert(e.message);
        } finally {
            setDeleting(false);
        }
    };

    const filtered = posts.filter((post) => {
        const matchesSearch =
            post.title.toLowerCase().includes(search.toLowerCase()) ||
            (post.slug && post.slug.toLowerCase().includes(search.toLowerCase())) ||
            (post.excerpt && post.excerpt.toLowerCase().includes(search.toLowerCase()));
        const matchesStatus =
            !statusFilter ||
            (statusFilter === 'published' && post.published) ||
            (statusFilter === 'draft' && !post.published);
        return matchesSearch && matchesStatus;
    });

    const columns = [
        {
            key: 'title',
            header: 'Title',
            render: (row: BlogRow) => (
                <div>
                    <span className="font-bold text-neutral-900 block">{row.title}</span>
                    <span className="text-xs text-neutral-400 font-mono">/{row.slug}</span>
                </div>
            ),
        },
        {
            key: 'published',
            header: 'Status',
            render: (row: BlogRow) => (
                <StatusBadge status={row.published ? 'published' : 'draft'} />
            ),
        },
        {
            key: 'publishDate',
            header: 'Publish Date',
            render: (row: BlogRow) => (
                <span className="text-xs text-neutral-600 font-medium">
                    {row.publishDate ? formatToDDMMYYYY(row.publishDate) : '—'}
                </span>
            ),
        },
    ];

    const rowActions = (row: BlogRow) => (
        <div className="flex items-center gap-3">
            <Link
                href={`/sis/admin/blog/edit?id=${row.id}`}
                className="text-xs font-bold text-[#0a151a] hover:underline no-underline"
            >
                Edit
            </Link>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(row.id);
                }}
                disabled={deleting}
                className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors"
            >
                Delete
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Blog Posts"
                subtitle="Manage and publish student stories and news articles in the database"
                actions={
                    <Link
                        href="/sis/admin/blog/create"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#0a151a] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors no-underline"
                    >
                        <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> New Blog Post
                    </Link>
                }
            />

            <ActionToolbar
                search={
                    <SearchBar
                        placeholder="Search by title, slug, or excerpt..."
                        value={search}
                        onChange={setSearch}
                    />
                }
                filter={
                    <FilterBar
                        filters={[
                            {
                                key: 'status',
                                label: 'Status',
                                placeholder: 'All Statuses',
                                value: statusFilter,
                                onChange: setStatusFilter,
                                options: [
                                    { label: 'Published', value: 'published' },
                                    { label: 'Draft', value: 'draft' },
                                ],
                            },
                        ]}
                    />
                }
            />

            <DataTable<BlogRow>
                keyField="id"
                columns={columns}
                data={filtered}
                emptyMessage="No blog posts found in the database."
                rowActions={rowActions}
                onRowClick={(row: BlogRow) => {
                    window.location.href = `/sis/admin/blog/edit?id=${row.id}`;
                }}
            />
        </div>
    );
}
