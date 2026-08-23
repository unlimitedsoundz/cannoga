'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Hero } from '@/components/layout/Hero';
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
        const checkAndSetSession = async () => {
            // Check current session
            const { data: { session: existingSession } } = await supabase.auth.getSession();
            if (existingSession) {
                setSessionReady(true);
                return;
            }

            // Check URL hash for access_token and refresh_token
            if (window.location.hash) {
                const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
                const accessToken = hashParams.get('access_token');
                const refreshToken = hashParams.get('refresh_token');

                if (accessToken && refreshToken) {
                    const { error: setErr } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });
                    if (!setErr) {
                        setSessionReady(true);
                        return;
                    }
                }
            }

            // Check URL query search for PKCE code
            if (window.location.search) {
                const searchParams = new URLSearchParams(window.location.search);
                const code = searchParams.get('code');
                if (code) {
                    const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
                    if (!exchangeErr) {
                        setSessionReady(true);
                        return;
                    }
                }
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
            if (event === 'PASSWORD_RECOVERY' || session) {
                setSessionReady(true);
            }
        });

        checkAndSetSession();

        return () => {
            subscription.unsubscribe();
        };
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
            // Ensure session is set before calling updateUser
            let { data: { session } } = await supabase.auth.getSession();

            if (!session && window.location.hash) {
                const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
                const accessToken = hashParams.get('access_token');
                const refreshToken = hashParams.get('refresh_token');

                if (accessToken && refreshToken) {
                    const { data: sessionData, error: setErr } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });
                    if (setErr) throw setErr;
                    session = sessionData.session;
                }
            }

            if (!session) {
                throw new Error('Your reset link has expired or is invalid. Please request a new password reset link.');
            }

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
        <div className="w-full">
            <Hero
                title="Reset Your Password"
                body="Set a new secure password for your Cannoga College portal account."
                backgroundColor="#000000"
                tinted
                lightText={true}
                image={{ src: '/images/international-students-hero.png', alt: 'Cannoga students' }}
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Portal', href: '/portal' }, { label: 'Reset Password' }]}
                className="min-h-[250px] lg:min-h-[350px]"
            />

            <div className="cc-container max-w-3xl mx-auto py-10">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 text-[#2d2d2d]">
                    <h1 className="text-2xl font-bold mb-1 text-center text-neutral-900">Set New Password</h1>
                    <p className="text-neutral-600 text-sm text-center mb-6">Please enter your new password below</p>

                    {success ? (
                        <div className="text-center py-4 space-y-4">
                            <h2 className="text-lg font-bold text-neutral-900">Password Reset Successful!</h2>
                            <p className="text-sm text-neutral-600">
                                Your password has been updated successfully. You can now log in with your new password.
                            </p>
                            <div className="pt-4">
                                <Link
                                    href="/portal/account/login/"
                                    className="w-full inline-block text-center bg-neutral-600 hover:bg-neutral-700 text-white font-bold py-3 rounded-lg transition-colors"
                                >
                                    Proceed to Portal Login
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handlePasswordReset} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-100 p-3 rounded-lg text-xs text-red-700 text-center">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium font-black text-neutral-700 mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium font-black text-neutral-700 mb-1">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-neutral-600 text-white font-bold py-3 rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50 text-sm"
                            >
                                {loading ? 'Updating Password...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
