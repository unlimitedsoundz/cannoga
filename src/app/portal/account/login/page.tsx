'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Hero } from '@/components/layout/Hero';
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { Toaster, toast } from 'sonner';

export default function PortalLoginPage() {
    const [email, setEmail] = useState('');
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
                    email,
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
                                <label className="block text-xs font-medium font-black text-neutral-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                    placeholder="student@studentmail.cannogacollege.ca"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium font-black text-neutral-700 mb-1">Password</label>
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
        </>
    );
}