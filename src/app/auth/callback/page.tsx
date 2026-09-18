'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AuthCallbackPage() {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            const supabase = createClient();
            
            // Check both query string (?code=...) and hash fragment (#access_token=...)
            const searchParams = new URLSearchParams(window.location.search);
            const hashString = window.location.hash.startsWith('#') 
                ? window.location.hash.substring(1) 
                : window.location.hash;
            const hashParams = new URLSearchParams(hashString);

            // 1. Check if provider returned an error
            const errorDesc = searchParams.get('error_description') || 
                              hashParams.get('error_description') ||
                              searchParams.get('error') ||
                              hashParams.get('error');

            if (errorDesc) {
                console.error('[AuthCallback] Provider error:', errorDesc);
                setError(decodeURIComponent(errorDesc).replace(/\+/g, ' '));
                return;
            }

            const code = searchParams.get('code') || hashParams.get('code');
            const targetNext = searchParams.get('next') || hashParams.get('next') || '/sis';

            // 2. If authorization code is present, exchange it for session
            if (code) {
                try {
                    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
                    if (!error && data?.session?.user) {
                        const userEmail = data.session.user.email?.toLowerCase() || '';
                        if (userEmail.endsWith('@cannogacollege.ca')) {
                            window.location.href = '/sis';
                            return;
                        }
                        window.location.href = targetNext;
                        return;
                    }
                    if (error) {
                        console.error('[AuthCallback] exchangeCodeForSession error:', error);
                        setError(error.message);
                        return;
                    }
                } catch (err: any) {
                    console.error('[AuthCallback] Exception during code exchange:', err);
                    setError(err?.message || 'Authentication exchange failed');
                    return;
                }
            }

            // 3. If no code was in URL, check if Supabase already initialized the session (e.g. from hash tokens)
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData?.session?.user) {
                const userEmail = sessionData.session.user.email?.toLowerCase() || '';
                if (userEmail.endsWith('@cannogacollege.ca')) {
                    window.location.href = '/sis';
                    return;
                }
                window.location.href = targetNext;
                return;
            }

            // 4. Listen for auth state change as final fallback
            const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
                if (session?.user) {
                    authListener.subscription.unsubscribe();
                    const userEmail = session.user.email?.toLowerCase() || '';
                    if (userEmail.endsWith('@cannogacollege.ca')) {
                        window.location.href = '/sis';
                        return;
                    }
                    window.location.href = targetNext;
                }
            });

            // If after 2 seconds no session or code is detected, show error
            setTimeout(() => {
                setError('No authorization code or active session found. Please try signing in again.');
            }, 2500);
        };

        handleCallback();
    }, []);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl font-bold mb-2">Authentication Error</h1>
                    <p className="text-neutral-500 mb-4">{error}</p>
                    <a href="/portal/account/login/" className="text-blue-600 hover:underline">
                        Return to Login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a151a] mx-auto mb-4"></div>
                <p className="text-neutral-500">Completing authentication...</p>
            </div>
        </div>
    );
}

