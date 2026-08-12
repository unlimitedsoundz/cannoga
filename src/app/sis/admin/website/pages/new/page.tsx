'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft, Save } from '@hugeicons/core-free-icons';

export default function NewPagePage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [status, setStatus] = useState('draft');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/sis/admin/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    slug,
                    status,
                    meta_title: metaTitle,
                    meta_description: metaDescription,
                    content: {},
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create page');
            }

            router.push('/sis/admin/website/pages');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="New Page"
                subtitle="Create a new website page"
                actions={
                    <Link href="/sis/admin/website/pages" className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-50 transition-colors no-underline">
                        <HugeiconsIcon icon={ArrowLeft} size={14} strokeWidth={2.5} /> Back to Pages
                    </Link>
                }
            />

            <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-6 space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Page title" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug *</Label>
                        <Input id="slug" value={slug} onChange={e => setSlug(e.target.value)} required placeholder="page-slug" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={status} onChange={e => setStatus(e.target.value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="metaTitle">SEO Title</Label>
                    <Input id="metaTitle" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="SEO title (optional)" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea id="metaDescription" value={metaDescription} onChange={e => setMetaDescription(e.target.value)} placeholder="SEO description (optional)" rows={3} />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button htmlType="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button htmlType="submit" disabled={loading}>
                        <HugeiconsIcon icon={Save} size={14} strokeWidth={2.5} className="mr-2" />
                        {loading ? 'Saving...' : 'Create Page'}
                    </Button>
                </div>
            </form>
        </div>
    );
}