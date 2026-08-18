'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    CaretLeft,
    CaretRight,
    ArrowLeft,
    DownloadSimple,
    ShareNetwork,
    MagnifyingGlass,
    SquaresFour
} from '@phosphor-icons/react';
import { Publication, ZoomLevel, FlipOrientation } from '@/types/flipbook';
import { FlipbookCanvas, FlipbookCanvasHandle } from './FlipbookCanvas';
import { FlipbookToolbar } from './FlipbookToolbar';
import { FlipbookThumbnails } from './FlipbookThumbnails';
import { FlipbookSearch } from './FlipbookSearch';
import { FlipbookShareModal } from './FlipbookShareModal';
import { FlipbookLoader } from './FlipbookLoader';
import { FlipbookError } from './FlipbookError';
import { trackViewbookEvent } from '@/lib/flipbook/analytics';

interface FlipbookViewerProps {
    publication: Publication;
    initialPage?: number;
    embedded?: boolean;
    className?: string;
}

export function FlipbookViewer({
    publication,
    initialPage = 1,
    embedded = false,
    className = ''
}: FlipbookViewerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const viewerRootRef = useRef<HTMLDivElement | null>(null);
    const canvasHandleRef = useRef<FlipbookCanvasHandle | null>(null);

    // Initial page resolution from query params
    const pageFromUrl = searchParams.get('page');
    const startPage = pageFromUrl ? parseInt(pageFromUrl, 10) || initialPage : initialPage;

    const [currentPage, setCurrentPage] = useState(startPage);
    const [spreadPages, setSpreadPages] = useState<number[]>([startPage]);
    const [orientation, setOrientation] = useState<FlipOrientation>('landscape');
    const [zoom, setZoom] = useState<ZoomLevel>(1.0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(15);
    const [error, setError] = useState<string | null>(null);

    // Modals & Drawers
    const [isThumbnailsOpen, setIsThumbnailsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);

    // Pan state when zoomed in
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const panStartRef = useRef({ x: 0, y: 0 });

    // Track Viewbook Open
    useEffect(() => {
        trackViewbookEvent({
            event: 'viewbook_opened',
            edition: publication.edition,
            pageNumber: startPage
        });

        // Simulate progress increment while mounting
        const p1 = setTimeout(() => setLoadProgress(45), 100);
        const p2 = setTimeout(() => setLoadProgress(80), 250);
        const p3 = setTimeout(() => setLoadProgress(100), 450);

        return () => {
            clearTimeout(p1);
            clearTimeout(p2);
            clearTimeout(p3);
        };
    }, [publication.edition, startPage]);

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
            window.history.replaceState({}, '', url.toString());
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

    const handleCanvasReady = useCallback(() => {
        setIsLoading(false);
    }, []);

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
            // Ignore if typing in an input
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
            className={`relative w-full flex flex-col bg-[#050b0e] text-white overflow-hidden select-none font-sans ${
                isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen' : 'min-h-[85vh] md:min-h-[92vh]'
            } ${className}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: zoom > 1.0 ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
        >
            {/* TOP HEADER BAR (Only in non-fullscreen, or minimal HUD in fullscreen) */}
            <header className="z-20 flex items-center justify-between px-4 py-3 bg-[#0a151a]/80 backdrop-blur-md border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                    {!embedded && (
                        <Link
                            href="/"
                            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors inline-flex items-center gap-1 text-xs font-bold no-underline"
                            title="Back to Cannoga Home"
                        >
                            <ArrowLeft size={16} weight="bold" />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                    )}

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#c89211] animate-ping duration-1000" />
                            <h1 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider truncate">
                                {publication.title}
                            </h1>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium hidden sm:block">
                            Edition {publication.edition} • Official Digital Prospectus
                        </span>
                    </div>
                </div>

                {/* Right Header Controls */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsSearchOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                        <MagnifyingGlass size={15} weight="bold" />
                        <span className="hidden sm:inline">Search</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsThumbnailsOpen(!isThumbnailsOpen)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                        <SquaresFour size={15} weight="bold" />
                        <span className="hidden sm:inline">Pages</span>
                    </button>

                    <a
                        href={publication.pdfUrl}
                        download="Cannoga-College-Viewbook-2026-2027.pdf"
                        onClick={() => {
                            trackViewbookEvent({
                                event: 'pdf_download',
                                edition: publication.edition,
                                pageNumber: currentPage
                            });
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#c89211] hover:bg-[#b07f0f] text-black text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 no-underline"
                    >
                        <DownloadSimple size={15} weight="bold" />
                        <span className="hidden sm:inline">PDF</span>
                    </a>
                </div>
            </header>

            {/* MAIN INTERACTIVE FLIPBOOK STAGE */}
            <main className="relative flex-1 w-full h-full flex items-center justify-center p-2 sm:p-6 overflow-hidden">
                
                {/* Floating Left Page-Turn Arrow (Desktop) */}
                <button
                    type="button"
                    onClick={handlePrevPage}
                    disabled={isFirst}
                    title="Previous Page (Arrow Left)"
                    aria-label="Previous Page"
                    className="absolute left-2 sm:left-6 z-10 p-3 sm:p-4 rounded-2xl bg-[#0a151a]/80 hover:bg-[#c89211] hover:text-black text-white backdrop-blur-md border border-white/15 shadow-2xl transition-all disabled:opacity-0 disabled:pointer-events-none active:scale-95 group hidden sm:flex items-center justify-center"
                >
                    <CaretLeft size={24} weight="bold" className="group-hover:-translate-x-0.5 transition-transform" />
                </button>

                {/* Floating Right Page-Turn Arrow (Desktop) */}
                <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={isLast}
                    title="Next Page (Arrow Right)"
                    aria-label="Next Page"
                    className="absolute right-2 sm:right-6 z-10 p-3 sm:p-4 rounded-2xl bg-[#0a151a]/80 hover:bg-[#c89211] hover:text-black text-white backdrop-blur-md border border-white/15 shadow-2xl transition-all disabled:opacity-0 disabled:pointer-events-none active:scale-95 group hidden sm:flex items-center justify-center"
                >
                    <CaretRight size={24} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Zoomable & Pannable Viewport */}
                <div
                    className="relative w-full h-full flex items-center justify-center transition-transform duration-200"
                    style={{
                        transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`,
                        transformOrigin: 'center center'
                    }}
                >
                    <FlipbookCanvas
                        ref={canvasHandleRef}
                        pages={publication.pages}
                        initialPage={startPage}
                        onPageChange={handlePageChange}
                        onOrientationChange={handleOrientationChange}
                        onReady={handleCanvasReady}
                    />
                </div>

                {/* Loading State Overlay */}
                {isLoading && (
                    <FlipbookLoader
                        title={publication.title}
                        edition={publication.edition}
                        progress={loadProgress}
                    />
                )}

                {/* Error State Overlay */}
                {error && (
                    <FlipbookError
                        message={error}
                        pdfUrl={publication.pdfUrl}
                        onRetry={() => {
                            setError(null);
                            setIsLoading(true);
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
            </main>

            {/* FLOATING BOTTOM ISSUU-STYLE TOOLBAR */}
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
                />
            </footer>
        </div>
    );
}
