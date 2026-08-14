'use client';

import { useState, useEffect } from 'react';
import { Link } from "@aalto-dx/react-components";
import { createBlogClient } from '@/utils/supabase/blogClient';
import { formatToDDMMYYYY } from '@/utils/date';
import { Pencil, Plus, Trash } from "@phosphor-icons/react";

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        const supabase = createBlogClient();
        const { data, error } = await supabase.from('blogs').select('*').order('publishDate', { ascending: false });
        if (error) {
            console.error('Error fetching blog posts:', error);
        }
        setPosts(data || []);
        setLoading(false);
    }

    async function deletePost(id: string) {
        if (!confirm('Are you sure you want to delete this post?')) return;
        const supabase = createBlogClient();
        const { error } = await supabase.from('blogs').delete().eq('id', id);
        if (error) {
            alert('Error deleting post: ' + error.message);
        } else {
            fetchPosts();
        }
    }

    if (loading) return <div className="p-8 font-sans text-neutral-600">Loading blog posts from database...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto font-sans">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#0a151a]">Blog Management</h1>
                    <p className="text-sm text-neutral-500 mt-1">Manage posts in the Cannoga College blog database</p>
                </div>
                <Link href="/admin/blog/create" className="bg-[#0a151a] hover:bg-slate-800 text-white px-4 py-2 rounded.xl flex items-center gap-2 text-sm font-bold no-underline transition-colors shadow-xs">
                    <Plus size={18} /> New Post
                </Link>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-12 bg-neutral-50 rounded-2xl">
                    <p className="text-neutral-500">No blog posts found in database.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map((post: any) => (
                        <div key={post.id} className="bg-neutral-50 p-5 rounded-2xl flex justify-between items-center shadow-xs">
                            <div className="space-y-1">
                                <h2 className="font-bold text-[#0a151a] text-lg">{post.title}</h2>
                                <div className="flex items-center gap-3 text-xs text-neutral-500 font-medium">
                                    <span>{formatToDDMMYYYY(post.publishDate)}</span>
                                    <span>•</span>
                                    <span className={post.published ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                                        {post.published ? 'Published' : 'Draft'}
                                    </span>
                                    {post.slug && (
                                        <>
                                            <span>•</span>
                                            <span className="font-mono text-neutral-400">/{post.slug}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <Link href={`/admin/blog/edit?id=${post.id}`} className="text-neutral-700 hover:text-black font-semibold text-sm flex items-center gap-1.5 no-underline">
                                    <Pencil size={16} /> Edit
                                </Link>
                                <button onClick={() => deletePost(post.id)} className="text-red-600 hover:text-red-800 font-semibold text-sm flex items-center gap-1.5">
                                    <Trash size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
