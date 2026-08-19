import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import type { ReserveRoomPayload } from '@/types/housing';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const supabase    = await createServerClient();
    const adminClient = createServiceRoleClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: ReserveRoomPayload = await req.json();
    const { roomId, term, academicYear, housingType = 'on_campus', homestayHostId } = body;

    if (!term) {
        return NextResponse.json({ error: 'term is required' }, { status: 400 });
    }

    if (housingType === 'on_campus' && !roomId) {
        return NextResponse.json({ error: 'roomId is required for on-campus housing' }, { status: 400 });
    }

    if (housingType === 'homestay' && !homestayHostId) {
        return NextResponse.json({ error: 'homestayHostId is required for homestay' }, { status: 400 });
    }

    // Check for existing application this academic year
    const { data: existingApp } = await adminClient
        .from('housing_applications')
        .select('id, status, assigned_room_id, housing_type')
        .eq('student_id', user.id)
        .eq('academic_year', academicYear ?? '2026/2027')
        .maybeSingle();

    if (existingApp && ['contract_signed', 'deposit_paid', 'confirmed'].includes(existingApp.status)) {
        return NextResponse.json({ error: 'You already have an active housing placement for this academic year.' }, { status: 409 });
    }

    // For on-campus: verify room exists
    if (housingType === 'on_campus' && roomId) {
        const { data: room, error: roomErr } = await adminClient
            .from('housing_rooms')
            .select('id, status, building_id, full_room_code')
            .eq('id', roomId)
            .single();

        if (roomErr || !room) {
            console.error('[reserve-room] Room query error:', roomErr, 'for roomId:', roomId);
            return NextResponse.json({ error: 'Room not found in inventory' }, { status: 404 });
        }

        const roomStatusUpper = (room.status || '').toUpperCase();
        const isCurrentAppRoom = existingApp?.assigned_room_id === roomId;

        if (roomStatusUpper === 'OCCUPIED' && !isCurrentAppRoom) {
            return NextResponse.json({ error: `Room ${room.full_room_code || 'selected'} is no longer available (status: ${room.status})` }, { status: 409 });
        }
    }

    // Upsert the housing application
    const appPayload = {
        student_id:        user.id,
        academic_year:     academicYear ?? '2026/2027',
        term,
        housing_type:      housingType,
        status:            'room_selected',
        assigned_room_id:  housingType === 'on_campus' ? roomId : null,
        building_id:       housingType === 'on_campus' && roomId ? (
            (await adminClient.from('housing_rooms').select('building_id').eq('id', roomId).single()).data?.building_id ?? null
        ) : null,
        homestay_host_id:  housingType === 'homestay' ? homestayHostId : null,
        updated_at:        new Date().toISOString(),
    };

    let application;
    if (existingApp) {
        const { data, error } = await adminClient
            .from('housing_applications')
            .update(appPayload)
            .eq('id', existingApp.id)
            .select('*, building:building_id(*), assigned_room:assigned_room_id(*), meal_plan:selected_meal_plan_id(*), homestay_host:homestay_host_id(*)')
            .single();
        if (error) {
            console.error('[POST /api/housing/reserve-room] update:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        application = data;
    } else {
        const { data, error } = await adminClient
            .from('housing_applications')
            .insert({
                ...appPayload,
                priority_score: 50,
                move_in_date:   '2026-09-02',
                move_out_date:  '2027-04-30',
            })
            .select('*, building:building_id(*), assigned_room:assigned_room_id(*), meal_plan:selected_meal_plan_id(*), homestay_host:homestay_host_id(*)')
            .single();
        if (error) {
            console.error('[POST /api/housing/reserve-room] insert:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        application = data;
    }

    return NextResponse.json({ success: true, application });
}
