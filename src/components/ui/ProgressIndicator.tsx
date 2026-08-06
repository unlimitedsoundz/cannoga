'use client';

import React from 'react';
import { CircleNotch as Loader2 } from "@phosphor-icons/react";

interface ProgressIndicatorProps {
    size?: number;
    className?: string;
    variant?: 'default' | 'white' | 'primary';
}

/**
 * ProgressIndicator component for all loading states.
 * Replaces manual animate-spin div/icon combinations.
 */
export function ProgressIndicator({ 
    size = 24, 
    className = "",
    variant = 'default'
}: ProgressIndicatorProps) {
    const variantClasses = {
        default: 'text-black',
        white: 'text-white',
        primary: 'text-primary'
    };

    return (
        <Loader2 
            size={size} 
            className={`animate-spin ${variantClasses[variant]} ${className}`} 
            weight="bold"
        />
    );
}
