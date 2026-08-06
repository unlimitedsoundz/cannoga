'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { ChevronDownIcon as ChevronDown, ChevronRightIcon as ChevronRight } from '@hugeicons/core-free-icons';

interface NavItem {
  key?: string;
  label: string;
  href?: string;
  icon?: string;
  children?: NavItem[];
}

interface SISSidebarProps {
  items: NavItem[];
  pathname: string;
  open: boolean;
  onClose: () => void;
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + '/');
}

function NavItemComponent({ item, pathname, depth = 0 }: { item: NavItem; pathname: string; depth?: number }) {
  const hasChildren = item.children && item.children.length > 0;
  const active = item.href ? isActive(pathname, item.href) : false;
  const childActive = item.children?.some(c => isActive(pathname, c.href || '')) || false;
  const [expanded, setExpanded] = React.useState(childActive || active);

  return (
    <li key={item.href || item.label}>
      {hasChildren ? (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${depth === 0 ? 'text-xs font-bold uppercase tracking-widest' : 'text-xs'} ${active || childActive ? 'text-[#9c27b3] bg-[#faf5ff]' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}`}
            style={{ paddingLeft: depth === 0 ? '1rem' : `${1 + depth * 0.75}rem` }}
          >
            {expanded ? <HugeiconsIcon icon={ChevronDown} size={12} strokeWidth={2.5} /> : <HugeiconsIcon icon={ChevronRight} size={12} strokeWidth={2.5} />}
            <span className="truncate">{item.label}</span>
          </button>
          {expanded && item.children && (
            <ul className="mt-0.5">
              {item.children.map((child, idx) => (
                <NavItemComponent key={child.key || child.href || child.label || idx} item={child} pathname={pathname} depth={depth + 1} />
              ))}
            </ul>
          )}
        </>
      ) : (
        <Link
          href={item.href || '#'}
          className={`block px-3 py-1.5 text-left transition-colors ${depth === 0 ? 'text-xs font-bold uppercase tracking-widest' : 'text-xs'} ${active ? 'text-[#9c27b3] bg-[#faf5ff] font-bold' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}`}
          style={{ paddingLeft: depth === 0 ? '1rem' : `${1 + depth * 0.75}rem` }}
          onClick={() => {}}
        >
          {item.label}
        </Link>
      )}
    </li>
  );
}

export function SISSidebar({ items, pathname, open, onClose }: SISSidebarProps) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={`
        w-64 bg-white border-r border-neutral-200 flex-shrink-0 flex flex-col overflow-y-auto
        fixed lg:sticky top-14 bottom-0 z-30 transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <nav className="flex-1 py-4 px-2 space-y-1">
          <ul className="space-y-0.5">
            {items.map((item, idx) => (
              <NavItemComponent key={item.href || item.label || idx} item={item} pathname={pathname} depth={0} />
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-neutral-200">
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Institution</div>
          <div className="text-xs font-bold text-neutral-900">Cannoga College</div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Ottawa, Ontario</div>
          <div className="mt-3 pt-3 border-t border-neutral-100">
            <Link href="/" className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-600 no-underline">View Website</Link>
          </div>
        </div>
      </aside>
    </>
  );
}