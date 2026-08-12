'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from "@aalto-dx/react-components";
import { Plus, Pencil, Trash, Eye, EyeSlash, ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { createClient } from '@/utils/supabase/client';
import RichTextEditor from '@/components/RichTextEditor';

interface FaqPage {
    id: string;
    name: string;
    slug: string;
}

interface FAQ {
    id: string;
    question: string;
    answer: string;
    page_id: string;
    order_index: number;
    is_published: boolean;
    created_at: string;
    faq_pages?: FaqPage;
}

export default function AdminFAQsPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [pages, setPages] = useState<FaqPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPage, setSelectedPage] = useState<string>('all');
    const [showForm, setShowForm] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const supabase = createClient();

        // Fetch pages
        const { data: pagesData, error: pagesError } = await supabase
            .from('faq_pages')
            .select('*')
            .order('name');

        if (pagesError) {
            console.error('Error fetching pages:', pagesError);
            return;
        }

        // Fetch FAQs with page info
        const { data: faqsData, error: faqsError } = await supabase
            .from('faq')
            .select(`
                *,
                faq_pages (
                    id,
                    name,
                    slug
                )
            `)
            .order('order_index');

        if (faqsError) {
            console.error('Error fetching FAQs:', faqsError);
            return;
        }

        setPages(pagesData || []);
        setFaqs(faqsData || []);
        setLoading(false);
    };

    const togglePublish = async (faqId: string, currentStatus: boolean) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('faq')
            .update({ is_published: !currentStatus })
            .eq('id', faqId);

        if (error) {
            alert('Error updating FAQ status');
            return;
        }

        fetchData();
    };

    const deleteFaq = async (faqId: string) => {
        if (!confirm('Are you sure you want to delete this FAQ?')) return;

        const supabase = createClient();
        const { error } = await supabase
            .from('faq')
            .delete()
            .eq('id', faqId);

        if (error) {
            alert('Error deleting FAQ');
            return;
        }

        fetchData();
    };

    const filteredFaqs = selectedPage === 'all'
        ? faqs
        : faqs.filter(faq => faq.page_id === selectedPage);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-16 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/admin" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
                            <ArrowLeft size={16} />
                            Back to Admin
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">FAQ Management</h1>
                        <p className="text-gray-600">Manage FAQs across all pages</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-[#9c27b3] text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Add FAQ
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                    <div className="flex items-center gap-4">
                        <label className="font-medium text-gray-700">Filter by Page:</label>
                        <select
                            value={selectedPage}
                            onChange={(e) => setSelectedPage(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-[#9c27b3]"
                        >
                            <option value="all">All Pages</option>
                            {pages.map(page => (
                                <option key={page.id} value={page.id}>{page.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {filteredFaqs.map((faq) => (
                        <div key={faq.id} className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-1 text-xs rounded-full ${faq.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {faq.is_published ? 'Published' : 'Draft'}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {faq.faq_pages?.name || 'Unknown Page'}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                                    <div className="text-gray-600 text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <button
                                        onClick={() => togglePublish(faq.id, faq.is_published)}
                                        className={`p-2 rounded-lg ${faq.is_published ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                                    >
                                        {faq.is_published ? <Eye size={16} /> : <EyeSlash size={16} />}
                                    </button>
                                    <button
                                        onClick={() => setEditingFaq(faq)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => deleteFaq(faq.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredFaqs.length === 0 && (
                        <div className="bg-white p-12 rounded-lg shadow-sm text-center">
                            <p className="text-gray-500">No FAQs found for the selected page.</p>
                        </div>
                    )}
                </div>

                {/* FAQ Form Modal would go here */}
                {showForm && (
                    <div className="fixed inset-0 bg-[#9c27b3] bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-4">Add New FAQ</h2>
                            <FAQForm
                                onClose={() => setShowForm(false)}
                                onSave={() => {
                                    setShowForm(false);
                                    fetchData();
                                }}
                                pages={pages}
                            />
                        </div>
                    </div>
                )}

                {editingFaq && (
                    <div className="fixed inset-0 bg-[#9c27b3] bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-4">Edit FAQ</h2>
                            <FAQForm
                                faq={editingFaq}
                                onClose={() => setEditingFaq(null)}
                                onSave={() => {
                                    setEditingFaq(null);
                                    fetchData();
                                }}
                                pages={pages}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

interface FAQFormProps {
    faq?: FAQ;
    onClose: () => void;
    onSave: () => void;
    pages: FaqPage[];
}

function FAQForm({ faq, onClose, onSave, pages }: FAQFormProps) {
    const [question, setQuestion] = useState(faq?.question || '');
    const [answer, setAnswer] = useState(faq?.answer || '');
    const [pageId, setPageId] = useState(faq?.page_id || '');
    const [orderIndex, setOrderIndex] = useState(faq?.order_index || 0);
    const [isPublished, setIsPublished] = useState(faq?.is_published ?? true);
    const [saving, setSaving] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const supabase = createClient();
        const data = {
            question,
            answer,
            page_id: pageId,
            order_index: orderIndex,
            is_published: isPublished,
        };

        const { error } = faq
            ? await supabase.from('faq').update(data).eq('id', faq.id)
            : await supabase.from('faq').insert(data);

        console.log('Saving FAQ:', data);

        setSaving(false);

        if (error) {
            alert('Error saving FAQ');
            return;
        }

        onSave();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">Page</label>
                <select
                    value={pageId}
                    onChange={(e) => setPageId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                >
                    <option value="">Select a page</option>
                    {pages.map(page => (
                        <option key={page.id} value={page.id}>{page.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Question</label>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Answer</label>


                <div className="border border-t-0 border-gray-300 rounded-b-lg">
                    <RichTextEditor value={answer} onChange={setAnswer} />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Use the rich text editor toolbar to format your content.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Order Index</label>
                    <input
                        type="number"
                        value={orderIndex}
                        onChange={(e) => setOrderIndex(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                </div>
                <div className="flex items-center">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={isPublished}
                            onChange={(e) => setIsPublished(e.target.checked)}
                            className="border-2 border-neutral-300 rounded-sm checked:bg-[#9c27b3] checked:border-[#9c27b3] w-4 h-4"
                        />
                        Published
                    </label>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#9c27b3] text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                    {saving ? 'Saving...' : (faq ? 'Update FAQ' : 'Create FAQ')}
                </button>
            </div>
        </form>
    );
}

