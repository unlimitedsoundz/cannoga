'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import Link from 'next/link';
import dynamicImport from 'next/dynamic';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon as ArrowLeft, FloppyDiskIcon as Save } from '@hugeicons/core-free-icons';
import '@/styles/ckeditor-content.css';

const RichTextEditor = dynamicImport(() => import('@/components/RichTextEditor'), {
    ssr: false,
    loading: () => (
        <div className="h-64 w-full bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-400 font-sans text-sm animate-pulse">
            Loading Editor...
        </div>
    )
});

export default function EditWebsiteEventPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [category, setCategory] = useState('General');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [published, setPublished] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`/api/sis/admin/events?id=${id}`);
                if (!response.ok) throw new Error('Failed to fetch event');
                const data = await response.json();
                const ev = data.event || data;
                setTitle(ev.title || '');
                setSlug(ev.slug || '');
                setCategory(ev.category || 'General');
                setDate(ev.date ? new Date(ev.date).toISOString().slice(0, 16) : '');
                setLocation(ev.location || '');
                setContent(ev.content || '');
                setImageUrl(ev.imageUrl || '');
                setPublished(ev.published ?? true);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const response = await fetch('/api/sis/admin/events', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    title,
                    slug,
                    category,
                    date,
                    location,
                    content,
                    imageUrl,
                    published,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update event');
            }

            router.push('/sis/admin/website/events/');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader title="Edit Event" subtitle="Loading event details..." />
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Edit Event"
                subtitle="Update event details, schedule, or content"
                actions={
                    <Link
                        href="/sis/admin/website/events/"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-white/10 transition-colors no-underline"
                    >
                        <HugeiconsIcon icon={ArrowLeft} size={14} strokeWidth={2.5} /> Back to Events
                    </Link>
                }
            />

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-[#0f2027] p-6 rounded-2xl border border-white/10 space-y-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-slate-300">Event Title *</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug" className="text-xs font-bold uppercase tracking-wider text-slate-300">URL Slug *</Label>
                        <Input
                            id="slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-slate-300">Category *</Label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full h-10 px-3 rounded-md border border-white/20 bg-[#0a151a] text-white text-sm outline-none"
                        >
                            <option value="General">General</option>
                            <option value="Admissions">Admissions</option>
                            <option value="Webinar">Webinar</option>
                            <option value="Conference">Conference</option>
                            <option value="Workshop">Workshop</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date" className="text-xs font-bold uppercase tracking-wider text-slate-300">Date & Time *</Label>
                        <Input
                            id="date"
                            type="datetime-local"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location" className="text-xs font-bold uppercase tracking-wider text-slate-300">Location</Label>
                        <Input
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="imageUrl" className="text-xs font-bold uppercase tracking-wider text-slate-300">Cover Image URL</Label>
                        <Input
                            id="imageUrl"
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-300">Event Description (Rich Text & Images)</Label>
                        <RichTextEditor
                            value={content}
                            onChange={setContent}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={published}
                            onChange={(e) => setPublished(e.target.checked)}
                            className="rounded border-white/20 accent-sky-400 outline-none"
                        />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Published</span>
                    </label>

                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
                    >
                        <HugeiconsIcon icon={Save} size={14} strokeWidth={2.5} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
