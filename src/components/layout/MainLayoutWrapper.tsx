'use client';

import { usePathname } from 'next/navigation';

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isPortalOrAdmin = (pathname.startsWith('/portal') || pathname.startsWith('/admin') || pathname.startsWith('/sis')) && !pathname.includes('/login');

    return (
        <main className={isPortalOrAdmin ? '' : 'pt-[112px] md:pt-[148px]'}>
            {children}
        </main>
    );
}
