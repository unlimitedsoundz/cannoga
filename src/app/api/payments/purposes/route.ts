import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';

// GET /api/payments/purposes — returns active purposes for students, all purposes for admins
export async function GET() {
    const supabase = await createServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const isAdmin = profile && ['ADMIN', 'REGISTRAR', 'FINANCE_OFFICER'].includes(profile.role);

    let query = supabase
        .from('payment_purposes')
        .select('*')
        .order('display_order', { ascending: true });

    if (!isAdmin) {
        query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
        console.error('[GET /api/payments/purposes]', error);
        return NextResponse.json({ error: 'Failed to fetch purposes' }, { status: 500 });
    }

    return NextResponse.json({ purposes: data ?? [] });
}

// POST /api/payments/purposes — admin: create or update a purpose
export async function POST(request: NextRequest) {
    const supabase = await createServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || !['ADMIN', 'REGISTRAR', 'FINANCE_OFFICER'].includes(profile.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { id, code, title, description, default_amount_cad, allow_partial_payments, is_active, display_order } = body;

    if (!code || !title) {
        return NextResponse.json({ error: 'code and title are required' }, { status: 400 });
    }

    if (id) {
        // Update existing
        const { data, error } = await supabase
            .from('payment_purposes')
            .update({ code, title, description, default_amount_cad, allow_partial_payments, is_active, display_order, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[POST /api/payments/purposes] update error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ purpose: data });
    } else {
        // Insert new
        const { data, error } = await supabase
            .from('payment_purposes')
            .insert({ code, title, description, default_amount_cad, allow_partial_payments, is_active: is_active ?? true, display_order: display_order ?? 0 })
            .select()
            .single();

        if (error) {
            console.error('[POST /api/payments/purposes] insert error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ purpose: data }, { status: 201 });
    }
}
