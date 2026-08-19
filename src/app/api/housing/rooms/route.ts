import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import type { ResidenceRoom } from '@/types/housing';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const supabase = await createServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const buildingId = searchParams.get('buildingId');
    const floor      = searchParams.get('floor');

    if (!buildingId || buildingId === 'PLACEHOLDER' || buildingId === 'null' || buildingId === 'undefined') {
        return NextResponse.json({ rooms: [], byFloor: {} }, { status: 200 });
    }

    let query = supabase
        .from('housing_rooms')
        .select('*')
        .eq('building_id', buildingId)
        .order('floor_number')
        .order('room_number');

    if (floor) {
        query = query.eq('floor_number', parseInt(floor, 10));
    }

    const { data: rawRooms, error } = await query;

    if (error) {
        console.error('[GET /api/housing/rooms]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Auto-migrate any legacy LAUR- codes in DB
    const rooms = ((rawRooms ?? []) as any[]).map((r: any) => {
        let code = r.full_room_code;
        if (code && code.startsWith('LAUR-')) {
            const newCode = code.replace(/^LAUR-/, 'CAN-');
            supabase.from('housing_rooms').update({ full_room_code: newCode }).eq('id', r.id).then();
            return { ...r, full_room_code: newCode };
        }
        return r;
    });

    // Group by floor for convenient client rendering
    const byFloor: Record<number, ResidenceRoom[]> = {};
    for (const room of rooms) {
        const fl = room.floor_number ?? 1;
        if (!byFloor[fl]) byFloor[fl] = [];
        byFloor[fl].push(room as ResidenceRoom);
    }

    return NextResponse.json({ rooms, byFloor });
}
