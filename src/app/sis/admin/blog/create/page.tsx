'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import dynamicImport from 'next/dynamic';
import { createBlogClient } from '@/utils/supabase/blogClient';
import { PageHeader } from '@/components/sis/PageHeader';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon as ArrowLeft, FloppyDiskIcon as Save } from '@hugeicons/core-free-icons';
import Link from 'next/link';
import '@/styles/ckeditor-content.css';

const RichTextEditor = dynamicImport(() => import('@/components/RichTextEditor'), { ssr: false });

interface FormData {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    imageUrl: string;
    publishDate: string;
    published: boolean;
    meta_title?: string;
    meta_description?: string;
    og_image?: string;
}

export default function SISAdminCreateBlogPostPage() {
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const router = useRouter();
    const { register, handleSubmit, setValue, watch } = useForm<FormData>({
        defaultValues: {
            publishDate: new Date().toISOString().slice(0, 16),
            published: true,
        },
    });

    const [editorContent, setEditorContent] = useState('');
    const [ogImageUrl, setOgImageUrl] = useState('');
    const [seoPanelOpen, setSeoPanelOpen] = useState(false);

    const onSubmit = async (data: FormData) => {
        setSaving(true);
        try {
            if (!data.title?.trim()) {
                alert('Title is required');
                setSaving(false);
                return;
            }

            const autoSlug = data.slug?.trim()
                ? data.slug.trim()
                : data.title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)+/g, '');

            const supabase = createBlogClient();
            const cleanedContent = editorContent
                .replace(/&nbsp;/g, ' ')
                .replace(/\s+/g, ' ')
                .replace(/—/g, '')
                .replace(/word-break:\s*break-all;?/gi, '')
                .replace(/overflow-wrap:\s*anywhere;?/gi, '')
                .replace(/white-space:\s*pre-wrap;?/gi, '')
                .replace(/(<(?!img|figure)[^>]*?)style="[^"]*"/gi, '$1')
                .replace(/<p><\/p>/g, '');

            const publishDate = data.publishDate ? new Date(data.publishDate) : new Date();

            const newPost = {
                title: data.title.trim(),
                slug: autoSlug,
                excerpt: data.excerpt?.trim() || null,
                content: cleanedContent,
                imageUrl: data.imageUrl || null,
                publishDate: publishDate.toISOString(),
                published: Boolean(data.published),
                meta_title: data.meta_title || null,
                meta_description: data.meta_description || null,
                og_image: data.og_image || ogImageUrl || null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const { error } = await supabase.from('blogs').insert([newPost]);

            if (error) {
                console.error('Error inserting post in DB:', error);
                alert(`Error saving blog post: ${error.message}`);
            } else {
                router.push('/sis/admin/blog/');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            alert('An unexpected error occurred while creating the post');
        } finally {
            setSaving(false);
        }
    };

    const uploadImage = async (file: File) => {
        setUploading(true);
        try {
            const supabase = createBlogClient();
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const { error } = await supabase.storage
                .from('blog-images')
                .upload(fileName, file);

            if (error) {
                alert('Error uploading image: ' + error.message);
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from('blog-images')
                    .getPublicUrl(fileName);
                setValue('imageUrl', publicUrl);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const uploadOgImage = async (file: File) => {
        setUploading(true);
        try {
            const supabase = createBlogClient();
            const fileExt = file.name.split('.').pop();
            const fileName = `og-${Date.now()}.${fileExt}`;
            const { error } = await supabase.storage
                .from('blog-images')
                .upload(fileName, file);

            if (error) {
                alert('Error uploading OG image: ' + error.message);
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from('blog-images')
                    .getPublicUrl(fileName);
                setOgImageUrl(publicUrl);
                setValue('og_image', publicUrl);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl">
            <PageHeader
                title="Create Blog Post"
                subtitle="Add a new student story or article to the database"
                actions={
                    <Link
                        href="/sis/admin/blog/"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 text-neutral-300 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-white/10 transition-colors no-underline"
                    >
                        <HugeiconsIcon icon={ArrowLeft} size={14} strokeWidth={2.5} /> Back to Blog
                    </Link>
                }
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-neutral-900 border border-white/10 p-6 rounded-xl">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                        Post Title *
                    </label>
                    <input
                        {...register('title', { required: true })}
                        className="w-full p-3 bg-neutral-800 border border-white/10 text-white rounded-lg focus:outline-none focus:border-white text-sm"
                        placeholder="Enter blog post title"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                        URL Slug (Leave blank to auto-generate from title)
                    </label>
                    <input
                        {...register('slug')}
                        className="w-full p-3 bg-neutral-800 border border-white/10 text-white rounded-lg focus:outline-none focus:border-white text-sm font-mono"
                        placeholder="e.g. my-first-term-at-cannoga-college"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                        Short Excerpt
                    </label>
                    <textarea
                        {...register('excerpt')}
                        className="w-full p-3 bg-neutral-800 border border-white/10 text-white rounded-lg focus:outline-none focus:border-white text-sm"
                        rows={3}
                        placeholder="Short preview summary of the post..."
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                        Featured Image
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files && uploadImage(e.target.files[0])}
                            className="text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer"
                        />
                        {uploading && <span className="text-xs text-neutral-400 animate-pulse">Uploading image...</span>}
                    </div>
                    {watch('imageUrl') && (
                        <div className="mt-3 relative w-40 h-28 rounded-lg overflow-hidden border border-white/10">
                            <img src={watch('imageUrl')} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <input {...register('imageUrl')} type="hidden" />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                        Post Content (Rich Text)
                    </label>
                    <div className="bg-white text-neutral-900 rounded-lg overflow-hidden">
                        <RichTextEditor
                            value={editorContent}
                            onChange={(data) => {
                                setEditorContent(data);
                                setValue('content', data);
                            }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                            Publish Date
                        </label>
                        <input
                            {...register('publishDate', { required: true })}
                            type="datetime-local"
                            className="p-3 bg-neutral-800 border border-white/10 text-white rounded-lg focus:outline-none text-sm w-full"
                        />
                    </div>

                    <div className="pt-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                {...register('published')}
                                type="checkbox"
                                className="w-5 h-5 rounded text-[#0a151a] bg-neutral-800 border-white/20 focus:ring-0"
                            />
                            <span className="text-sm font-bold text-white uppercase tracking-wider">
                                Published (Visible to Public)
                            </span>
                        </label>
                    </div>
                </div>

                {/* SEO Panel */}
                <div className="border border-white/10 rounded-xl overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setSeoPanelOpen(!seoPanelOpen)}
                        className="w-full px-5 py-4 bg-neutral-800 hover:bg-neutral-750 flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-white"
                    >
                        <span>SEO & Social Sharing Metadata</span>
                        <span className="text-neutral-400">{seoPanelOpen ? '▲ Hide' : '▼ Expand'}</span>
                    </button>

                    {seoPanelOpen && (
                        <div className="p-5 space-y-4 bg-neutral-850 border-t border-white/10">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                                    Meta Title
                                </label>
                                <input
                                    {...register('meta_title')}
                                    className="w-full p-3 bg-neutral-800 border border-white/10 text-white rounded-lg focus:outline-none text-sm"
                                    placeholder="Custom title for search engines (optional)"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                                    Meta Description
                                </label>
                                <textarea
                                    {...register('meta_description')}
                                    className="w-full p-3 bg-neutral-800 border border-white/10 text-white rounded-lg focus:outline-none text-sm"
                                    rows={3}
                                    placeholder="Custom description for search engines (optional)"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                                    Open Graph Image (Social Preview)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => e.target.files && uploadOgImage(e.target.files[0])}
                                    className="text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-white cursor-pointer"
                                />
                                {ogImageUrl && (
                                    <div className="mt-3 relative w-40 h-28 rounded-lg overflow-hidden border border-white/10">
                                        <img src={ogImageUrl} alt="OG Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <input {...register('og_image')} type="hidden" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-neutral-200 transition-colors disabled:opacity-50"
                    >
                        <HugeiconsIcon icon={Save} size={16} strokeWidth={2.5} />
                        {saving ? 'Creating post...' : 'Publish Blog Post'}
                    </button>
                    <Link
                        href="/sis/admin/blog/"
                        className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white no-underline transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
