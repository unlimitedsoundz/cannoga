'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import Link from 'next/link';
import dynamicImport from 'next/dynamic';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon as ArrowLeft, FloppyDiskIcon as Save } from '@hugeicons/core-free-icons';
import { UploadSimple, Trash, WarningCircle, CheckCircle, Image as ImageIcon } from '@phosphor-icons/react';
import { normalizeImageUrl } from '@/utils/imageUrl';
import '@/styles/ckeditor-content.css';

const RichTextEditor = dynamicImport(() => import('@/components/RichTextEditor'), {
    ssr: false,
    loading: () => (
        <div className="h-64 w-full bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-400 font-sans text-sm animate-pulse">
            Loading Editor...
        </div>
    )
});

export default function NewWebsiteEventPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [category, setCategory] = useState('General');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [published, setPublished] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Failed to upload image file');
            const data = await res.json();
            if (data.url) {
                setImageUrl(data.url);
                setImageError(false);
            }
        } catch (err: any) {
            setError(err.message || 'Image upload failed');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/sis/admin/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
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
                throw new Error(data.error || 'Failed to create event');
            }

            router.push('/sis/admin/website/events/');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="New Event"
                subtitle="Create a new campus event or webinar"
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

            <form onSubmit={handleSubmit} className="sis-dark-card bg-[#0f2027] p-6 rounded-2xl border border-white/10 space-y-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-slate-300">Event Title *</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (!slug) {
                                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                                }
                            }}
                            placeholder="e.g. Advanced Diploma Programme Virtual Open Day"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug" className="text-xs font-bold uppercase tracking-wider text-slate-300">URL Slug *</Label>
                        <Input
                            id="slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="e.g. virtual-open-day-2026"
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
                            placeholder="e.g. Online (Zoom) or Ottawa Campus, Hall A"
                        />
                    </div>

                    <div className="md:col-span-2 space-y-3 bg-[#0a151a]/80 p-4 rounded-xl border border-white/10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <Label htmlFor="imageUrl" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                Event Cover Image
                            </Label>
                            <span className="text-[11px] text-slate-400">
                                Upload an image file or paste an image URL (Imgur, Google Drive, direct link)
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <label className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-md cursor-pointer transition-colors shrink-0">
                                <UploadSimple size={16} weight="bold" />
                                <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={uploadingImage}
                                    className="hidden"
                                />
                            </label>

                            <Input
                                id="imageUrl"
                                type="url"
                                value={imageUrl}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setImageUrl(normalizeImageUrl(val, val));
                                    setImageError(false);
                                }}
                                placeholder="Or paste direct image URL (https://...)"
                                className="flex-1"
                            />
                        </div>

                        {/* Image Preview & Status */}
                        {imageUrl && (
                            <div className="mt-3 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="relative w-36 h-24 rounded-lg overflow-hidden bg-black/40 border border-white/20 shrink-0">
                                    <img
                                        src={normalizeImageUrl(imageUrl)}
                                        alt="Cover preview"
                                        className="w-full h-full object-cover"
                                        onError={() => setImageError(true)}
                                        onLoad={() => setImageError(false)}
                                    />
                                </div>
                                <div className="flex-1 space-y-1">
                                    {imageError ? (
                                        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                                            <WarningCircle size={15} weight="bold" />
                                            <span>Could not preview image. Make sure this links directly to an image (.jpg, .png) or upload a file.</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                                            <CheckCircle size={15} weight="bold" />
                                            <span>Image loaded successfully</span>
                                        </div>
                                    )}
                                    <p className="text-[11px] text-slate-400 break-all line-clamp-1">{imageUrl}</p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageUrl('');
                                            setImageError(false);
                                        }}
                                        className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-semibold pt-1"
                                    >
                                        <Trash size={14} /> Remove Image
                                    </button>
                                </div>
                            </div>
                        )}
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
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Publish Immediately</span>
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
                    >
                        <HugeiconsIcon icon={Save} size={14} strokeWidth={2.5} /> {loading ? 'Saving...' : 'Create Event'}
                    </button>
                </div>
            </form>
        </div>
    );
}
