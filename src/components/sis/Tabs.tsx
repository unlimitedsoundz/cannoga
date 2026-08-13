'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Tab {
  label: string;
  href: string;
}

interface TabsProps {
  tabs: Tab[];
}

export function Tabs({ tabs }: TabsProps) {
  const pathname = usePathname();

  return (
    <div className="border-b border-neutral-200 mb-6">
      <div className="flex gap-0">
        {tabs.map(tab => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors no-underline ${
                isActive
                  ? 'border-[#0a151a] text-[#0a151a]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}