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

function NavItemComponent({ item, pathname, depth = 0, isDark = false }: { item: NavItem; pathname: string; depth?: number; isDark?: boolean }) {
  const hasChildren = item.children && item.children.length > 0;
  const active = item.href ? isActive(pathname, item.href) : false;
  const childActive = item.children?.some(c => isActive(pathname, c.href || '')) || false;
  const [expanded, setExpanded] = React.useState(childActive || active);

  if (isDark) {
    return (
      <li key={item.href || item.label}>
        {hasChildren ? (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${depth === 0 ? 'text-[10px] font-bold uppercase tracking-widest' : 'text-xs'} ${active || childActive ? 'text-white font-bold' : 'text-neutral-300 hover:text-white'}`}
              style={{ paddingLeft: depth === 0 ? '0.75rem' : `${0.75 + depth * 0.75}rem` }}
            >
              {expanded
                ? <HugeiconsIcon icon={ChevronDown} size={11} strokeWidth={2.5} className="text-white" />
                : <HugeiconsIcon icon={ChevronRight} size={11} strokeWidth={2.5} className="text-white" />
              }
              <span className="truncate text-white">{item.label}</span>
            </button>
            {expanded && item.children && (
              <ul className="mt-0.5 space-y-0.5">
                {item.children.map((child, idx) => (
                  <NavItemComponent key={child.key || child.href || child.label || idx} item={child} pathname={pathname} depth={depth + 1} isDark={isDark} />
                ))}
              </ul>
            )}
          </>
        ) : (
          <Link
            href={item.href || '#'}
            className={`flex items-center gap-2 px-3 py-2 text-left transition-colors ${depth === 0 ? 'text-[10px] font-bold uppercase tracking-widest' : 'text-xs font-medium'} ${active ? 'text-white font-bold' : 'text-neutral-300 hover:text-white'} no-underline`}
            style={{ paddingLeft: depth === 0 ? '0.75rem' : `${0.75 + depth * 0.75}rem` }}
          >
            <span className="truncate text-white">{item.label}</span>
          </Link>
        )}
      </li>
    );
  }

  // Light (student) variant
  return (
    <li key={item.href || item.label}>
      {hasChildren ? (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${depth === 0 ? 'text-xs font-bold uppercase tracking-widest' : 'text-xs'} ${active || childActive ? 'text-white font-bold' : 'text-white/80 hover:text-white'}`}
            style={{ paddingLeft: depth === 0 ? '1rem' : `${1 + depth * 0.75}rem` }}
          >
            {expanded ? <HugeiconsIcon icon={ChevronDown} size={12} strokeWidth={2.5} className="text-white" /> : <HugeiconsIcon icon={ChevronRight} size={12} strokeWidth={2.5} className="text-white" />}
            <span className="truncate text-white">{item.label}</span>
          </button>
          {expanded && item.children && (
            <ul className="mt-0.5">
              {item.children.map((child, idx) => (
                <NavItemComponent key={child.key || child.href || child.label || idx} item={child} pathname={pathname} depth={depth + 1} isDark={isDark} />
              ))}
            </ul>
          )}
        </>
      ) : (
        <Link
          href={item.href || '#'}
          className={`block px-3 py-1.5 text-left transition-colors ${depth === 0 ? 'text-xs font-bold uppercase tracking-widest' : 'text-xs'} ${active ? 'text-white font-bold' : 'text-white/80 hover:text-white'}`}
          style={{ paddingLeft: depth === 0 ? '1rem' : `${1 + depth * 0.75}rem` }}
        >
          <span className="text-white">{item.label}</span>
        </Link>
      )}
    </li>
  );
}

export function SISSidebar({ items, pathname, open, onClose }: SISSidebarProps) {
  const isDark = pathname?.startsWith('/sis/admin');

  if (isDark) {
    return (
      <>
        {open && (
          <div 
            className="fixed inset-0 bg-black/70 z-50 lg:hidden backdrop-blur-sm transition-opacity" 
            onClick={onClose} 
            aria-hidden="true"
          />
        )}
        <aside className={`
          w-64 bg-[#0a151a] border-r border-white/10 flex-shrink-0 flex flex-col
          fixed inset-y-0 left-0 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] z-50 lg:z-30 transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-14 px-4 flex items-center justify-between border-b border-white/10 lg:hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Navigation Menu</span>
            <button 
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto overscroll-contain no-scrollbar">
            <ul className="space-y-0.5">
              {items.map((item, idx) => (
                <div key={item.key || `${item.label}-${item.href || ''}-${idx}`} onClick={() => { if (open && !item.children) onClose(); }}>
                  <NavItemComponent item={item} pathname={pathname} depth={0} isDark={true} />
                </div>
              ))}
            </ul>
          </nav>
        </aside>
      </>
    );
  }

  // Light (student) sidebar
  return (
    <>
      {open && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 lg:hidden backdrop-blur-sm transition-opacity" 
          onClick={onClose} 
          aria-hidden="true"
        />
      )}
      <aside className={`
        sis-sidebar w-64 bg-white border-r border-neutral-200 flex-shrink-0 flex flex-col
        fixed inset-y-0 left-0 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] z-50 lg:z-30 transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-14 px-4 flex items-center justify-between border-b border-neutral-200 lg:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Navigation Menu</span>
          <button 
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-black rounded-md hover:bg-neutral-100 transition-colors"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overscroll-contain">
          <ul className="space-y-0.5">
            {items.map((item, idx) => (
              <div key={item.key || `${item.label}-${item.href || ''}-${idx}`} onClick={() => { if (open && !item.children) onClose(); }}>
                <NavItemComponent item={item} pathname={pathname} depth={0} isDark={false} />
              </div>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}