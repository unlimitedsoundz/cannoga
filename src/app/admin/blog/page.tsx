'use client';

import { useState, useEffect } from 'react';
import { Link } from "@aalto-dx/react-components";
import { createClient } from '@/utils/supabase/client';
import { formatToDDMMYYYY } from '@/utils/date';
import { Pencil, Plus, Trash } from "@phosphor-icons/react";

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        const supabase = createClient();
            const { data } = await supabase.from('blogs').select('*').order('createdAt', { ascending: false });
        setPosts(data || []);
        setLoading(false);
    }

    async function deletePost(id: string) {
        if (!confirm('Are you sure you want to delete this post?')) return;
        const supabase = createClient();
        await supabase.from('blogs').delete().eq('id', id);
        fetchPosts();
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Blog Management</h1>
                <Link href="/admin/blog/create" className="bg-[#9c27b3] text-white px-4 py-2 rounded flex items-center gap-2">
                    <Plus size={20} /> New Post
                </Link>
            </div>

            <div className="space-y-4">
                {posts.map((post: any) => (
                    <div key={post.id} className="border p-4 rounded flex justify-between items-center">
                        <div>
                            <h2 className="font-bold">{post.title}</h2>
                            <p className="text-sm text-gray-600">{formatToDDMMYYYY(post.publishDate)} - {post.published ? 'Published' : 'Draft'}</p>
                        </div>
                        <div className="flex gap-2">
                            <Link href={`/admin/blog/edit?id=${post.id}`} className="text-blue-600 hover:underline flex items-center gap-1">
                                <Pencil size={16} /> Edit
                            </Link>
                            <button onClick={() => deletePost(post.id)} className="text-red-600 hover:underline flex items-center gap-1">
                                <Trash size={16} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

