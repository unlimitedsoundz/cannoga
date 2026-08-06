'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import * as Icons from "@phosphor-icons/react/dist/ssr";

interface ContentBoxProps {
    icon?: string;
    title: string | ReactNode;
    body: string | ReactNode;
    image?: {
        src: string;
        alt: string;
    };
    size?: 'small' | 'large';
    backgroundColor?: string;
    className?: string;
}

export function ContentBox({
    icon,
    title,
    body,
    image,
    size = 'small',
    backgroundColor,
    className = ""
}: ContentBoxProps) {
    // Map icon string to Phosphor Icon component
    const IconComponent = icon ? (Icons as any)[icon.charAt(0).toUpperCase() + icon.slice(1)] || Icons.Circle : null;

    const isLarge = size === 'large';

    return (
        <div 
            className={`flex flex-col ${isLarge ? 'md:flex-row' : ''} h-full group transition-colors overflow-hidden ${className}`}
            style={{ backgroundColor: backgroundColor || '#f2f2f2' }} // Default to light grey
        >
            {image && (
                <div className={`${isLarge ? 'md:w-1/2' : 'w-full'} aspect-[16/9] md:aspect-auto relative overflow-hidden`}>
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                </div>
            )}
            <div className={`p-10 md:p-12 flex flex-col justify-center ${isLarge && image ? 'md:w-1/2' : 'w-full'}`}>
                {IconComponent && (
                    <div className="mb-8 text-black">
                        <IconComponent size={isLarge ? 64 : 48} weight="light" />
                    </div>
                )}
                <h3 className={`${isLarge ? 'text-aalto-5' : 'text-aalto-4'} font-bold mb-aalto-p4 text-black tracking-tight leading-tight`}>
                    {title}
                </h3>
                <div className={`${isLarge ? 'text-aalto-3' : 'text-aalto-2'} text-black leading-aalto-2`}>
                    {body}
                </div>
            </div>
        </div>
    );
}

