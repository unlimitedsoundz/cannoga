'use client';

import React, { useState } from 'react';
import { Hero } from '@/components/layout/Hero';
import { Toaster, toast } from 'sonner';
import { requestPasswordReset } from '../forgot-password-actions';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const res = await requestPasswordReset(email);
            if (res.error) {
                setError(res.error);
                toast.error(res.error);
            } else {
                setSuccessMessage(res.message || 'Check your inbox for password reset link.');
                toast.success('Reset link sent!');
                setEmail('');
            }
        } catch (err: any) {
            setError('An unexpected error occurred. Please try again.');
            toast.error('Failed to send reset link.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="w-full">
                <Hero
                    title="Reset Your Password"
                    body="Enter your registered email address and we will send you instructions to safely reset your account password."
                    backgroundColor="#000000"
                    tinted
                    lightText={true}
                    image={{ src: '/images/international-students-hero.png', alt: 'Cannoga students' }}
                    breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Portal', href: '/portal' }, { label: 'Forgot Password' }]}
                    className="min-h-[250px] lg:min-h-[350px]"
                />

                <div className="cc-container max-w-xl mx-auto py-12 px-4">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 text-[#2d2d2d]">
                        <h1 className="text-2xl font-bold mb-1 text-center text-neutral-900">Forgot Password</h1>
                        <p className="text-neutral-600 text-xs text-center mb-6">Enter your email to receive a password reset link</p>

                        {successMessage && (
                            <div className="bg-emerald-50 p-4 rounded-xl mb-6 text-xs text-emerald-800 font-medium leading-relaxed">
                                {successMessage}
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 p-4 rounded-xl mb-6 text-xs text-red-800 font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">Account Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm text-neutral-900 placeholder-neutral-400"
                                    placeholder="name@cannogacollege.ca"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-neutral-900 text-white font-bold py-3 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 text-sm shadow-md"
                            >
                                {isLoading ? 'Sending Reset Link...' : 'Send Password Reset Link'}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-neutral-100 text-center text-xs font-bold">
                            <a href="/portal/account/login" className="text-neutral-600 hover:text-black transition-colors">
                                &larr; Back to Login
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
