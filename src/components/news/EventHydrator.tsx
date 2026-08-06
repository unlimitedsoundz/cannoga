'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Event } from '@/types/database';

interface EventHydratorProps {
    initialEvent: Event;
    children: (event: Event) => React.ReactNode;
}

export default function EventHydrator({ initialEvent, children }: EventHydratorProps) {
    const [event, setEvent] = useState<Event>(initialEvent);

    useEffect(() => {
        async function fetchLatest() {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('Event')
                .select('*')
                .eq('id', initialEvent.id)
                .single();

            if (data && !error) {
                // Only update if there's a meaningful change (simple check)
                if (data.updated_at !== initialEvent.updated_at || data.content !== initialEvent.content) {
                    setEvent(data as Event);
                }
            }
        }

        fetchLatest();
    }, [initialEvent.id, initialEvent.updated_at, initialEvent.content]);

    return <>{children(event)}</>;
}
