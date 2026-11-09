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

    // Batch-fetch rooms for all buildings in a single query instead of N+1
    const buildingList = buildings ?? [];
    const buildingIds = buildingList.map((b: any) => b.id);
    const { data: allRooms } = buildingIds.length > 0
        ? await supabase.from('housing_rooms').select('building_id, status').in('building_id', buildingIds)
        : { data: [] };

    const roomsByBuilding = new Map<string, any[]>();
    for (const r of allRooms || []) {
        if (!roomsByBuilding.has(r.building_id)) {
            roomsByBuilding.set(r.building_id, []);
        }
        roomsByBuilding.get(r.building_id)!.push(r);
    }

    const buildingsWithStats = buildingList.map((b: any) => {
        const rooms = roomsByBuilding.get(b.id) || [];
        const available = rooms.filter((r: any) => r.status === 'AVAILABLE').length;
        const occupied  = rooms.filter((r: any) => r.status === 'OCCUPIED').length;
        const total     = rooms.length;

        return {
            ...b,
            available_beds: available,
            occupied_beds: occupied,
            total_beds: b.total_beds || total,
        } as ResidenceBuilding;
    });

    return NextResponse.json({ buildings: buildingsWithStats });
}
