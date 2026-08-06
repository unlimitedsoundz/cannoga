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

export default function EditNewsPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [published, setPublished] = useState(false);
    const [publishDate, setPublishDate] = useState('');

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`/api/sis/admin/news?id=${id}`);
                if (!response.ok) throw new Error('Failed to fetch article');
                const data = await response.json();
                const article = data.news || data;
                setTitle(article.title || '');
                setSlug(article.slug || '');
                setExcerpt(article.excerpt || '');
                setContent(article.content || '');
                setImageUrl(article.imageUrl || '');
                setPublished(article.published || false);
                setPublishDate(article.publishDate ? article.publishDate.slice(0, 10) : '');
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const response = await fetch('/api/sis/admin/news', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    title,
                    slug,
                    excerpt,
                    content,
                    imageUrl,
                    published,
                    publishDate: publishDate || new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update article');
            }

            router.push('/sis/admin/website/news');
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
                title="Edit Article"
                subtitle="Update news article"
                actions={
                    <Link href="/sis/admin/website/news" className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-50 transition-colors no-underline">
                        <HugeiconsIcon icon={ArrowLeft} size={14} strokeWidth={2.5} /> Back to News
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
                    <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Article title" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug *</Label>
                        <Input id="slug" value={slug} onChange={e => setSlug(e.target.value)} required placeholder="article-slug" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="publishDate">Publish Date</Label>
                        <Input id="publishDate" type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <textarea id="excerpt" value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Brief article summary" rows={3} className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <textarea id="content" value={content} onChange={e => setContent(e.target.value)} placeholder="Full article content" rows={8} className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select id="status" value={published ? 'published' : 'draft'} onChange={e => setPublished(e.target.value === 'published')} className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans bg-white">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                    <Button htmlType="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button htmlType="submit" disabled={saving}>
                        <HugeiconsIcon icon={Save} size={14} strokeWidth={2.5} className="mr-2" />
                        {saving ? 'Saving...' : 'Update Article'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
