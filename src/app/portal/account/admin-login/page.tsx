'use client';

import React, { useState } from 'react';
import { Shield, Envelope, Lock } from '@phosphor-icons/react';
import { Button } from '@aalto-dx/react-components';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

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

            if (!response.ok) {
                const text = await response.text();
                setError('Login failed. Please try again.');
                console.error('Login error:', text);
                setIsLoading(false);
                return;
            }

            const data = await response.json();
            const targetPath = data.redirect || '/sis/admin';

            toast.success('Login successful');
            window.location.href = targetPath;
        } catch (error: any) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Admin login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <Toaster position="top-right" />
            <div className="w-full max-w-md">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-neutral-900 rounded-lg flex items-center justify-center text-white">
                        <Shield size={24} weight="bold" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold leading-tight text-neutral-900">Admin Login</h1>
                        <p className="text-neutral-500 text-xs font-medium uppercase tracking-wider">Cannoga College SIS</p>
                    </div>
                </div>

                <div className="bg-neutral-50 border border-neutral-200 p-4 mb-8">
                    <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                        Restricted to administrative personnel only. Unauthorized access is prohibited and logged.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg mb-6 text-xs text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-black uppercase text-neutral-400 mb-2 ml-1">Work Email Address</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                                <Envelope size={18} weight="bold" />
                            </span>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition-all text-sm"
                                placeholder="name@cannogacollege.ca"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase text-neutral-400 mb-2 ml-1">Administrative Password</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                                <Lock size={18} weight="bold" />
                            </span>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition-all text-sm"
                                placeholder="••••••••••••"
                            />
                        </div>
                    </div>

                    <Button
                        type="primary"
                        htmlType="submit"
                        label={isLoading ? 'Authenticating...' : 'Authenticate Access'}
                        isLoading={isLoading}
                        className="w-full !bg-neutral-900 !border-neutral-900 hover:!bg-neutral-800"
                    />
                </form>

                <div className="mt-8 pt-6 border-t border-neutral-100">
                    <a href="/portal/account/login" className="text-neutral-400 text-[10px] font-black uppercase tracking-widest hover:text-black text-center transition-colors block">
                        Student Portal Login
                    </a>
                </div>
            </div>
        </div>
    );
}
