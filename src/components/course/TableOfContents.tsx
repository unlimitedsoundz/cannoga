
'use client';

import { useState } from 'react';
import { CaretDown, CaretUp, Plus, Minus } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@aalto-dx/react-components";

interface Section {
    id: string;
    title: string;
    content: string;
    items?: { title: string; href: string }[];
}

interface Props {
    sections: Section[];
    isOpen?: boolean;
    onToggle?: () => void;
}

function CollapsibleSection({ section }: { section: Section }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasItems = section.items && section.items.length > 0;

    return (
        <div>
            <div className="flex items-center justify-between group cursor-pointer" onClick={() => hasItems && setIsExpanded(!isExpanded)}>
                <a
                    href={`#${section.id}`}
                    className="flex-1 text-base font-bold text-black hover:opacity-70 transition-all block py-2"
                    onClick={(e) => {
                        // Navigation happens automatically via href
                    }}
                >
                    {section.title}
                </a>
                {hasItems && (
                    <button
                        className="p-1 text-black hover:opacity-70 transition-opacity align-middle flex items-center justify-center"
                    >
                        {isExpanded ? <Minus size={16} weight="bold" /> : <Plus size={16} weight="bold" />}
                    </button>
                )}
            </div>
            {hasItems && (
                <div
                    className={`pl-3 mt-1 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100 mb-2' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="flex flex-wrap gap-2">
                        {section.items!.map(item => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="text-sm text-black font-bold py-1 px-3 bg-[#9c27b3]/10 hover:bg-[#9c27b3] hover:text-white transition-all underline decoration-1 underline-offset-4"
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TableOfContents({ sections }: Props) {
    return (
        <div className="bg-white text-black h-full p-4 overflow-y-auto">
            <div className="pt-4">
                <div className="px-4 md:px-0 pb-2">
                    <h3 className="text-sm md:text-lg font-bold text-black uppercase tracking-widest">Study at Cannoga College</h3>
                </div>

                <div className="px-4 md:px-0 pb-6">
                    <nav className="flex flex-col space-y-1 mt-4">
                        {sections.map((section) => (
                            <CollapsibleSection key={section.id} section={section} />
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}

