'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Link } from "@aalto-dx/react-components";
import { News } from '@/types/database';
import { createClient } from '@/utils/supabase/client';
import { formatToDDMMYYYY } from '@/utils/date';
import { CaretLeft, FacebookLogo, TwitterLogo, LinkedinLogo, LinkSimple, ArrowRight } from "@phosphor-icons/react";
import DynamicNewsSection from './DynamicNewsSection';
import { Info } from '@/components/ui/Info';

interface NewsDetailClientProps {
    initialNews: News;
}

export default function NewsDetailClient({ initialNews }: NewsDetailClientProps) {
    const [currentNews, setNews] = useState<News>(initialNews);

    useEffect(() => {
        async function fetchLatest() {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('News')
                .select('*')
                .eq('id', initialNews.id)
                .single();

            if (data && !error) {
                if (data.content !== initialNews.content || data.title !== initialNews.title) {
                    setNews(data as News);
                }
            }
        }
        fetchLatest();
    }, [initialNews.id, initialNews.content]);

    return (
        <div className="min-h-screen bg-white font-sans text-black">
            <section className="text-black overflow-hidden border-b border-[#0a151a]/5" style={{ backgroundColor: '#FDF2F8' }}>
                <div className="container mx-auto flex flex-col lg:flex-row items-center gap-2 lg:gap-16 pt-0 md:pt-12 pb-12 lg:pb-0 h-auto lg:h-[600px] lg:py-0 relative mb-0">
                    {/* Left Content */}
                    <div className="lg:w-1/2 space-y-6 relative z-10 flex flex-col justify-center h-full pt-2 lg:pt-0 px-4 md:px-0">
                        <h1 className="font-bold text-4xl lg:text-aalto-7 leading-[1.1] lg:leading-aalto-7 tracking-aalto-3 text-black">
                            {currentNews.title}
                        </h1>
                    </div>

                    {/* Right Image */}
                    <div className="lg:w-1/2 h-full w-full relative lg:translate-y-16 z-20 flex justify-center lg:block order-first lg:order-none">
                        <div className="h-full w-full">
                            <div className="relative w-full aspect-square md:aspect-auto lg:w-full lg:h-full bg-neutral-100 overflow-hidden">
                                {currentNews.imageUrl && (
                                    <Image
                                        src={currentNews.imageUrl}
                                        alt={currentNews.title}
                                        fill
                                        priority
                                        unoptimized
                                        className="object-cover object-top"
                                        sizes="100vw"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-6 max-w-3xl mt-12 lg:mt-24">
                <Link href="/news" className="text-neutral-500 hover:text-black font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 transition-colors">
                    <CaretLeft size={16} weight="bold" /> Back to News
                </Link>
            </div>

            <div className="container mx-auto px-4 pb-16 md:pb-24 max-w-3xl">
                
                <Info 
                    items={[
                        { title: "Published", body: formatToDDMMYYYY(currentNews.publishDate) },
                        { title: "Type", body: "Cannoga News" },
                        {
                            tagGroup: {
                                tags: [
                                    { label: "University" },
                                    { label: "Community" }
                                ]
                            }
                        }
                    ]}
                />

                <div className="prose prose-lg mx-auto">
                    <div className="whitespace-pre-wrap text-aalto-3 text-neutral-800 leading-aalto-3 font-medium">
                        {currentNews.content}
                    </div>
                </div>

                {/* Social Share Section */}
                <div className="mt-16 pt-10 border-t border-neutral-100">
                    <div className="flex flex-wrap items-center gap-8">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Share this article</span>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                                className="w-12 h-12 flex items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors"
                                title="Share on Facebook"
                            >
                                <FacebookLogo size={24} weight="fill" className="text-[#1877F2]" />
                            </button>
                            <button 
                                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(currentNews.title)}`, '_blank')}
                                className="w-12 h-12 flex items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors"
                                title="Share on Twitter"
                            >
                                <TwitterLogo size={24} weight="fill" className="text-[#1DA1F2]" />
                            </button>
                            <button 
                                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                                className="w-12 h-12 flex items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors"
                                title="Share on LinkedIn"
                            >
                                <LinkedinLogo size={24} weight="fill" className="text-[#0A66C2]" />
                            </button>
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert('Link copied to clipboard!');
                                }}
                                className="w-12 h-12 flex items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors"
                                title="Copy Link"
                            >
                                <LinkSimple size={24} weight="bold" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Links */}
                <div className="mt-20 pt-12 border-t border-neutral-100">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-900 mb-8">Related Links</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { title: "Admissions", href: "/admissions", desc: "Start your journey." },
                            { title: "Programmes", href: "/studies", desc: "What we offer." },
                            { title: "Support", href: "/student-guide", desc: "Here to help." },
                        ].map(link => (
                            <Link key={link.href} href={link.href} className="bg-neutral-50 p-6 hover:bg-neutral-100 transition-all border-l-2 border-transparent hover:border-[#0a151a] group">
                                <h4 className="font-bold text-black mb-1 group-hover:underline text-sm">{link.title}</h4>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">{link.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Read More Section */}
            <section className="bg-neutral-50 py-20 md:py-32 border-t border-neutral-100">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-16 max-w-6xl mx-auto">
                        <div>
                            <h2 className="text-aalto-6 font-bold mb-4 tracking-tight">Read more news</h2>
                            <p className="text-aalto-3 text-neutral-600 font-medium">Discover more stories and updates from Cannoga College.</p>
                        </div>
                        <Link href="/news" className="hidden md:flex items-center gap-3 font-bold uppercase tracking-widest text-xs hover:underline">
                            All news <ArrowRight size={20} weight="bold" />
                        </Link>
                    </div>
                    
                    <div className="max-w-6xl mx-auto">
                        <DynamicNewsSection limit={3} excludeId={currentNews.id} />
                    </div>

                    <div className="flex md:hidden mt-12">
                        <Link href="/news" className="flex items-center justify-center gap-3 w-full py-5 bg-[#0a151a] text-white font-bold uppercase tracking-widest text-xs">
                            All news <ArrowRight size={20} weight="bold" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}


