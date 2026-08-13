'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RedirectContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    useEffect(() => {
        if (id) {
            router.replace(`/portal/application/letter?id=${id}`);
        } else {
            router.replace('/portal/dashboard');
        }
    }, [id, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a151a]"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Loading Official Letter...</p>
            </div>
        </div>
    );
}

export default function OfferRedirectPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a151a]"></div>
            </div>
        }>
            <RedirectContent />
        </Suspense>
    );
}

