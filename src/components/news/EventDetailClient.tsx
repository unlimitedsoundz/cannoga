'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Link } from "@aalto-dx/react-components";
import { CTA } from "@aalto-dx/react-modules";
import { Event } from '@/types/database';
import { createClient } from '@/utils/supabase/client';
import { formatToDDMMYYYY } from '@/utils/date';
import { Calendar, MapPin, Clock, Tag, CaretLeft as ChevronLeft } from "@phosphor-icons/react";

interface EventDetailClientProps {
    initialEvent: Event;
}

export default function EventDetailClient({ initialEvent }: EventDetailClientProps) {
    const [currentEvent, setEvent] = useState<Event>(initialEvent);

    useEffect(() => {
        async function fetchLatest() {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('Event')
                .select('*')
                .eq('id', initialEvent.id)
                .single();

            if (data && !error) {
                if (data.updated_at !== initialEvent.updated_at || data.content !== initialEvent.content) {
                    setEvent(data as Event);
                }
            }
        }
        fetchLatest();
        }, [initialEvent.id, initialEvent.updated_at, initialEvent.content]);

    return (
        <div className="min-h-screen bg-white">
            {/* HERO SECTION */}
            <section className="text-black overflow-hidden" style={{ backgroundColor: '#FDF2F8' }}>
                <div className="container mx-auto flex flex-col lg:flex-row items-center gap-2 lg:gap-16 pt-0 md:pt-12 pb-12 lg:pb-0 h-auto lg:h-[600px] lg:py-0 relative mb-0">
                    {/* Left Content */}
                    <div className="lg:w-1/2 space-y-6 relative z-10 flex flex-col justify-center h-full pt-2 lg:pt-0 px-4 md:px-0">
                        <div className="text-sm font-bold text-black uppercase tracking-wider mb-2">
                            {currentEvent.category || 'Event'} • {formatToDDMMYYYY(currentEvent.date)}
                        </div>
                        <h1 className="font-bold text-4xl lg:text-[40px] leading-[1.1] tracking-tight pt-0 text-black">
                            {currentEvent.title}
                        </h1>
                        <div className="flex flex-wrap gap-6 items-center text-black font-bold">
                            {currentEvent.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={20} weight="bold" />
                                    <span>{currentEvent.location}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Clock size={20} weight="bold" />
                                <span>{new Date(currentEvent.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="lg:w-1/2 h-full w-full relative lg:translate-y-16 z-20 flex justify-center lg:block order-first lg:order-none">
                        <div className="h-full w-full">
                            <div className="relative w-full aspect-square md:aspect-auto lg:w-full lg:h-full bg-neutral-800">
                                {currentEvent.imageUrl && (
                                    <Image
                                        src={currentEvent.imageUrl}
                                        alt={currentEvent.title}
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

            <div className="container mx-auto px-4 py-6 max-w-5xl">
                <Link href="/news" className="text-neutral-500 hover:text-black font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 transition-colors">
                    <ChevronLeft size={16} weight="bold" /> Back to News & Events
                </Link>
            </div>

            <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
                <div className="grid md:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="md:col-span-2 prose prose-lg prose-neutral">
                        <div className="whitespace-pre-wrap text-neutral-800 leading-relaxed text-lg">
                            {currentEvent.content}
                        </div>
                    </div>

                    {/* Sidebar / CTA */}
                    <div className="md:col-span-1">
                        <div className="sticky top-32 space-y-8">
                            <CTA
                                title="Interested?"
                                body="Join us for this exciting event at Cannoga College. No registration required unless specified."
                                cta={{
                                    label: "Add to Calendar",
                                    onClick: () => { /* Handle calendar logic */ }
                                }}
                            />

                            <div className="p-8 border border-neutral-200 rounded-2xl">
                                <h4 className="font-bold mb-4 flex items-center gap-2">
                                    <Tag size={18} weight="regular" /> Related Info
                                </h4>
                                <ul className="space-y-3 text-sm">
                                    <li><Link href="/contact" className="hover:underline">Contact Campus Office</Link></li>
                                    <li><Link href="/admissions" className="hover:underline">Admissions Information</Link></li>
                                    <li><Link href="/student-life" className="hover:underline">Student Activities</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
