'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { XCircle } from "@phosphor-icons/react";

export default function RejectOfferButton({ applicationId }: { applicationId: string }) {
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleRejectOffer = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to reject this offer? This action cannot be undone and your application will be closed.'
        );

        if (!confirmed) return;

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('admission_offers')
                .update({
                    status: 'REJECTED',
                    rejected_at: new Date().toISOString()
                })
                .eq('application_id', applicationId);

            if (error) throw error;

            const { error: appError } = await supabase
                .from('applications')
                .update({
                    status: 'OFFER_REJECTED',
                    updated_at: new Date().toISOString()
                })
                .eq('id', applicationId);

            if (appError) throw appError;

            alert('Offer rejected. Your application has been closed.');
            router.push('/portal/dashboard');
        } catch (err: any) {
            console.error('Error rejecting offer:', err);
            alert('Failed to reject offer. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <button
            onClick={handleRejectOffer}
            disabled={isSaving}
            className="flex items-center gap-2 border border-red-200 text-red-600 px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 transition-all disabled:opacity-50"
        >
            {isSaving ? (
                <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
            ) : (
                <XCircle size={16} weight="bold" />
            )}
            Reject Offer
        </button>
    );
}
