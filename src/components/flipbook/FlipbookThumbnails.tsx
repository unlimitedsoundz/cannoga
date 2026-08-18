'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, BookOpen, Check } from '@phosphor-icons/react';
import { FlipbookPageMeta } from '@/types/flipbook';

interface FlipbookThumbnailsProps {
    isOpen: boolean;
    pages: FlipbookPageMeta[];
    currentPage: number;
    spreadPages: number[];
    onClose: () => void;
    onSelectPage: (pageNumber: number) => void;
}

export function FlipbookThumbnails({
    isOpen,
    pages,
    currentPage,
    spreadPages,
    onClose,
    onSelectPage
}: FlipbookThumbnailsProps) {
    const activeItemRef = useRef<HTMLButtonElement | null>(null);

    // Scroll active thumbnail into view when drawer opens or page changes
    useEffect(() => {
        if (isOpen && activeItemRef.current) {
            activeItemRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, [isOpen, currentPage]);

    if (!isOpen) return null;

    return (
        <div className="absolute inset-x-0 bottom-16 sm:bottom-20 z-20 mx-auto max-w-6xl px-4 animate-in slide-in-from-bottom-6 duration-300 pointer-events-auto">
            <div className="bg-[#0a151a]/95 backdrop-blur-xl border border-white/15 rounded-3xl p-4 sm:p-5 shadow-2xl text-white">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <BookOpen size={18} weight="bold" className="text-[#c89211]" />
                        <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                            All Pages &amp; Sections ({pages.length})
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close Thumbnails"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X size={18} weight="bold" />
                    </button>
                </div>

                {/* Horizontal Scrollable Thumbnails Strip */}
                <div className="flex items-start gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    {pages.map((page) => {
                        const isSpreadActive = spreadPages.includes(page.pageNumber);
                        const isCurrent = page.pageNumber === currentPage;
                        const isHighlighted = isSpreadActive || isCurrent;

                        return (
                            <button
                                key={page.pageNumber}
                                ref={isHighlighted ? activeItemRef : null}
                                type="button"
                                onClick={() => {
                                    onSelectPage(page.pageNumber);
                                    onClose();
                                }}
                                className={`group flex flex-col items-center shrink-0 text-left transition-all focus:outline-none ${
                                    isHighlighted ? 'scale-105' : 'opacity-70 hover:opacity-100'
                                }`}
                            >
                                {/* Thumbnail Container */}
                                <div
                                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 transition-all shadow-md ${
                                        isHighlighted
                                            ? 'border-[#c89211] ring-4 ring-[#c89211]/30 shadow-amber-500/20'
                                            : 'border-white/15 group-hover:border-white/40'
                                    }`}
                                >
                                    <Image
                                        src={page.thumbnail || page.image}
                                        alt={page.title}
                                        fill
                                        sizes="96px"
                                        className="object-cover"
                                        loading="lazy"
                                    />

                                    {/* Page Number Badge */}
                                    <div className="absolute bottom-1 left-1 bg-black/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-white">
                                        {String(page.pageNumber).padStart(2, '0')}
                                    </div>

                                    {/* Active Checkmark */}
                                    {isHighlighted && (
                                        <div className="absolute top-1 right-1 bg-[#c89211] text-black p-0.5 rounded-full shadow">
                                            <Check size={10} weight="bold" />
                                        </div>
                                    )}
                                </div>

                                {/* Title Label */}
                                <div className="mt-1.5 max-w-[80px] sm:max-w-[96px] text-center">
                                    <p className="text-[10px] font-bold text-white truncate leading-tight">
                                        {page.section}
                                    </p>
                                    <p className="text-[9px] text-slate-400 truncate leading-tight">
                                        Page {page.pageNumber}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
