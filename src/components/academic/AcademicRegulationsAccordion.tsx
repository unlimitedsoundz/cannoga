'use client';

import { useState, type ReactNode } from 'react';
import { Plus, Minus } from '@phosphor-icons/react/dist/ssr';

export interface RegulationItem {
    id: string;
    question: string;
    answer: string | ReactNode;
    order_index: number;
}

interface AcademicRegulationsAccordionProps {
    items: RegulationItem[];
}

export default function AcademicRegulationsAccordion({ items }: AcademicRegulationsAccordionProps) {
    const [openKeys, setOpenKeys] = useState<Set<string>>(new Set(['reg-1'])); // Keep first open by default

    const toggle = (id: string) => {
        const next = new Set(openKeys);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setOpenKeys(next);
    };

    const sortedItems = [...items].sort((a, b) => a.order_index - b.order_index);

    return (
        <div className="w-full divide-y divide-slate-200 border-y border-slate-200">
            {sortedItems.map((item) => {
                const isOpen = openKeys.has(item.id);

                return (
                    <div key={item.id} className="bg-white transition-colors">
                        <button
                            onClick={() => toggle(item.id)}
                            className="w-full flex items-center justify-between py-6 md:py-8 px-0 text-left hover:bg-slate-50/70 transition-colors focus:outline-none group"
                            aria-expanded={isOpen}
                        >
                            <span className="text-xl md:text-2xl font-bold text-slate-900 pr-8 leading-snug tracking-tight">
                                {item.question}
                            </span>
                            <div className="flex-shrink-0 bg-[#0a151a] text-white p-2 md:p-2.5 rounded-none group-hover:bg-[#1a2e35] transition-colors">
                                {isOpen ? (
                                    <Minus size={20} weight="bold" />
                                ) : (
                                    <Plus size={20} weight="bold" />
                                )}
                            </div>
                        </button>
                        <div
                            className={`transition-all duration-500 ease-in-out ${
                                isOpen ? 'max-h-[3000px] opacity-100 pb-8 md:pb-10' : 'max-h-0 opacity-0'
                            } overflow-hidden`}
                        >
                            <div className="text-black text-base md:text-lg font-normal leading-relaxed text-left">
                                {typeof item.answer === 'string' ? (
                                    <p>{item.answer}</p>
                                ) : (
                                    item.answer
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
