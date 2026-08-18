'use client';

import React, { useState, useEffect } from 'react';
import {
    CaretLeft,
    CaretRight,
    CaretDoubleLeft,
    CaretDoubleRight,
    MagnifyingGlassPlus,
    MagnifyingGlassMinus,
    MagnifyingGlass,
    SquaresFour,
    ArrowsOut,
    ArrowsIn,
    DownloadSimple,
    ShareNetwork,
    ArrowCounterClockwise
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
    onPrevPage: () => void;
    onNextPage: () => void;
    onFirstPage: () => void;
    onLastPage: () => void;
    onGoToPage: (page: number) => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoomReset: () => void;
    onToggleFullscreen: () => void;
    onToggleThumbnails: () => void;
    onToggleSearch: () => void;
    onOpenShare: () => void;
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
    onPrevPage,
    onNextPage,
    onFirstPage,
    onLastPage,
    onGoToPage,
    onZoomIn,
    onZoomOut,
    onZoomReset,
    onToggleFullscreen,
    onToggleThumbnails,
    onToggleSearch,
    onOpenShare
}: FlipbookToolbarProps) {
    const [pageInputValue, setPageInputValue] = useState(String(currentPage));

    useEffect(() => {
        setPageInputValue(String(currentPage));
    }, [currentPage]);

    const handlePageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const num = parseInt(pageInputValue, 10);
        if (!isNaN(num) && num >= 1 && num <= totalPages) {
            onGoToPage(num);
        } else {
            setPageInputValue(String(currentPage));
        }
    };

    // Calculate spread display label
    const pageLabel = isPortrait || spreadPages.length <= 1
        ? `Page ${currentPage} of ${totalPages}`
        : `Pages ${spreadPages[0]}–${spreadPages[spreadPages.length - 1]} of ${totalPages}`;

    const isFirst = currentPage <= 1;
    const isLast = currentPage >= totalPages;

    return (
        <div className="w-full select-none z-20 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            {/* Main Floating HUD Bar */}
            <div className="pointer-events-auto flex items-center justify-between gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-[#0a151a]/90 backdrop-blur-md border border-white/10 shadow-2xl text-white max-w-full overflow-x-auto scrollbar-none">
                
                {/* LEFT SECTION: Utility Trays (Thumbnails, Search) */}
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    <button
                        type="button"
                        onClick={onToggleThumbnails}
                        title="Pages & Thumbnails"
                        aria-label="Toggle Thumbnails"
                        className={`p-2 rounded-xl transition-all ${
                            isThumbnailsOpen
                                ? 'bg-[#c89211] text-black font-black'
                                : 'text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <SquaresFour size={18} weight={isThumbnailsOpen ? 'fill' : 'bold'} />
                    </button>

                    <button
                        type="button"
                        onClick={onToggleSearch}
                        title="Search in Publication"
                        aria-label="Search Publication"
                        className={`p-2 rounded-xl transition-all ${
                            isSearchOpen
                                ? 'bg-[#c89211] text-black font-black'
                                : 'text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <MagnifyingGlass size={18} weight="bold" />
                    </button>
                </div>

                <div className="h-4 w-px bg-white/10 shrink-0 hidden sm:block mx-1" />

                {/* CENTER SECTION: Page Navigation & Counter */}
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    <button
                        type="button"
                        onClick={onFirstPage}
                        disabled={isFirst}
                        title="First Page"
                        aria-label="First Page"
                        className="hidden md:flex p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                        <CaretDoubleLeft size={16} weight="bold" />
                    </button>

                    <button
                        type="button"
                        onClick={onPrevPage}
                        disabled={isFirst}
                        title="Previous Page (Arrow Left)"
                        aria-label="Previous Page"
                        className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                        <CaretLeft size={18} weight="bold" />
                    </button>

                    {/* Interactive Page Jump Input */}
                    <form onSubmit={handlePageSubmit} className="flex items-center gap-1 sm:gap-1.5 px-2">
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={pageInputValue}
                            onChange={(e) => setPageInputValue(e.target.value)}
                            onBlur={() => setPageInputValue(String(currentPage))}
                            title="Click to jump to page"
                            className="w-9 sm:w-11 text-center bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/15 rounded-lg py-1 text-xs sm:text-sm font-bold text-white outline-none focus:ring-1 focus:ring-[#c89211] transition-all"
                        />
                        <span className="text-[11px] sm:text-xs font-semibold text-slate-400">
                            / {totalPages}
                        </span>
                    </form>

                    <button
                        type="button"
                        onClick={onNextPage}
                        disabled={isLast}
                        title="Next Page (Arrow Right)"
                        aria-label="Next Page"
                        className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                        <CaretRight size={18} weight="bold" />
                    </button>

                    <button
                        type="button"
                        onClick={onLastPage}
                        disabled={isLast}
                        title="Last Page"
                        aria-label="Last Page"
                        className="hidden md:flex p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                        <CaretDoubleRight size={16} weight="bold" />
                    </button>
                </div>

                <div className="h-4 w-px bg-white/10 shrink-0 hidden sm:block mx-1" />

                {/* RIGHT SECTION: Zoom, Download, Share, Fullscreen */}
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    {/* Zoom Out */}
                    <button
                        type="button"
                        onClick={onZoomOut}
                        disabled={zoom <= 0.75}
                        title="Zoom Out (-)"
                        aria-label="Zoom Out"
                        className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                        <MagnifyingGlassMinus size={18} weight="bold" />
                    </button>

                    {/* Current Zoom Percentage */}
                    <button
                        type="button"
                        onClick={onZoomReset}
                        title="Reset Zoom"
                        className="hidden sm:block px-2 py-1 rounded-lg text-[11px] font-mono font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                    >
                        {Math.round(zoom * 100)}%
                    </button>

                    {/* Zoom In */}
                    <button
                        type="button"
                        onClick={onZoomIn}
                        disabled={zoom >= 2.0}
                        title="Zoom In (+)"
                        aria-label="Zoom In"
                        className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                        <MagnifyingGlassPlus size={18} weight="bold" />
                    </button>

                    <div className="h-4 w-px bg-white/10 shrink-0 hidden md:block mx-0.5" />

                    {/* Download PDF */}
                    <a
                        href={pdfUrl}
                        download="Cannoga-College-Viewbook-2026-2027.pdf"
                        title="Download Official Viewbook PDF"
                        aria-label="Download PDF"
                        className="p-2 rounded-xl text-slate-300 hover:text-[#c89211] hover:bg-white/10 transition-all no-underline inline-flex items-center justify-center"
                    >
                        <DownloadSimple size={18} weight="bold" />
                    </a>

                    {/* Share Button */}
                    <button
                        type="button"
                        onClick={onOpenShare}
                        title="Share Publication"
                        aria-label="Share Publication"
                        className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <ShareNetwork size={18} weight="bold" />
                    </button>

                    {/* Fullscreen Toggle */}
                    <button
                        type="button"
                        onClick={onToggleFullscreen}
                        title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen Mode (F)'}
                        aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                        className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                    >
                        {isFullscreen ? (
                            <ArrowsIn size={18} weight="bold" />
                        ) : (
                            <ArrowsOut size={18} weight="bold" />
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}
