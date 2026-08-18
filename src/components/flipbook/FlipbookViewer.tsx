'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    CaretLeft,
    CaretRight
} from '@phosphor-icons/react';
import { Publication, ZoomLevel, FlipOrientation } from '@/types/flipbook';
import { FlipbookCanvas, FlipbookCanvasHandle } from './FlipbookCanvas';
import { FlipbookToolbar } from './FlipbookToolbar';
import { FlipbookThumbnails } from './FlipbookThumbnails';
import { FlipbookSearch } from './FlipbookSearch';
import { FlipbookShareModal } from './FlipbookShareModal';
import { FlipbookError } from './FlipbookError';
import { trackViewbookEvent } from '@/lib/flipbook/analytics';
import { useSearchParams } from 'next/navigation';

interface FlipbookViewerProps {
    publication: Publication;
    initialPage?: number;
    viewMode?: 'spread' | 'single';
    embedded?: boolean;
    className?: string;
}

export function FlipbookViewer({
    publication,
    initialPage = 1,
    viewMode = 'spread',
    embedded = false,
    className = ''
}: FlipbookViewerProps) {
    const searchParams = useSearchParams();
    const viewerRootRef = useRef<HTMLDivElement | null>(null);
    const canvasHandleRef = useRef<FlipbookCanvasHandle | null>(null);

    // Resolve initial starting page once on mount
    const pageFromUrl = searchParams?.get('page');
    const initialStartPage = useRef(
        pageFromUrl ? parseInt(pageFromUrl, 10) || initialPage : initialPage
    ).current;

    const [currentViewMode, setCurrentViewMode] = useState<'spread' | 'single'>(viewMode);
    const [currentPage, setCurrentPage] = useState(initialStartPage);
    const [spreadPages, setSpreadPages] = useState<number[]>([initialStartPage]);
    const [orientation, setOrientation] = useState<FlipOrientation>(viewMode === 'single' ? 'portrait' : 'landscape');
    const [zoom, setZoom] = useState<ZoomLevel>(1.0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modals & Drawers
    const [isThumbnailsOpen, setIsThumbnailsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);

    // Pan state when zoomed in
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const panStartRef = useRef({ x: 0, y: 0 });

    // Track Viewbook Open once on mount
    useEffect(() => {
        trackViewbookEvent({
            event: 'viewbook_opened',
            edition: publication.edition,
            pageNumber: initialStartPage
        });
    }, [publication.edition]);

    // Fullscreen change listener
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isFull = !!document.fullscreenElement;
            setIsFullscreen(isFull);
            trackViewbookEvent({
                event: 'fullscreen_toggled',
                edition: publication.edition,
                pageNumber: currentPage
            });
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [publication.edition, currentPage]);

    // Sync current page changes with URL parameter without full reload
    const updateUrlPage = useCallback((pageNum: number) => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            if (pageNum > 1) {
                url.searchParams.set('page', String(pageNum));
            } else {
                url.searchParams.delete('page');
            }
            window.history.replaceState(null, '', url.pathname + url.search);
        }
    }, []);

    const handlePageChange = useCallback((pageNum: number, spread: number[]) => {
        setCurrentPage(pageNum);
        setSpreadPages(spread);
        updateUrlPage(pageNum);
        trackViewbookEvent({
            event: 'page_viewed',
            edition: publication.edition,
            pageNumber: pageNum
        });
    }, [publication.edition, updateUrlPage]);

    const handleOrientationChange = useCallback((orient: FlipOrientation) => {
        setOrientation(orient);
    }, []);

    const handleCanvasReady = useCallback(() => {}, []);

    // Navigation actions
    const handleNextPage = () => {
        canvasHandleRef.current?.nextPage();
    };

    const handlePrevPage = () => {
        canvasHandleRef.current?.prevPage();
    };

    const handleFirstPage = () => {
        canvasHandleRef.current?.firstPage();
    };

    const handleLastPage = () => {
        canvasHandleRef.current?.lastPage();
    };

    const handleGoToPage = (pageNum: number) => {
        canvasHandleRef.current?.goToPage(pageNum);
    };

    // Zoom controls
    const handleZoomIn = () => {
        setZoom((prev) => {
            if (prev === 0.75) return 1.0;
            if (prev === 1.0) return 1.25;
            if (prev === 1.25) return 1.5;
            if (prev === 1.5) return 2.0;
            return 2.0;
        });
    };

    const handleZoomOut = () => {
        setZoom((prev) => {
            if (prev === 2.0) return 1.5;
            if (prev === 1.5) return 1.25;
            if (prev === 1.25) return 1.0;
            if (prev === 1.0) return 0.75;
            return 0.75;
        });
    };

    const handleZoomReset = () => {
        setZoom(1.0);
        setPanOffset({ x: 0, y: 0 });
    };

    // Fullscreen toggle
    const handleToggleFullscreen = async () => {
        if (!viewerRootRef.current) return;
        try {
            if (!document.fullscreenElement) {
                await viewerRootRef.current.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.error('Fullscreen request failed:', err);
        }
    };

    // Pan handlers for zoomed state
    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoom <= 1.0) return;
        setIsPanning(true);
        panStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isPanning || zoom <= 1.0) return;
        const newX = e.clientX - panStartRef.current.x;
        const newY = e.clientY - panStartRef.current.y;
        setPanOffset({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
                return;
            }

            if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                e.preventDefault();
                canvasHandleRef.current?.nextPage();
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                e.preventDefault();
                canvasHandleRef.current?.prevPage();
            } else if (e.key === 'Home') {
                e.preventDefault();
                canvasHandleRef.current?.firstPage();
            } else if (e.key === 'End') {
                e.preventDefault();
                canvasHandleRef.current?.lastPage();
            } else if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                handleZoomIn();
            } else if (e.key === '-' || e.key === '_') {
                e.preventDefault();
                handleZoomOut();
            } else if (e.key === 'f' || e.key === 'F') {
                e.preventDefault();
                handleToggleFullscreen();
            } else if (e.key === 'Escape') {
                setIsThumbnailsOpen(false);
                setIsSearchOpen(false);
                setIsShareOpen(false);
                if (zoom > 1.0) handleZoomReset();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [zoom]);

    const isFirst = currentPage <= 1;
    const isLast = currentPage >= publication.totalPages;

    return (
        <div
            ref={viewerRootRef}
            className={`relative w-full flex flex-col bg-[#333333] text-white overflow-hidden select-none font-sans ${
                isFullscreen
                    ? 'fixed inset-0 z-50 h-screen w-screen'
                    : 'w-full shadow-2xl'
            } ${className}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: zoom > 1.0 ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
        >
            {/* MAIN INTERACTIVE FLIPBOOK STAGE */}
            <div className="relative w-full flex-1 flex items-center justify-center min-h-[460px] sm:min-h-[540px] md:min-h-[620px] p-2 sm:p-6 lg:p-10 overflow-hidden bg-[#333333]">
                
                {/* Minimalist White Left Chevron Button */}
                <button
                    type="button"
                    onClick={handlePrevPage}
                    disabled={isFirst}
                    title="Previous Page"
                    aria-label="Previous Page"
                    className="absolute left-2 sm:left-4 z-10 p-2 text-white hover:opacity-100 opacity-80 transition-all disabled:opacity-0 disabled:pointer-events-none active:scale-95 cursor-pointer"
                >
                    <CaretLeft size={38} weight="bold" />
                </button>

                {/* Minimalist White Right Chevron Button */}
                <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={isLast}
                    title="Next Page"
                    aria-label="Next Page"
                    className="absolute right-2 sm:right-4 z-10 p-2 text-white hover:opacity-100 opacity-80 transition-all disabled:opacity-0 disabled:pointer-events-none active:scale-95 cursor-pointer"
                >
                    <CaretRight size={38} weight="bold" />
                </button>

                {/* Zoomable & Pannable Viewport */}
                <div
                    className="relative w-full max-w-5xl h-full flex items-center justify-center transition-transform duration-200"
                    style={{
                        transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`,
                        transformOrigin: 'center center'
                    }}
                >
                    <FlipbookCanvas
                        ref={canvasHandleRef}
                        pages={publication.pages}
                        initialPage={initialStartPage}
                        viewMode={currentViewMode}
                        onPageChange={handlePageChange}
                        onOrientationChange={handleOrientationChange}
                        onReady={handleCanvasReady}
                    />
                </div>

                {/* Error State Overlay */}
                {error && (
                    <FlipbookError
                        message={error}
                        pdfUrl={publication.pdfUrl}
                        onRetry={() => {
                            setError(null);
                        }}
                    />
                )}

                {/* Thumbnails Drawer */}
                <FlipbookThumbnails
                    isOpen={isThumbnailsOpen}
                    pages={publication.pages}
                    currentPage={currentPage}
                    spreadPages={spreadPages}
                    onClose={() => setIsThumbnailsOpen(false)}
                    onSelectPage={handleGoToPage}
                />

                {/* Search Modal */}
                <FlipbookSearch
                    isOpen={isSearchOpen}
                    publication={publication}
                    onClose={() => setIsSearchOpen(false)}
                    onSelectPage={handleGoToPage}
                />

                {/* Share Modal */}
                <FlipbookShareModal
                    isOpen={isShareOpen}
                    publication={publication}
                    currentPage={currentPage}
                    onClose={() => setIsShareOpen(false)}
                />
            </div>

            {/* INTEGRATED BOTTOM CONTROL BAR & SCRUBBER */}
            <footer className="shrink-0 w-full z-20">
                <FlipbookToolbar
                    currentPage={currentPage}
                    totalPages={publication.totalPages}
                    spreadPages={spreadPages}
                    isPortrait={orientation === 'portrait'}
                    zoom={zoom}
                    isFullscreen={isFullscreen}
                    isThumbnailsOpen={isThumbnailsOpen}
                    isSearchOpen={isSearchOpen}
                    pdfUrl={publication.pdfUrl}
                    viewMode={currentViewMode}
                    onPrevPage={handlePrevPage}
                    onNextPage={handleNextPage}
                    onFirstPage={handleFirstPage}
                    onLastPage={handleLastPage}
                    onGoToPage={handleGoToPage}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onZoomReset={handleZoomReset}
                    onToggleFullscreen={handleToggleFullscreen}
                    onToggleThumbnails={() => setIsThumbnailsOpen(!isThumbnailsOpen)}
                    onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
                    onOpenShare={() => setIsShareOpen(true)}
                    onToggleViewMode={() => setCurrentViewMode(prev => prev === 'spread' ? 'single' : 'spread')}
                />
            </footer>
        </div>
    );
}
