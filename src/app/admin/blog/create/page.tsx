'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { createBlogClient } from '@/utils/supabase/blogClient';
import { Link } from "@aalto-dx/react-components";
import { ArrowLeft } from "@phosphor-icons/react";
import '@/styles/ckeditor-content.css';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

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

export default function CreateBlogPost() {
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [editorContent, setEditorContent] = useState('');
    const [ogImageUrl, setOgImageUrl] = useState('');
    const [seoPanelOpen, setSeoPanelOpen] = useState(false);
    const router = useRouter();
    const { register, handleSubmit, setValue, watch } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        try {
            if (!data.title?.trim()) {
                alert('Title is required');
                return;
            }
            if (!data.slug?.trim()) {
                alert('Slug is required');
                return;
            }

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

            const { error } = await supabase.from('blogs').insert([{
                ...data,
                content: cleanedContent,
                publishDate: publishDate.toISOString(),
            }]);

            if (error) {
                console.error('Error creating post:', error);
                alert('Error creating post: ' + error.message);
            } else {
                router.push('/admin/blog/');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            alert('An unexpected error occurred while creating the post');
        }
    };

    const uploadImage = async (file: File) => {
        setUploading(true);
        const supabase = createBlogClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
            .from('blog-images')
            .upload(fileName, file);

        if (error) {
            alert('Error uploading image: ' + error.message);
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('blog-images')
                .getPublicUrl(fileName);
            setImageUrl(publicUrl);
            setValue('imageUrl', publicUrl);
        }
        setUploading(false);
    };

    const uploadOgImage = async (file: File) => {
        setUploading(true);
        const supabase = createBlogClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `og-${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
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
        setUploading(false);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl font-sans">
            <div className="mb-8">
                <Link href="/admin/blog/" className="text-neutral-600 hover:text-black flex items-center gap-2 font-semibold">
                    <ArrowLeft size={20} /> Back to Blog Management
                </Link>
            </div>

            <h1 className="text-2xl font-bold mb-8 text-[#0a151a]">Create New Blog Post</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block font-medium mb-2">Title</label>
                    <input {...register('title', { required: true })} className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a151a]" placeholder="Post Title" />
                </div>

                <div>
                    <label className="block font-medium mb-2">Slug</label>
                    <input {...register('slug', { required: true })} className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a151a]" placeholder="post-url-slug" />
                </div>

                <div>
                    <label className="block font-medium mb-2">Excerpt</label>
                    <textarea {...register('excerpt')} className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a151a]" rows={3} placeholder="Short summary of the blog post" />
                </div>

                <div>
                    <label className="block font-medium mb-2">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files && uploadImage(e.target.files[0])}
                        className="mb-2"
                    />
                    {uploading && <p className="text-sm text-neutral-500">Uploading...</p>}
                    {imageUrl && <img src={imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-xl mt-2" />}
                    <input {...register('imageUrl')} type="hidden" />
                </div>

                <div>
                    <label className="block font-medium mb-2">Content</label>
                    <RichTextEditor
                        value={editorContent}
                        onChange={(data) => {
                            setEditorContent(data);
                            setValue('content', data);
                        }}
                    />
                </div>

                <div>
                    <label className="block font-medium mb-2">Publish Date</label>
                    <input {...register('publishDate', { required: true })} type="datetime-local" className="p-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a151a]" />
                </div>

                <div>
                    <label className="flex items-center gap-2 font-medium">
                        <input {...register('published')} type="checkbox" className="w-4 h-4 rounded text-[#0a151a] focus:ring-[#0a151a]" />
                        Published
                    </label>
                </div>

                {/* SEO Panel */}
                <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setSeoPanelOpen(!seoPanelOpen)}
                        className="w-full px-5 py-4 bg-neutral-50 hover:bg-neutral-100 flex items-center justify-between text-left font-bold text-sm"
                    >
                        SEO Settings
                        <svg className={`w-5 h-5 transition-transform ${seoPanelOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {seoPanelOpen && (
                        <div className="p-5 space-y-4 bg-white border-t border-neutral-200">
                            <div>
                                <label className="block font-medium mb-2">Meta Title</label>
                                <input {...register('meta_title')} className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none" placeholder="Custom title for SEO (optional)" />
                            </div>

                            <div>
                                <label className="block font-medium mb-2">Meta Description</label>
                                <textarea {...register('meta_description')} className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none" rows={3} placeholder="Custom description for SEO (optional)" />
                            </div>

                            <div>
                                <label className="block font-medium mb-2">Open Graph Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => e.target.files && uploadOgImage(e.target.files[0])}
                                    className="mb-2"
                                />
                                {uploading && <p className="text-sm text-neutral-500">Uploading...</p>}
                                {ogImageUrl && <img src={ogImageUrl} alt="OG Preview" className="w-32 h-32 object-cover rounded-xl mt-2" />}
                                <input {...register('og_image')} type="hidden" />
                            </div>
                        </div>
                    )}
                </div>

                <button type="submit" className="bg-[#0a151a] hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-xl transition-colors">
                    Create Post
                </button>
            </form>
        </div>
    );
}
