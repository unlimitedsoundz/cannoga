'use client';

import { createClient } from '@/utils/supabase/client';
import { uploadToHosting } from '@/utils/hostingUpload';
import { FloppyDisk as Save, Image as ImageIcon, Calendar, FileText, Globe } from "@phosphor-icons/react/dist/ssr";
import Image from 'next/image';
import { useState } from 'react';

interface NewsFormProps {
    id: string;
    isNew: boolean;
    newsItem: any;
}

export default function NewsForm({ id, isNew, newsItem }: NewsFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(newsItem?.imageUrl || null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const supabase = createClient();

        try {
            const title = formData.get('title') as string;
            const content = formData.get('content') as string;
            const slug = formData.get('slug') as string;
            const publishDate = formData.get('publishDate') as string;

            // Generate excerpt (first 160 chars)
            const excerpt = content
                ? content.replace(/[#*`]/g, '').slice(0, 160).trim() + '...'
                : '';

            const newsData: any = {
                title,
                slug,
                content,
                excerpt,
                publishDate,
                published: true
            };

            // Handle Image Upload (Hostinger PHP)
            const imageFile = formData.get('image') as File;
            if (imageFile && imageFile.size > 0) {
                const imageUrl = await uploadToHosting(imageFile);
                if (imageUrl) {
                    newsData.imageUrl = imageUrl;
                }
            }

            if (isNew) {
                const response = await fetch('/api/sis/admin/news', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newsData),
                });
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to save news article');
                }
            } else {
                const response = await fetch('/api/sis/admin/news', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, ...newsData }),
                });
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to update news article');
                }
            }

            // Success! Redirect
            window.location.href = '/admin/news';

        } catch (error: any) {
            console.error('Error submitting form:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
                error
            });
            alert(`Failed to save: ${error.message || 'Unknown error'}`);
            setIsSubmitting(false);
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden">
            <div className="p-8 space-y-6">
                {/* Image Upload Selection */}
                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-neutral-600 flex items-center gap-1">
                        <ImageIcon size={14} weight="bold" /> Featured Image
                    </label>
                    <div className="flex items-start gap-4">
                        {previewImage && (
                            <div className="w-32 h-20 bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 flex-shrink-0 relative">
                                <Image
                                    src={previewImage}
                                    alt="Preview"
                                    fill
                                    className="object-cover object-top"
                                    unoptimized
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="relative group">
                                <input
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-neutral-100 file:text-black hover:file:bg-neutral-200 cursor-pointer border border-neutral-200 rounded-lg p-1"
                                />
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-2 italic">Recommended size: 1200x630px. Max 5MB.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-neutral-600">Headline</label>
                        <input
                            name="title"
                            defaultValue={newsItem?.title || ''}
                            required
                            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black outline-none text-xl font-bold"
                            placeholder="Enter article headline..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-neutral-600 flex items-center gap-2"><Globe size={14} weight="bold" /> URL Slug</label>
                            <input
                                name="slug"
                                defaultValue={newsItem?.slug || ''}
                                required
                                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none"
                                placeholder="my-article-title"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-neutral-600 flex items-center gap-2"><Calendar size={14} weight="bold" /> Publish Date</label>
                            <input
                                name="publishDate"
                                type="date"
                                defaultValue={newsItem?.publishDate ? new Date(newsItem.publishDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-neutral-600 flex items-center gap-2"><FileText size={14} weight="bold" /> Content (Markdown supported)</label>
                        <textarea
                            name="content"
                            defaultValue={newsItem?.content || ''}
                            rows={15}
                            required
                            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl outline-none resize-none font-mono text-sm leading-relaxed"
                            placeholder="# Heading\n\nWrite your content here..."
                        />
                    </div>
                </div>
            </div>

            <div className="bg-neutral-50 p-6 border-t border-neutral-200 flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#0a151a] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-neutral-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save size={18} weight="bold" /> {isSubmitting ? 'Saving...' : (isNew ? 'Publish Article' : 'Save Changes')}
                </button>
            </div>
        </form>
    );
}


