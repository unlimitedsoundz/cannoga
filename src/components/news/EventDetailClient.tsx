'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Link } from "@aalto-dx/react-components";
import { CTA } from "@aalto-dx/react-modules";
import { Event } from '@/types/database';
import { createClient } from '@/utils/supabase/client';
import { formatToDDMMYYYY } from '@/utils/date';
import { CaretLeft, Calendar, MapPin, Clock, Tag } from "@phosphor-icons/react";
import { Info } from '@/components/ui/Info';
import { Hero } from '@/components/layout/Hero';

import '@/styles/ckeditor-content.css';

interface EventDetailClientProps {
    initialEvent: Event;
}

export default function EventDetailClient({ initialEvent }: EventDetailClientProps) {
    const [currentEvent, setEvent] = useState<Event>(initialEvent);
    const [coverImageFailed, setCoverImageFailed] = useState(false);

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

    const isHtmlContent = Boolean(
        currentEvent.content && /<[a-z][\s\S]*>/i.test(currentEvent.content)
    );

    return (
        <div className="min-h-screen bg-white font-sans text-black">
            <Hero
                title={currentEvent.title}
                body={`Join us on ${formatToDDMMYYYY(currentEvent.date)} at ${currentEvent.location || 'Cannoga Ottawa Campus'}.`}
                image={{
                    src: currentEvent.imageUrl || "/images/home-carousel-2.png",
                    alt: currentEvent.title
                }}
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "News & Events", href: "/news" },
                    { label: currentEvent.title }
                ]}
            />

            <div className="max-w-[800px] mx-auto px-4 py-8 md:py-16">
                <div className="mb-8">
                    <Link
                        href="/news#events"
                        className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-black uppercase tracking-wider"
                    >
                        <CaretLeft size={16} weight="bold" /> Back to News & Events
                    </Link>
                </div>

                {/* Event Metadata */}
                <Info
                    items={[
                        {
                            title: "Date & Time",
                            body: `${formatToDDMMYYYY(currentEvent.date)} at ${new Date(currentEvent.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                        },
                        {
                            title: "Location",
                            body: currentEvent.location || "Ottawa Campus",
                        },
                        {
                            tagGroup: {
                                tags: [
                                    { label: currentEvent.category || "Event" },
                                    { label: "Ottawa" },
                                    { label: "Campus Life" }
                                ]
                            }
                        }
                    ]}
                />

                {/* Optional Image */}
                {currentEvent.imageUrl && !coverImageFailed && (
                    <div className="mb-12">
                        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-neutral-100 border border-neutral-200 shadow-sm">
                            <Image
                                src={currentEvent.imageUrl}
                                alt={currentEvent.title}
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
                            dangerouslySetInnerHTML={{ __html: currentEvent.content }}
                        />
                    ) : (
                        <div className="whitespace-pre-wrap text-base md:text-lg text-neutral-800 leading-relaxed font-normal space-y-6">
                            {currentEvent.content || "Join us for this event at Cannoga College Ottawa Campus."}
                        </div>
                    )}
                </div>

                {/* CTA Section */}
                <div className="py-12 mt-10">
                    <CTA
                        title="Interested in Attending?"
                        body="Join us for this exciting event at Cannoga College. No advance registration required unless specified by your faculty department."
                        cta={{
                            label: "View All Events",
                            linkComponentProps: {
                                href: "/news#events",
                            },
                        }}
                    />
                </div>

                {/* Related links */}
                <div className="mt-12 grid md:grid-cols-3 gap-8">
                    {[
                        { title: "Student Life", href: "/student-life", desc: "Explore campus and housing." },
                        { title: "Academic Calendar", href: "/student-guide", desc: "Schedules and key dates." },
                        { title: "Contact Us", href: "/contact", desc: "Reach campus office." },
                    ].map(link => (
                        <Link key={link.href} href={link.href} className="bg-neutral-50 p-8 hover:bg-neutral-100 transition-all group border-l-2 border-transparent hover:border-[#0a151a]">
                            <h3 className="font-bold text-[#000000] mb-2 group-hover:underline">{link.title}</h3>
                            <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest leading-relaxed">{link.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
