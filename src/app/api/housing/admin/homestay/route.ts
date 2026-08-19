import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import type { HomestayHost } from '@/types/housing';

export const dynamic = 'force-dynamic';

async function requireAdmin(supabase: Awaited<ReturnType<typeof createServerClient>>) {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['ADMIN', 'REGISTRAR', 'FINANCE_OFFICER'].includes(profile.role)) return null;
    return user;
}

// GET /api/housing/admin/homestay — List all homestay hosts including inactive
export async function GET(_req: NextRequest) {
    const supabase = await createServerClient();
    const adminClient = createServiceRoleClient();

    const user = await requireAdmin(supabase);
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { data: hosts, error } = await adminClient
        .from('homestay_hosts')
        .select('*')
        .order('distance_to_campus_km');

    if (error) {
        console.error('[GET /api/housing/admin/homestay]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const hostsWithAvailability = (hosts ?? []).map((h: Record<string, unknown> & { max_students: number; current_students: number }) => ({
        ...h,
        spots_available: h.max_students - (h.current_students ?? 0),
    } as HomestayHost));

    return NextResponse.json({ hosts: hostsWithAvailability });
}

// POST /api/housing/admin/homestay — Create or Update a homestay host
export async function POST(req: NextRequest) {
    const supabase = await createServerClient();
    const adminClient = createServiceRoleClient();

    const user = await requireAdmin(supabase);
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const {
        id,
        host_name,
        host_family_description,
        address_city,
        distance_to_campus_km,
        languages_spoken,
        dietary_accommodations,
        max_students,
        current_students,
        price_per_week_minor,
        gender_policy,
        has_quiet_study_room,
        photo_url,
        is_active,
    } = body;

    if (!host_name || !address_city) {
        return NextResponse.json({ error: 'Host name and address city are required' }, { status: 400 });
    }

    const payload: Record<string, unknown> = {
        host_name: host_name.trim(),
        host_family_description: host_family_description ?? '',
        address_city: address_city.trim(),
        distance_to_campus_km: typeof distance_to_campus_km === 'number' ? distance_to_campus_km : parseFloat(distance_to_campus_km) || 0,
        languages_spoken: Array.isArray(languages_spoken) ? languages_spoken : (typeof languages_spoken === 'string' ? languages_spoken.split(',').map(s => s.trim()).filter(Boolean) : ['English']),
        dietary_accommodations: Array.isArray(dietary_accommodations) ? dietary_accommodations : (typeof dietary_accommodations === 'string' ? dietary_accommodations.split(',').map(s => s.trim()).filter(Boolean) : []),
        max_students: parseInt(String(max_students), 10) || 1,
        current_students: parseInt(String(current_students), 10) || 0,
        price_per_week_minor: typeof price_per_week_minor === 'number' ? price_per_week_minor : parseInt(String(price_per_week_minor), 10) || 35000,
        gender_policy: gender_policy || 'any',
        has_quiet_study_room: !!has_quiet_study_room,
        photo_url: photo_url ?? null,
        host_photo_url: photo_url ?? null,
        is_active: is_active !== undefined ? !!is_active : true,
    };

    if (id) {
        // Update existing host
        const { data: updated, error } = await adminClient
            .from('homestay_hosts')
            .update(payload)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[POST /api/housing/admin/homestay update]', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, host: updated, message: 'Homestay host updated successfully' });
    } else {
        // Create new host
        const { data: created, error } = await adminClient
            .from('homestay_hosts')
            .insert(payload)
            .select()
            .single();

        if (error) {
            console.error('[POST /api/housing/admin/homestay insert]', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, host: created, message: 'Homestay host created successfully' });
    }
}

// DELETE /api/housing/admin/homestay — Delete or deactivate a host
export async function DELETE(req: NextRequest) {
    const supabase = await createServerClient();
    const adminClient = createServiceRoleClient();

    const user = await requireAdmin(supabase);
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Host ID is required' }, { status: 400 });
    }

    const { error } = await adminClient
        .from('homestay_hosts')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('[DELETE /api/housing/admin/homestay]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Homestay host deleted successfully' });
}
