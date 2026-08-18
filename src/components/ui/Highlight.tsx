import React from 'react';
import { Quotes } from "@phosphor-icons/react/dist/ssr";

interface HighlightProps {
    source?: string;
    body: string;
    alignment?: 'left' | 'right';
    className?: string;
}

export const Highlight: React.FC<HighlightProps> = ({ 
    source, 
    body, 
    className = "" 
}) => {
    return (
        <div className={`relative py-4 my-8 ${className}`}>
            {/* Blue quote icon */}
            <Quotes
                size={52}
                weight="fill"
                className="text-blue-500 mb-3"
            />
            <div className="space-y-4 pl-4 md:pl-6 border-l-4 border-blue-400">
                <blockquote className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 leading-snug">
                    &ldquo;{body}&rdquo;
                </blockquote>
                {source && (
                    <div className="flex items-center gap-3 pt-1">
                        <div className="w-8 h-0.5 bg-[#c89211]"></div>
                        <cite className="not-italic text-sm font-bold uppercase tracking-widest text-[#0f2027]">
                            {source}
                        </cite>
                    </div>
                )}
            </div>
        </div>
    );
};
