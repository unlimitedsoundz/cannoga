'use client';

import { useState } from 'react';
import { Plus, Minus, FileText } from "@phosphor-icons/react/dist/ssr";

interface Publication {
    title: string;
    authors: string;
    journal: string;
    year: string;
    abstract: string;
    link?: string;
}

interface PublicationListProps {
    publications: Publication[];
}

export default function PublicationList({ publications }: PublicationListProps) {
    const [openKeys, setOpenKeys] = useState<Set<number>>(new Set());

    const toggle = (index: number) => {
        const next = new Set(openKeys);
        if (next.has(index)) {
            next.delete(index);
        } else {
            next.add(index);
        }
        setOpenKeys(next);
    };

    return (
        <div className="w-full space-y-0">
            {publications.map((pub, idx) => {
                const isOpen = openKeys.has(idx);

                return (
                    <div 
                        key={idx} 
                        className="border-t-2 border-[#0a151a] last:border-b-2 bg-white"
                    >
                        <button
                            onClick={() => toggle(idx)}
                            className="w-full flex items-center justify-between py-6 md:py-8 px-0 text-left hover:bg-[#0a151a]/5 transition-colors focus:outline-none group"
                            aria-expanded={isOpen}
                        >
                            <div className="pr-8 space-y-1.5 flex-1">
                                <h3 className="text-lg md:text-xl font-bold text-black group-hover:underline transition-colors leading-snug">
                                    {pub.title}
                                </h3>
                                <p className="text-xs md:text-sm text-black font-semibold">{pub.authors} ({pub.year})</p>
                                <p className="text-xs text-neutral-500 italic font-normal">{pub.journal}</p>
                            </div>
                            <div className="flex-shrink-0 bg-[#0a151a] text-white p-2">
                                {isOpen ? (
                                    <Minus size={20} weight="bold" />
                                ) : (
                                    <Plus size={20} weight="bold" />
                                )}
                            </div>
                        </button>

                        <div
                            className={`transition-all duration-500 ease-in-out ${
                                isOpen ? 'max-h-[1000px] opacity-100 pb-8 md:pb-12' : 'max-h-0 opacity-0'
                            } overflow-hidden`}
                        >
                            <div className="text-neutral-800 leading-relaxed px-0 text-left space-y-3">
                                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#0a151a]">
                                    <FileText size={16} weight="bold" /> Research Abstract
                                </div>
                                <p className="text-sm md:text-base text-black leading-relaxed font-normal">
                                    {pub.abstract}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
