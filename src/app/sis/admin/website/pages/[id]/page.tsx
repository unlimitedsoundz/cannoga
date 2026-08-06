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

export default function EditPagePage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [canonicalUrl, setCanonicalUrl] = useState('');
    const [ogImageUrl, setOgImageUrl] = useState('');
    const [status, setStatus] = useState('draft');
    const [content, setContent] = useState('');

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const response = await fetch(`/api/sis/admin/pages?id=${id}`);
                if (!response.ok) throw new Error('Failed to fetch page');
                const data = await response.json();
                const page = data.page || data;
                setTitle(page.title || '');
                setSlug(page.slug || '');
                setMetaTitle(page.meta_title || '');
                setMetaDescription(page.meta_description || '');
                setCanonicalUrl(page.canonical_url || '');
                setOgImageUrl(page.og_image_url || '');
                setStatus(page.status || 'draft');
                setContent(page.content || '');
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const response = await fetch('/api/sis/admin/pages', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    title,
                    slug,
                    meta_title: metaTitle,
                    meta_description: metaDescription,
                    canonical_url: canonicalUrl,
                    og_image_url: ogImageUrl,
                    status,
                    content,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update page');
            }

            router.push('/sis/admin/website/pages');
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
                title="Edit Page"
                subtitle="Update CMS page"
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

                <div className="space-y-2">
                    <Label htmlFor="title">Page Title *</Label>
                    <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Page title" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input id="slug" value={slug} onChange={e => setSlug(e.target.value)} required placeholder="page-slug" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input id="metaTitle" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="SEO title" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <textarea id="metaDescription" value={metaDescription} onChange={e => setMetaDescription(e.target.value)} placeholder="SEO description" rows={2} className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="canonicalUrl">Canonical URL</Label>
                        <Input id="canonicalUrl" value={canonicalUrl} onChange={e => setCanonicalUrl(e.target.value)} placeholder="https://example.com/page" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ogImageUrl">OG Image URL</Label>
                        <Input id="ogImageUrl" value={ogImageUrl} onChange={e => setOgImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
                    </div>
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
                    <Label htmlFor="content">Page Content (JSON)</Label>
                    <textarea id="content" value={content} onChange={e => setContent(e.target.value)} placeholder='{"sections": []}' rows={8} className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-mono" />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                    <Button htmlType="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button htmlType="submit" disabled={saving}>
                        <HugeiconsIcon icon={Save} size={14} strokeWidth={2.5} className="mr-2" />
                        {saving ? 'Saving...' : 'Update Page'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
