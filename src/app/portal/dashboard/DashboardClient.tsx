'use client';

import React, { useState, useEffect } from 'react';
import { Hero } from '@/components/layout/Hero';
import { Link } from "@aalto-dx/react-components";
import { Button } from "@aalto-dx/react-components";
import { HugeiconsIcon } from '@hugeicons/react';
import { File01Icon as DocumentIcon } from '@hugeicons/core-free-icons';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function DashboardClient() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const redirectToApplication = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.push('/portal/account/login/');
                    return;
                }

                const { data: application } = await supabase
                    .from('applications')
                    .select('id')
                    .eq('user_id', user.id)
                    .single();

                if (application) {
                    router.push(`/portal/application/view/?id=${application.id}`);
                } else {
                    router.push('/portal/apply/');
                }
            } catch (err) {
                console.error('Failed to load application:', err);
                setLoading(false);
            }
        };

        redirectToApplication();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <Hero
                title="Student Application Portal"
                body="Track your application status and complete your enrollment process at Cannoga College."
                backgroundColor="#000000"
                tinted
                lightText={true}
                image={{ src: '/images/international-students-hero.png', alt: 'Cannoga students' }}
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Portal', href: '/portal' }]}
            />

            <div className="cc-container max-w-3xl mx-auto py-10">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 text-[#2d2d2d]">
                    <h1 className="text-2xl font-bold mb-6 text-neutral-900">Your Application Portal</h1>
                    <p className="text-neutral-600 mb-8">Your account is ready! Check your application status below.</p>

                    <div className="space-y-4">
                        <Link href="/portal/apply/" className="block">
                            <Button
                                type="primary"
                                htmlType="button"
                                label="Start Application"
                                className="w-full justify-start"
                                icon={<HugeiconsIcon icon={DocumentIcon} size={20} />}
                            />
                        </Link>
                    </div>

                    <div className="mt-8 pt-4 border-t border-neutral-100 text-center">
                        <p className="text-sm text-neutral-500">
                            Having trouble accessing your application?{' '}
                            <a href="/portal/account/login/" className="text-black font-bold hover:underline">
                                Sign in again
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
