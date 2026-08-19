import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import type { ResidenceBuilding } from '@/types/housing';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
    const supabase = await createServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: buildings, error } = await supabase
        .from('housing_buildings')
        .select('*')
        .eq('is_active', true)
        .order('name');

    if (error) {
        console.error('[GET /api/housing/buildings]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Ensure Cannoga Suites image_url is populated in DB if missing or default
    for (const b of (buildings ?? [])) {
        if ((b.code === 'CANNOGA' || b.name?.toLowerCase()?.includes('cannoga')) && (!b.image_url || b.image_url.includes('studies-hero'))) {
            try {
                await supabase
                    .from('housing_buildings')
                    .update({ image_url: '/images/housing/cannoga-suites.jpg' })
                    .eq('id', b.id);
                b.image_url = '/images/housing/cannoga-suites.jpg';
            } catch (err) {
                console.warn('Could not auto-update Cannoga Suites image_url:', err);
            }
        }
    }

    // For each building, compute bed stats
    const buildingsWithStats = await Promise.all(
        (buildings ?? []).map(async (b: Record<string, unknown>) => {
            const { data: rooms } = await supabase
                .from('housing_rooms')
                .select('status')
                .eq('building_id', b.id);

            const available = rooms?.filter((r: Record<string, unknown>) => r.status === 'AVAILABLE').length ?? 0;
            const occupied  = rooms?.filter((r: Record<string, unknown>) => r.status === 'OCCUPIED').length ?? 0;
            const total     = rooms?.length ?? 0;

            return {
                ...b,
                available_beds: available,
                occupied_beds: occupied,
                total_beds: b.total_beds || total,
            } as ResidenceBuilding;
        })
    );

    return NextResponse.json({ buildings: buildingsWithStats });
}
