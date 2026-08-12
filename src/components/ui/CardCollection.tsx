'use client';

import * as React from "react"
import { Card } from "./Card";
import { Tag } from "./Tag";

interface CardTile {
    title: string;
    image?: {
        src?: string;
        alt?: string;
        srcSet?: { src: string; width: number }[];
    };
    body?: string;
    tags?: string[];
    cta?: {
        label: string;
        linkComponentProps?: {
            href: string;
            [key: string]: any;
        };
    };
    onClick?: (value: any) => void;
}

interface CardCollectionProps {
    tiles: CardTile[];
    tilesPerRow?: number;
}

/**
 * Standardized CardCollection component for Cannoga College.
 * Aliased from @aalto-dx/react-modules.
 */
export function CardCollection({ tiles, tilesPerRow = 3 }: CardCollectionProps) {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    }[tilesPerRow] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

    return (
        <div className={`grid ${gridCols} gap-8`}>
            {tiles.map((tile, index) => {
                // Determine image src from srcSet if src is missing
                const imageSrc = tile.image?.src || (tile.image?.srcSet && tile.image.srcSet.length > 0 ? tile.image.srcSet[tile.image.srcSet.length - 1].src : '');
                
                // If tile has too many content fields, image is not rendered (as per user request text)
                const hasTooMuchContent = !!(tile.title && tile.body && tile.tags && tile.tags.length > 0 && tile.cta);
                const finalShouldShowImage = !!tile.image && !hasTooMuchContent;

                return (
                    <Card
                        key={index}
                        title={tile.title}
                        image={finalShouldShowImage ? { src: imageSrc, alt: tile.image?.alt || tile.title } : undefined}
                        body={tile.body || ""}
                        tags={tile.tags}
                        cta={tile.cta}
                        onClick={tile.onClick}
                    />
                );
            })}
        </div>
    );
}
