import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export const dynamic = 'force-dynamic';

async function requireAdmin(supabase: Awaited<ReturnType<typeof createServerClient>>) {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile || !['ADMIN', 'REGISTRAR', 'FINANCE_OFFICER'].includes(profile.role)) return null;
    return user;
}

// GET /api/housing/admin/work-orders — list all work orders
export async function GET(req: NextRequest) {
    const supabase    = await createServerClient();
    const adminClient = createServiceRoleClient();

    const user = await requireAdmin(supabase);
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const urgency = searchParams.get('urgency');
    const status  = searchParams.get('status');

    let query = adminClient
        .from('housing_work_orders')
        .select('*, room:room_id(room_number, full_room_code, building:building_id(name, code))')
        .order('created_at', { ascending: false });

    if (urgency) query = query.eq('urgency', urgency);
    if (status)  query = query.eq('status', status);

    const { data: orders, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ orders: orders ?? [] });
}

// POST /api/housing/admin/work-orders — update a work order
export async function POST(req: NextRequest) {
    const supabase    = await createServerClient();
    const adminClient = createServiceRoleClient();

    const user = await requireAdmin(supabase);
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { orderId, status, assignedTechnician, resolutionNotes } = body;

    if (!orderId || !status) {
        return NextResponse.json({ error: 'orderId and status are required' }, { status: 400 });
    }

    const updatePayload: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
    };

    if (assignedTechnician) updatePayload.assigned_technician = assignedTechnician;
    if (resolutionNotes)    updatePayload.resolution_notes    = resolutionNotes;
    if (status === 'resolved' || status === 'closed') {
        updatePayload.resolved_at = new Date().toISOString();
    }

    const { data: order, error } = await adminClient
        .from('housing_work_orders')
        .update(updatePayload)
        .eq('id', orderId)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, order });
}
