'use client';

import { useState, useEffect } from 'react';
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { SideNavigation } from '@/components/layout/SideNavigation';

interface Props {
  sections: any[];
  children: React.ReactNode;
}

export default function GuideSidebarLayout({ sections, children }: Props) {
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    // Default open on desktop
    if (window.innerWidth >= 1024) {
      setTocOpen(true);
    }
  }, []);

  // Transform sections to Aalto DX format if they are in the old format
  const navSections = sections.map(s => {
    if (s.header) return s; // already in new format
    
    return {
      header: { 
        label: s.title, 
        linkComponentProps: s.id ? { href: `#${s.id}` } : undefined 
      },
      links: (s.items || []).map((item: any) => ({
        label: item.title,
        linkComponentProps: { href: item.href }
      }))
    };
  });

  return (
    <div className="relative">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 w-80 border-r border-white/10 overflow-y-auto transition-all duration-300 ease-aalto-in-out z-40 ${tocOpen ? 'translate-x-0' : '-translate-x-full'} ${tocOpen ? 'lg:block' : 'lg:hidden'}`}
        style={{ top: '144px', height: 'calc(100vh - 144px)', backgroundColor: '#000000' }}
      >
        <SideNavigation sections={navSections} />
      </aside>

      {/* Toggle Button */}
      <div
        className={`fixed transition-all duration-300 ease-aalto-in-out z-50 ${tocOpen ? 'left-80' : 'left-0'}`}
        style={{ top: '144px' }}
      >
        <button
          onClick={() => setTocOpen(!tocOpen)}
          style={{ backgroundColor: '#000000' }}
          className="text-white px-2 py-6 rounded-r shadow-none hover:opacity-90 flex items-center justify-center transition-opacity"
          aria-label={tocOpen ? "Close sidebar" : "Open sidebar"}
        >
          {tocOpen ? <CaretLeft size={16} weight="regular" /> : <CaretRight size={16} weight="regular" />}
        </button>
      </div>

      {/* Main Content */}
      <main className={`transition-all duration-300 ease-aalto-in-out ${tocOpen ? 'lg:ml-80' : 'lg:ml-0'}`}>
        {children}
      </main>
    </div>
  );
}
