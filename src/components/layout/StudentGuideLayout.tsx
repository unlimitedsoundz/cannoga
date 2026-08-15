'use client';

import { useState, useEffect } from 'react';
import { Breadcrumbs } from "@aalto-dx/react-components";
import { Plus, Minus, List, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  sections: any[];
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
}

const VIBRANT_TAG_COLORS = [
  '#c89211', // Vibrant Gold
  '#005596', // Vibrant Royal Blue
  '#8b0000', // Vibrant Crimson
  '#0f766e', // Vibrant Emerald Teal
  '#6b21a8', // Vibrant Imperial Purple
  '#c026d3', // Vibrant Magenta
  '#0284c7', // Vibrant Sky Blue
  '#d97706', // Vibrant Amber
];

const getVibrantTagColor = (label: string): string => {
  if (!label) return VIBRANT_TAG_COLORS[0];
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % VIBRANT_TAG_COLORS.length;
  return VIBRANT_TAG_COLORS[index];
};

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

  const lastBreadcrumbLabel = breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1]?.label : '';
  const pageTitle = lastBreadcrumbLabel || (navItems && navItems[0] ? navItems[0].label : 'Guide');
  const tagBgColor = getVibrantTagColor(pageTitle || '');

  return (
    <div className="w-full">
      {/* Sub-Navigation Bar: Mobile FAQ Accordion & Desktop Horizontal Bar */}
      {navItems.length > 0 && (
        <nav aria-label="Section Navigation" className="w-full bg-neutral-100 p-0">
          {/* ── Mobile View: Compact FAQ Accordion ── */}
          <div className="sm:hidden container mx-auto px-4 py-3 bg-[#f4f6f8]">
            <button
              onClick={() => setMobileAccordionOpen(!mobileAccordionOpen)}
              style={{ backgroundColor: tagBgColor }}
              className="w-full flex items-center justify-between py-3 px-4 text-white text-left transition-colors focus:outline-none rounded-sm shadow-sm"
              aria-expanded={mobileAccordionOpen}
            >
              <div className="flex items-center gap-2">
                <List size={20} weight="bold" className="text-white" />
                <span className="text-sm font-extrabold uppercase tracking-wide text-white">
                  {activeItem ? activeItem.label : 'Jump to Section'}
                </span>
              </div>
            </button>

            <div
              className={`transition-all duration-300 ease-in-out ${
                mobileAccordionOpen ? 'max-h-[500px] opacity-100 mt-2 p-2' : 'max-h-0 opacity-0'
              } overflow-hidden bg-[#f4f6f8] rounded-sm`}
            >
              {navItems.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setMobileAccordionOpen(false)}
                    className={`block py-2.5 px-4 text-xs font-bold transition-colors no-underline rounded-sm ${
                      isActive ? 'bg-white text-black font-black shadow-xs' : 'text-neutral-700 hover:bg-white/60'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* ── Desktop View: Horizontal Sub-Nav Row with Full-Height Left Title Block Aligned to Screen Edge ── */}
          <div className="hidden sm:flex items-stretch justify-start gap-6 md:gap-8 overflow-x-auto no-scrollbar scroll-smooth w-full min-h-[120px]">
            {/* Left-aligned Coloured Title Card (Full Height, Zero Left Padding Offset, Width Auto, Dynamic Vibrant Color) */}
            {pageTitle && (
              <div 
                style={{ backgroundColor: tagBgColor }}
                className="shrink-0 w-auto text-white px-8 py-8 md:py-10 font-black text-[36px] uppercase tracking-wider flex items-center justify-start gap-3 self-stretch min-h-[120px]"
              >
                <span>{pageTitle}</span>
                <ArrowUpRight size={34} weight="bold" className="text-white shrink-0 stroke-[2]" />
              </div>
            )}

            {/* Navigation Items */}
            <div className="flex items-center justify-start flex-wrap gap-x-6 md:gap-x-8 gap-y-3 py-8 pr-6 lg:pr-12">
              {navItems.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    style={{
                      borderBottomColor: isActive ? tagBgColor : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.borderBottomColor = tagBgColor;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.borderBottomColor = 'transparent';
                    }}
                    className={`shrink-0 whitespace-nowrap text-xs sm:text-sm md:text-base font-bold transition-all no-underline py-1.5 border-b-2 ${
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
          </div>
        </nav>
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
