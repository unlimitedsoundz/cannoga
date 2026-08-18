'use client';

import React, { forwardRef, useImperativeHandle } from 'react';
import { FlipbookPageMeta } from '@/types/flipbook';
import { FlipbookCanvasHandle } from './FlipbookCanvas';

interface SinglePageCanvasProps {
    pages: FlipbookPageMeta[];
    currentPage: number;
    onPageChange: (page: number, spread: number[]) => void;
    onReady?: () => void;
}

export const SinglePageCanvas = forwardRef<FlipbookCanvasHandle, SinglePageCanvasProps>(
    function SinglePageCanvas({ pages, currentPage, onPageChange, onReady }, ref) {
        const activeIdx = Math.max(0, Math.min(pages.length - 1, currentPage - 1));
        const activePageMeta = pages[activeIdx] || pages[0];

        useImperativeHandle(ref, () => ({
            nextPage: () => {
                const next = Math.min(pages.length, currentPage + 1);
                onPageChange(next, [next]);
            },
            prevPage: () => {
                const prev = Math.max(1, currentPage - 1);
                onPageChange(prev, [prev]);
            },
            firstPage: () => {
                onPageChange(1, [1]);
            },
            lastPage: () => {
                onPageChange(pages.length, [pages.length]);
            },
            goToPage: (pageNum: number) => {
                const target = Math.max(1, Math.min(pages.length, pageNum));
                onPageChange(target, [target]);
            },
            getCurrentPage: () => currentPage,
            getOrientation: () => 'portrait'
        }));

        React.useEffect(() => {
            onReady?.();
        }, [onReady]);

        return (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none py-2">
                {/* Ambient Soft Drop Shadow */}
                <div className="absolute inset-0 bg-gradient-radial from-black/30 via-transparent to-transparent pointer-events-none" />

                {/* Single Page Frame */}
                <div className="relative max-w-[540px] w-full aspect-square bg-[#0a151a] shadow-2xl overflow-hidden rounded-sm border border-black/40">
                    <img
                        key={`single-pg-${activePageMeta.pageNumber}`}
                        src={activePageMeta.image}
                        alt={activePageMeta.title}
                        width={576}
                        height={576}
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-contain pointer-events-none select-none transition-opacity duration-150"
                    />
                    <div className="absolute inset-0 border border-white/10 pointer-events-none" />
                </div>
            </div>
        );
    }
);
