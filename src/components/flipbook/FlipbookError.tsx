'use client';

import React from 'react';
import { WarningCircle, ArrowClockwise, DownloadSimple } from '@phosphor-icons/react';

interface FlipbookErrorProps {
    message?: string;
    pdfUrl: string;
    onRetry?: () => void;
}

export function FlipbookError({
    message = 'Unable to load the digital viewbook spread.',
    pdfUrl,
    onRetry
}: FlipbookErrorProps) {
    return (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#070e12] text-white p-6">
            <div className="flex flex-col items-center max-w-md text-center space-y-6 bg-[#0a151a] border border-white/10 p-8 rounded-2xl shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <WarningCircle size={32} weight="bold" />
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-black text-white tracking-tight">
                        Publication Unavailable
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed font-normal">
                        {message} You can retry loading or download the official PDF directly.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 items-center justify-center pt-2">
                    {onRetry && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all active:scale-95"
                        >
                            <ArrowClockwise size={16} weight="bold" />
                            Retry Viewer
                        </button>
                    )}
                    <a
                        href={pdfUrl}
                        download="Cannoga-College-Viewbook-2026-2027.pdf"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c89211] hover:bg-[#b07f0f] text-black text-xs font-black transition-all active:scale-95 no-underline shadow-lg shadow-amber-500/20"
                    >
                        <DownloadSimple size={16} weight="bold" />
                        Download PDF
                    </a>
                </div>
            </div>
        </div>
    );
}
