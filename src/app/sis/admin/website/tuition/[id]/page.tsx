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

export default function EditTuitionPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [credentialType, setCredentialType] = useState('CERTIFICATE');
    const [domesticTuition, setDomesticTuition] = useState('');
    const [internationalTuition, setInternationalTuition] = useState('');
    const [applicationFee, setApplicationFee] = useState('');
    const [effectiveFrom, setEffectiveFrom] = useState('');
    const [effectiveTo, setEffectiveTo] = useState('');
    const [status, setStatus] = useState('active');

    useEffect(() => {
        const fetchTuition = async () => {
            try {
                const response = await fetch(`/api/sis/admin/tuition?id=${id}`);
                if (!response.ok) throw new Error('Failed to fetch tuition');
                const data = await response.json();
                const tuition = data.tuition || data;
                setCredentialType(tuition.credential_type || 'CERTIFICATE');
                setDomesticTuition(tuition.domestic_tuition ? JSON.stringify(tuition.domestic_tuition) : '');
                setInternationalTuition(tuition.international_tuition ? JSON.stringify(tuition.international_tuition) : '');
                setApplicationFee(String(tuition.application_fee || 0));
                setEffectiveFrom(tuition.effective_from ? tuition.effective_from.slice(0, 10) : '');
                setEffectiveTo(tuition.effective_to ? tuition.effective_to.slice(0, 10) : '');
                setStatus(tuition.status || 'active');
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTuition();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const response = await fetch('/api/sis/admin/tuition', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    credential_type: credentialType,
                    domestic_tuition: domesticTuition ? JSON.parse(domesticTuition) : {},
                    international_tuition: internationalTuition ? JSON.parse(internationalTuition) : {},
                    application_fee: parseFloat(applicationFee) || 0,
                    effective_from: effectiveFrom || null,
                    effective_to: effectiveTo || null,
                    status,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update tuition');
            }

            router.push('/sis/admin/website/tuition/');
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
                title="Edit Tuition"
                subtitle="Update tuition information"
                actions={
                    <Link href="/sis/admin/website/tuition/" className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-50 transition-colors no-underline">
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
                    <select id="credentialType" value={credentialType} onChange={e => setCredentialType(e.target.value)} className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans bg-white">
                        <option value="CERTIFICATE">Certificate</option>
                        <option value="DIPLOMA">Diploma</option>
                        <option value="BACHELOR">Bachelor</option>
                        <option value="MASTER">Master</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="domesticTuition">Domestic Tuition (JSON)</Label>
                    <textarea id="domesticTuition" value={domesticTuition} onChange={e => setDomesticTuition(e.target.value)} placeholder='{"annualTuition": "15000", "perCredit": "500"}' rows={3} className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-mono" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="internationalTuition">International Tuition (JSON)</Label>
                    <textarea id="internationalTuition" value={internationalTuition} onChange={e => setInternationalTuition(e.target.value)} placeholder='{"annualTuition": "18000", "perCredit": "600"}' rows={3} className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-mono" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="applicationFee">Application Fee ($)</Label>
                    <Input id="applicationFee" type="number" value={applicationFee} onChange={e => setApplicationFee(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="effectiveFrom">Effective From</Label>
                        <Input id="effectiveFrom" type="date" value={effectiveFrom} onChange={e => setEffectiveFrom(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="effectiveTo">Effective To</Label>
                        <Input id="effectiveTo" type="date" value={effectiveTo} onChange={e => setEffectiveTo(e.target.value)} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select id="status" value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans bg-white">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                    <Button htmlType="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button htmlType="submit" disabled={saving}>
                        <HugeiconsIcon icon={Save} size={14} strokeWidth={2.5} className="mr-2" />
                        {saving ? 'Saving...' : 'Update Tuition'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
