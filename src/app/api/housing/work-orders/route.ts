import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import type { SubmitWorkOrderPayload } from '@/types/housing';

export const dynamic = 'force-dynamic';

function generateTicketNumber(): string {
    const date = new Date();
    const yr   = date.getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `WO-${yr}-${rand}`;
}

// GET /api/housing/work-orders — fetch own work orders
export async function GET(_req: NextRequest) {
    const supabase = await createServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: orders, error } = await supabase
        .from('housing_work_orders')
        .select('*, room:room_id(room_number, full_room_code)')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: orders ?? [] });
}

// POST /api/housing/work-orders — submit new work order
export async function POST(req: NextRequest) {
    const supabase    = await createServerClient();
    const adminClient = createServiceRoleClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: SubmitWorkOrderPayload = await req.json();
    const { category, urgency, description, roomId, photoUrls } = body;

    if (!category || !urgency || !description) {
        return NextResponse.json({ error: 'category, urgency, and description are required' }, { status: 400 });
    }

    if (description.trim().length < 10) {
        return NextResponse.json({ error: 'Please provide a more detailed description (minimum 10 characters)' }, { status: 400 });
    }

    // Generate unique ticket number
    let ticketNumber = generateTicketNumber();
    // Ensure uniqueness
    let attempts = 0;
    while (attempts < 5) {
        const { data: existing } = await adminClient
            .from('housing_work_orders')
            .select('id')
            .eq('ticket_number', ticketNumber)
            .maybeSingle();
        if (!existing) break;
        ticketNumber = generateTicketNumber();
        attempts++;
    }

    const { data: order, error } = await adminClient
        .from('housing_work_orders')
        .insert({
            ticket_number:  ticketNumber,
            student_id:     user.id,
            room_id:        roomId ?? null,
            category,
            urgency,
            description:    description.trim(),
            photo_urls:     photoUrls ? JSON.stringify(photoUrls) : '[]',
            status:         'open',
        })
        .select()
        .single();

    if (error) {
        console.error('[POST /api/housing/work-orders]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order, ticketNumber });
}
