'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft, Save } from '@hugeicons/core-free-icons';

export default function NewAnnouncementPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [priority, setPriority] = useState('normal');
    const [status, setStatus] = useState('published');
    const [displayOrder, setDisplayOrder] = useState('0');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/sis/admin/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    excerpt,
                    priority,
                    status,
                    display_order: parseInt(displayOrder, 10) || 0,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create announcement');
            }

            router.push('/sis/admin/website/announcements');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="New Announcement"
                subtitle="Create a new site announcement"
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={priority} onChange={e => setPriority(e.target.value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={status} onChange={e => setStatus(e.target.value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="displayOrder">Display Order</Label>
                        <Input id="displayOrder" type="number" value={displayOrder} onChange={e => setDisplayOrder(e.target.value)} />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                    <Button htmlType="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button htmlType="submit" disabled={loading}>
                        <HugeiconsIcon icon={Save} size={14} strokeWidth={2.5} className="mr-2" />
                        {loading ? 'Saving...' : 'Create Announcement'}
                    </Button>
                </div>
            </form>
        </div>
    );
}