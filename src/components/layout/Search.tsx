"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { MagnifyingGlass as SearchIcon, X, ArrowRight } from "@phosphor-icons/react"
import { SearchField } from "@/components/ui/SearchField"
import { searchablePages, SearchablePage } from "@/lib/search-data"

export function Search() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<SearchablePage[]>([])
    const router = useRouter()
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setIsOpen(true)
            }
            if (e.key === "Escape") {
                setIsOpen(false)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    React.useEffect(() => {
        if (!query.trim()) {
            setResults([])
            return
        }

        const lowerQuery = query.toLowerCase()
        const filtered = searchablePages.filter(page =>
            page.title.toLowerCase().includes(lowerQuery) ||
            page.category.toLowerCase().includes(lowerQuery)
        ).slice(0, 6)

        setResults(filtered)
    }, [query])

    const handleNavigate = (href: string) => {
        setIsOpen(false)
        setQuery("")
        router.push(href)
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 hover:opacity-70 transition-opacity flex items-center"
                aria-label="Open Search"
            >
                <SearchIcon size={20} weight="bold" className="text-[#2d2d2d]" />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-[100] bg-[#0f2027]/40 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Drop Modal */}
                    <div className="fixed top-0 left-0 right-0 lg:absolute lg:top-12 lg:right-0 lg:left-auto lg:w-[450px] z-[101] bg-white shadow-2xl animate-in slide-in-from-top-2 duration-200">
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex-1">
                                    <SearchField
                                        placeholder="Search university pages..."
                                        value={query}
                                        onChange={(v) => setQuery(v)}
                                        onEnter={() => results.length > 0 && handleNavigate(results[0].href)}
                                    />
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors shrink-0">
                                    <X size={24} weight="bold" />
                                </button>
                            </div>

                            <div className="space-y-1">
                                {results.length > 0 ? (
                                    results.map((result) => (
                                        <button
                                            key={result.href}
                                            onClick={() => handleNavigate(result.href)}
                                            className="w-full text-left p-3 hover:bg-neutral-50 flex items-center justify-between group transition-colors border border-transparent hover:border-[#0a151a]/5"
                                        >
                                            <div>
                                                <span className="text-[10px] uppercase tracking-widest font-black text-neutral-400 block">
                                                    {result.category}
                                                </span>
                                                <span className="text-sm font-bold text-black">{result.title}</span>
                                            </div>
                                            <ArrowRight size={14} weight="bold" className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-0 group-hover:translate-x-1" />
                                        </button>
                                    ))
                                ) : query.trim() ? (
                                    <div className="py-8 text-center text-neutral-400 italic text-sm">
                                        No results for "{query}"
                                    </div>
                                ) : (
                                    <div className="py-2 px-1">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">Quick Search</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Tuition', 'Admissions', 'Courses', 'Guide'].map(term => (
                                                <button
                                                    key={term}
                                                    onClick={() => setQuery(term)}
                                                    className="text-xs font-bold text-black hover:text-black hover:bg-neutral-50 p-2 text-left rounded border border-transparent hover:border-[#0a151a]/10 transition-all"
                                                >
                                                    {term}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

