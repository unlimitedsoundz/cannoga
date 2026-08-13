'use client';

import * as React from "react"
import Image from 'next/image';
import { Link } from "@aalto-dx/react-components";
import { ArrowRight, DownloadSimple, CaretRight } from "@phosphor-icons/react/dist/ssr";

interface LiftupTile {
    title: string;
    image?: {
        src?: string;
        alt?: string;
        srcSet?: { src: string; width: number }[];
    };
    body?: string;
    cta?: {
        label: string;
        linkComponentProps?: {
            href: string;
            target?: string;
            [key: string]: any;
        };
        onClick?: (value: any) => void;
    };
    icon?: string;
    type?: 'button' | 'link';
}

interface LiftupCollectionProps {
    tiles: LiftupTile[];
    tilesPerRow?: number;
}

const iconMap: Record<string, React.ElementType> = {
    'chevron-right': CaretRight,
    'arrow-download': DownloadSimple,
    'arrow-right': ArrowRight,
};

/**
 * Standardized LiftupCollection component for Cannoga College.
 * Aliased from @aalto-dx/react-modules.
 */
export function LiftupCollection({ tiles, tilesPerRow = 3 }: LiftupCollectionProps) {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    }[tilesPerRow] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

    return (
        <div className={`grid ${gridCols} gap-0 border-t border-l border-slate-200`}>
            {tiles.map((tile, index) => {
                const imageSrc = tile.image?.src || (tile.image?.srcSet && tile.image.srcSet.length > 0 ? tile.image.srcSet[tile.image.srcSet.length - 1].src : '');
                const IconComponent = tile.icon ? iconMap[tile.icon] : null;

                return (
                    <div key={index} className="flex flex-col bg-white border-b border-r border-slate-200 group hover:border-[#0f2027] transition-colors">
                        {imageSrc && (
                            <div className="aspect-[16/9] relative overflow-hidden bg-neutral-100">
                                <Image
                                    src={imageSrc}
                                    alt={tile.image?.alt || tile.title}
                                    fill
                                    className="object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        )}
                        <div className="p-10 flex flex-col flex-1">
                            <h3 className="text-2xl font-serif font-bold text-[#0f2027] tracking-tight mb-6 group-hover:underline decoration-2 underline-offset-8">
                                {tile.title}
                            </h3>
                            {tile.body && (
                                <p className="text-slate-600 leading-relaxed font-normal mb-10 flex-1">
                                    {tile.body}
                                </p>
                            )}
                            {tile.cta && (
                                <div className="mt-auto">
                                    <Link 
                                        href={tile.cta.linkComponentProps?.href || '#'}
                                        target={tile.cta.linkComponentProps?.target}
                                         className={`inline-flex items-center gap-3 font-bold uppercase tracking-widest text-sm transition-all hover:gap-5 ${
                                             tile.type === 'button' 
                                             ? 'bg-[#0f2027] text-white px-8 py-4 hover:bg-[#1a3644] rounded-sm' 
                                             : 'text-[#0f2027]'
                                         }`}
                                        onClick={() => tile.cta?.onClick?.(tile.title)}
                                    >
                                        {tile.cta.label}
                                        {IconComponent && <IconComponent size={18} weight="bold" />}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

