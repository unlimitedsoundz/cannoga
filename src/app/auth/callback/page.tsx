'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
    const [message, setMessage] = useState('Completing Microsoft sign in...');

    useEffect(() => {
        let cancelled = false;

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

                if (!code) {
                    window.location.replace('/portal/account/login/?error=missing_auth_code');
                    return;
                }

                const supabase = createClient();

                console.log('[CLIENT CALLBACK] code found:', !!code);
                console.log('[CLIENT CALLBACK] flowId:', flowId);

                const { data, error } = await supabase.auth.exchangeCodeForSession(
                    code,
                    flowId ? { flowId } : undefined
                );

                if (cancelled) return;

                if (error) {
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
                } catch {
                    // Non-fatal
                }

                const finalTarget = next.endsWith('/') ? next : `${next}/`;
                window.location.replace(finalTarget);
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

        return () => {
            cancelled = true;
        };
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
