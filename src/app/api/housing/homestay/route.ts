import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import type { HomestayHost } from '@/types/housing';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
    const supabase = await createServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: hosts, error } = await supabase
        .from('homestay_hosts')
        .select('*')
        .eq('is_active', true)
        .order('distance_to_campus_km');

    if (error) {
        console.error('[GET /api/housing/homestay]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const hostsWithAvailability = (hosts ?? []).map((h: Record<string, unknown> & { max_students: number; current_students: number }) => ({
        ...h,
        spots_available: h.max_students - (h.current_students ?? 0),
    } as HomestayHost));

    return NextResponse.json({ hosts: hostsWithAvailability });
}
