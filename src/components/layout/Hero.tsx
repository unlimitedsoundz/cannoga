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
    videoSrc?: string;
    backgroundColor?: string;
    tinted?: boolean;
    lightText?: boolean;
    breadcrumbs?: Array<{ label: string; href?: string }>;
    imagePosition?: string;
    children?: ReactNode;
    className?: string;
    overlay?: boolean;
    overlayOpacity?: string;
}

export function Hero({ 
    title, 
    body, 
    image, 
    videoSrc,
    backgroundColor = '#000000', 
    tinted = true, 
    lightText = true,
    breadcrumbs,
    imagePosition = 'object-center',
    children,
    className,
    overlay = true,
    overlayOpacity = 'opacity-40'
}: HeroProps) {
    const textColorClass = lightText ? 'text-white' : 'text-black';
    const bodyColorClass = lightText ? 'text-white' : 'text-neutral-700';
    return (
        <>
        <div className="w-full container mx-auto px-4 sm:px-6 lg:px-8 pt-0">
            <section 
                className={`relative w-full overflow-hidden transition-all duration-700 ease-aalto-in-out border-b border-[#0f2027]/10 aspect-[9/16] sm:aspect-auto sm:min-h-[520px] md:min-h-[600px] lg:h-[680px] lg:min-h-[680px] flex items-center ${className || ''}`}
                style={{ backgroundColor: backgroundColor }}
            >
                {/* Background Video */}
                {videoSrc && (
                    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                        <video
                            src={videoSrc}
                            autoPlay
                            loop
                            muted
                            playsInline
                            suppressHydrationWarning
                            className={`w-full h-full object-cover ${overlayOpacity || (overlay ? 'opacity-40' : 'opacity-100')}`}
                        />
                        {overlay && (
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20 z-[1]" />
                        )}
                    </div>
                )}

                {/* Background Image */}
                {!videoSrc && image && (
                    <div className="absolute inset-0 w-full h-full z-0">
                        <Image
                            src={image.src || (image.srcSet ? image.srcSet[0].src : '/images/campus-welcome-v2.png')}
                            alt={image.alt || "Hero Image"}
                            fill
                            priority
                            className={`object-cover ${imagePosition} ${overlayOpacity || (overlay ? 'opacity-40' : 'opacity-100')}`}
                            sizes="100vw"
                        />
                        {/* Dark gradient overlay (Only when explicitly enabled) */}
                        {overlay && (
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20 z-[1]" />
                        )}
                    </div>
                )}

                {/* Content Container */}
                <div className="w-full h-full relative z-20 flex flex-col justify-end sm:justify-center items-start px-6 md:px-10 lg:px-12 pb-14 sm:pb-8 lg:py-12">
                    <div className={`w-full lg:w-3/5 flex flex-col space-y-6 ${textColorClass} text-left items-start`}>
                        <div className="space-y-4">
                            <h1 className="font-black text-3xl md:text-5xl lg:text-6xl leading-tight tracking-tight">
                                {title}
                            </h1>
                            <p className={`text-lg lg:text-xl ${bodyColorClass} max-w-xl font-medium leading-relaxed`}>
                                {body}
                            </p>
                        </div>

                        {children && (
                            <div className="flex flex-wrap gap-4 pt-2">
                                {children}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
        
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


