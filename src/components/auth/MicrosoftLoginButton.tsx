'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function MicrosoftLoginButton({ className }: { className?: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleMicrosoftLogin = async () => {
        setIsLoading(true);
        const supabase = createClient();

        const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent('/sis')}`;

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'azure',
            options: {
                scopes: 'email',
                redirectTo,
            },
        });

        if (error) {
            console.error('Microsoft OAuth error:', error);
            setIsLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleMicrosoftLogin}
            disabled={isLoading}
            className={
                className ||
                'w-full max-w-[400px] h-[38px] flex items-center justify-center gap-3 border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-800 font-semibold text-[13px] rounded-md transition-all shadow-xs cursor-pointer disabled:opacity-60'
            }
        >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
            <span>{isLoading ? 'Connecting to Microsoft...' : 'Sign in with Microsoft 365'}</span>
        </button>
    );
}
