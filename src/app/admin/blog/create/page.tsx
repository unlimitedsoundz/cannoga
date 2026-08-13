'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { createClient } from '@/utils/supabase/client';
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
        const supabase = createClient();
        const cleanedContent = editorContent
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/—/g, '')
            .replace(/word-break:\s*break-all;?/gi, '')
            .replace(/overflow-wrap:\s*anywhere;?/gi, '')
            .replace(/white-space:\s*pre-wrap;?/gi, '')
            // remove inline styles from all tags except img and figure (to preserve image resizing)
            .replace(/(<(?!img|figure)[^>]*?)style="[^"]*"/gi, '$1')
            .replace(/<p><\/p>/g, '');
        const { error } = await supabase.from('blogs').insert([{
            ...data,
            content: cleanedContent,
            publishDate: new Date(data.publishDate).toISOString(),
        }]);
        if (error) alert('Error creating post');
        else router.push('/admin/blog');
    };

    const uploadImage = async (file: File) => {
        setUploading(true);
        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
            .from('blog-images')
            .upload(fileName, file);

        if (error) {
            alert('Error uploading image');
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
        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `og-${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
            .from('blog-images')
            .upload(fileName, file);

        if (error) {
            alert('Error uploading OG image');
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
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <Link href="/admin/blog" className="text-gray-600 hover:text-black flex items-center gap-2">
                    <ArrowLeft size={20} /> Back to Blog Management
                </Link>
            </div>

            <h1 className="text-2xl font-bold mb-8">Create New Blog Post</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block font-medium mb-2">Title</label>
                    <input {...register('title', { required: true })} className="w-full p-2 border rounded" />
                </div>

                <div>
                    <label className="block font-medium mb-2">Slug</label>
                    <input {...register('slug', { required: true })} className="w-full p-2 border rounded" />
                </div>

                <div>
                    <label className="block font-medium mb-2">Excerpt</label>
                    <textarea {...register('excerpt')} className="w-full p-2 border rounded" rows={3} />
                </div>

                <div>
                    <label className="block font-medium mb-2">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files && uploadImage(e.target.files[0])}
                        className="mb-2"
                    />
                    {uploading && <p>Uploading...</p>}
                    {imageUrl && <img src={imageUrl} alt="Preview" className="w-32 h-32 object-cover object-top" />}
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
                    <input {...register('publishDate', { required: true })} type="datetime-local" className="p-2 border rounded" />
                </div>

                <div>
                    <label className="flex items-center gap-2">
                        <input {...register('published')} type="checkbox" className="border-2 border-neutral-300 rounded-sm checked:bg-[#0a151a] checked:border-[#0a151a] w-4 h-4" />
                        Published
                    </label>
                </div>

                {/* SEO Panel */}
                <div className="border rounded-lg">
                    <button
                        type="button"
                        onClick={() => setSeoPanelOpen(!seoPanelOpen)}
                        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg flex items-center justify-between text-left font-medium"
                    >
                        SEO Settings
                        <svg className={`w-5 h-5 transition-transform ${seoPanelOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {seoPanelOpen && (
                        <div className="p-4 space-y-4 bg-white rounded-b-lg">
                            <div>
                                <label className="block font-medium mb-2">Meta Title</label>
                                <input {...register('meta_title')} className="w-full p-2 border rounded" placeholder="Custom title for SEO (optional)" />
                                <p className="text-sm text-gray-500 mt-1">Leave empty to use the blog post title</p>
                            </div>

                            <div>
                                <label className="block font-medium mb-2">Meta Description</label>
                                <textarea {...register('meta_description')} className="w-full p-2 border rounded" rows={3} placeholder="Custom description for SEO (optional)" />
                                <p className="text-sm text-gray-500 mt-1">Leave empty to use the blog post excerpt</p>
                            </div>

                            <div>
                                <label className="block font-medium mb-2">Open Graph Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => e.target.files && uploadOgImage(e.target.files[0])}
                                    className="mb-2"
                                />
                                {uploading && <p>Uploading...</p>}
                                {ogImageUrl && <img src={ogImageUrl} alt="OG Preview" className="w-32 h-32 object-cover object-top" />}
                                <input {...register('og_image')} type="hidden" />
                                <p className="text-sm text-gray-500 mt-1">Recommended size: 1200x630px. Leave empty to use the blog post image</p>
                            </div>
                        </div>
                    )}
                </div>

                <button type="submit" className="bg-[#0a151a] text-white px-6 py-2 rounded">Create Post</button>
            </form>
        </div>
    );
}


