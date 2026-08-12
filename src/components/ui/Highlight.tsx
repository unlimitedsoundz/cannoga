import React from 'react';
import { Quotes } from "@phosphor-icons/react/dist/ssr";

interface HighlightProps {
    source: string;
    body: string;
    alignment?: 'left' | 'right';
    className?: string;
}

export const Highlight: React.FC<HighlightProps> = ({ 
    source, 
    body, 
    alignment = 'left',
    className = "" 
}) => {
    return (
        <div className={`my-12 flex flex-col ${alignment === 'right' ? 'items-end text-right' : 'items-start text-left'} ${className}`}>
            <div className={`max-w-2xl relative ${alignment === 'right' ? 'pr-8' : 'pl-8'}`}>
                <Quotes 
                    size={32} 
                    weight="fill" 
                    className={`absolute top-0 text-neutral-200 -z-10 ${alignment === 'right' ? 'right-0' : 'left-0'}`} 
                />
                <blockquote className="text-2xl md:text-3xl font-bold text-black leading-tight mb-6">
                    "{body}"
                </blockquote>
                <cite className="not-italic block">
                    <span className="text-lg font-bold text-black">{source}</span>
                </cite>
            </div>
        </div>
    );
};
