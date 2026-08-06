'use client';

import * as React from "react"
import { Link } from "./Link";

interface ListItem {
    label: string;
    linkComponentProps: {
        href: string;
        [key: string]: any;
    };
    subItems?: ListItem[];
}

interface ListProps {
    items: ListItem[];
    className?: string;
    depth?: number;
}

/**
 * Standardized recursive List component for the Cannoga College project.
 * Aliased from @aalto-dx/react-components.
 */
export function List({ items, className = "", depth = 0 }: ListProps) {
    return (
        <ul className={`${depth === 0 ? 'space-y-6' : 'space-y-3 mt-3 ml-4 border-l border-neutral-200 pl-4'} ${className}`}>
            {items.map((item, index) => (
                <li key={index} className="group">
                    <Link 
                        label={item.label} 
                        linkComponentProps={item.linkComponentProps}
                        className={`${depth === 0 ? 'text-sm font-medium tracking-normal' : 'text-xs font-normal text-neutral-600 hover:opacity-70'} transition-colors`}
                    />
                    {item.subItems && item.subItems.length > 0 && (
                        <List items={item.subItems} depth={depth + 1} />
                    )}
                </li>
            ))}
        </ul>
    );
}
