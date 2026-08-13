'use client';

import * as React from "react"
import { Link } from "@aalto-dx/react-components";
import { ProgressIndicator } from "./ProgressIndicator";

export interface ButtonProps {
    label?: string;
    type?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'link' | 'link-white' | 'white';
    htmlType?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'link' | 'link-white' | 'white';
    size?: 'default' | 'sm' | 'lg' | 'icon' | 'none';
    isLoading?: boolean;
    href?: string;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    className?: string;
    disabled?: boolean;
    children?: React.ReactNode;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

const buttonVariants = {
    primary: "bg-[#0f2027] text-white hover:bg-[#1a3644] shadow-sm",
    secondary: "bg-[#f8fafc] text-[#0f2027] hover:bg-[#e2e8f0] shadow-sm border border-slate-200",
    accent: "bg-[#0f2027] text-white hover:bg-[#1a3644] shadow-sm",
    white: "bg-white text-[#0f2027] hover:bg-[#f8fafc] shadow-sm border border-slate-200",
    outline: "border-2 border-[#0f2027] bg-transparent text-[#0f2027] hover:bg-[#0f2027] hover:text-white",
    ghost: "hover:bg-[#f8fafc] text-[#0f2027]",
    link: "text-[#0f2027] underline-offset-4 hover:underline",
    "link-white": "text-white underline-offset-8 hover:opacity-70 underline decoration-white",
}

const buttonSizes = {
    default: "h-12 px-8 py-4",
    sm: "h-9 px-3",
    lg: "h-14 px-10",
    icon: "h-10 w-10",
    none: "",
}

/**
 * Standardized Button component for the Cannoga College project.
 * Aliased from @aalto-dx/react-components.
 */
const Button = React.forwardRef<HTMLElement, ButtonProps>(
    ({ 
        className = "", 
        type = "primary", 
        htmlType = "button",
        variant, 
        size = "default", 
        label, 
        children, 
        isLoading,
        onClick,
        href,
        disabled,
        icon,
        iconPosition = 'right',
        ...props 
    }, ref) => {
        const activeVariant = variant || type;
        
        // Base classes depend on size/variant
        const isLink = activeVariant.startsWith('link');
        const baseClasses = isLink 
            ? "inline-flex items-center gap-2 font-bold transition-all focus-visible:outline-none"
            : "inline-flex items-center justify-center gap-2 rounded-sm text-[11px] font-black uppercase tracking-widest transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";

        const combinedClassName = `${baseClasses} ${buttonVariants[activeVariant]} ${buttonSizes[size]} ${className}`;

        const content = isLoading ? (
            <ProgressIndicator size={16} variant={activeVariant === 'primary' ? 'white' : 'default'} />
        ) : (
            <>
                {icon && iconPosition === 'left' && icon}
                {label || children}
                {icon && iconPosition === 'right' && icon}
            </>
        );

        if (href && !disabled) {
            return (
                <Link 
                    href={href} 
                    className={combinedClassName}
                    onClick={onClick as any}
                    {...(props as any)}
                >
                    {content}
                </Link>
            );
        }

        return (
            <button
                ref={ref as any}
                type={htmlType}
                onClick={onClick as any}
                disabled={disabled || isLoading}
                className={combinedClassName}
                {...props}
            >
                {content}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button }
