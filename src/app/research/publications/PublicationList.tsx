"use client";

import { useState } from 'react';
import { CaretDown, CaretUp, FileText, ArrowSquareOut as ExternalLink } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@aalto-dx/react-components";

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
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="divide-y divide-neutral-200 border border-neutral-200 bg-white">
            {publications.map((pub, idx) => {
                const isOpen = expandedIndex === idx;
                return (
                    <div key={idx} className="transition-colors">
                        <button
                            onClick={() => toggleExpand(idx)}
                            className="w-full text-left py-5 px-6 hover:bg-neutral-50 flex justify-between items-start gap-4 group transition-colors"
                            aria-expanded={isOpen}
                        >
                            <div className="flex-1 space-y-1">
                                <h3 className="text-base sm:text-lg font-bold text-black group-hover:underline transition-colors leading-snug">
                                    {pub.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-neutral-600 font-medium">{pub.authors} ({pub.year})</p>
                                <p className="text-xs text-neutral-500 italic font-normal">{pub.journal}</p>
                            </div>
                            <div className="mt-1 text-black shrink-0">
                                {isOpen ? <CaretUp size={20} weight="bold" /> : <CaretDown size={20} weight="bold" />}
                            </div>
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="px-6 pb-6 pt-2 text-neutral-700 bg-neutral-50/60 border-t border-neutral-100 text-xs sm:text-sm leading-relaxed space-y-3">
                                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
                                    <FileText size={15} weight="bold" /> Abstract
                                </div>
                                <p className="text-neutral-600 leading-relaxed font-normal">
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
