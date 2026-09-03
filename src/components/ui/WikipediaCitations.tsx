'use client';

import React, { useState } from 'react';
import { BookOpen, ArrowUpRight, Check, Copy, ShieldCheck, GlobeHemisphereWest, Sparkle, LinkSimple, Code } from '@phosphor-icons/react';
import { WikipediaCitation, generateWikitextCitation } from '@/data/wikipediaCitations';
import { SchemaLD } from '@/components/seo/SchemaLD';
import { toast } from 'sonner';

interface WikipediaCitationsProps {
    citations: WikipediaCitation[];
    title?: string;
    description?: string;
    pageUrl?: string;
    pageName?: string;
}

export function WikipediaCitations({
    citations,
    title = "Encyclopedic Knowledge & Wikipedia References",
    description = "Official background context, statutory references, and open encyclopedic citations curated from reference resources.",
    pageUrl = "https://cannogacollege.ca",
    pageName = "Cannoga College Official Guide",
}: WikipediaCitationsProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [showBacklinkGuide, setShowBacklinkGuide] = useState<boolean>(false);

    if (!citations || citations.length === 0) return null;

    const categories = ['All', ...Array.from(new Set(citations.map(c => c.category)))];

    const filteredCitations = selectedCategory === 'All' 
        ? citations 
        : citations.filter(c => c.category === selectedCategory);

    const handleCopyBacklink = (citation: WikipediaCitation) => {
        const wikitext = citation.suggestedBacklinkWikitext || generateWikitextCitation(
            `${pageName} - ${citation.title}`,
            pageUrl,
            citation.description
        );

        navigator.clipboard.writeText(wikitext);
        setCopiedId(citation.id);
        toast.success(`Copied Wikipedia citation markup for "${citation.title}"`);

        setTimeout(() => {
            setCopiedId(null);
        }, 3000);
    };

    // Generate JSON-LD Schema.org Mentions & Citations for SEO
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": pageName || title,
        "url": pageUrl || "https://cannogacollege.ca",
        "mentions": citations.map(item => ({
            "@type": "Thing",
            "name": item.title,
            "sameAs": item.url,
            ...(item.wikidataId ? { "identifier": `wikidata:${item.wikidataId}` } : {})
        })),
        "citation": citations.map(item => ({
            "@type": "CreativeWork",
            "name": item.title,
            "url": item.url,
            "abstract": item.extract
        }))
    };

    return (
        <div className="my-10 pt-8 border-t border-neutral-200">
            {/* SEO Structured Data */}
            <SchemaLD data={schemaData} />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold uppercase tracking-wider mb-2 border border-neutral-200">
                        <BookOpen size={14} weight="bold" className="text-black" />
                        <span>Verified Open References &amp; Backlinks</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-black tracking-tight flex items-center gap-2">
                        {title}
                    </h3>
                    <p className="text-sm md:text-base text-neutral-600 max-w-3xl mt-1">
                        {description}
                    </p>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                    {/* Toggle Backlinks / Wikitext Panel */}
                    <button
                        onClick={() => setShowBacklinkGuide(!showBacklinkGuide)}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                        <Code size={14} weight="bold" />
                        <span>{showBacklinkGuide ? 'Hide Wikitext Backlinks' : 'Wikitext Backlink Snippets'}</span>
                    </button>

                    {/* Categories Tabs */}
                    {categories.length > 2 && (
                        <div className="flex flex-wrap gap-1 p-1 bg-neutral-100 rounded-lg border border-neutral-200">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                                        selectedCategory === cat
                                            ? 'bg-white text-black shadow-sm font-bold'
                                            : 'text-neutral-600 hover:text-black'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Expandable Wikipedia Wikitext Backlinks Panel */}
            {showBacklinkGuide && (
                <div className="mb-6 p-4 rounded-xl bg-neutral-900 text-white space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkle size={16} className="text-amber-400" />
                            <h4 className="text-sm font-bold text-white">Wikipedia {"{{cite web}}"} Backlink Syntax</h4>
                        </div>
                        <span className="text-[11px] text-neutral-400">MediaWiki Citation Format</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                        Use the copy button on any card below to copy standard MediaWiki <code className="text-amber-300 font-mono bg-neutral-800 px-1 py-0.5 rounded">&lt;ref&gt;{'{{cite web}}'}&lt;/ref&gt;</code> syntax for embedding Cannoga College citations directly into Wikipedia articles.
                    </p>
                </div>
            )}

            {/* Citation Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCitations.map((citation, index) => {
                    const isCopied = copiedId === citation.id;
                    const wikitextSnippet = citation.suggestedBacklinkWikitext || generateWikitextCitation(
                        `${pageName} - ${citation.title}`,
                        pageUrl,
                        citation.description
                    );

                    return (
                        <div
                            key={citation.id}
                            className="group relative bg-neutral-50 hover:bg-white border border-neutral-200 hover:border-neutral-400 rounded-xl p-5 transition-all duration-300 hover:shadow-md flex flex-col justify-between"
                        >
                            <div>
                                {/* Top Badge, Number & Copy Backlink Button */}
                                <div className="flex items-center justify-between gap-2 mb-2.5">
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-neutral-700 uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-200/80">
                                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                                        {citation.category}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleCopyBacklink(citation)}
                                            title="Copy Wikipedia Wikitext Backlink Citation"
                                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded transition-all ${
                                                isCopied
                                                    ? 'bg-green-100 text-green-800 border border-green-300 font-bold'
                                                    : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300'
                                            }`}
                                        >
                                            {isCopied ? (
                                                <>
                                                    <Check size={12} weight="bold" />
                                                    <span>Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={12} />
                                                    <span>Copy Wikitext</span>
                                                </>
                                            )}
                                        </button>
                                        <span className="text-xs font-mono text-neutral-500">
                                            [Ref. {index + 1}]
                                        </span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h4 className="text-base font-bold text-black group-hover:text-[#000] flex items-center justify-between gap-2 leading-snug">
                                    <span>{citation.title}</span>
                                </h4>

                                {/* Short Summary */}
                                <p className="text-xs text-neutral-600 mt-2 font-medium">
                                    {citation.description}
                                </p>

                                {/* Encyclopedic Extract */}
                                <div className="mt-3 p-3 rounded-lg bg-white/80 border border-neutral-200/70 text-xs text-neutral-800 leading-relaxed font-serif italic border-l-2 border-l-neutral-700">
                                    “{citation.extract}”
                                </div>

                                {/* Wikitext Preview if Guide is open */}
                                {showBacklinkGuide && (
                                    <div className="mt-3 p-2 bg-neutral-950 text-neutral-300 rounded font-mono text-[10px] break-all border border-neutral-800">
                                        {wikitextSnippet}
                                    </div>
                                )}
                            </div>

                            {/* Card Footer: External Link */}
                            <div className="mt-4 pt-3 border-t border-neutral-200/80 flex items-center justify-between">
                                <span className="text-[11px] text-neutral-600 font-sans flex items-center gap-1">
                                    <GlobeHemisphereWest size={13} className="text-neutral-500" />
                                    Wikipedia Encyclopedia
                                </span>
                                <a
                                    href={citation.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-bold text-black hover:text-[#c89211] underline-offset-4 hover:underline transition-colors"
                                    aria-label={`Read Wikipedia article about ${citation.title}`}
                                >
                                    <span>View Wikipedia article</span>
                                    <ArrowUpRight size={13} weight="bold" />
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Micro Citation Notice */}
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-neutral-500">
                <span className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-green-700 shrink-0" />
                    External references &amp; reciprocal backlink citations are structured according to standard MediaWiki {"{{cite web}}"} formats and Schema.org linked data.
                </span>
                <span className="shrink-0">
                    Source: Wikipedia &amp; Wikimedia Foundation Contributors (CC BY-SA 4.0)
                </span>
            </div>
        </div>
    );
}

interface InlineCiteProps {
    href: string;
    label: string;
    num?: number;
}

export function WikipediaInlineCite({ href, label, num }: InlineCiteProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Wikipedia Reference: ${label}`}
            className="inline-flex items-center gap-0.5 text-xs font-bold text-black hover:text-[#c89211] hover:underline bg-neutral-100 hover:bg-neutral-200 px-1.5 py-0.5 rounded mx-1 align-baseline border border-neutral-300 transition-colors"
        >
            <span>{label}</span>
            {num && <span className="font-mono text-[10px] text-black">[{num}]</span>}
            <ArrowUpRight size={10} weight="bold" className="text-black" />
        </a>
    );
}

