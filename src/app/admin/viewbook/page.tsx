'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    BookOpen,
    Eye,
    DownloadSimple,
    UploadSimple,
    CheckCircle,
    Archive,
    Sparkle,
    FilePdf,
    Globe,
    ShareNetwork
} from '@phosphor-icons/react';
import { ALL_PUBLICATIONS } from '@/lib/flipbook/publication-config';
import { Publication } from '@/types/flipbook';

export default function AdminViewbookPage() {
    const [publications, setPublications] = useState<Publication[]>(ALL_PUBLICATIONS);
    const [selectedPub, setSelectedPub] = useState<Publication>(ALL_PUBLICATIONS[0]);
    const [isSaving, setIsSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const handleTogglePublish = (id: string) => {
        setPublications(prev => prev.map(p => {
            if (p.id === id) {
                return { ...p, published: !p.published };
            }
            return p;
        }));
        setStatusMessage('Publication status updated.');
        setTimeout(() => setStatusMessage(null), 3000);
    };

    return (
        <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
                        <BookOpen size={16} weight="bold" />
                        <span>Digital Publications CMS</span>
                    </div>
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
                        Viewbook &amp; Prospectus Manager
                    </h1>
                    <p className="text-sm text-neutral-600 mt-1">
                        Manage interactive Issuu-style digital viewbooks, versions, PDF source files, and analytics.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/viewbook/"
                        target="_blank"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm no-underline active:scale-95"
                    >
                        <Eye size={16} weight="bold" />
                        Preview Live Flipbook
                    </Link>
                </div>
            </div>

            {statusMessage && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle size={18} weight="fill" />
                    <span>{statusMessage}</span>
                </div>
            )}

            {/* Main Grid: Editions List & Detail View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Edition Cards */}
                <div className="space-y-4 lg:col-span-1">
                    <h2 className="text-sm font-black uppercase tracking-wider text-neutral-500">
                        Publication Editions
                    </h2>

                    {publications.map((pub) => {
                        const isSelected = selectedPub.id === pub.id;
                        return (
                            <div
                                key={pub.id}
                                onClick={() => setSelectedPub(pub)}
                                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer bg-white shadow-sm flex flex-col justify-between space-y-4 ${
                                    isSelected
                                        ? 'border-neutral-900 ring-2 ring-neutral-900/10'
                                        : 'border-neutral-200 hover:border-neutral-400'
                                }`}
                            >
                                <div className="flex gap-4 items-start">
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-neutral-200 shrink-0 shadow-inner">
                                        <Image
                                            src={pub.coverImage}
                                            alt={pub.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                                                {pub.edition}
                                            </span>
                                            {pub.published ? (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-200 text-neutral-700">
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-sm text-neutral-900 truncate mt-1">
                                            {pub.title}
                                        </h3>
                                        <p className="text-xs text-neutral-500 font-mono">
                                            {pub.totalPages} Pages • PDF 59.7 MB
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                                    <span className="text-neutral-500 font-medium">
                                        Slug: <code className="font-bold text-neutral-800">{pub.slug}</code>
                                    </span>
                                    <span className="text-amber-700 font-bold hover:underline">
                                        Edit Details →
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {/* Archive Placeholder */}
                    <div className="p-5 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 text-neutral-500 flex flex-col items-center justify-center text-center p-6 space-y-2">
                        <Archive size={24} weight="duotone" className="text-neutral-400" />
                        <span className="text-xs font-bold text-neutral-700">Multi-Year Edition Archiving</span>
                        <p className="text-[11px] text-neutral-500 max-w-xs">
                            New yearly viewbooks can be added here without overwriting previous historical editions.
                        </p>
                    </div>
                </div>

                {/* Right Column: Edition Details & Analytics */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                            <div>
                                <h3 className="text-xl font-black text-neutral-900">
                                    {selectedPub.title}
                                </h3>
                                <p className="text-xs text-neutral-500 mt-0.5">
                                    Live at <code className="text-amber-700 font-bold">/viewbook/{selectedPub.slug}</code>
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleTogglePublish(selectedPub.id)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        selectedPub.published
                                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                            : 'bg-neutral-900 text-white hover:bg-neutral-800'
                                    }`}
                                >
                                    {selectedPub.published ? 'Published (Active)' : 'Publish Edition'}
                                </button>
                            </div>
                        </div>

                        {/* Metadata Form */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-neutral-700">Publication Title</label>
                                <input
                                    type="text"
                                    value={selectedPub.title}
                                    readOnly
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-800 outline-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-neutral-700">Academic Edition Year</label>
                                <input
                                    type="text"
                                    value={selectedPub.edition}
                                    readOnly
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-800 outline-none"
                                />
                            </div>

                            <div className="sm:col-span-2 space-y-1">
                                <label className="text-xs font-bold text-neutral-700">SEO &amp; Sharing Description</label>
                                <textarea
                                    rows={2}
                                    value={selectedPub.description}
                                    readOnly
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium text-neutral-700 outline-none"
                                />
                            </div>

                            <div className="sm:col-span-2 space-y-1">
                                <label className="text-xs font-bold text-neutral-700">Source PDF File Location</label>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-200 bg-neutral-50">
                                    <FilePdf size={20} weight="duotone" className="text-red-600 shrink-0" />
                                    <span className="text-xs font-mono text-neutral-700 truncate w-full">
                                        {selectedPub.pdfUrl}
                                    </span>
                                    <a
                                        href={selectedPub.pdfUrl}
                                        download="Cannoga-College-Viewbook-2026-2027.pdf"
                                        className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-[11px] font-bold hover:bg-neutral-800 transition-all shrink-0 no-underline"
                                    >
                                        Download
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Page Thumbnails Preview Grid */}
                        <div className="pt-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black uppercase tracking-wider text-neutral-700">
                                    Verified Page Directory ({selectedPub.pages.length} Pages)
                                </h4>
                                <span className="text-[11px] font-bold text-neutral-500 font-mono">
                                    Aspect Ratio 1:1 (576 x 576)
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                {selectedPub.pages.map((p) => (
                                    <div
                                        key={p.pageNumber}
                                        className="group relative rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-sm"
                                    >
                                        <div className="relative aspect-square w-full">
                                            <Image
                                                src={p.thumbnail}
                                                alt={p.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform"
                                            />
                                        </div>
                                        <div className="p-1.5 bg-white text-[10px]">
                                            <span className="font-mono font-bold block text-neutral-900 truncate">
                                                Page {p.pageNumber}
                                            </span>
                                            <span className="text-neutral-500 block truncate">
                                                {p.section}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Performance & Technology Specs */}
                        <div className="pt-4 border-t border-neutral-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100">
                                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Rendering Engine</span>
                                <span className="text-sm font-black text-neutral-900 block mt-0.5">page-flip + PDF.js</span>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100">
                                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Desktop Mode</span>
                                <span className="text-sm font-black text-neutral-900 block mt-0.5">2-Page Spread</span>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100">
                                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Mobile Mode</span>
                                <span className="text-sm font-black text-neutral-900 block mt-0.5">Single Page Swipe</span>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100">
                                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Search Index</span>
                                <span className="text-sm font-black text-neutral-900 block mt-0.5">Fulltext Extracted</span>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
