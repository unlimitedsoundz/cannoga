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

            const url = new URL(response.url);
            const targetPath = url.pathname + url.search;

            toast.success('Login successful');
            router.replace(targetPath);
        } catch (error: any) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Admin login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-neutral-900 text-white text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                Admin Access
            </div>

            <div className="flex items-center gap-3 mb-6 mt-2">
                <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-neutral-200">
                    <Shield size={24} weight="bold" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold leading-tight">Admin Login</h1>
                    <p className="text-neutral-500 text-xs font-medium uppercase tracking-wider">Cannoga College SIS</p>
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl mb-8 flex items-start gap-3">
                <div className="text-amber-600 mt-0.5">
                    <Shield size={16} weight="bold" />
                </div>
                <p className="text-[11px] text-amber-800 font-bold uppercase leading-relaxed">
                    Administrative Personnel Only. Unauthorized access is strictly prohibited and logged.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 p-3 rounded-lg mb-6 text-xs text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
                <div>
                    <label className="block text-[10px] font-black uppercase text-neutral-400 mb-2 ml-1">Work Email Address</label>
                    <div className="relative">
                        <Envelope size={20} weight="bold" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition-all font-bold text-sm"
                            placeholder="name@cannogacollege.ca"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase text-neutral-400 mb-2 ml-1">Administrative Password</label>
                    <div className="relative">
                        <Lock size={20} weight="bold" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition-all font-bold text-sm"
                            placeholder="••••••••••••"
                        />
                    </div>
                </div>

                <Button
                    type="primary"
                    htmlType="submit"
                    label={isLoading ? 'Authenticating...' : 'Authenticate Access'}
                    isLoading={isLoading}
                    className="w-full"
                />
            </form>

            <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col gap-4">
                <a href="/portal/account/login" className="text-neutral-400 text-[10px] font-black uppercase tracking-widest hover:text-black text-center transition-colors">
                    Student Portal Login
                </a>
            </div>
        </div>
    );
}