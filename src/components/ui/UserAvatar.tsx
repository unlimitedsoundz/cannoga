'use client';

import { Link } from "@aalto-dx/react-components";
import Image from 'next/image';
import { useState } from 'react';
import { User } from "@phosphor-icons/react/dist/ssr";

interface UserAvatarProps {
    src?: string | null;
    firstName?: string | null;
    email?: string | null;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    isLoggedIn?: boolean;
}

export function UserAvatar({ src, firstName, email, size = 'md', className = '', isLoggedIn = true }: UserAvatarProps) {
    const [hasImageError, setHasImageError] = useState(false);
    const sizeClasses = {
        sm: 'w-8 h-8 text-[10px]',
        md: 'w-10 h-10 text-xs',
        lg: 'w-16 h-16 text-xl',
        xl: 'w-24 h-24 text-3xl',
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 32,
        xl: 48
    };

    const initial = firstName?.[0] || email?.[0]?.toUpperCase() || '?';
    const showPlaceholder = !isLoggedIn || (!src && !firstName && !email);

    return (
        <div className={`relative flex-shrink-0 bg-neutral-900 rounded-full force-circle flex items-center justify-center text-white font-black overflow-hidden border border-neutral-200/50 ${sizeClasses[size]} ${className}`}>
            {src && !hasImageError ? (
                <Image
                    src={src}
                    alt={firstName || email || 'User'}
                    fill
                    onError={() => setHasImageError(true)}
                    className="object-cover object-top force-circle"
                />
            ) : showPlaceholder ? (
                <div className="flex items-center justify-center w-full h-full bg-neutral-100/10 backdrop-blur-sm">
                    <User
                        size={iconSizes[size]}
                        weight="regular"
                        className="text-white/40"
                    />
                </div>
            ) : (
                <span>{initial}</span>
            )}
        </div>
    );
}

