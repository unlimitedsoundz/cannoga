'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AuthCallbackPage() {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            const supabase = createClient();
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            const next = params.get('next') ?? '/portal/dashboard';

            if (code) {
                const { error } = await supabase.auth.exchangeCodeForSession(code);
                if (!error) {
                    window.location.href = next;
                    return;
                }
                setError(error.message);
            } else {
                setError('No authorization code found');
            }
        };

        handleCallback();
    }, []);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl font-bold mb-2">Authentication Error</h1>
                    <p className="text-neutral-500 mb-4">{error}</p>
                    <a href="/portal/account/login" className="text-blue-600 hover:underline">
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

