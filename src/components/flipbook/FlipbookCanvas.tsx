'use client';

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
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

        const [activePage, setActivePage] = useState(initialPage);
        const [currentOrientation, setCurrentOrientation] = useState<FlipOrientation>('landscape');

        // Keep callback refs stable
        const onPageChangeRef = useRef(onPageChange);
        onPageChangeRef.current = onPageChange;

        const onOrientationChangeRef = useRef(onOrientationChange);
        onOrientationChangeRef.current = onOrientationChange;

        const onReadyRef = useRef(onReady);
        onReadyRef.current = onReady;

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
                if (!pageFlipInstance.current) return activePage;
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

        // PageFlip lifecycle for Spread Mode
        useEffect(() => {
            if (!isMounted || !bookRef.current || !containerRef.current) return;

            let isDestroyed = false;

            // Destroy existing instance cleanly
            if (pageFlipInstance.current) {
                try {
                    pageFlipInstance.current.destroy();
                } catch {
                    // ignore
                }
                pageFlipInstance.current = null;
            }

            const bookEl = bookRef.current;
            bookEl.innerHTML = '';

            pages.forEach((page) => {
                const isCover = page.pageNumber === 1;
                const isBackCover = page.pageNumber === pages.length;

                const pageItem = document.createElement('div');
                pageItem.className = `flipbook-page-item overflow-hidden bg-[#0a151a] relative ${
                    isCover ? '--hard --cover-front' : ''
                } ${isBackCover ? '--hard --cover-back' : ''}`;
                pageItem.setAttribute('data-density', isCover || isBackCover ? 'hard' : 'soft');
                pageItem.style.width = '576px';
                pageItem.style.height = '576px';

                const innerWrapper = document.createElement('div');
                innerWrapper.className = 'relative w-full h-full bg-neutral-900 overflow-hidden';

                const img = document.createElement('img');
                img.src = page.image;
                img.alt = page.title;
                img.width = 576;
                img.height = 576;
                img.loading = 'eager';
                img.decoding = 'async';
                img.className = 'object-contain w-full h-full pointer-events-none select-none';
                innerWrapper.appendChild(img);

                // Spine shadow
                if (!isCover && !isBackCover) {
                    const spineShadow = document.createElement('div');
                    spineShadow.className = `absolute inset-y-0 w-8 pointer-events-none opacity-40 mix-blend-multiply ${
                        page.pageNumber % 2 === 0
                            ? 'right-0 bg-gradient-to-l from-black/60 to-transparent'
                            : 'left-0 bg-gradient-to-r from-black/60 to-transparent'
                    }`;
                    innerWrapper.appendChild(spineShadow);
                }

                const borderDiv = document.createElement('div');
                borderDiv.className = 'absolute inset-0 border border-black/10 pointer-events-none';
                innerWrapper.appendChild(borderDiv);

                pageItem.appendChild(innerWrapper);
                bookEl.appendChild(pageItem);
            });

            const pageElements = bookEl.querySelectorAll<HTMLElement>('.flipbook-page-item');
            if (pageElements.length === 0) {
                onReadyRef.current();
                return;
            }

            try {
                const flip = new PageFlip(bookEl, {
                    width: 576,
                    height: 576,
                    size: 'stretch',
                    minWidth: 120,
                    maxWidth: 750,
                    minHeight: 120,
                    maxHeight: 750,
                    maxShadowOpacity: 0.45,
                    showCover: true,
                    mobileScrollSupport: true,
                    usePortrait: false,
                    startPage: Math.max(0, initialPage - 1),
                    flippingTime: 650,
                    useMouseEvents: true,
                    swipeDistance: 30,
                    autoSize: true
                });

                flip.loadFromHTML(pageElements);
                pageFlipInstance.current = flip;

                const updateState = () => {
                    if (!pageFlipInstance.current) return;
                    const currentIdx = pageFlipInstance.current.getCurrentPageIndex();
                    const rawOrient = pageFlipInstance.current.getOrientation();
                    const orient = rawOrient === 'portrait' ? 'portrait' : 'landscape';
                    const currentPageNum = currentIdx + 1;

                    setActivePage(currentPageNum);
                    setCurrentOrientation(orient);

                    let spread: number[] = [currentPageNum];
                    if (orient === 'landscape') {
                        if (currentIdx === 0) {
                            spread = [1];
                        } else if (currentIdx === pages.length - 1 && pages.length % 2 === 1) {
                            spread = [pages.length];
                        } else {
                            const leftPage = currentIdx;
                            const rightPage = currentIdx + 1;
                            spread = [leftPage, rightPage].filter(p => p >= 1 && p <= pages.length);
                        }
                    }

                    onPageChangeRef.current(currentPageNum, spread);
                    onOrientationChangeRef.current(orient);
                };

                flip.on('flip', (e: { data: number }) => {
                    const targetPageNum = (e.data as number) + 1;
                    const rawOrient = flip.getOrientation();
                    const orient = rawOrient === 'portrait' ? 'portrait' : 'landscape';
                    
                    setActivePage(targetPageNum);
                    setCurrentOrientation(orient);

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

                    onPageChangeRef.current(targetPageNum, spread);
                });

                flip.on('changeOrientation', (e: { data: string }) => {
                    const orient = e.data === 'portrait' ? 'portrait' : 'landscape';
                    setCurrentOrientation(orient);
                    onOrientationChangeRef.current(orient);
                    updateState();
                });

                flip.on('init', () => {
                    updateState();
                    onReadyRef.current();
                });

                setTimeout(() => {
                    if (!isDestroyed) {
                        updateState();
                        onReadyRef.current();
                    }
                }, 100);

            } catch (err) {
                console.error('Error initializing PageFlip:', err);
                onReadyRef.current();
            }

            return () => {
                isDestroyed = true;
                if (pageFlipInstance.current) {
                    try {
                        pageFlipInstance.current.destroy();
                    } catch {
                        // ignore
                    }
                    pageFlipInstance.current = null;
                }
            };
        }, [isMounted, pages, initialPage]);

        // Render 2-Page Spread Mode with PageFlip
        const isFrontCover = activePage === 1;
        const isBackCover = activePage === pages.length;

        let coverOffset = '0%';
        if (currentOrientation === 'landscape') {
            if (isFrontCover) {
                coverOffset = '-25%';
            } else if (isBackCover) {
                coverOffset = '25%';
            }
        }

        return (
            <div
                ref={containerRef}
                className="relative w-full h-full flex items-center justify-center overflow-hidden select-none"
            >
                {/* 3D Realistic Drop Shadows & Ambient Glow */}
                <div className="absolute inset-0 bg-gradient-radial from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Flipbook Container Wrapper with Centering Animation for Covers */}
                <div
                    ref={bookRef}
                    className="flipbook-root-container shadow-2xl relative transition-transform duration-500 ease-out"
                    style={{
                        margin: 'auto',
                        transform: `translateX(${coverOffset})`
                    }}
                />
            </div>
        );
    }
);
