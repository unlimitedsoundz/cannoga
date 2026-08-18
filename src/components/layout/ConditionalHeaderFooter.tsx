'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { IconContext } from "@phosphor-icons/react";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieConsent } from '@/components/layout/CookieConsent';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';
import { CannogaAIChatWidget } from '@/components/chat/CannogaAIChatWidget';

export function ConditionalHeaderFooter({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isSISPage = pathname?.startsWith('/sis');
    
    return (
        <IconContext.Provider value={{ weight: "fill" }}>
            <AuthProvider>
                {!isSISPage && <Header />}
                <MainLayoutWrapper>
                    {children}
                </MainLayoutWrapper>
                {!isSISPage && <Footer />}
                <CookieConsent />
                {!isSISPage && <CannogaAIChatWidget />}
            </AuthProvider>
        </IconContext.Provider>
    );
}