'use client';

import { useState, useEffect } from 'react';
import { Breadcrumbs } from "@aalto-dx/react-components";
import { Plus, Minus, List } from "@phosphor-icons/react/dist/ssr";

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
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState<boolean>(false);

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

  const activeItem = navItems.find(item => item.id === activeId) || navItems[0];

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
      {/* Sub-Navigation Bar: Mobile FAQ Accordion & Desktop Horizontal Bar */}
      {navItems.length > 0 && (
        <div className="w-full bg-neutral-100 py-4 sm:py-8">
          <nav aria-label="Section Navigation" className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            {/* ── Mobile View: Compact FAQ Accordion ── */}
            <div className="sm:hidden w-full">
              <button
                onClick={() => setMobileAccordionOpen(!mobileAccordionOpen)}
                className="w-full flex items-center justify-between py-2 px-3 bg-white border border-neutral-200 text-left transition-colors focus:outline-none"
                aria-expanded={mobileAccordionOpen}
              >
                <div className="flex items-center gap-2">
                  <List size={18} weight="bold" className="text-black" />
                  <span className="text-sm font-bold text-black">
                    {activeItem ? activeItem.label : 'Jump to Section'}
                  </span>
                </div>
                <div className="bg-[#0a151a] text-white p-1">
                  {mobileAccordionOpen ? (
                    <Minus size={16} weight="bold" />
                  ) : (
                    <Plus size={16} weight="bold" />
                  )}
                </div>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  mobileAccordionOpen ? 'max-h-[500px] opacity-100 mt-2 border-t border-neutral-200 pt-2' : 'max-h-0 opacity-0'
                } overflow-hidden bg-white border-x border-b border-neutral-200 divide-y divide-neutral-100`}
              >
                {navItems.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setMobileAccordionOpen(false)}
                      className={`block py-2.5 px-4 text-xs font-bold transition-colors no-underline ${
                        isActive ? 'bg-neutral-100 text-black font-extrabold' : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* ── Desktop View: Horizontal Sub-Nav Row ── */}
            <div className="hidden sm:flex items-center justify-start xl:justify-center flex-wrap gap-x-6 md:gap-x-8 gap-y-3 overflow-x-auto no-scrollbar scroll-smooth py-1">
              {navItems.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`shrink-0 whitespace-nowrap text-xs sm:text-sm md:text-base font-bold transition-colors no-underline py-1.5 ${
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
