'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Hero } from '@/components/layout/Hero';
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { Toaster, toast } from 'sonner';

export default function PortalLoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const errorMsg = searchParams.get('error');
        const msg = searchParams.get('message');
        if (errorMsg) {
            setError(errorMsg.replace(/_/g, ' '));
        }
        if (msg) {
            setMessage(msg === 'access_disabled' ? 'Your access has been disabled. Please contact support.' : msg);
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            const response = await fetch('/portal/account/login/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    identifier,
                    password,
                }).toString(),
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                const errorMsg = data.error || 'Login failed. Please try again.';
                setError(errorMsg);
                console.error('Login error:', errorMsg);
                setIsLoading(false);
                return;
            }

            toast.success('Login successful');
            if (data.redirect) {
                window.location.href = data.redirect;
            }
        } catch (error: any) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const [showForgotModal, setShowForgotModal] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [isResetting, setIsResetting] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetEmail) return;
        setIsResetting(true);
        setError(null);

        try {
            const { createClient } = await import('@/utils/supabase/client');
            const supabase = createClient();
            const redirectTo = `${window.location.origin}/auth/reset-password`;

            const { error: resetErr } = await supabase.auth.resetPasswordForEmail(resetEmail, {
                redirectTo,
            });

            if (resetErr) {
                toast.error(resetErr.message);
                setError(resetErr.message);
            } else {
                setResetSuccess(true);
                toast.success('Password reset link sent to your email');
            }
        } catch (err: any) {
            toast.error('Failed to send reset link. Please try again.');
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="w-full">
                <Hero
                    title="Student Portal Login"
                    body="Sign in to your Cannoga College portal to access your academic records, registration, and student services."
                    backgroundColor="#000000"
                    tinted
                    lightText={true}
                    image={{ src: '/images/international-students-hero.png', alt: 'Cannoga students' }}
                    breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Portal', href: '/portal' }, { label: 'Login' }]}
                    className="min-h-[250px] lg:min-h-[350px]"
                />

                <div className="cc-container max-w-3xl mx-auto py-10">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 text-[#2d2d2d]">
                        <h1 className="text-2xl font-bold mb-1 text-center text-neutral-900">Welcome Back</h1>
                        <p className="text-neutral-600 text-sm text-center mb-6">Sign in to your student portal</p>

                        {message && (
                            <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg mb-6 text-xs text-blue-700">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-100 p-3 rounded-lg mb-6 text-xs text-red-700">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium font-black text-neutral-700 mb-1">Email or Student ID</label>
                                <input
                                    type="text"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                    placeholder="email or student ID"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-xs font-medium font-black text-neutral-700">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setResetEmail(identifier.includes('@') ? identifier : '');
                                            setShowForgotModal(true);
                                            setResetSuccess(false);
                                        }}
                                        className="text-xs text-neutral-500 hover:text-black font-semibold transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2 pr-12 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-black transition-colors"
                                    >
                                        {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-neutral-600 text-white font-bold py-3 rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-6 pt-4 border-t border-neutral-100 text-center">
                            <p className="text-sm text-neutral-500">
                                Don&apos;t have an account yet?{' '}
                                <a href="/portal/account/register" className="text-black font-bold hover:underline">
                                    Start your application
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
                        <button
                            onClick={() => setShowForgotModal(false)}
                            className="absolute top-4 right-4 text-neutral-400 hover:text-black font-bold"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold text-neutral-900 mb-2">Reset Your Password</h2>
                        <p className="text-sm text-neutral-600 mb-4">
                            Enter your email address below and we will send you a link to reset your password.
                        </p>

                        {resetSuccess ? (
                            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center space-y-2">
                                <p className="text-emerald-800 text-sm font-semibold">
                                    Reset Link Sent!
                                </p>
                                <p className="text-xs text-emerald-700">
                                    Check your inbox for instructions to set your new password.
                                </p>
                                <button
                                    onClick={() => setShowForgotModal(false)}
                                    className="mt-2 text-xs bg-emerald-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-900"
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                                        Account Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        placeholder="your.email@example.com"
                                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black outline-none text-sm"
                                    />
                                </div>
                                <div className="flex gap-2 justify-end pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotModal(false)}
                                        className="px-4 py-2 text-sm text-neutral-600 hover:text-black font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isResetting}
                                        className="px-4 py-2 text-sm bg-black text-white font-bold rounded-lg hover:bg-neutral-800 disabled:opacity-50"
                                    >
                                        {isResetting ? 'Sending...' : 'Send Reset Link'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}