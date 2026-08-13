'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Breadcrumbs({ pathname }: { pathname: string }) {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0 || segments[0] === 'sis') {
    return null;
  }

  const labels: Record<string, string> = {
    sis: 'SIS',
    students: 'Students',
    admin: 'Administration',
    courses: 'Courses',
    registration: 'Registration',
    grades: 'Grades',
    notifications: 'Notifications',
    settings: 'Settings',
    academic: 'Academic Record',
    finance: 'Finance',
    documents: 'Documents',
  };

  let href = '';

  return (
    <nav className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider mb-4" aria-label="Breadcrumb">
      <Link href="/sis" className="text-neutral-500 hover:text-[#0a151a] no-underline transition-colors">SIS</Link>
      {segments.map((segment, idx) => {
        href += `/${segment}`;
        const isLast = idx === segments.length - 1;
        const label = labels[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

        if (isLast) {
          return (
            <React.Fragment key={href}>
              <span className="text-neutral-400 mx-1">/</span>
              <span className="text-neutral-900" aria-current="page">{label}</span>
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={href}>
            <span className="text-neutral-400 mx-1">/</span>
            <Link href={href} className="text-neutral-500 hover:text-[#0a151a] no-underline transition-colors">{label}</Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
}