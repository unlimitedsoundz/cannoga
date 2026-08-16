import { createStaticClient } from '@/lib/supabase/static';

// Revalidate every hour; admin mutations call revalidatePath() for immediate updates.
export const revalidate = 3600;
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types/database';
import { notFound } from 'next/navigation';
import { formatToDDMMYYYY } from '@/utils/date';
import { Calendar, MapPin, Clock, Tag, CaretLeft as ChevronLeft } from "@phosphor-icons/react/dist/ssr";
import EventDetailClient from '@/components/news/EventDetailClient';

interface Props {
    params: Promise<{
        slug: string;
    }>;
}


export const dynamicParams = true;

export async function generateStaticParams() {
    const supabase = createStaticClient();
    const { data: events } = await supabase.from('Event').select('slug');
    return (events || []).map((item) => ({
        slug: item.slug,
    }));
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const supabase = createStaticClient();

    const { data: event } = await supabase
        .from('Event')
        .select('title, content')
        .eq('slug', slug)
        .single();

    if (!event) return { title: 'Event Not Found' };

    return {
        title: `${event.title} Events Calendar`,
        description: `Discover our upcoming campus event: ${event.title}. ${event.content?.substring(0, 120) || ''}`,
        alternates: {
            canonical: `https://cannogacollege.ca/news/events/${slug}/`,
        },
    };
}

export default async function EventDetailPage({ params }: Props) {
    const { slug } = await params;
    const supabase = createStaticClient();

    const { data: eventItem, error } = await supabase
        .from('Event')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !eventItem) {
        if (error?.code !== 'PGRST116') console.error('Error fetching event:', error);
        notFound();
    }

    const item = eventItem as Event;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: item.title,
        startDate: item.date,
        endDate: item.date,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
            '@type': 'Place',
            name: item.location || 'Cannoga College Ottawa campus',
            address: {
                '@type': 'PostalAddress',
                streetAddress: '81 Montreal Rd',
                addressLocality: 'Ottawa',
                postalCode: 'K1L 6E8',
                addressRegion: 'Ontario',
                addressCountry: 'CA'
            }
        },
        image: item.imageUrl ? [item.imageUrl] : undefined,
        description: item.content?.substring(0, 160) || `Join us for ${item.title} at Cannoga College.`,
        organizer: {
            '@type': 'EducationalOrganization',
            name: 'Cannoga College',
            url: 'https://cannogacollege.ca'
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <EventDetailClient initialEvent={item} />
        </>
    );
}
