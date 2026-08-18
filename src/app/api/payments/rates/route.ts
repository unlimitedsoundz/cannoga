import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';

// GET /api/payments/rates — returns all active exchange rates (CAD → X)
export async function GET() {
    const supabase = await createServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('institutional_exchange_rates')
        .select('*')
        .eq('is_active', true)
        .order('to_currency', { ascending: true });

    if (error) {
        console.error('[GET /api/payments/rates]', error);
        return NextResponse.json({ error: 'Failed to fetch rates' }, { status: 500 });
    }

    // Return as a map for easy lookups: { NGN: { rate: 1120, ... }, USD: { ... } }
    const rateMap: Record<string, any> = {};
    for (const r of data ?? []) {
        rateMap[r.to_currency] = r;
    }

    return NextResponse.json({ rates: data ?? [], rateMap });
}

// POST /api/payments/rates — admin: update a rate
export async function POST(request: NextRequest) {
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

    if (!profile || !['ADMIN', 'REGISTRAR', 'FINANCE_OFFICER'].includes(profile.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { id, to_currency, rate_multiplier, lock_duration_hours, is_active, notes } = body;

    if (!to_currency || rate_multiplier === undefined) {
        return NextResponse.json({ error: 'to_currency and rate_multiplier are required' }, { status: 400 });
    }

    const updatePayload = {
        rate_multiplier: Number(rate_multiplier),
        lock_duration_hours: lock_duration_hours ?? 48,
        is_active: is_active ?? true,
        notes: notes ?? null,
        last_updated_by: user.id,
        updated_at: new Date().toISOString(),
    };

    let data, error;

    if (id) {
        ({ data, error } = await supabase
            .from('institutional_exchange_rates')
            .update(updatePayload)
            .eq('id', id)
            .select()
            .single());
    } else {
        // Upsert by unique constraint (from_currency, to_currency)
        ({ data, error } = await supabase
            .from('institutional_exchange_rates')
            .upsert(
                { from_currency: 'CAD', to_currency, ...updatePayload },
                { onConflict: 'from_currency,to_currency' }
            )
            .select()
            .single());
    }

    if (error) {
        console.error('[POST /api/payments/rates]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ rate: data });
}
