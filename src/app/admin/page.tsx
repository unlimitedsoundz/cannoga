'use client';

import {
    BookOpen,
    Newspaper,
    Users,
    Calendar,
    Clock,
    ArrowRight,
    Buildings as SchoolIcon,
    FileText,
    House as Home,
    CircleNotch as Loader2,
    XCircle
} from "@phosphor-icons/react";
import { useState, useEffect } from 'react';
import { Link } from "@aalto-dx/react-components";
import { getAdminDashboardStats } from './actions';

export default function AdminPage() {
    const [stats, setStats] = useState<any[]>([]);
    const [pendingApps, setPendingApps] = useState<any[]>([]);
    const [appsCount, setAppsCount] = useState(0);
    const [statusCounts, setStatusCounts] = useState({
        SUBMITTED: 0,
        UNDER_REVIEW: 0,
        ADMITTED: 0,
        REJECTED: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAdminDashboardStats();

                if (!result.success) {
                    throw new Error(result.error);
                }

                setStats(result.stats || []);
                setPendingApps(result.apps || []);
                setAppsCount(result.appsCount || 0);
                setStatusCounts(result.statusCounts || {
                    SUBMITTED: 0,
                    UNDER_REVIEW: 0,
                    ADMITTED: 0,
                    REJECTED: 0,
                });
            } catch (err: any) {
                console.error("Error fetching dashboard data:", err);
                setError(err.message || "Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
    if (error) {
        return (
            <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-center">
                <XCircle size={40} className="text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-red-900 uppercase">Fetch Error</h3>
                <p className="text-red-600 font-medium text-sm mt-1">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all"
                >
                    Retry Fetch
                </button>
            </div>
        );
    }

    return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    return (
        <div className="space-y-8 md:space-y-10 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">System Overview</h1>
                <p className="text-neutral-500 mt-2">Welcome back. Here's what's happening at Cannoga College.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Link key={stat.label} href={stat.href} className="bg-card p-6 rounded-2xl border border-neutral-200 hover:border-[#0a151a] transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                                <stat.icon size={24} weight="bold" />
                            </div>
                            <span className="text-2xl font-black text-neutral-900">{stat.count || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-500 font-bold uppercase text-xs tracking-widest">{stat.label}</span>
                            <ArrowRight size={14} weight="bold" className="text-neutral-300 group-hover:text-black transform group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Applications */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Clock size={20} weight="bold" className="text-amber-500" /> Recent Applications
                        </h2>
<Link href="/sis/admin/admissions" className="text-xs font-bold 
text-neutral-400 hover:text-black transition-colors uppercase tracking-widest">
                            View All →
                        </Link>
                    </div>

                    <div className="bg-card border border-neutral-200 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[500px]">
                                <thead className="bg-neutral-50 border-b border-neutral-100">
                                    <tr>
                                        <th className="p-4 text-xs font-bold text-neutral-400 uppercase">Student</th>
                                        <th className="p-4 text-xs font-bold text-neutral-400 uppercase">Applied For</th>
                                        <th className="p-4 text-xs font-bold text-neutral-400 uppercase text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-50">
                                    {pendingApps && pendingApps.length > 0 ? (
                                        (pendingApps as any[]).map((a) => (
                                            <tr key={a.id} className="hover:bg-neutral-50 transition-colors">
                                                <td className="p-4">
                                                    <div>
                                                        <div className="font-bold text-neutral-900 leading-none mb-1">
                                                            {a.user?.first_name} {a.user?.last_name || a.user?.email?.split('@')[0]}
                                                        </div>
                                                        <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none">{a.user?.email}</div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-neutral-600">{a.course?.title}</td>
                                                <td className="p-4 text-right">
                                                    <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded text-[10px] font-bold uppercase tracking-tight">
                                                        {a.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="p-8 text-center text-neutral-400">No recent applications</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Status Breakdown Card */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold">Admissions Pipeline</h2>
                    <div className="bg-neutral-900 p-8 rounded-3xl text-white relative overflow-hidden group">
                        <Users className="absolute -right-4 -bottom-4 text-white/5 w-40 h-40 transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" weight="fill" />

                        <div className="space-y-6 relative z-10">
                            <div>
                                <div className="text-4xl font-black mb-1">{appsCount || 0}</div>
                                <div className="text-neutral-400 text-xs font-bold uppercase tracking-widest">Total Applications</div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                                        <div className="w-2 h-2 rounded-full bg-blue-400" /> Submitted
                                    </div>
                                    <div className="font-bold">{statusCounts.SUBMITTED}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                                        <div className="w-2 h-2 rounded-full bg-amber-400" /> Under Review
                                    </div>
                                    <div className="font-bold">{statusCounts.UNDER_REVIEW}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                                        <div className="w-2 h-2 rounded-full bg-neutral-400" /> Admitted
                                    </div>
                                    <div className="font-bold">{statusCounts.ADMITTED}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                                        <div className="w-2 h-2 rounded-full bg-red-400" /> Rejected
                                    </div>
                                    <div className="font-bold">{statusCounts.REJECTED}</div>
                                </div>
                            </div>
                        </div>
                    </div>

<Link href="/sis/admin/admissions" className="block p-4 bg-card border 
border-neutral-200 rounded-2xl text-center font-bold text-sm hover:bg-neutral-50 transition-colors">
                        Manage All Admissions
                    </Link>
                </div>
            </div>
        </div>
    );
}

