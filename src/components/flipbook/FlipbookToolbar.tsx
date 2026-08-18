'use client';

import React, { useState } from 'react';
import {
    MagnifyingGlass,
    SquaresFour,
    ArrowsOut,
    ArrowsIn,
    DownloadSimple,
    ShareNetwork,
    Plus,
    Minus,
    BookOpen,
    FileText
} from '@phosphor-icons/react';
import { ZoomLevel } from '@/types/flipbook';

interface FlipbookToolbarProps {
    currentPage: number;
    totalPages: number;
    spreadPages: number[];
    isPortrait: boolean;
    zoom: ZoomLevel;
    isFullscreen: boolean;
    isThumbnailsOpen: boolean;
    isSearchOpen: boolean;
    pdfUrl: string;
    viewMode?: 'spread' | 'single';
    onPrevPage?: () => void;
    onNextPage?: () => void;
    onFirstPage?: () => void;
    onLastPage?: () => void;
    onGoToPage: (page: number) => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoomReset?: () => void;
    onToggleFullscreen: () => void;
    onToggleThumbnails: () => void;
    onToggleSearch: () => void;
    onOpenShare: () => void;
    onToggleViewMode?: () => void;
}

export function FlipbookToolbar({
    currentPage,
    totalPages,
    spreadPages,
    isPortrait,
    zoom,
    isFullscreen,
    isThumbnailsOpen,
    isSearchOpen,
    pdfUrl,
    viewMode = 'spread',
    onGoToPage,
    onZoomIn,
    onZoomOut,
    onToggleFullscreen,
    onToggleThumbnails,
    onToggleSearch,
    onOpenShare,
    onToggleViewMode
}: FlipbookToolbarProps) {
    const isSingle = viewMode === 'single';

    // Calculate spread display label like `2-3 / 30` or `1 / 30`
    const spreadText = isPortrait || isSingle || spreadPages.length <= 1
        ? `${currentPage}`
        : `${spreadPages[0]}-${spreadPages[spreadPages.length - 1]}`;

    // Progress percentage
    const progressPercent = Math.min(100, Math.max(0, ((currentPage - 1) / Math.max(1, totalPages - 1)) * 100));

    const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const ratio = Math.max(0, Math.min(1, clickX / rect.width));
        const targetPage = Math.round(ratio * (totalPages - 1)) + 1;
        onGoToPage(targetPage);
    };

    return (
        <div className="w-full flex flex-col bg-[#1e1e1e] text-white border-t border-white/10 select-none">
            {/* Top Interactive Progress Scrubber */}
            <div
                className="w-full bg-white/20 h-[3px] hover:h-[5px] relative cursor-pointer transition-all duration-150 group"
                onClick={handleScrubberClick}
                title="Jump to page"
            >
                <div
                    className="bg-white h-full relative"
                    style={{ width: `${progressPercent}%` }}
                >
                    {/* Scrubber Knob */}
                    <div className="w-3 h-3 bg-white rounded-full shadow-md absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 transition-transform scale-100 group-hover:scale-125 pointer-events-none" />
                </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="px-4 py-2.5 flex items-center justify-between text-xs">
                {/* Left: Page Counter & Brand Logo */}
                <div className="flex items-center gap-3 shrink-0">
                    <span className="font-semibold text-white tracking-wide text-xs">
                        {spreadText} / {totalPages}
                    </span>
                    <span className="text-neutral-400 font-bold tracking-wider text-xs flex items-center gap-1.5 lowercase">
                        <span className="w-2 h-2 rounded-full bg-[#c89211]" />
                        cannoga
                    </span>
                </div>

                {/* Center: View Mode, Pages / Grid & Zoom Slider */}
                <div className="flex items-center gap-3 sm:gap-5">
                    {onToggleViewMode && (
                        <button
                            type="button"
                            onClick={onToggleViewMode}
                            title={isSingle ? "Switch to 2-Page Spread" : "Switch to 1-Page View"}
                            aria-label="Toggle Page Layout"
                            className="p-1 rounded text-neutral-300 hover:text-white transition-colors"
                        >
                            {isSingle ? (
                                <BookOpen size={18} weight="bold" />
                            ) : (
                                <FileText size={18} weight="bold" />
                            )}
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onToggleThumbnails}
                        title="Pages & Thumbnails"
                        aria-label="Toggle Pages"
                        className={`p-1 rounded transition-colors ${
                            isThumbnailsOpen ? 'text-[#c89211]' : 'text-neutral-300 hover:text-white'
                        }`}
                    >
                        <SquaresFour size={19} weight={isThumbnailsOpen ? 'fill' : 'bold'} />
                    </button>

                    {/* Zoom Slider */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onZoomOut}
                            title="Zoom Out"
                            aria-label="Zoom Out"
                            className="text-neutral-400 hover:text-white p-0.5"
                        >
                            <Minus size={13} weight="bold" />
                        </button>

                        <input
                            type="range"
                            min="0.75"
                            max="2.0"
                            step="0.25"
                            value={zoom}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (val > zoom) onZoomIn();
                                else if (val < zoom) onZoomOut();
                            }}
                            className="w-16 sm:w-24 h-1 bg-white/30 rounded-lg appearance-none accent-white cursor-pointer"
                            aria-label="Zoom Level"
                        />

                        <button
                            type="button"
                            onClick={onZoomIn}
                            title="Zoom In"
                            aria-label="Zoom In"
                            className="text-neutral-400 hover:text-white p-0.5"
                        >
                            <Plus size={13} weight="bold" />
                        </button>
                    </div>
                </div>

                {/* Right: Search, Share, PDF Download, Fullscreen */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <button
                        type="button"
                        onClick={onToggleSearch}
                        title="Search in Viewbook"
                        aria-label="Search"
                        className={`p-1 rounded transition-colors ${
                            isSearchOpen ? 'text-[#c89211]' : 'text-neutral-300 hover:text-white'
                        }`}
                    >
                        <MagnifyingGlass size={18} weight="bold" />
                    </button>

                    <button
                        type="button"
                        onClick={onOpenShare}
                        title="Share"
                        aria-label="Share"
                        className="p-1 rounded text-neutral-300 hover:text-white transition-colors"
                    >
                        <ShareNetwork size={18} weight="bold" />
                    </button>

                    <a
                        href={pdfUrl}
                        download="Cannoga-College-Viewbook-2026-2027.pdf"
                        title="Download PDF"
                        aria-label="Download PDF"
                        className="p-1 rounded text-neutral-300 hover:text-white transition-colors"
                    >
                        <DownloadSimple size={18} weight="bold" />
                    </a>

                    <button
                        type="button"
                        onClick={onToggleFullscreen}
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                        aria-label="Fullscreen"
                        className="p-1 rounded text-neutral-300 hover:text-white transition-colors"
                    >
                        {isFullscreen ? (
                            <ArrowsIn size={18} weight="bold" />
                        ) : (
                            <ArrowsOut size={18} weight="bold" />
                        )}
                    </button>
                </div>
            </div>

            {/* Black Sub-Ribbon Footer Bar */}
            <div className="bg-[#141414] px-4 py-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-white/5 font-sans">
                <span>Flipbook created for Cannoga College</span>
                <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Cannoga-College-Viewbook-2026-2027.pdf"
                    className="text-neutral-400 hover:text-white underline transition-colors"
                >
                    Download PDF version
                </a>
            </div>
        </div>
    );
}
