'use client';

import * as React from "react"
import { GraduationCap, Tag as TagIcon, Clock, CheckCircle, Info, Warning, Prohibit } from "@phosphor-icons/react";

interface TagProps {
    label: string;
    icon?: string;
    className?: string;
    type?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

const iconMap: Record<string, React.ElementType> = {
    'graduation-cap': GraduationCap,
    'tag': TagIcon,
    'clock': Clock,
    'check-circle': CheckCircle,
    'info': Info,
    'warning': Warning,
    'prohibit': Prohibit,
};

/**
 * Standardized Tag component for the Cannoga College project.
 * Aliased from @aalto-dx/react-components.
 */
export function Tag({ 
    label, 
    icon, 
    className = "",
    type = 'neutral'
}: TagProps) {
    const IconComponent = icon ? iconMap[icon] : null;

    const typeStyles = {
        default: 'bg-neutral-100 text-neutral-800 border-neutral-200',
        neutral: 'bg-neutral-50 text-black border-neutral-200',
        success: 'bg-neutral-50 text-neutral-800 border-neutral-100',
        warning: 'bg-amber-50 text-amber-800 border-amber-100',
        error: 'bg-red-50 text-red-800 border-red-100',
        info: 'bg-blue-50 text-blue-800 border-blue-100',
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black border leading-none transition-all ${typeStyles[type]} ${className}`}>
            {IconComponent && <IconComponent size={12} weight="bold" />}
            {label}
        </span>
    );
}
