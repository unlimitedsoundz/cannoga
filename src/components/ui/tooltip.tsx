'use client';

import { Info } from 'lucide-react';

interface TooltipProps {
    text: string;
    className?: string;
}

export default function Tooltip({ text, className = '' }: TooltipProps) {
    return (
        <span className={`inline-flex items-center text-neutral-400 hover:text-neutral-600 cursor-help ${className}`} title={text}>
            <Info size={14} strokeWidth={2} />
        </span>
    );
}
