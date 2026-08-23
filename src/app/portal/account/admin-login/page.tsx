'use client';

import React, { useState } from 'react';
import { Shield, Eye, EyeSlash } from '@phosphor-icons/react';
import { Button } from '@aalto-dx/react-components';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
                        <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-1.5 ml-0.5">
                            Work Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition-all text-sm text-neutral-900 placeholder-neutral-400"
                            placeholder="name@cannogacollege.ca"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-1.5 ml-0.5">
                            Administrative Password
                        </label>
                        <div className="relative flex items-center">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-4 pr-11 py-2.5 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition-all text-sm text-neutral-900 placeholder-neutral-400"
                                placeholder="••••••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 text-neutral-400 hover:text-neutral-900 transition-colors p-1"
                            >
                                {showPassword ? <EyeSlash size={18} weight="bold" /> : <Eye size={18} weight="bold" />}
                            </button>
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
                    <a href="/portal/account/login/" className="text-neutral-400 text-[10px] font-black uppercase tracking-widest hover:text-black text-center transition-colors block">
                        Student Portal Login
                    </a>
                </div>
            </div>
        </div>
    );
}
