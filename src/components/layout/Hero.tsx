'use client';

import Image from 'next/image';
import { Breadcrumbs } from '@aalto-dx/react-modules';
import { ReactNode } from 'react';

interface HeroImage {
    src?: string;
    alt?: string;
    srcSet?: Array<{
        src: string;
        width: number;
    }>;
}

interface HeroProps {
    title: ReactNode;
    body: ReactNode;
    image?: HeroImage;
    backgroundColor?: string;
    tinted?: boolean;
    lightText?: boolean;
    breadcrumbs?: Array<{ label: string; href?: string }>;
    imagePosition?: string;
    children?: ReactNode;
    className?: string;
}

export function Hero({ 
    title, 
    body, 
    image, 
    backgroundColor = '#000000', 
    tinted = true, 
    lightText = true,
    breadcrumbs,
    imagePosition = 'object-center',
    children,
    className
}: HeroProps) {
    const textColorClass = lightText ? 'text-white' : 'text-black';
    const bodyColorClass = lightText ? 'text-white' : 'text-neutral-700';
    return (
        <>
        <section 
            className={`relative overflow-hidden transition-all duration-700 ease-aalto-in-out border-b border-[#0f2027]/10 min-h-[400px] lg:h-[600px] lg:min-h-[600px] flex items-center ${className || ''}`}
            style={{ backgroundColor: backgroundColor }}
        >
            {/* Background Image */}
                {image && (
                <div className="absolute inset-0 w-full h-full z-0">
                    <Image
                        src={image.src || (image.srcSet ? image.srcSet[0].src : '/images/campus-welcome-v2.png')}
                        alt={image.alt || "Hero Image"}
                        fill
                        priority
                        className={`object-cover ${imagePosition} opacity-5`}
                        sizes="100vw"
                    />
                    {/* Dark overlay for better text contrast */}
                    <div className="absolute inset-0 bg-black/50 z-[1]" />
                </div>
            )}

            {/* Content Container */}
            <div className="container mx-auto px-4 md:px-12 lg:px-20 h-full relative z-20 flex items-center justify-start w-full">
                <div className={`w-full lg:w-3/5 p-8 md:p-12 lg:p-16 flex flex-col space-y-6 ${textColorClass} text-left items-start ${image ? 'bg-transparent backdrop-blur-none' : 'bg-transparent backdrop-blur-none'} rounded-none`}>
                    <div className="space-y-4">
                        <h1 className="font-black text-3xl md:text-5xl lg:text-6xl leading-tight tracking-tight">
                            {title}
                        </h1>
                        <p className={`text-lg lg:text-xl ${bodyColorClass} max-w-xl font-medium leading-relaxed`}>
                            {body}
                        </p>
                    </div>

                    {children && (
                        <div className="flex flex-wrap gap-4 pt-4">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </section>
        
        {/* Mobile Breadcrumbs - Outside the background container */}
        {/* Breadcrumbs Bar - Always under the colored background */}
        {breadcrumbs && (
            <div className="border-b border-neutral-100 bg-white">
                <div className="container mx-auto px-4 py-3">
                    <Breadcrumbs 
                        items={[
                            { icon: 'home', linkComponentProps: { href: '/' } },
                            ...breadcrumbs.map(b => ({
                                label: b.label,
                                linkComponentProps: b.href ? { href: b.href } : undefined
                            }))
                        ]} 
                        className=""
                    />
                </div>
            </div>
        )}
        </>
    );
}


