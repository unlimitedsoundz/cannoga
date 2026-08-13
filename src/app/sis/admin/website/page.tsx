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
          <Link href="/sis/admin/website/pages/new" className="inline-flex items-center gap-2 px-4 py-2 bg-[#0a151a] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-purple-700 transition-colors no-underline">
            <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> New Page
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="bg-neutral-900 rounded-2xl p-6 hover:bg-neutral-800 transition-all no-underline block group shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-neutral-800 text-purple-400 rounded-xl group-hover:bg-[#0a151a] group-hover:text-white transition-colors">
                <HugeiconsIcon icon={section.icon} size={20} strokeWidth={2.5} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white group-hover:text-purple-300 transition-colors">
                {section.label}
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}