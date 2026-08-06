'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon as Plus, Book01Icon as Book, Newspaper as News, HelpCircleIcon as Help, DollarSignIcon as Dollar, MegaphoneIcon as Megaphone, SchoolIcon as School } from '@hugeicons/core-free-icons';

export default function WebsiteDashboardPage() {
  const sections = [
    { label: 'Pages', href: '/sis/admin/website/pages', icon: Book, description: 'Manage website pages' },
    { label: 'Schools', href: '/sis/admin/website/schools', icon: School, description: 'Manage school listings' },
    { label: 'News', href: '/sis/admin/website/news', icon: News, description: 'Manage news articles' },
    { label: 'FAQs', href: '/sis/admin/website/faqs', icon: Help, description: 'Manage frequently asked questions' },
    { label: 'Tuition', href: '/sis/admin/website/tuition', icon: Dollar, description: 'Manage tuition information' },
    { label: 'Announcements', href: '/sis/admin/website/announcements', icon: Megaphone, description: 'Manage announcements' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Website CMS"
        subtitle="Manage public website content"
        actions={
          <Link href="/sis/admin/website/pages/new" className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors no-underline">
            <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> New Page
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="bg-white border border-neutral-200 p-6 hover:border-[#9c27b3] transition-colors no-underline block group"
          >
            <div className="flex items-center gap-3 mb-3">
              <HugeiconsIcon icon={section.icon} size={20} strokeWidth={2.5} className="text-[#9c27b3]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 group-hover:text-[#9c27b3] transition-colors">
                {section.label}
              </h3>
            </div>
            <p className="text-xs text-neutral-500">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}