'use client';

import React from 'react';
import { Hero } from '@/components/layout/Hero';
import { Link } from "@aalto-dx/react-components";
import { Button } from "@aalto-dx/react-components";
import { HugeiconsIcon } from '@hugeicons/react';
import { File01Icon as DocumentIcon } from '@hugeicons/core-free-icons';

export default function DashboardClient() {
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
                        <Link href="/portal/view" className="block">
                            <Button
                                type="primary"
                                htmlType="button"
                                label="View Application"
                                className="w-full justify-start"
                                icon={<HugeiconsIcon icon={DocumentIcon} size={20} />}
                            />
                        </Link>
                    </div>

                    <div className="mt-8 pt-4 border-t border-neutral-100 text-center">
                        <p className="text-sm text-neutral-500">
                            Having trouble accessing your application?{' '}
                            <a href="/portal/account/login" className="text-black font-bold hover:underline">
                                Sign in again
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}