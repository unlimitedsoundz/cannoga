'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Link } from "@aalto-dx/react-components";
import { CTA } from "@aalto-dx/react-modules";
import { News } from '@/types/database';
import { createClient } from '@/utils/supabase/client';
import { formatToDDMMYYYY } from '@/utils/date';
import { CaretLeft, FacebookLogo, TwitterLogo, LinkedinLogo, LinkSimple, ArrowRight } from "@phosphor-icons/react";
import DynamicNewsSection from './DynamicNewsSection';
import { Info } from '@/components/ui/Info';
import { Hero } from '@/components/layout/Hero';

import '@/styles/ckeditor-content.css';

interface NewsDetailClientProps {
    initialNews: News;
}

export default function NewsDetailClient({ initialNews }: NewsDetailClientProps) {
    const [currentNews, setNews] = useState<News>(initialNews);
    const [coverImageFailed, setCoverImageFailed] = useState(false);
    const [heroImageFailed, setHeroImageFailed] = useState(false);

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

    const isHtmlContent = Boolean(currentNews.content && /<[a-z][\s\S]*>/i.test(currentNews.content));

    return (
        <div className="min-h-screen bg-white font-sans text-black">
            {/* Hero */}
            <Hero
                title={currentNews.title}
                body={currentNews.excerpt || "Official institutional announcement and updates from Cannoga College Ottawa campus."}
                image={{
                    src: (!heroImageFailed && currentNews.imageUrl) ? currentNews.imageUrl : "/images/home-carousel-1.png",
                    alt: currentNews.title
                }}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'News', href: '/news' },
                    { label: currentNews.title }
                ]}
            />

            {/* Back nav */}
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                <Link href="/news/" className="text-neutral-500 hover:text-black font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 transition-colors">
                    <CaretLeft size={16} weight="bold" /> Back to News
                </Link>
            </div>

            {/* Article body */}
            <div className="container mx-auto px-4 pb-16 md:pb-24 max-w-4xl">
                
                <Info 
                    items={[
                        { title: "Published", body: formatToDDMMYYYY(currentNews.publishDate) },
                        { title: "Author", body: "Cannoga Communications" },
                        {
                            tagGroup: {
                                tags: [
                                    { label: "News" },
                                    { label: "Institutional" },
                                    { label: "Ottawa" }
                                ]
                            }
                        }
                    ]}
                />

                {/* Excerpt Lead */}
                {currentNews.excerpt && (
                    <div className="mb-10">
                        <p className="text-aalto-4 text-neutral-800 leading-aalto-3 font-medium">
                            {currentNews.excerpt}
                        </p>
                    </div>
                )}

                {/* Content Image if exists */}
                {currentNews.imageUrl && !coverImageFailed && (
                    <div className="mb-12">
                        <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-neutral-100">
                            <Image
                                src={currentNews.imageUrl}
                                alt={currentNews.title}
                                fill
                                unoptimized
                                className="object-cover object-top"
                                sizes="(max-width: 768px) 100vw, 800px"
                                onError={() => setCoverImageFailed(true)}
                            />
                        </div>
                    </div>
                )}

                {/* Main Content Body */}
                <div className="my-10">
                    {isHtmlContent ? (
                        <div
                            className="ck-content prose prose-neutral max-w-none text-base md:text-lg text-neutral-800 leading-relaxed font-normal [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:my-6 [&_img]:shadow-sm [&_figure]:my-6 [&_figure]:max-w-full [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800"
                            dangerouslySetInnerHTML={{ __html: currentNews.content }}
                        />
                    ) : (
                        <div className="whitespace-pre-wrap text-base md:text-lg text-neutral-800 leading-relaxed font-normal space-y-6">
                            {currentNews.content}
                        </div>
                    )}
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

                {/* CTA Section */}
                <div className="py-12 mt-10">
                    <CTA
                        title="Ready to Start Your Journey?"
                        body="Cannoga College offers world-class career-focused programmes in Business, Technology, Science, and Health Sciences. Applications for Autumn 2026 are now open."
                        cta={{
                            label: "Apply Now",
                            linkComponentProps: {
                                href: "/admissions",
                            },
                        }}
                    />
                </div>

                {/* Related links */}
                <div className="mt-12 grid md:grid-cols-3 gap-8">
                    {[
                        { title: "Student Life", href: "/student-life", desc: "Explore campus and housing." },
                        { title: "Tuition Fees", href: "/admissions/tuition", desc: "Scholarships and aids." },
                        { title: "Arrival Guide", href: "/student-guide/arrival", desc: "Settling in Ottawa." },
                    ].map(link => (
                        <Link key={link.href} href={link.href} className="bg-neutral-50 p-8 hover:bg-neutral-100 transition-all group border-l-2 border-transparent hover:border-[#0a151a]">
                            <h3 className="font-bold text-[#000000] mb-2 group-hover:underline">{link.title}</h3>
                            <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest leading-relaxed">{link.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Read More Section */}
            <section className="bg-neutral-50 py-20 md:py-32 border-t border-neutral-100">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-16 max-w-6xl mx-auto">
                        <div>
                            <h2 className="text-aalto-6 font-bold mb-4 tracking-tight">Read more news</h2>
                            <p className="text-aalto-3 text-black font-medium">Discover more stories and updates from Cannoga College.</p>
                        </div>
                        <Link href="/news/" className="hidden md:flex items-center gap-3 font-bold uppercase tracking-widest text-xs hover:underline">
                            All news <ArrowRight size={20} weight="bold" />
                        </Link>
                    </div>
                    
                    <div className="max-w-6xl mx-auto">
                        <DynamicNewsSection limit={3} excludeId={currentNews.id} />
                    </div>

                    <div className="flex md:hidden mt-12">
                        <Link href="/news/" className="flex items-center justify-center gap-3 w-full py-5 bg-[#0a151a] text-white font-bold uppercase tracking-widest text-xs">
                            All news <ArrowRight size={20} weight="bold" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
