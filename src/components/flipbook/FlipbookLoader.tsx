'use client';

import React from 'react';
import { BookOpen } from '@phosphor-icons/react';

interface FlipbookLoaderProps {
    title?: string;
    edition?: string;
    progress?: number;
}

export function FlipbookLoader({
    title = 'Cannoga College Viewbook',
    edition = '2026/2027',
    progress = 0
}: FlipbookLoaderProps) {
    return (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#070e12] text-white p-6 transition-opacity duration-300">
            <div className="flex flex-col items-center max-w-sm text-center space-y-5 animate-in fade-in zoom-in-95 duration-500">
                {/* Animated Logo/Icon Glow */}
                <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#c89211]/30 to-amber-500/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative w-16 h-16 rounded-2xl bg-[#0a151a] border border-white/10 flex items-center justify-center text-[#c89211] shadow-2xl">
                        <BookOpen size={34} weight="duotone" className="animate-bounce duration-1000" />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#c89211]">
                        Cannoga College • Digital Publication
                    </p>
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                        {title}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                        Edition {edition} • Loading interactive pages...
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="w-full max-w-[220px] space-y-2">
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#c89211] to-amber-400 rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(15, progress)}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Preparing Spread</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
