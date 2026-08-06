'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

interface FallbackImageProps extends ImageProps {
    fallbackSrc?: string;
}

export default function FallbackImage({ src, fallbackSrc = '/images/placeholders/design.png', ...props }: FallbackImageProps) {
    const [imgSrc, setImgSrc] = useState<string | null>(null);

    useEffect(() => {
        // Reset state when src prop changes
        setImgSrc(src as string);
    }, [src]);

    return (
        <Image
            {...props}
            src={imgSrc || fallbackSrc}
            onError={() => {
                setImgSrc(fallbackSrc);
            }}
        />
    );
}
