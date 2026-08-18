'use client';

import React, { useState } from 'react';
import {
    X,
    Copy,
    Check,
    ShareNetwork,
    EnvelopeSimple,
    LinkedinLogo,
    TwitterLogo,
    WhatsappLogo,
    LinkSimple
} from '@phosphor-icons/react';
import { Publication } from '@/types/flipbook';
import { trackViewbookEvent } from '@/lib/flipbook/analytics';

interface FlipbookShareModalProps {
    isOpen: boolean;
    publication: Publication;
    currentPage: number;
    onClose: () => void;
}

export function FlipbookShareModal({
    isOpen,
    publication,
    currentPage,
    onClose
}: FlipbookShareModalProps) {
    const [includePage, setIncludePage] = useState(true);
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://cannogacollege.ca';
    const shareUrl = includePage && currentPage > 1
        ? `${baseUrl}/viewbook/${publication.slug}?page=${currentPage}`
        : `${baseUrl}/viewbook/${publication.slug}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            trackViewbookEvent({
                event: 'viewbook_shared',
                edition: publication.edition,
                shareMethod: 'clipboard_copy',
                pageNumber: includePage ? currentPage : undefined
            });
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // Fallback
        }
    };

    const handleNativeShare = async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: publication.title,
                    text: `${publication.title} - ${publication.description}`,
                    url: shareUrl
                });
                trackViewbookEvent({
                    event: 'viewbook_shared',
                    edition: publication.edition,
                    shareMethod: 'web_share_api'
                });
            } catch {
                // Cancelled
            }
        }
    };

    const emailSubject = encodeURIComponent(publication.title);
    const emailBody = encodeURIComponent(`Explore the Cannoga College ${publication.edition} Viewbook:\n\n${shareUrl}`);
    const emailHref = `mailto:?subject=${emailSubject}&body=${emailBody}`;

    const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Explore the @CannogaCollege ${publication.edition} Viewbook:`)}&url=${encodeURIComponent(shareUrl)}`;
    const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`Check out the Cannoga College Viewbook: ${shareUrl}`)}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#0a151a] border border-white/15 rounded-3xl p-6 shadow-2xl text-white space-y-5">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <ShareNetwork size={20} weight="bold" className="text-[#c89211]" />
                        <h3 className="text-base font-black text-white uppercase tracking-wider">
                            Share Viewbook
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close Share Modal"
                        className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={18} weight="bold" />
                    </button>
                </div>

                {/* Deep Link Toggle */}
                {currentPage > 1 && (
                    <label className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={includePage}
                            onChange={(e) => setIncludePage(e.target.checked)}
                            className="w-4 h-4 rounded text-[#c89211] bg-white/10 border-white/20 focus:ring-[#c89211]"
                        />
                        <div className="text-xs">
                            <span className="font-bold text-white block">Link directly to Page {currentPage}</span>
                            <span className="text-slate-400 font-normal">Recipients will open directly on this spread</span>
                        </div>
                    </label>
                )}

                {/* URL Box & Copy Button */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/15 rounded-2xl p-2 pl-3">
                        <LinkSimple size={18} weight="bold" className="text-slate-400 shrink-0" />
                        <input
                            type="text"
                            readOnly
                            value={shareUrl}
                            className="bg-transparent text-xs text-slate-200 outline-none w-full truncate font-mono"
                        />
                        <button
                            type="button"
                            onClick={handleCopy}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 active:scale-95 ${
                                copied
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-[#c89211] text-black font-black hover:bg-[#b07f0f]'
                            }`}
                        >
                            {copied ? (
                                <>
                                    <Check size={14} weight="bold" />
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={14} weight="bold" />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Native Share / Social Share Channels */}
                <div className="pt-2 space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Share Via
                    </p>

                    <div className="grid grid-cols-4 gap-2">
                        {/* Email */}
                        <a
                            href={emailHref}
                            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-all no-underline gap-1 text-center"
                        >
                            <EnvelopeSimple size={20} weight="bold" />
                            <span className="text-[10px] font-bold">Email</span>
                        </a>

                        {/* WhatsApp */}
                        <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-all no-underline gap-1 text-center"
                        >
                            <WhatsappLogo size={20} weight="fill" />
                            <span className="text-[10px] font-bold">WhatsApp</span>
                        </a>

                        {/* LinkedIn */}
                        <a
                            href={linkedinHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-all no-underline gap-1 text-center"
                        >
                            <LinkedinLogo size={20} weight="fill" />
                            <span className="text-[10px] font-bold">LinkedIn</span>
                        </a>

                        {/* X / Twitter */}
                        <a
                            href={twitterHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-all no-underline gap-1 text-center"
                        >
                            <TwitterLogo size={20} weight="fill" />
                            <span className="text-[10px] font-bold">X</span>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}
