import { createServerClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
        const { data: item, error } = await supabase
            .from('tuition_info')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ tuition: item });
    }

    const { data: tuition, error } = await supabase
        .from('tuition_info')
        .select('id, credential_type, domestic_tuition, international_tuition, application_fee, additional_fees, effective_from, effective_to, status, updated_at')
        .order('credential_type', { ascending: true });

    if (error) {
        return NextResponse.json({ tuition: [], error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tuition: tuition || [] });
}

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
    const { credential_type, domestic_tuition, international_tuition, application_fee, additional_fees, effective_from, effective_to, status } = body;

    if (!credential_type) {
        return NextResponse.json({ error: 'Credential type is required' }, { status: 400 });
    }

    const { data: item, error } = await supabase
        .from('tuition_info')
        .insert({
            credential_type,
            domestic_tuition: domestic_tuition || {},
            international_tuition: international_tuition || {},
            application_fee: application_fee || 0,
            additional_fees: additional_fees || {},
            effective_from: effective_from || null,
            effective_to: effective_to || null,
            status: status || 'active',
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tuition: item }, { status: 201 });
}

export async function PUT(request: NextRequest) {
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
    const { id, credential_type, domestic_tuition, international_tuition, application_fee, additional_fees, effective_from, effective_to, status } = body;

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (credential_type !== undefined) updateData.credential_type = credential_type;
    if (domestic_tuition !== undefined) updateData.domestic_tuition = domestic_tuition;
    if (international_tuition !== undefined) updateData.international_tuition = international_tuition;
    if (application_fee !== undefined) updateData.application_fee = application_fee;
    if (additional_fees !== undefined) updateData.additional_fees = additional_fees;
    if (effective_from !== undefined) updateData.effective_from = effective_from;
    if (effective_to !== undefined) updateData.effective_to = effective_to;
    if (status !== undefined) updateData.status = status;

    const { data: item, error } = await supabase
        .from('tuition_info')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tuition: item });
}

export async function DELETE(request: NextRequest) {
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

    if (!profile || profile.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabase
        .from('tuition_info')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
