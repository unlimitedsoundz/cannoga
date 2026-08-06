'use client';

import * as React from "react"
import NextLink from "next/link";

interface LinkProps {
    label?: string;
    linkComponentProps?: {
        href: string;
        target?: string;
        [key: string]: any;
    };
    href?: string; // Backwards compatibility
    target?: string; // Backwards compatibility
    highlighted?: boolean;
    noHover?: boolean;
    onClick?: (value: any) => void;
    className?: string;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    children?: React.ReactNode;
    title?: string;
}

/**
 * Standardized Link component for the Cannoga College project.
 * Aliased from @aalto-dx/react-components.
 * Supports both the new API (label, linkComponentProps) and traditional Link API (href, target, children).
 */
export function Link({ 
    label, 
    linkComponentProps, 
    href,
    target,
    highlighted, 
    noHover = false,
    onClick,
    className = "",
    icon,
    iconPosition = 'left',
    children,
    title
}: LinkProps) {
    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            onClick(e);
        }
    };

    // Determine final href and props
    const finalHref = href || linkComponentProps?.href || '#';
    const finalTarget = target || linkComponentProps?.target;
    const finalProps = linkComponentProps || { href: finalHref, target: finalTarget };

    const isStructural = !!children && !label;

    const hoverClass = noHover ? '' : 'hover:opacity-70 transition-colors';

    return (
        <NextLink
            {...finalProps}
            href={finalHref}
            target={finalTarget}
            onClick={handleClick}
            title={title}
            className={`${isStructural ? '' : 'font-medium transition-all inline-flex items-center gap-2'} ${highlighted ? 'text-black underline underline-offset-4 decoration-black' : hoverClass} ${className}`}
        >
            {icon && iconPosition === 'left' && icon}
            {label || children}
            {icon && iconPosition === 'right' && icon}
        </NextLink>
    );
}
