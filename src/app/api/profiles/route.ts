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

    if (!profile || !['ADMIN', 'REGISTRAR', 'STUDENT_SERVICES'].includes(profile.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let query = supabase.from('profiles').select('id, first_name, last_name, email, role');

    if (role) {
        query = query.eq('role', role);
    }

    const { data: profiles, error } = await query.order('first_name', { ascending: true });

    if (error) {
        return NextResponse.json({ success: false, data: [], error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: profiles || [] });
}
