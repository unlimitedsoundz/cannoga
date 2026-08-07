'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft, Save } from '@hugeicons/core-free-icons';

export default function EditAnnouncementPage() {
    const params = useParams();
    const resolvedParams = React.use(params);
    const id = resolvedParams.id as string;
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState('normal');
    const [status, setStatus] = useState('draft');
    const [displayOrder, setDisplayOrder] = useState('0');
    const [publishStart, setPublishStart] = useState('');
    const [publishEnd, setPublishEnd] = useState('');

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const response = await fetch(`/api/sis/admin/announcements?id=${id}`);
                if (!response.ok) throw new Error('Failed to fetch announcement');
                const data = await response.json();
                const announcement = data.announcement || data;
                setTitle(announcement.title || '');
                setExcerpt(announcement.excerpt || '');
                setContent(announcement.content || '');
                setPriority(announcement.priority || 'normal');
                setStatus(announcement.status || 'draft');
                setDisplayOrder(String(announcement.display_order || 0));
                setPublishStart(announcement.publish_start ? announcement.publish_start.slice(0, 10) : '');
                setPublishEnd(announcement.publish_end ? announcement.publish_end.slice(0, 10) : '');
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncement();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const response = await fetch('/api/sis/admin/announcements', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    title,
                    excerpt,
                    content,
                    priority,
                    status,
                    display_order: parseInt(displayOrder, 10) || 0,
                    publish_start: publishStart || null,
                    publish_end: publishEnd || null,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update announcement');
            }

            router.push('/sis/admin/website/announcements');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div></div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Edit Announcement"
                subtitle="Update site announcement"
                actions={
                    <Link href="/sis/admin/website/announcements" className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-50 transition-colors no-underline">
                        <HugeiconsIcon icon={ArrowLeft} size={14} strokeWidth={2.5} /> Back to Announcements
                    </Link>
                }
            />

            <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-6 space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Announcement title" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <textarea id="excerpt" value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Brief announcement summary" rows={3} className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <textarea id="content" value={content} onChange={e => setContent(e.target.value)} placeholder="Full announcement content" rows={5} className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <select id="priority" value={priority} onChange={e => setPriority(e.target.value)} className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans bg-white">
                            <option value="low">Low</option>
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select id="status" value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans bg-white">
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="displayOrder">Display Order</Label>
                        <Input id="displayOrder" type="number" value={displayOrder} onChange={e => setDisplayOrder(e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="publishStart">Publish Start</Label>
                        <Input id="publishStart" type="date" value={publishStart} onChange={e => setPublishStart(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="publishEnd">Publish End</Label>
                        <Input id="publishEnd" type="date" value={publishEnd} onChange={e => setPublishEnd(e.target.value)} />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                    <Button htmlType="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button htmlType="submit" disabled={saving}>
                        <HugeiconsIcon icon={Save} size={14} strokeWidth={2.5} className="mr-2" />
                        {saving ? 'Saving...' : 'Update Announcement'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
