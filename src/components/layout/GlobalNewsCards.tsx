'use client';

import DynamicNewsSection from '../news/DynamicNewsSection';
import { ArrowRight } from '@phosphor-icons/react';
import { Link } from "@aalto-dx/react-components";

export default function GlobalNewsCards() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-black mb-2 tracking-tight">Latest from Cannoga</h2>
                        <p className="text-neutral-500 max-w-md">Stay updated with the latest news, research breakthroughs, and community events from across the university.</p>
                    </div>
                    <Link href="/news" className="inline-flex items-center gap-2 text-black font-bold hover:underline underline-offset-4">
                        All news and events <ArrowRight size={20} weight="bold" />
                    </Link>
                </div>
                <DynamicNewsSection limit={3} showExcerpt={false} />
            </div>
        </section>
    );
}
