'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MagnifyingGlass, X, ArrowRight, BookOpen } from '@phosphor-icons/react';
import { Publication, SearchResult } from '@/types/flipbook';
import { searchPublication } from '@/lib/flipbook/publication-config';
import { trackViewbookEvent } from '@/lib/flipbook/analytics';

interface FlipbookSearchProps {
    isOpen: boolean;
    publication: Publication;
    onClose: () => void;
    onSelectPage: (pageNumber: number) => void;
}

export function FlipbookSearch({
    isOpen,
    publication,
    onClose,
    onSelectPage
}: FlipbookSearchProps) {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const results: SearchResult[] = useMemo(() => {
        if (!query || query.trim().length < 2) return [];
        return searchPublication(publication, query);
    }, [publication, query]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim().length >= 2) {
            trackViewbookEvent({
                event: 'search_performed',
                edition: publication.edition,
                searchQuery: query.trim()
            });
        }
    };

    if (!isOpen) return null;

    // Highlight query occurrences in snippet text
    const renderHighlightedSnippet = (snippet: string, term: string) => {
        if (!term || !snippet) return snippet;
        const parts = snippet.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === term.toLowerCase() ? (
                        <mark key={i} className="bg-[#c89211] text-black font-bold px-0.5 rounded">
                            {part}
                        </mark>
                    ) : (
                        part
                    )
                )}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 z-40 flex items-start justify-center p-4 pt-20 sm:pt-24 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-xl bg-[#0a151a] border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl text-white flex flex-col max-h-[80vh]">
                
                {/* Search Bar Header */}
                <form onSubmit={handleSearchSubmit} className="relative flex items-center mb-4">
                    <MagnifyingGlass size={20} weight="bold" className="absolute left-3.5 text-slate-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search programs, tuition, Ottawa, admissions..."
                        className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/15 focus:border-[#c89211] rounded-2xl pl-11 pr-10 py-3 text-sm font-medium text-white placeholder-slate-400 outline-none transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            if (query) setQuery('');
                            else onClose();
                        }}
                        aria-label="Clear Search"
                        className="absolute right-3 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                    >
                        <X size={18} weight="bold" />
                    </button>
                </form>

                {/* Popular Search Suggestions */}
                {query.length < 2 && (
                    <div className="py-2 space-y-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Suggested Topics
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {['Bachelors', 'Advanced Diplomas', 'Tuition', 'Ottawa', 'Scholarships', 'Schools', 'Apply', 'Hub'].map((term) => (
                                <button
                                    key={term}
                                    type="button"
                                    onClick={() => setQuery(term)}
                                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all active:scale-95"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Results Count */}
                {query.length >= 2 && (
                    <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10 text-xs font-semibold text-slate-400">
                        <span>
                            {results.length === 0
                                ? 'No matching pages found'
                                : `Found ${results.length} matching ${results.length === 1 ? 'page' : 'pages'}`}
                        </span>
                        <span className="font-mono text-[10px] text-[#c89211]">
                            13 Pages Indexed
                        </span>
                    </div>
                )}

                {/* Search Results List */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-white/20">
                    {results.map((res) => (
                        <button
                            key={res.pageNumber}
                            type="button"
                            onClick={() => {
                                onSelectPage(res.pageNumber);
                                onClose();
                            }}
                            className="w-full text-left p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c89211]/50 transition-all flex items-start justify-between gap-3 group focus:outline-none focus:ring-1 focus:ring-[#c89211]"
                        >
                            <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="bg-[#c89211]/20 text-[#c89211] font-mono font-bold text-xs px-2 py-0.5 rounded-md">
                                        Page {res.pageNumber}
                                    </span>
                                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                                        {res.pageTitle}
                                    </h4>
                                </div>
                                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-normal">
                                    {renderHighlightedSnippet(res.snippet, query)}
                                </p>
                            </div>

                            <div className="shrink-0 p-1.5 rounded-xl bg-white/5 group-hover:bg-[#c89211] group-hover:text-black text-slate-400 transition-all mt-1">
                                <ArrowRight size={14} weight="bold" />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Esc</kbd> to exit</span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xs font-bold text-[#c89211] hover:underline"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}
