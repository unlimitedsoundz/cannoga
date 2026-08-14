const fs = require('fs');
const base = '/d/cannogauniversity';

function writeFile(relPath, content) {
  const full = base + '/' + relPath;
  const dir = full.substring(0, full.lastIndexOf('/'));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(full, content);
  console.log('Created:', relPath);
}

writeFile('src/app/sis/layout.tsx', `'use client';

import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import { SISHeader } from '@/components/sis/SISHeader';
import { SISSidebar } from '@/components/sis/SISSidebar';
import { Breadcrumbs } from '@/components/sis/Breadcrumbs';

export default function SISLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: 'DASHBOARD', href: '/sis' },
    {
      label: 'STUDENTS',
      children: [
        { label: 'Student Records', href: '/sis/students' },
        { label: 'Admissions', href: '/sis/admin/students' },
      ],
    },
    {
      label: 'ACADEMICS',
      children: [
        { label: 'Academic Records', href: '/sis/students/academic-record' },
        { label: 'Grades', href: '/sis/grades' },
        { label: 'Course Search', href: '/sis/courses' },
        { label: 'Class Schedule', href: '/sis/registration' },
      ],
    },
    {
      label: 'REGISTRATION',
      children: [
        { label: 'Registration', href: '/sis/registration' },
      ],
    },
    {
      label: 'FINANCE',
      children: [
        { label: 'Account Summary', href: '/sis/students/finance' },
        { label: 'Invoices', href: '/sis/students/finance' },
        { label: 'Payments', href: '/sis/students/finance' },
      ],
    },
    {
      label: 'ADMISSIONS',
      children: [
        { label: 'Applications', href: '/sis/admin/students' },
        { label: 'Documents', href: '/sis/students/documents' },
      ],
    },
    {
      label: 'STUDENT SERVICES',
      children: [
        { label: 'Advising', href: '/sis/settings' },
        { label: 'Requests', href: '/sis/settings' },
        { label: 'Notifications', href: '/sis/notifications' },
      ],
    },
    { label: 'SETTINGS', href: '/sis/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-black flex flex-col">
      <SISHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <SISSidebar
          items={navItems}
          pathname={pathname}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
            <Breadcrumbs pathname={pathname} />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
`);

writeFile('src/components/sis/SISHeader.tsx', `'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { MagnifyingGlass as SearchIcon, Bell, Envelope, HelpCircle, User, ChevronDown, Menu } from '@phosphor-icons/react/dist/ssr';

interface SISHeaderProps {
  onMenuToggle: () => void;
}

export function SISHeader({ onMenuToggle }: SISHeaderProps) {
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Tuition invoice generated', description: 'Fall 2026 invoice is now available for viewing.', time: '2 hours ago', priority: 'normal', read: false },
    { id: 2, title: 'Registration window open', description: 'Your Fall 2026 registration window is now open.', time: '1 day ago', priority: 'normal', read: false },
    { id: 3, title: 'Additional documentation required', description: 'Admission documentation required for APP-2026-00192.', time: '3 days ago', priority: 'high', read: true },
    { id: 4, title: 'Grade posted', description: 'BIO101 grade has been posted for Fall 2026.', time: '5 days ago', priority: 'normal', read: true },
  ];

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button onClick={onMenuToggle} className="lg:hidden p-1 text-neutral-600 hover:text-black">
            <Menu size={22} weight="bold" />
          </button>
          <Link href="/sis" className="flex items-center gap-3 shrink-0">
            <Logo className="h-8 w-auto" />
            <div className="hidden md:block">
              <div className="text-xs font-black uppercase tracking-widest text-neutral-900">Cannoga College</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Student Information System</div>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <SearchIcon size={16} weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search students, courses, applications..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-neutral-400 focus:outline-none font-sans"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border border-neutral-200 bg-white px-1.5 py-0.5 rounded">ctrl K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="relative p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors" title="Notifications" onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}>
            <Bell size={18} weight="bold" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#9c27b3] rounded-full" />
          </button>
          <button className="relative p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors" title="Messages">
            <Envelope size={18} weight="bold" />
          </button>
          <button className="p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors" title="Help">
            <HelpCircle size={18} weight="bold" />
          </button>

          <div className="relative">
            <button className="flex items-center gap-2 p-1.5 hover:bg-neutral-100 transition-colors rounded" onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}>
              <div className="w-7 h-7 bg-neutral-200 rounded flex items-center justify-center">
                <User size={14} weight="bold" className="text-neutral-600" />
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-neutral-900 leading-none">Admin User</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Registrar</div>
              </div>
              <ChevronDown size={12} weight="bold" className="text-neutral-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-neutral-200 shadow-lg z-50 py-1">
                <div className="px-4 py-2 border-b border-neutral-100">
                  <div className="text-sm font-bold text-neutral-900">Admin User</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">registrar@cannogacollege.ca</div>
                </div>
                <Link href="/sis/settings" className="block px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 no-underline">Settings</Link>
                <Link href="/" className="block px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 no-underline">View Website</Link>
                <div className="border-t border-neutral-100 mt-1 pt-1">
                  <Link href="/portal/account/login" className="block px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-neutral-50 no-underline">Sign Out</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {notificationsOpen && (
        <div className="absolute right-4 top-14 w-80 bg-white border border-neutral-200 shadow-lg z-50">
          <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-900">Notifications</span>
            <button className="text-[10px] font-bold uppercase tracking-wider text-[#9c27b3] hover:underline">Mark all read</button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <div key={n.id} className={\`px-4 py-3 border-b border-neutral-50 hover:bg-neutral-50 cursor-pointer \${!n.read ? 'bg-[#faf5ff]' : ''}\`}>
                <div className="flex items-start gap-2">
                  {!n.read && <span className="w-2 h-2 bg-[#9c27b3] rounded-full mt-1.5 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-neutral-900 truncate">{n.title}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5 line-clamp-2">{n.description}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{n.time}</span>
                      {n.priority === 'high' && <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">High</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-neutral-200">
            <Link href="/sis/notifications" className="block text-center text-xs font-bold uppercase tracking-wider text-[#9c27b3] hover:underline no-underline">View All Notifications</Link>
          </div>
        </div>
      )}
    </header>
  );
}
`);

writeFile('src/components/sis/SISSidebar.tsx', `'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from '@phosphor-icons/react/dist/ssr';

interface NavItem {
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
    <li>
      {hasChildren ? (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className={\`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors \${depth === 0 ? 'text-xs font-bold uppercase tracking-widest' : 'text-xs'} \${active || childActive ? 'text-[#9c27b3] bg-[#faf5ff]' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}\`}
            style={{ paddingLeft: depth === 0 ? '1rem' : \`\${1 + depth * 0.75}rem\` }}
          >
            {expanded ? <ChevronDown size={12} weight="bold" /> : <ChevronRight size={12} weight="bold" />}
            <span className="truncate">{item.label}</span>
          </button>
          {expanded && (
            <ul className="mt-0.5">
              {item.children.map(child => (
                <NavItemComponent key={child.href || child.label} item={child} pathname={pathname} depth={depth + 1} />
              ))}
            </ul>
          )}
        </>
      ) : (
        <Link
          href={item.href || '#'}
          className={\`block px-3 py-1.5 text-left transition-colors \${depth === 0 ? 'text-xs font-bold uppercase tracking-widest' : 'text-xs'} \${active ? 'text-[#9c27b3] bg-[#faf5ff] font-bold' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}\`}
          style={{ paddingLeft: depth === 0 ? '1rem' : \`\${1 + depth * 0.75}rem\` }}
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
      <aside className={\`
        w-64 bg-white border-r border-neutral-200 flex-shrink-0 flex flex-col overflow-y-auto
        fixed lg:sticky top-14 bottom-0 z-30 transition-transform duration-200
        \${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      \`}>
        <nav className="flex-1 py-4 px-2 space-y-1">
          <ul className="space-y-0.5">
            {items.map(item => (
              <NavItemComponent key={item.href || item.label} item={item} pathname={pathname} depth={0} />
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
`);

writeFile('src/components/sis/Breadcrumbs.tsx', `'use client';

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
      <Link href="/sis" className="text-neutral-500 hover:text-[#9c27b3] no-underline transition-colors">SIS</Link>
      {segments.map((segment, idx) => {
        href += '/' + segment;
        const isLast = idx === segments.length - 1;
        const label = labels[segment] || segment.replace(/-/g, ' ').replace(/\\b\\w/g, c => c.toUpperCase());

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
            <Link href={href} className="text-neutral-500 hover:text-[#9c27b3] no-underline transition-colors">{label}</Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
`);

writeFile('src/components/sis/StatusBadge.tsx', `'use client';

import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'under review': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  completed: { bg: 'bg-neutral-100', text: 'text-neutral-700', dot: 'bg-neutral-500' },
  incomplete: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  paid: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  outstanding: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  overdue: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  verified: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'requires attention': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  enrolled: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  registered: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'in progress': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const s = status.toLowerCase();
  const style = statusStyles[s] || { bg: 'bg-neutral-50', text: 'text-neutral-700', dot: 'bg-neutral-400' };
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={\`inline-flex items-center gap-1.5 \${padding} \${style.bg} \${style.text} font-bold uppercase tracking-wider rounded-none\`}>
      <span className={\`w-1.5 h-1.5 rounded-full \${style.dot}\`} />
      {status}
    </span>
  );
}
`);

writeFile('src/components/sis/Tabs.tsx', `'use client';

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
              className={\`px-4 py-2 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors no-underline \${
                isActive
                  ? 'border-[#9c27b3] text-[#9c27b3]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }\`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
`);

writeFile('src/components/sis/PageHeader.tsx', `'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-black text-neutral-900 uppercase tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
`);

writeFile('src/components/sis/ActionToolbar.tsx', `'use client';

import React from 'react';

interface ActionToolbarProps {
  actions?: React.ReactNode;
  search?: React.ReactNode;
  filter?: React.ReactNode;
}

export function ActionToolbar({ actions, search, filter }: ActionToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-2">
        {filter}
      </div>
      <div className="flex items-center gap-2">
        {search}
        {actions}
      </div>
    </div>
  );
}
`);

console.log('All SIS files created successfully!');
`);
