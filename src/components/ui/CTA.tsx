'use client';

import React from 'react';
import { Link } from './Link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

interface CTAProps {
    title: string | React.ReactNode;
    body: string | React.ReactNode;
    cta: {
        label: string;
        onClick?: (value?: any) => void;
        linkComponentProps?: {
            href: string;
            [key: string]: any;
        };
    };
    className?: string;
}

/**
 * Standardized CTA component for Cannoga College.
 * Aliased from @aalto-dx/react-modules.
 * 
 * Recreates the Aalto University CTA layout (col-4-x-7).
 */
export function CTA({ title, body, cta, className = "" }: CTAProps) {
    return (
        <section className={`aalto-cta bg-[#0f2027] text-white border-b border-white/10 ${className}`}>
            <div className="w-full max-w-7xl mx-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left side: Title (col-4) */}
                    <div className="lg:col-span-4">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight break-words">
                            {title}
                        </h2>
                    </div>

                    {/* Right side: Body and Button (col-8) */}
                    <div className="lg:col-span-8 space-y-10">
                        <div className="text-xl md:text-2xl text-white leading-relaxed font-medium break-words">
                            {typeof body === 'string' ? (
                                <p className="rich">{body}</p>
                            ) : (
                                body
                            )}
                        </div>
                        
                        <div className="flex">
                            <Link
                                label={cta.label}
                                linkComponentProps={cta.linkComponentProps}
                                onClick={cta.onClick}
                                className="bg-white text-[#000000] px-10 py-5 font-bold hover:bg-[#f5f5f5] transition-all uppercase tracking-widest text-sm inline-flex items-center gap-3 relative overflow-hidden group/btn"
                                icon={<ArrowRight size={20} weight="bold" className="transition-transform group-hover/btn:translate-x-1" />}
                                iconPosition="right"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
