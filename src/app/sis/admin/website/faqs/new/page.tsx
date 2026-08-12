'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft, Save } from '@hugeicons/core-free-icons';

export default function NewFaqPage() {
    const router = useRouter();
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [category, setCategory] = useState('General');
    const [status, setStatus] = useState('draft');
    const [displayOrder, setDisplayOrder] = useState('0');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/sis/admin/faqs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question,
                    answer,
                    category,
                    status,
                    display_order: parseInt(displayOrder, 10) || 0,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create FAQ');
            }

            router.push('/sis/admin/website/faqs');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="New FAQ"
                subtitle="Create a new frequently asked question"
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
                    <Input id="question" value={question} onChange={e => setQuestion(e.target.value)} required placeholder="FAQ question" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="answer">Answer *</Label>
                    <textarea id="answer" value={answer} onChange={e => setAnswer(e.target.value)} required placeholder="FAQ answer" rows={5} className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={category} onChange={e => setCategory(e.target.value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="General">General</SelectItem>
                                <SelectItem value="Admissions">Admissions</SelectItem>
                                <SelectItem value="Tuition">Tuition</SelectItem>
                                <SelectItem value="Programs">Programs</SelectItem>
                                <SelectItem value="Campus">Campus</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={status} onChange={e => setStatus(e.target.value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="displayOrder">Display Order</Label>
                        <Input id="displayOrder" type="number" value={displayOrder} onChange={e => setDisplayOrder(e.target.value)} />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                    <Button htmlType="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button htmlType="submit" disabled={loading}>
                        <HugeiconsIcon icon={Save} size={14} strokeWidth={2.5} className="mr-2" />
                        {loading ? 'Saving...' : 'Create FAQ'}
                    </Button>
                </div>
            </form>
        </div>
    );
}