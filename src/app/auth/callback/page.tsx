'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
    const [message, setMessage] = useState('Completing Microsoft sign in...');

    const executedRef = useRef(false);

    useEffect(() => {
        if (executedRef.current) return;
        executedRef.current = true;

        async function completeLogin() {
            try {
                const params = new URLSearchParams(window.location.search);

                const code = params.get('code');
                const flowId = params.get('sb_flow_id');
                const requestedNext = params.get('next') || '/sis';

                const next =
                    requestedNext.startsWith('/') && !requestedNext.startsWith('//')
                        ? requestedNext
                        : '/sis';
                const finalTarget = next.endsWith('/') ? next : `${next}/`;

                // Critical: detectSessionInUrl: false prevents the internal GoTrue constructor
                // from auto-consuming and clearing the PKCE verifier cookie in the background
                // before our exchangeCodeForSession can read it.
                const supabase = createClient({ detectSessionInUrl: false });

                // 1. Check if a session already exists (e.g. already logged in)
                const { data: existingData } = await supabase.auth.getSession();
                if (existingData?.session) {
                    console.log('[CLIENT CALLBACK] Session already active:', existingData.session.user.id);
                    setMessage('Sign in successful. Redirecting...');
                    try {
                        await fetch('/api/auth/link-student/', { method: 'POST' });
                    } catch {}
                    const activeEmail = (existingData.session.user.email || '').toLowerCase().trim();
                    const target = activeEmail.endsWith('@cannogacollege.ca') ? finalTarget : '/portal/dashboard/';
                    window.location.replace(target);
                    return;
                }

                if (!code) {
                    window.location.replace('/portal/account/login/?error=missing_auth_code');
                    return;
                }

                console.log('[CLIENT CALLBACK] Exchanging code for session, flowId:', flowId);

                const { data, error } = await supabase.auth.exchangeCodeForSession(
                    code,
                    flowId ? { flowId } : undefined
                );

                if (error) {
                    // Fallback: check if session was established despite error
                    const { data: fallbackData } = await supabase.auth.getSession();
                    if (fallbackData?.session) {
                        console.log('[CLIENT CALLBACK] Session found on fallback check:', fallbackData.session.user.id);
                        setMessage('Sign in successful. Redirecting...');
                        try {
                            await fetch('/api/auth/link-student/', { method: 'POST' });
                        } catch {}
                        const fallbackEmail = (fallbackData.session.user.email || '').toLowerCase().trim();
                        const target = fallbackEmail.endsWith('@cannogacollege.ca') ? finalTarget : '/portal/dashboard/';
                        window.location.replace(target);
                        return;
                    }

                    console.error('[CLIENT CALLBACK] Exchange failed:', error);
                    setMessage('Authentication failed.');
                    window.location.replace(
                        `/portal/account/login/?error=${encodeURIComponent(error.message)}`
                    );
                    return;
                }

                console.log('[CLIENT CALLBACK] Login successful:', !!data.session);
                setMessage('Sign in successful. Redirecting...');

                // Auto-link student profile if applicable
                try {
                    await fetch('/api/auth/link-student/', { method: 'POST' });
                } catch {}

                const userEmail = (data?.session?.user?.email || '').toLowerCase().trim();
                const destination = userEmail.endsWith('@cannogacollege.ca') ? finalTarget : '/portal/dashboard/';
                window.location.replace(destination);
            } catch (error) {
                console.error('[CLIENT CALLBACK] Unexpected error:', error);
                const message =
                    error instanceof Error ? error.message : 'Authentication failed';
                window.location.replace(
                    `/portal/account/login/?error=${encodeURIComponent(message)}`
                );
            }
        }

        completeLogin();
    }, []);

    return (
        <main
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                background: '#f8fafc',
            }}
        >
            <div
                style={{
                    textAlign: 'center',
                    background: '#ffffff',
                    padding: '32px 40px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    maxWidth: '400px',
                    width: '100%',
                }}
            >
                <div
                    style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid #e2e8f0',
                        borderTopColor: '#034737',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px',
                    }}
                />
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
                <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
                    Signing you in
                </h1>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>{message}</p>
            </div>
        </main>
    );
}
