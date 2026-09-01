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
        <nav className={`flex items-center gap-2 text-black text-xs font-bold tracking-normal ${className}`} aria-label="Breadcrumb">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const IconComponent = item.icon ? iconMap[item.icon] : null;
                
                return (
                    <div key={index} className="flex items-center gap-2">
                        {item.linkComponentProps && !isLast ? (
                            <Link 
                                linkComponentProps={item.linkComponentProps}
                                className="text-black hover:text-black transition-colors flex items-center gap-1 font-bold no-underline"
                            >
                                {IconComponent && <IconComponent size={14} weight="fill" className="text-black" />}
                                {item.label}
                            </Link>
                        ) : (
                            <span className={`flex items-center gap-1 ${isLast ? "text-black font-medium" : "text-black font-bold"}`}>
                                {IconComponent && <IconComponent size={14} weight="fill" className="text-black" />}
                                {item.label}
                            </span>
                        )}
                        {!isLast && <CaretRight size={12} weight="fill" className="text-black" />}
                    </div>
                );
            })}
        </nav>
    );
}
