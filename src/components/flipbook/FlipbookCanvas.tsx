'use client';

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';
import { PageFlip } from 'page-flip';
import { FlipbookPageMeta, FlipOrientation } from '@/types/flipbook';

export interface FlipbookCanvasHandle {
    nextPage: () => void;
    prevPage: () => void;
    firstPage: () => void;
    lastPage: () => void;
    goToPage: (pageNum: number) => void;
    getCurrentPage: () => number;
    getOrientation: () => FlipOrientation;
}

interface FlipbookCanvasProps {
    pages: FlipbookPageMeta[];
    initialPage?: number;
    onPageChange: (currentPage: number, spreadPages: number[]) => void;
    onOrientationChange: (orientation: FlipOrientation) => void;
    onReady: () => void;
}

export const FlipbookCanvas = forwardRef<FlipbookCanvasHandle, FlipbookCanvasProps>(
    function FlipbookCanvas(
        { pages, initialPage = 1, onPageChange, onOrientationChange, onReady },
        ref
    ) {
        const containerRef = useRef<HTMLDivElement | null>(null);
        const bookRef = useRef<HTMLDivElement | null>(null);
        const pageFlipInstance = useRef<PageFlip | null>(null);
        const [isMounted, setIsMounted] = useState(false);

        // Expose imperative API to parent controller
        useImperativeHandle(ref, () => ({
            nextPage: () => {
                pageFlipInstance.current?.flipNext();
            },
            prevPage: () => {
                pageFlipInstance.current?.flipPrev();
            },
            firstPage: () => {
                pageFlipInstance.current?.flip(0);
            },
            lastPage: () => {
                const total = pages.length;
                pageFlipInstance.current?.flip(total - 1);
            },
            goToPage: (pageNum: number) => {
                const targetIdx = Math.max(0, Math.min(pages.length - 1, pageNum - 1));
                pageFlipInstance.current?.flip(targetIdx);
            },
            getCurrentPage: () => {
                if (!pageFlipInstance.current) return 1;
                return (pageFlipInstance.current.getCurrentPageIndex() || 0) + 1;
            },
            getOrientation: () => {
                if (!pageFlipInstance.current) return 'landscape';
                const orient = pageFlipInstance.current.getOrientation();
                return orient === 'portrait' ? 'portrait' : 'landscape';
            }
        }));

        useEffect(() => {
            setIsMounted(true);
        }, []);

        useEffect(() => {
            if (!isMounted || !bookRef.current || !containerRef.current) return;

            let isDestroyed = false;

            const initFlipbook = () => {
                if (isDestroyed || !bookRef.current) return;

                // Cleanup any existing instance
                if (pageFlipInstance.current) {
                    try {
                        pageFlipInstance.current.destroy();
                    } catch {
                        // ignore
                    }
                    pageFlipInstance.current = null;
                }

                // Base page dimension (576 x 576 from PDF)
                const baseWidth = 576;
                const baseHeight = 576;

                try {
                    const flip = new PageFlip(bookRef.current, {
                        width: baseWidth,
                        height: baseHeight,
                        size: 'stretch',
                        minWidth: 260,
                        maxWidth: 750,
                        minHeight: 260,
                        maxHeight: 750,
                        maxShadowOpacity: 0.45,
                        showCover: true,
                        mobileScrollSupport: true,
                        usePortrait: true,
                        startPage: Math.max(0, initialPage - 1),
                        flippingTime: 700,
                        useMouseEvents: true,
                        swipeDistance: 30,
                        autoSize: true
                    });

                    flip.loadFromHTML(
                        bookRef.current.querySelectorAll<HTMLElement>('.flipbook-page-item')
                    );

                    pageFlipInstance.current = flip;

                    const updateState = () => {
                        if (!pageFlipInstance.current) return;
                        const currentIdx = pageFlipInstance.current.getCurrentPageIndex();
                        const orient = pageFlipInstance.current.getOrientation() === 'portrait' ? 'portrait' : 'landscape';
                        const currentPageNum = currentIdx + 1;

                        let spread: number[] = [currentPageNum];
                        if (orient === 'landscape') {
                            if (currentIdx === 0) {
                                // Cover spread (single front page)
                                spread = [1];
                            } else if (currentIdx === pages.length - 1 && pages.length % 2 === 1) {
                                // Back cover
                                spread = [pages.length];
                            } else {
                                // Double page spread
                                const leftPage = currentIdx; // 1-based is currentIdx
                                const rightPage = currentIdx + 1;
                                spread = [leftPage, rightPage].filter(p => p >= 1 && p <= pages.length);
                            }
                        }

                        onPageChange(currentPageNum, spread);
                        onOrientationChange(orient);
                    };

                    flip.on('flip', (e: { data: number }) => {
                        const targetPageNum = (e.data as number) + 1;
                        const orient = flip.getOrientation() === 'portrait' ? 'portrait' : 'landscape';
                        
                        let spread: number[] = [targetPageNum];
                        if (orient === 'landscape') {
                            if (targetPageNum === 1) {
                                spread = [1];
                            } else if (targetPageNum === pages.length && pages.length % 2 === 1) {
                                spread = [pages.length];
                            } else {
                                const left = (e.data as number);
                                const right = (e.data as number) + 1;
                                spread = [left, right].filter(p => p >= 1 && p <= pages.length);
                            }
                        }

                        onPageChange(targetPageNum, spread);
                    });

                    flip.on('changeOrientation', (e: { data: string }) => {
                        const orient = e.data === 'portrait' ? 'portrait' : 'landscape';
                        onOrientationChange(orient);
                        updateState();
                    });

                    flip.on('init', () => {
                        updateState();
                        onReady();
                    });

                    // Immediate ready trigger
                    setTimeout(() => {
                        updateState();
                        onReady();
                    }, 150);

                } catch (err) {
                    console.error('Error initializing PageFlip:', err);
                    onReady();
                }
            };

            const timer = setTimeout(initFlipbook, 50);

            return () => {
                isDestroyed = true;
                clearTimeout(timer);
                if (pageFlipInstance.current) {
                    try {
                        pageFlipInstance.current.destroy();
                    } catch {
                        // ignore
                    }
                    pageFlipInstance.current = null;
                }
            };
        }, [isMounted, pages, initialPage, onPageChange, onOrientationChange, onReady]);

        return (
            <div
                ref={containerRef}
                className="relative w-full h-full flex items-center justify-center overflow-hidden select-none"
            >
                {/* 3D Realistic Drop Shadows & Ambient Glow */}
                <div className="absolute inset-0 bg-gradient-radial from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Flipbook Container Wrapper */}
                <div
                    ref={bookRef}
                    className="flipbook-root-container shadow-2xl relative"
                    style={{ margin: 'auto' }}
                >
                    {pages.map((page) => {
                        const isCover = page.pageNumber === 1;
                        const isBackCover = page.pageNumber === pages.length;
                        const isInitialSpread = page.pageNumber === 1 || Math.abs(page.pageNumber - initialPage) <= 1;

                        return (
                            <div
                                key={page.pageNumber}
                                className={`flipbook-page-item overflow-hidden bg-[#0a151a] relative ${
                                    isCover ? '--hard --cover-front' : ''
                                } ${isBackCover ? '--hard --cover-back' : ''}`}
                                data-density={isCover || isBackCover ? 'hard' : 'soft'}
                                style={{ width: '576px', height: '576px' }}
                            >
                                {/* High-Resolution Page Canvas / Image */}
                                <div className="relative w-full h-full bg-neutral-900 overflow-hidden">
                                    <Image
                                        src={page.image}
                                        alt={page.title}
                                        width={576}
                                        height={576}
                                        priority={isInitialSpread}
                                        loading={isInitialSpread ? 'eager' : 'lazy'}
                                        sizes="(max-width: 768px) 100vw, 750px"
                                        className="object-contain w-full h-full pointer-events-none select-none"
                                    />

                                    {/* Realistic Center Spine Shadow (Left Page Gutter vs Right Page Gutter) */}
                                    {!isCover && !isBackCover && (
                                        <div
                                            className={`absolute inset-y-0 w-8 pointer-events-none opacity-40 mix-blend-multiply ${
                                                page.pageNumber % 2 === 0
                                                    ? 'right-0 bg-gradient-to-l from-black/60 to-transparent' // Even = Left page
                                                    : 'left-0 bg-gradient-to-r from-black/60 to-transparent'   // Odd = Right page
                                            }`}
                                        />
                                    )}

                                    {/* Subtle Page Edge Border */}
                                    <div className="absolute inset-0 border border-black/10 pointer-events-none" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
);
