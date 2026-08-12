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
        <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-sm">
            {publications.map((pub, idx) => (
                <div key={idx} className="border-b border-neutral-200 last:border-0">
                    <button
                        onClick={() => toggleExpand(idx)}
                        className="w-full text-left p-6 hover:bg-neutral-50 transition-colors flex justify-between items-start gap-4 group"
                        aria-expanded={expandedIndex === idx}
                    >
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-black transition-colors">
                                {pub.title}
                            </h3>
                            <p className="text-neutral-700 mb-2 font-medium">{pub.authors} ({pub.year})</p>
                            <p className="text-sm text-neutral-500 italic">{pub.journal}</p>
                        </div>
                        <div className="mt-1 text-neutral-400 group-hover:text-neutral-900 transition-colors">
                            {expandedIndex === idx ? <CaretUp size={20} weight="bold" /> : <CaretDown size={20} weight="bold" />}
                        </div>
                    </button>

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedIndex === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                    >
                        <div className="p-6 pt-0 text-neutral-600 bg-neutral-50/50">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center gap-2">
                                <FileText size={16} weight="regular" /> Abstract
                            </h4>
                            <p className="mb-4 leading-relaxed">
                                {pub.abstract}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
