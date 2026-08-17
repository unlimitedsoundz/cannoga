'use client';

import { useState, type ReactNode } from 'react';
import { Plus, Minus } from "@phosphor-icons/react/dist/ssr";

export interface FAQItem {
    id: string;
    question: string;
    answer: string | ReactNode;
    order_index: number;
}

interface FAQProps {
    faqs: FAQItem[];
}

export default function FAQ({ faqs }: FAQProps) {
    const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

    const toggle = (id: string) => {
        const next = new Set(openKeys);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setOpenKeys(next);
    };

    const faqList = faqs || [];

    if (!faqList || faqList.length === 0) {
        return (
            <div className="text-center py-12 text-black">
                <p className="text-lg font-medium">No FAQs available yet</p>
            </div>
        );
    }

    // Deduplicate FAQs by question (normalized) and sort by order_index
    const seenQuestions = new Set<string>();
    const deduplicatedFaqs: FAQItem[] = [];
    for (const item of faqList) {
        const cleanQ = (item.question || '')
            .toString()
            .trim()
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, ' ');
        if (!cleanQ || seenQuestions.has(cleanQ)) continue;
        seenQuestions.add(cleanQ);
        deduplicatedFaqs.push(item);
    }

    const sortedFaqs = deduplicatedFaqs.sort((a, b) => a.order_index - b.order_index);

    return (
        <div className="w-full space-y-0">
            {sortedFaqs.map((faq) => {
                const isOpen = openKeys.has(faq.id);

                return (
                    <div 
                        key={faq.id} 
                        className="border-b border-neutral-200 last:border-b-0 bg-white"
                    >
                        <button
                            onClick={() => toggle(faq.id)}
                            className="w-full flex items-center justify-between py-8 px-0 text-left hover:bg-[#0a151a]/5 transition-colors focus:outline-none group"
                            aria-expanded={isOpen}
                        >
                            <span className="text-aalto-5 md:text-aalto-6 font-bold text-black pr-8 leading-aalto-5 tracking-aalto-2">
                                {faq.question}
                            </span>
                            <div className="flex-shrink-0 bg-[#0a151a] text-white p-2">
                                {isOpen ? (
                                    <Minus size={20} weight="bold" />
                                ) : (
                                    <Plus size={20} weight="bold" />
                                )}
                            </div>
                        </button>
                        <div
                            className={`transition-all duration-500 ease-aalto-in-out ${
                                isOpen ? 'max-h-[2000px] opacity-100 pb-12' : 'max-h-0 opacity-0'
                            } overflow-hidden`}
                        >
                            <div className="faq-content text-black leading-relaxed px-0 text-left prose prose-lg max-w-none prose-a:text-black prose-a:font-bold hover:prose-a:opacity-70">
                                {typeof faq.answer === 'string' ? (
                                    <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                ) : (
                                    faq.answer
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

