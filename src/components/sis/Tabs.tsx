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
    <div className="border-b border-white/10 mb-6">
      <div className="flex gap-1 overflow-x-auto no-scrollbar">
        {tabs.map(tab => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors no-underline whitespace-nowrap ${
                isActive
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-white hover:border-white/20'
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