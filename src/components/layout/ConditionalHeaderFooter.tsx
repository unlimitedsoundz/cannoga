'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieConsent } from '@/components/layout/CookieConsent';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';

export function ConditionalHeaderFooter({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isSISPage = pathname?.startsWith('/sis');
    
    return (
        <AuthProvider>
            {!isSISPage && <Header />}
            <MainLayoutWrapper>
                {children}
            </MainLayoutWrapper>
            {!isSISPage && <Footer />}
            <CookieConsent />
        </AuthProvider>
    );
}