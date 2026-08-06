'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft, Save } from '@hugeicons/core-free-icons';

export default function EditFaqPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [category, setCategory] = useState('General');
    const [status, setStatus] = useState('published');
    const [displayOrder, setDisplayOrder] = useState('0');

    useEffect(() => {
        const fetchFaq = async () => {
            try {
                const response = await fetch(`/api/sis/admin/faqs?id=${id}`);
                if (!response.ok) throw new Error('Failed to fetch FAQ');
                const data = await response.json();
                const faq = data.faq || data;
                setQuestion(faq.question || '');
                setAnswer(faq.answer || '');
                setCategory(faq.category || 'General');
                setStatus(faq.status || 'published');
                setDisplayOrder(String(faq.display_order || 0));
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFaq();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const response = await fetch('/api/sis/admin/faqs', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    question,
                    answer,
                    category,
                    status,
                    display_order: parseInt(displayOrder, 10) || 0,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update FAQ');
            }

            router.push('/sis/admin/website/faqs');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div></div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Edit FAQ"
                subtitle="Update frequently asked question"
                actions={
                    <Link href="/sis/admin/website/faqs" className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-50 transition-colors no-underline">
                        <HugeiconsIcon icon={ArrowLeft} size={14} strokeWidth={2.5} /> Back to FAQs
                    </Link>
                }
            />

            <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-6 space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="question">Question *</Label>
                    <Input id="question" value={question} onChange={e => setQuestion(e.target.value)} required placeholder="Enter question" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="answer">Answer *</Label>
                    <textarea id="answer" value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Enter answer" rows={5} className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans bg-white">
                            <option value="General">General</option>
                            <option value="Admissions">Admissions</option>
                            <option value="Tuition">Tuition</option>
                            <option value="Programs">Programs</option>
                            <option value="Campus">Campus</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select id="status" value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans bg-white">
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="displayOrder">Display Order</Label>
                        <Input id="displayOrder" type="number" value={displayOrder} onChange={e => setDisplayOrder(e.target.value)} />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                    <Button htmlType="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button htmlType="submit" disabled={saving}>
                        <HugeiconsIcon icon={Save} size={14} strokeWidth={2.5} className="mr-2" />
                        {saving ? 'Saving...' : 'Update FAQ'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
