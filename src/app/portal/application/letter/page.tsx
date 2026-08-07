'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface ApplicationData {
    id: string;
    status: string;
    course?: {
        title: string;
        degreeLevel?: string;
        school?: {
            name: string;
        };
    };
    user?: {
        first_name: string;
        last_name: string;
        email: string;
    };
}

export default function AdmissionLetterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [application, setApplication] = useState<ApplicationData | null>(null);
    const supabase = createClient();

    useEffect(() => {
        if (!id) {
            router.push('/portal/dashboard');
            return;
        }

        const fetchData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/portal/account/login');
                    return;
                }

                const { data, error } = await supabase
                    .from('applications')
                    .select(`
                        id,
                        status,
                        course:Course(title, degreeLevel, school:School(name)),
                        user:profiles(first_name, last_name, email)
                    `)
                    .eq('id', id)
                    .eq('user_id', user.id)
                    .single();

                if (error || !data) {
                    setError('Application not found');
                    setLoading(false);
                    return;
                }

                setApplication((data as unknown) as ApplicationData);
            } catch (err) {
                console.error('Error fetching application:', err);
                setError('Failed to load application');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, router, supabase]);

    const formatDegreeLevel = (level: string) => {
        if (!level) return '';
        return level.charAt(0) + level.slice(1).toLowerCase();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-red-600 font-medium mb-4">{error || 'Application not found'}</p>
                    <button onClick={() => router.push('/portal/dashboard')} className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded hover:bg-neutral-800">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const programName = application.course?.title
        ? `${application.course.title} — ${formatDegreeLevel(application.course.degreeLevel || '')}`
        : 'Your Program';

    return (
        <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6 sm:p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Letter of Acceptance</h1>
                        <p className="text-sm text-neutral-600">
                            {programName}
                        </p>
                    </div>

                    <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Application Details</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-neutral-600">Student</span>
                            <span className="font-medium text-neutral-900">
                                {application.user?.first_name} {application.user?.last_name}
                            </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-600">Program</span>
                                <span className="font-medium text-neutral-900">{programName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-600">Status</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    application.status === 'ADMITTED' || application.status === 'OFFER_ACCEPTED'
                                        ? 'bg-green-50 text-green-700'
                                        : 'bg-neutral-100 text-neutral-700'
                                }`}>
                                    {application.status}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-600">School</span>
                                <span className="font-medium text-neutral-900">{application.course?.school?.name || '—'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href={`/api/portal/letter/pdf?id=${application.id}`}
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            View Offer
                        </a>
                        <button
                            onClick={() => router.back()}
                            className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
