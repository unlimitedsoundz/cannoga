'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Link } from "@aalto-dx/react-components";
import { CaretLeft as ArrowLeft, ArrowSquareOut as ExternalLink, BookOpen } from "@phosphor-icons/react/dist/ssr";
import { formatToDDMMYYYY } from '@/utils/date';

export default function LmsPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{
        student: any;
        lmsAccess: any;
    } | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchLmsData = async () => {
            try {
                // 1. Primary Auth Check (Supabase)
                const { data: { user: sbUser } } = await supabase.auth.getUser();
                let currentUserEmail = sbUser?.email;
                let currentUserId = sbUser?.id;

                // 2. Secondary Auth Check (LocalStorage Fallback)
                if (!sbUser) {
                    const savedUser = localStorage.getItem('Cannoga_user');
                    if (savedUser) {
                        const localProfile = JSON.parse(savedUser);
                        currentUserEmail = localProfile.email;
                        currentUserId = localProfile.id;
                    }
                }

                if (!currentUserEmail) {
                    router.push('/portal/account/login/');
                    return;
                }

                const { data: student } = await supabase
                    .from('students')
                    .select('id, student_id, institutional_email')
                    .eq('user_id', currentUserId || '')
                    .single();

                let lmsAccess = null;
                if (student) {
                    const { data: itAccess } = await supabase
                        .from('student_it_access')
                        .select('*, asset:it_assets(*)')
                        .eq('student_id', student.id)
                        .eq('asset.asset_type', 'LMS')
                        .eq('status', 'ACTIVE')
                        .single();

                    lmsAccess = itAccess;
                }

                setData({ student, lmsAccess });
            } catch (err) {
                console.error('CRITICAL: Fetching LMS data failed', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLmsData();
    }, [router, supabase]);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
            </div>
        );
    }

    if (!data) return null;

    const { student, lmsAccess } = data;

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

                <div className="space-y-8">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter mb-1">Learning Management System</h1>
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                            Canvas LMS Access
                        </p>
                    </div>

                    {!student ? (
                        <div className="bg-amber-50 border-2 border-amber-200 p-12 rounded-sm text-center">
                            <BookOpen size={48} weight="bold" className="mx-auto text-amber-400 mb-4" />
                            <h2 className="text-xl font-black uppercase mb-2">Student Record Required</h2>
                            <p className="text-sm text-amber-800">
                                LMS access is only available to enrolled students. Please complete your enrollment first.
                            </p>
                        </div>
                    ) : lmsAccess ? (
                        <div className="bg-card border-2 border-[#0a151a] p-8 rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-[#0a151a] text-white rounded-sm flex items-center justify-center">
                                        <BookOpen size={32} weight="bold" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black uppercase">Canvas LMS</h2>
                                        <p className="text-[10px] font-bold text-green-600 uppercase mt-1">Active</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-neutral-600 mb-6">
                                Your Canvas Learning Management System account has been provisioned. Access your courses, assignments, grades, and course materials.
                            </p>

                            <div className="bg-neutral-50 p-6 rounded-sm border border-neutral-200 mb-6">
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">Credentials</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold uppercase text-sm text-neutral-500">Username</span>
                                        <span className="font-mono font-medium text-sm">{lmsAccess.credentials?.username || student.institutional_email}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold uppercase text-sm text-neutral-500">Password</span>
                                        <span className="font-mono font-medium text-sm">{lmsAccess.credentials?.password || '••••••••'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold uppercase text-sm text-neutral-500">Status</span>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[8px] font-black uppercase">
                                            {lmsAccess.status}
                                        </span>
                                    </div>
                                    {lmsAccess.expires_at && (
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold uppercase text-sm text-neutral-500">Expires</span>
                                            <span className="text-sm">{formatToDDMMYYYY(lmsAccess.expires_at)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <a
                                href={lmsAccess.asset?.access_url || "https://canvas.instructure.com"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0a151a] text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all"
                            >
                                <ExternalLink size={14} weight="bold" /> Launch Canvas LMS
                            </a>
                        </div>
                    ) : (
                        <div className="bg-card border-2 border-[#0a151a] p-12 rounded-sm text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <BookOpen size={48} weight="bold" className="mx-auto text-neutral-900 mb-6" />
                            <h2 className="text-xl font-black uppercase mb-2">LMS Not Provisioned</h2>
                            <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                                Your LMS account is being set up by the IT department. Please check back later or contact <Link href="/portal/support/" className="text-black underline font-bold">IT Support</Link> if this persists.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

