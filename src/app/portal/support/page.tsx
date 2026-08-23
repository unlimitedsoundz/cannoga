'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Link } from "@aalto-dx/react-components";
import {
    CaretLeft as ArrowLeft,
    Envelope as Mail,
    Phone,
    ChatTeardropText as MessageSquare,
    Clock,
    ShieldCheck,
    Key,
    BookOpen,
    Question as HelpCircle,
    Desktop as Laptop,
    WarningCircle as AlertCircle
} from "@phosphor-icons/react";

export default function SupportPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.replace('/portal/account/login/');
                return;
            }
            setLoading(false);
        };
        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900" />
            </div>
        );
    }

    const supportChannels = [
        {
            icon: <Mail className="text-black" size={24} weight="bold" />,
            title: "Email Support",
            value: "it.support@cannogacollege.ca",
            desc: "Primary channel for all technical inquiries.",
            link: "mailto:it.support@cannogacollege.ca"
        },
        {
            icon: <Phone className="text-black" size={24} weight="bold" />,
            title: "IT Helpdesk",
            value: "+358 09 42721884",
            desc: "Available for urgent access issues.",
            link: "tel:+3580942721884"
        },
        {
            icon: <MessageSquare className="text-black" size={24} weight="bold" />,
            title: "Live Chat",
            value: "Portal Chat",
            desc: "Logged-in students only (Mon-Fri 9:00-16:00).",
            link: "#"
        }
    ];

    const commonGuides = [
        {
            icon: <Key size={20} weight="bold" />,
            title: "Password Reset",
            desc: "Reset your institutional email and LMS password using your recovery phone number."
        },
        {
            icon: <BookOpen size={20} weight="bold" />,
            title: "LMS Troubleshooting",
            desc: "Guide for clearing browser cache and resolving common Canvas login errors."
        },
        {
            icon: <Laptop size={20} weight="bold" />,
            title: "Software Access",
            desc: "How to download and activate student-licensed software like Office 365."
        }
    ];

    return (
        <div className="min-h-screen bg-neutral-50/50 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/portal/dashboard/"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-black transition-colors"
                    >
                        <ArrowLeft size={14} weight="bold" /> Back to Dashboard
                    </Link>
                </div>

                <div className="space-y-12">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter mb-1">IT Support Center</h1>
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                            Technical Assistance & Digital Resources
                        </p>
                    </div>

                    {/* Support Channels Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {supportChannels.map((channel, i) => (
                            <a
                                key={i}
                                href={channel.link}
                                className="bg-card border-2 border-[#0a151a] p-8 rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group"
                            >
                                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-6 border border-neutral-200 group-hover:bg-[#0a151a] group-hover:text-white transition-colors">
                                    {channel.icon}
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest mb-1">{channel.title}</h3>
                                <p className="text-lg font-bold text-black mb-2">{channel.value}</p>
                                <p className="text-xs text-neutral-500 leading-relaxed">
                                    {channel.desc}
                                </p>
                            </a>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* FAQs & Guides */}
                        <div className="lg:col-span-2 space-y-8">
                            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                                <HelpCircle size={24} weight="bold" /> Knowledge Base & Guides
                            </h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                {commonGuides.map((guide, i) => (
                                    <div key={i} className="bg-card border border-neutral-200 p-6 rounded-sm hover:border-[#0a151a] transition-colors">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="text-black">
                                                {guide.icon}
                                            </div>
                                            <h4 className="font-bold text-sm uppercase tracking-wide">{guide.title}</h4>
                                        </div>
                                        <p className="text-sm text-neutral-600 leading-relaxed">
                                            {guide.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-neutral-100 p-8 rounded-sm">
                                <h3 className="text-lg font-black uppercase mb-4">
                                    Security Tip
                                </h3>
                                <p className="text-neutral-600 text-sm leading-relaxed">
                                    Cannoga College IT department will never ask for your password via email or phone. Always use official login portals to access your accounts.
                                </p>
                            </div>
                        </div>

                        {/* Sidebar: Service Status */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-tight">Service Status</h2>

                            <div className="bg-card border border-neutral-200 rounded-sm divide-y divide-neutral-100">
                                {[
                                    { name: "Canvas LMS", status: "Operational", color: "bg-green-500" },
                                    { name: "Student Email (Outlook)", status: "Operational", color: "bg-green-500" },
                                    { name: "Portal API", status: "Operational", color: "bg-green-500" },
                                    { name: "Library VPN", status: "Operational", color: "bg-green-500" },
                                ].map((service, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-600">{service.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${service.color}`} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{service.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-neutral-100 p-6 rounded-sm">
                                <h4 className="text-xs font-black uppercase text-neutral-900 mb-2">Scheduled Maintenance</h4>
                                <p className="text-xs text-neutral-600 leading-relaxed">
                                    LMS provisioning may experience delays on Sunday, Feb 15th due to infrastructure updates.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

