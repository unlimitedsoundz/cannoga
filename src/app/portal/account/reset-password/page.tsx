'use client';

import React, { useState, useEffect } from 'react';
import { Hero } from '@/components/layout/Hero';
import { Eye, EyeSlash, CheckCircle } from "@phosphor-icons/react";
import { Toaster, toast } from 'sonner';
import { updatePasswordWithToken } from '../forgot-password-actions';
import { createClient } from '@/utils/supabase/client';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [hasSession, setHasSession] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        const supabase = createClient();
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setHasSession(true);
            }
            setCheckingSession(false);
        };
        checkAuth();
    }, []);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            const err = 'Password must be at least 6 characters long.';
            setError(err);
            toast.error(err);
            return;
        }

        if (password !== confirmPassword) {
            const err = 'Passwords do not match.';
            setError(err);
            toast.error(err);
            return;
        }

        setIsLoading(true);

        try {
            const res = await updatePasswordWithToken(password);
            if (res.error) {
                setError(res.error);
                toast.error(res.error);
            } else {
                setIsSuccess(true);
                toast.success('Password updated successfully!');
            }
        } catch (err: any) {
            setError('An unexpected error occurred. Please try again.');
            toast.error('Failed to update password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="w-full">
                <Hero
                    title="Set New Password"
                    body="Create a new secure password for your Cannoga College account."
                    backgroundColor="#000000"
                    tinted
                    lightText={true}
                    image={{ src: '/images/international-students-hero.png', alt: 'Cannoga students' }}
                    breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Portal', href: '/portal' }, { label: 'Reset Password' }]}
                    className="min-h-[250px] lg:min-h-[350px]"
                />

                <div className="cc-container max-w-xl mx-auto py-12 px-4">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 text-[#2d2d2d]">
                        <h1 className="text-2xl font-bold mb-1 text-center text-neutral-900">Choose New Password</h1>
                        <p className="text-neutral-600 text-xs text-center mb-6">Enter your new account password below</p>

                        {isSuccess ? (
                            <div className="text-center py-6 space-y-4">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle size={28} weight="bold" />
                                </div>
                                <h2 className="text-lg font-bold text-neutral-900">Password Reset Complete</h2>
                                <p className="text-xs text-neutral-600">Your password has been successfully updated in the database.</p>
                                <div className="pt-4">
                                    <a
                                        href="/portal/account/login"
                                        className="inline-block bg-neutral-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors text-xs uppercase tracking-wider"
                                    >
                                        Log In Now
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <>
                                {error && (
                                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-6 text-xs text-red-800 font-medium">
                                        {error}
                                    </div>
                                )}

                                {!checkingSession && !hasSession && (
                                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-6 text-xs text-amber-800 font-medium">
                                        Password reset link token expired or missing. If submission fails, please request a fresh link via the <a href="/portal/account/forgot-password" className="underline font-bold">Forgot Password page</a>.
                                    </div>
                                )}

                                <form onSubmit={handleReset} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full px-4 py-2.5 pr-12 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm text-neutral-900 placeholder-neutral-400"
                                                placeholder="••••••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-black transition-colors"
                                            >
                                                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">Confirm New Password</label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm text-neutral-900 placeholder-neutral-400"
                                            placeholder="••••••••••••"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-neutral-900 text-white font-bold py-3 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 text-sm shadow-md"
                                    >
                                        {isLoading ? 'Updating Password...' : 'Save New Password'}
                                    </button>
                                </form>

                                <div className="mt-6 pt-6 border-t border-neutral-100 text-center text-xs font-bold">
                                    <a href="/portal/account/login" className="text-neutral-600 hover:text-black transition-colors">
                                        Cancel & Return to Login
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
