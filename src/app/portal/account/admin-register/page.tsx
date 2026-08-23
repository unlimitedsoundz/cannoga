'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from "@aalto-dx/react-components";
import { CheckCircle as CheckCircle2, ArrowRight, CircleNotch as Loader2, ShieldCheck, Eye, EyeSlash } from "@phosphor-icons/react/dist/ssr";
import { registerAdmin } from '../actions';
import DateSelector from '@/components/ui/DateSelector';

export default function AdminRegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ status: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const result = await registerAdmin(formData);

            if (result.error) {
                throw new Error(result.error);
            }

            setMessage({
                status: 'success',
                text: result.message || 'Admin account created successfully!'
            });
        } catch (error: any) {
            setMessage({
                status: 'error',
                text: error.message || 'Failed to create admin account.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (message?.status === 'success') {
        return (
            <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
                    <ShieldCheck size={32} weight="bold" />
                </div>

                <div className="space-y-1">
                    <h1 className="text-2xl font-black uppercase tracking-tight">Admin Created</h1>
                    <p className="text-xs text-neutral-500 font-medium">{message.text}</p>
                </div>

                <div className="space-y-4">
                    <Link
                        href="/portal/account/login/"
                        className="w-full bg-neutral-900 text-white font-bold py-3.5 rounded-xl hover:bg-[#0a151a] transition-all flex items-center justify-center gap-2"
                    >
                        Go to Login <ArrowRight size={16} weight="bold" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-white">
                    <ShieldCheck size={20} weight="bold" />
                </div>
                <div>
                    <h1 className="text-xl font-bold leading-tight">Admin Registration</h1>
                    <p className="text-neutral-500 text-xs">Create a new administrative account</p>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg mb-6 text-xs font-bold uppercase tracking-widest border ${message.status === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-neutral-50 text-neutral-900 border-neutral-100'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm outline-none focus:border-[#0a151a] transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm outline-none focus:border-[#0a151a] transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm outline-none focus:border-[#0a151a] transition-all"
                        placeholder="admin@cannogacollege.ca"
                    />
                </div>

                <DateSelector
                    name="dateOfBirth"
                    label="Date of Birth"
                    required
                    value={formData.dateOfBirth}
                    onChange={(name, value) => setFormData({ ...formData, [name]: value })}
                />

                <div className="relative">
                    <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-neutral-50 border border-neutral-100 rounded-xl pl-4 pr-12 py-2.5 text-sm font-bold shadow-sm outline-none focus:border-[#0a151a] transition-all"
                            placeholder="Minimum 6 characters"
                            minLength={6}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                        >
                            {showPassword ? <EyeSlash size={20} weight="bold" /> : <Eye size={20} weight="bold" />}
                        </button>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-neutral-900 text-white font-bold py-3.5 rounded-xl hover:bg-[#0a151a] transition-all flex items-center justify-center gap-2 shadow-lg shadow-neutral-200"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} weight="bold" /> : 'Register Admin Account'}
                    </button>
                    <p className="text-[10px] text-neutral-400 mt-4 text-center font-bold uppercase tracking-widest">
                        Administrative Access Only
                    </p>
                </div>
            </form>

            <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
                <p className="text-neutral-500 text-sm">
                    Already have an account?{' '}
                    <Link href="/portal/account/login/" className="text-black font-bold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

