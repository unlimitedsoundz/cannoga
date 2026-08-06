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

export default function NewTuitionPage() {
    const router = useRouter();
    const [credentialType, setCredentialType] = useState('');
    const [domesticTuition, setDomesticTuition] = useState('');
    const [internationalTuition, setInternationalTuition] = useState('');
    const [applicationFee, setApplicationFee] = useState('');
    const [status, setStatus] = useState('active');
    const [effectiveFrom, setEffectiveFrom] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/sis/admin/tuition', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    credential_type: credentialType,
                    domestic_tuition: domesticTuition ? parseFloat(domesticTuition) : null,
                    international_tuition: internationalTuition ? parseFloat(internationalTuition) : null,
                    application_fee: applicationFee ? parseFloat(applicationFee) : null,
                    status,
                    effective_from: effectiveFrom || null,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create tuition entry');
            }

            router.push('/sis/admin/website/tuition');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="New Tuition Entry"
                subtitle="Add tuition and fee information"
                actions={
                    <Link href="/sis/admin/website/tuition" className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-50 transition-colors no-underline">
                        <HugeiconsIcon icon={ArrowLeft} size={14} strokeWidth={2.5} /> Back to Tuition
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
                    <Label htmlFor="credentialType">Credential Type *</Label>
                    <Input id="credentialType" value={credentialType} onChange={e => setCredentialType(e.target.value)} required placeholder="e.g. Bachelor Degree" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="domesticTuition">Domestic Tuition</Label>
                        <Input id="domesticTuition" type="number" step="0.01" value={domesticTuition} onChange={e => setDomesticTuition(e.target.value)} placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="internationalTuition">International Tuition</Label>
                        <Input id="internationalTuition" type="number" step="0.01" value={internationalTuition} onChange={e => setInternationalTuition(e.target.value)} placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="applicationFee">Application Fee</Label>
                        <Input id="applicationFee" type="number" step="0.01" value={applicationFee} onChange={e => setApplicationFee(e.target.value)} placeholder="0.00" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={status} onChange={e => setStatus(e.target.value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="effectiveFrom">Effective From</Label>
                        <Input id="effectiveFrom" type="date" value={effectiveFrom} onChange={e => setEffectiveFrom(e.target.value)} />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                    <Button htmlType="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button htmlType="submit" disabled={loading}>
                        <HugeiconsIcon icon={Save} size={14} strokeWidth={2.5} className="mr-2" />
                        {loading ? 'Saving...' : 'Create Entry'}
                    </Button>
                </div>
            </form>
        </div>
    );
}