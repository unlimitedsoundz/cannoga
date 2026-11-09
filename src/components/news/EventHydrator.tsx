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
        setEvent(initialEvent);
    }, [initialEvent]);

    return <>{children(event)}</>;
}
