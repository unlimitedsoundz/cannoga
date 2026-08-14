'use client';

import { useState, useEffect } from 'react';

import { Breadcrumbs } from "@aalto-dx/react-components";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  sections: any[];
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
}

export default function GuideSidebarLayout({ sections, breadcrumbs, children }: Props) {
  const [activeId, setActiveId] = useState<string>('');

  // Extract flat list of nav items
  const navItems = sections.flatMap(s => {
    if (s.header) {
      const items = [];
      if (s.header.linkComponentProps?.href) {
        items.push({ id: s.header.linkComponentProps.href.replace('#', ''), label: s.header.label });
      }
      if (s.links) {
        s.links.forEach((l: any) => {
          if (l.linkComponentProps?.href?.startsWith('#')) {
            items.push({ id: l.linkComponentProps.href.replace('#', ''), label: l.label });
          }
        });
      }
      return items;
    }
    return [{ id: s.id || '', label: s.title || s.label }];
  }).filter(item => item.id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  return (
    <div className="w-full">
      {/* Horizontal Sub-Navigation Bar matching Hero background styling with increased vertical height */}
      {navItems.length > 0 && (
        <div className="w-full bg-neutral-100 py-7">
          <nav aria-label="Section Navigation" className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="flex items-center justify-start sm:justify-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth">
              {navItems.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`whitespace-nowrap text-sm font-bold transition-colors no-underline py-3 ${
                      isActive 
                        ? 'text-black font-extrabold' 
                        : 'text-neutral-600 hover:text-black font-medium'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </nav>
        </div>
      )}

      {/* Breadcrumbs Bar below sub-navigation without border line */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-3">
            <Breadcrumbs 
              items={[
                { icon: 'home', linkComponentProps: { href: '/' } },
                ...breadcrumbs.map(b => ({
                  label: b.label,
                  linkComponentProps: b.href ? { href: b.href } : undefined
                }))
              ]} 
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
