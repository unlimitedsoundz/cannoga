import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

// GET /api/payments/countries — returns active country accounts for students, all for admins
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
        .from('institutional_bank_accounts')
        .select('*')
        .order('display_order', { ascending: true });

    if (!isAdmin) {
        query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
        console.error('[GET /api/payments/countries]', error);
        return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 });
    }

    return NextResponse.json({ countries: data ?? [] });
}

// POST /api/payments/countries — admin: create or update a bank account
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
    const { id, ...fields } = body;

    if (!fields.country_code || !fields.bank_name || !fields.account_number || !fields.currency) {
        return NextResponse.json({ error: 'country_code, bank_name, account_number, and currency are required' }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const payload = {
        ...fields,
        country_code: String(fields.country_code).trim().toUpperCase(),
        currency: String(fields.currency).trim().toUpperCase(),
        updated_at: new Date().toISOString()
    };

    let data, error;
    if (id) {
        ({ data, error } = await adminClient
            .from('institutional_bank_accounts')
            .update(payload)
            .eq('id', id)
            .select()
            .single());
    } else {
        ({ data, error } = await adminClient
            .from('institutional_bank_accounts')
            .upsert(payload, { onConflict: 'country_code,currency' })
            .select()
            .single());
    }

    if (error) {
        console.error('[POST /api/payments/countries]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ country: data }, { status: id ? 200 : 201 });
}

