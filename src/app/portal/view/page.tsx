'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PortalViewPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/portal/dashboard');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin"></div>
        </div>
    );
}
