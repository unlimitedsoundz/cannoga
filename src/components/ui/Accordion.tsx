'use client';

import { useState, type ReactNode } from 'react';
import { Plus, Minus } from "@phosphor-icons/react/dist/ssr";

interface AccordionSection {
    title: string;
    accordionKey: string;
    children: ReactNode;
}

interface AccordionProps {
    sections: AccordionSection[];
}

export function Accordion({ sections }: AccordionProps) {
    const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

    const toggle = (key: string) => {
        const next = new Set(openKeys);
        if (next.has(key)) {
            next.delete(key);
        } else {
            next.add(key);
        }
        setOpenKeys(next);
    };

    return (
        <div className="w-full space-y-0">
            {sections.map((section) => {
                const isOpen = openKeys.has(section.accordionKey);

                return (
                    <div 
                        key={section.accordionKey} 
                        className="border-t-2 border-[#9c27b3] last:border-b-2"
                    >
                        <button
                            onClick={() => toggle(section.accordionKey)}
                            className="w-full flex items-center justify-between py-8 px-0 text-left hover:bg-[#f5f5f5] transition-colors focus:outline-none group"
                            aria-expanded={isOpen}
                        >
                            <span className="text-aalto-5 md:text-aalto-6 font-bold text-[#000000] pr-8 leading-aalto-5 tracking-aalto-2">
                                {section.title}
                            </span>
                            <div className="flex-shrink-0 bg-[#9c27b3] text-white p-2">
                                {isOpen ? (
                                    <Minus size={20} weight="bold" />
                                ) : (
                                    <Plus size={20} weight="bold" />
                                ) }
                            </div>
                        </button>
                        <div
                            className={`transition-all duration-500 ease-aalto-in-out ${
                                isOpen ? 'max-h-[2000px] opacity-100 pb-12' : 'max-h-0 opacity-0'
                            } overflow-hidden`}
                        >
                            <div className="prose prose-lg max-w-none text-neutral-800 leading-relaxed">
                                {section.children}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
