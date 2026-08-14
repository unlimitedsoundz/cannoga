'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [sessionReady, setSessionReady] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        // Handle hash fragment or session check
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setSessionReady(true);
                return;
            }

            // Listen for auth state changes (e.g. recovery token exchange)
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
                if (event === 'PASSWORD_RECOVERY' || session) {
                    setSessionReady(true);
                }
            });

            // Fallback timeout in case hash fragment contains access token
            if (window.location.hash.includes('access_token')) {
                setSessionReady(true);
            }

            return () => {
                subscription.unsubscribe();
            };
        };

        checkSession();
    }, []);

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) {
                throw updateError;
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to update password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#070e12] text-white flex flex-col justify-center items-center px-4 py-12">
            <div className="w-full max-w-md bg-[#0d1920] border border-white/10 rounded-xl p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-6 text-center">
                    <img
                        src="/images/logo-cannoga.png"
                        alt="Cannoga College"
                        className="h-10 w-auto mb-4"
                    />
                    <h1 className="text-2xl font-bold tracking-tight">Set New Password</h1>
                    <p className="text-sm text-neutral-400 mt-1">
                        Please enter your new password below.
                    </p>
                </div>

                {success ? (
                    <div className="text-center py-4 space-y-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-white">Password Reset Successful!</h2>
                        <p className="text-sm text-neutral-400">
                            Your password has been updated successfully. You can now log in with your new password.
                        </p>
                        <div className="pt-4">
                            <Link
                                href="/portal/account/login"
                                className="w-full inline-block text-center bg-[#034737] hover:bg-[#045c47] text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                            >
                                Proceed to Portal Login
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                                New Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#070e12] border border-white/15 rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#034737] transition-colors text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#070e12] border border-white/15 rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#034737] transition-colors text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 bg-[#034737] hover:bg-[#045c47] text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 text-sm flex items-center justify-center"
                        >
                            {loading ? (
                                <span className="inline-flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating Password...
                                </span>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
