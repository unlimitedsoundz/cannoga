import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import type { ResidenceRoom } from '@/types/housing';

export const dynamic = 'force-dynamic';

async function requireAdmin(supabase: Awaited<ReturnType<typeof createServerClient>>) {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['ADMIN', 'REGISTRAR', 'FINANCE_OFFICER'].includes(profile.role)) return null;
    return user;
}

// GET /api/housing/admin/rooms — List all rooms with optional filtering by buildingId or status
export async function GET(req: NextRequest) {
    const supabase = await createServerClient();
    const adminClient = createServiceRoleClient();

    const user = await requireAdmin(supabase);
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const buildingId = searchParams.get('buildingId');
    const status = searchParams.get('status');

    let query = adminClient
        .from('housing_rooms')
        .select('*, building:building_id(name, code, campus_location)')
        .order('building_id')
        .order('floor_number')
        .order('room_number');

    if (buildingId) query = query.eq('building_id', buildingId);
    if (status && status !== 'all') query = query.eq('status', status);

    const { data: rooms, error } = await query;
    if (error) {
        console.error('[GET /api/housing/admin/rooms]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ rooms: rooms ?? [] });
}

// POST /api/housing/admin/rooms — Create or Update room status/details
export async function POST(req: NextRequest) {
    const supabase = await createServerClient();
    const adminClient = createServiceRoleClient();

    const user = await requireAdmin(supabase);
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const {
        id,
        building_id,
        room_number,
        floor_number,
        bed_identifier,
        suite_number,
        status, // 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'reserved'
        price_per_term_minor,
        room_type,
        room_type_label,
        window_orientation,
        is_accessible,
        full_room_code,
    } = body;

    if (!id && (!building_id || !room_number)) {
        return NextResponse.json({ error: 'building_id and room_number are required' }, { status: 400 });
    }

    const payload: Record<string, unknown> = {
        status: status || 'AVAILABLE',
        updated_at: new Date().toISOString(),
    };

    if (building_id) payload.building_id = building_id;
    if (room_number) payload.room_number = room_number.trim();
    if (floor_number !== undefined) payload.floor_number = parseInt(String(floor_number), 10) || 1;
    if (bed_identifier !== undefined) payload.bed_identifier = bed_identifier ? bed_identifier.trim().toUpperCase() : null;
    if (suite_number !== undefined) payload.suite_number = suite_number ? suite_number.trim() : null;
    if (price_per_term_minor !== undefined) payload.price_per_term_minor = parseInt(String(price_per_term_minor), 10) || 0;
    if (room_type !== undefined) payload.room_type = room_type;
    if (room_type_label !== undefined) payload.room_type_label = room_type_label;
    if (window_orientation !== undefined) payload.window_orientation = window_orientation;
    if (is_accessible !== undefined) payload.is_accessible = !!is_accessible;

    // Room code: use explicit code if provided, otherwise auto-generate
    if (full_room_code) {
        payload.full_room_code = full_room_code.trim().toUpperCase();
    } else if (room_number) {
        payload.full_room_code = bed_identifier ? `${room_number}-${bed_identifier}` : room_number;
    }

    if (id) {
        // Update room
        const { data: updated, error } = await adminClient
            .from('housing_rooms')
            .update(payload)
            .eq('id', id)
            .select('*, building:building_id(name, code)')
            .single();

        if (error) {
            console.error('[POST /api/housing/admin/rooms update]', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, room: updated, message: 'Room status and details updated successfully' });
    } else {
        // Create new room/bed
        const { data: created, error } = await adminClient
            .from('housing_rooms')
            .insert(payload)
            .select('*, building:building_id(name, code)')
            .single();

        if (error) {
            console.error('[POST /api/housing/admin/rooms insert]', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, room: created, message: 'Room/bed created successfully' });
    }
}

// DELETE /api/housing/admin/rooms — Delete a room
export async function DELETE(req: NextRequest) {
    const supabase = await createServerClient();
    const adminClient = createServiceRoleClient();

    const user = await requireAdmin(supabase);
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
    }

    const { error } = await adminClient
        .from('housing_rooms')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('[DELETE /api/housing/admin/rooms]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Room deleted successfully' });
}
