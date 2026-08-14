'use client';

import { useState, useEffect } from 'react';

interface Props {
  sections: any[];
  children: React.ReactNode;
}

export default function GuideSidebarLayout({ sections, children }: Props) {
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
      {/* Horizontal Sub-Navigation Bar centered, non-full-width matching Hero content container */}
      {navItems.length > 0 && (
        <div className="w-full bg-white border-b border-neutral-200 py-3">
          <nav aria-label="Section Navigation" className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="bg-neutral-100 rounded-md py-2 px-4 flex items-center justify-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth">
              {navItems.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`whitespace-nowrap text-xs font-bold uppercase tracking-wider transition-colors no-underline py-1 border-b-2 ${
                      isActive 
                        ? 'border-black text-black' 
                        : 'border-transparent text-neutral-600 hover:text-black hover:border-neutral-400'
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

      {/* Main Content */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
