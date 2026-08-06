'use client';

import * as React from "react"
import { CaretRight, House } from "@phosphor-icons/react";
import { Link } from "./Link";

interface BreadcrumbItem {
    label?: string;
    icon?: string;
    linkComponentProps?: {
        href: string;
        [key: string]: any;
    };
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

const iconMap: Record<string, React.ElementType> = {
    'home': House,
};

/**
 * Standardized Breadcrumbs component for the Cannoga College project.
 * Aliased from @aalto-dx/react-modules.
 */
export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
    return (
        <nav className={`flex items-center gap-2 text-black text-xs font-medium tracking-normal ${className}`} aria-label="Breadcrumb">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const IconComponent = item.icon ? iconMap[item.icon] : null;
                
                return (
                    <div key={index} className="flex items-center gap-2">
                        {item.linkComponentProps && !isLast ? (
                            <Link 
                                linkComponentProps={item.linkComponentProps}
                                className="hover:text-neutral-500 transition-colors flex items-center gap-1"
                            >
                                {IconComponent && <IconComponent size={14} weight="bold" />}
                                {item.label}
                            </Link>
                        ) : (
                            <span className={`flex items-center gap-1 ${isLast ? "text-neutral-500" : ""}`}>
                                {IconComponent && <IconComponent size={14} weight="bold" />}
                                {item.label}
                            </span>
                        )}
                        {!isLast && <CaretRight size={10} weight="bold" className="text-neutral-300" />}
                    </div>
                );
            })}
        </nav>
    );
}
