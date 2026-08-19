import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import type { ResidenceBuilding } from '@/types/housing';

export const dynamic = 'force-dynamic';

async function requireAdmin(supabase: Awaited<ReturnType<typeof createServerClient>>) {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['ADMIN', 'REGISTRAR', 'FINANCE_OFFICER'].includes(profile.role)) return null;
    return user;
}

// GET /api/housing/admin/buildings — List all buildings with stats
export async function GET(_req: NextRequest) {
    const supabase = await createServerClient();
    const adminClient = createServiceRoleClient();

    const user = await requireAdmin(supabase);
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { data: buildings, error } = await adminClient
        .from('housing_buildings')
        .select('*')
        .order('name');

    if (error) {
        console.error('[GET /api/housing/admin/buildings]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const buildingsWithStats = await Promise.all(
        (buildings ?? []).map(async (b: Record<string, unknown>) => {
            const { data: rooms } = await adminClient
                .from('housing_rooms')
                .select('status')
                .eq('building_id', b.id);

            const available = rooms?.filter((r: Record<string, unknown>) => r.status === 'AVAILABLE').length ?? 0;
            const occupied  = rooms?.filter((r: Record<string, unknown>) => r.status === 'OCCUPIED').length ?? 0;
            const total     = rooms?.length ?? 0;

            return {
                ...b,
                amenities: Array.isArray(b.amenities) ? b.amenities : [],
                available_beds: available,
                occupied_beds:  occupied,
                total_rooms:    total,
            } as unknown as ResidenceBuilding;
        })
    );

    return NextResponse.json({ buildings: buildingsWithStats });
}

// POST /api/housing/admin/buildings — Create or Update a building
export async function POST(req: NextRequest) {
    const supabase = await createServerClient();
    const adminClient = createServiceRoleClient();

    const user = await requireAdmin(supabase);
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const {
        id,
        name,
        code,
        campus_location,
        style,
        total_floors,
        total_beds,
        amenities,
        services,
        description,
        is_active,
    } = body;

    if (!name || !campus_location) {
        return NextResponse.json({ error: 'Building name and campus location are required' }, { status: 400 });
    }

    const payload: Record<string, unknown> = {
        name: name.trim(),
        code: code ? code.trim().toUpperCase() : null,
        campus_location: campus_location.trim(),
        style: style || 'traditional_dorm',
        total_floors: parseInt(String(total_floors), 10) || 4,
        total_beds: parseInt(String(total_beds), 10) || 0,
        amenities: Array.isArray(amenities) ? amenities : (typeof amenities === 'string' ? amenities.split(',').map(s => s.trim()).filter(Boolean) : []),
        services: Array.isArray(services) ? services : (typeof services === 'string' ? services.split(',').map(s => s.trim()).filter(Boolean) : []),
        description: description ?? null,
        is_active: is_active !== undefined ? !!is_active : true,
        updated_at: new Date().toISOString(),
    };

    if (id) {
        // Update
        const { data: updated, error } = await adminClient
            .from('housing_buildings')
            .update(payload)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[POST /api/housing/admin/buildings update]', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, building: updated, message: 'Building updated successfully' });
    } else {
        // Create
        const { data: created, error } = await adminClient
            .from('housing_buildings')
            .insert(payload)
            .select()
            .single();

        if (error) {
            console.error('[POST /api/housing/admin/buildings insert]', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, building: created, message: 'Building created successfully' });
    }
}

// DELETE /api/housing/admin/buildings — Delete a building
export async function DELETE(req: NextRequest) {
    const supabase = await createServerClient();
    const adminClient = createServiceRoleClient();

    const user = await requireAdmin(supabase);
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Building ID is required' }, { status: 400 });
    }

    const { error } = await adminClient
        .from('housing_buildings')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('[DELETE /api/housing/admin/buildings]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Building deleted successfully' });
}
