'use client';

import Image from 'next/image';
import { Link } from "@aalto-dx/react-components";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ReactNode } from 'react';

interface CardProps {
    title: string;
    subtitle?: ReactNode;
    badge?: {
        label: string;
        className?: string;
    };
    image?: {
        src: string;
        alt: string;
    };
    body: string | ReactNode;
    cta?: {
        label: string;
        linkComponentProps?: {
            href: string;
            [key: string]: any;
        };
    };
    onClick?: (value?: any) => void;
    tags?: string[];
    className?: string;
}

export function Card({
    title,
    subtitle,
    badge,
    image,
    body,
    cta,
    onClick,
    tags,
    className = ""
}: CardProps) {
    const CardContent = (
        <div 
            className={`bg-card border border-neutral-100 flex flex-col h-full hover:shadow-xl transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
            onClick={onClick}
        >
            {image && (
                <div className="aspect-[3/2] relative overflow-hidden bg-neutral-100">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {badge && (
                        <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-widest rounded-none ${badge.className || 'bg-[#0f2027] text-white'}`}>
                                {badge.label}
                            </span>
                        </div>
                    )}
                </div>
            )}
            <div className="p-8 md:p-10 flex flex-col flex-1">
                {subtitle && (
                    <div className="mb-3">
                        {subtitle}
                    </div>
                )}
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag, idx) => (
                            <span key={idx} className="text-[10px] font-bold uppercase tracking-widest text-[#0f2027]">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
                <h3 className="text-aalto-4 font-serif font-bold mb-aalto-p4 text-[#0f2027] tracking-tight leading-tight group-hover:underline">
                    {title}
                </h3>
                <div className="text-aalto-2 text-slate-600 leading-aalto-2 mb-8 flex-1">
                    {body}
                </div>
                {cta && (
                    <div className="mt-auto">
                        <span className="text-aalto-1 font-bold uppercase tracking-widest text-[#0f2027] inline-flex items-center gap-2 group/cta relative">
                            {cta.label}
                            <ArrowRight size={16} weight="bold" className="transition-transform group-hover/cta:translate-x-1 text-[#c89211]" />
                            <div className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-[#0f2027] scale-x-0 group-hover/cta:scale-x-100 transition-transform origin-left"></div>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );

    if (cta?.linkComponentProps?.href && !onClick) {
        const { href, ...otherProps } = cta.linkComponentProps;
        return (
            <Link href={href} className="group block h-full" {...otherProps}>
                {CardContent}
            </Link>
        );
    }

    return CardContent;
}

