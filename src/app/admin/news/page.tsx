'use client';

import { createClient } from '@/utils/supabase/client';
import { News } from '@/types/database';
import { Trash, PencilSimple as Edit, CircleNotch as Loader2 } from "@phosphor-icons/react";
import { Link } from "@aalto-dx/react-components";
import { formatToDDMMYYYY } from '@/utils/date';
import { useState, useEffect } from 'react';

export default function AdminNewsPage() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchNews = async () => {
        try {
            const { data } = await supabase
                .from('News')
                .select('*')
                .order('publishDate', { ascending: false });
            setNews(data || []);
        } catch (error) {
            console.error("Error fetching news:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this article?')) return;

        try {
            const { error } = await supabase.from('News').delete().eq('id', id);
            if (error) throw error;
            setNews(news.filter(n => n.id !== id));
        } catch (error: any) {
            alert("Error deleting news: " + error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 uppercase tracking-tight">Manage News</h1>
                <Link href="/admin/news/edit" className="bg-neutral-900 text-white px-4 py-2 rounded-none font-bold hover:bg-neutral-800 transition-colors uppercase tracking-widest text-xs">
                    + New Article
                </Link>
            </div>

            <div className="bg-white border border-neutral-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="hidden md:table-header-group bg-neutral-50 border-b border-neutral-200">
                        <tr>
                            <th className="p-4 font-semibold text-neutral-600 text-xs uppercase">Title</th>
                            <th className="p-4 font-semibold text-neutral-600 text-xs uppercase">Published</th>
                            <th className="p-4 font-semibold text-neutral-600 text-xs uppercase text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 block md:table-row-group">
                        {news.map((item) => (
                            <tr key={item.id} className="hover:bg-neutral-50 group block md:table-row p-4 md:p-0">
                                <td className="block md:table-cell py-1 md:p-4 font-bold text-neutral-900 text-sm md:text-base uppercase tracking-tight">{item.title}</td>
                                <td className="block md:table-cell py-1 md:p-4 text-xs text-neutral-500 md:text-neutral-600">
                                    <span className="md:hidden font-bold uppercase mr-1">Published:</span>
                                    {formatToDDMMYYYY(item.publishDate)}
                                </td>
                                <td className="block md:table-cell pt-4 md:p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/admin/news/edit?id=${item.id}`} className="p-2 border border-neutral-200 rounded-none hover:bg-neutral-50" title="Edit">
                                            <Edit size={16} weight="bold" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 border border-neutral-200 rounded-none hover:bg-red-50 text-red-600"
                                            title="Delete"
                                        >
                                            <Trash size={16} weight="bold" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
