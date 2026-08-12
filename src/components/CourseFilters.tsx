
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function CourseFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === 'all') {
                params.delete(name);
            } else {
                params.set(name, value);
            }
            return params.toString();
        },
        [searchParams]
    );

    const currentDegree = searchParams.get('degree') || 'all';

    return (
        <div className="mb-8 p-4 bg-white rounded-lg border border-neutral-200">
            <div className="flex flex-wrap gap-4 items-center">
                <span className="font-semibold text-neutral-700">Filter by Degree:</span>
                <div className="flex gap-2">
                    {[
                        { label: 'All', value: 'all' },
                        { label: 'Bachelor', value: 'BACHELOR' },
                        { label: 'Master', value: 'MASTER' },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => router.push(`?${createQueryString('degree', opt.value)}`, { scroll: false })}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentDegree === opt.value
                                    ? 'bg-neutral-600 text-white'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
