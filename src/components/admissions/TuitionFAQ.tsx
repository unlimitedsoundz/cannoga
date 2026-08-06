'use client';

import { useState } from 'react';
import DbFAQ from '@/components/DbFAQ';

export default function TuitionFAQ() {
    const [refreshKey, setRefreshKey] = useState(0);

    // This is a simple way to force refresh - in a real app, you'd use a more sophisticated approach
    const handleRefresh = () => setRefreshKey(prev => prev + 1);

    return <DbFAQ pageSlug="admissions/tuition" refreshKey={refreshKey} />;
}
