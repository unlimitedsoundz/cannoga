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

    const { data: semesters, error } = await supabase
        .from('semesters')
        .select('id, name, start_date, end_date, status')
        .order('start_date', { ascending: false });

    if (error) {
        return NextResponse.json({ success: false, data: [], error: error.message }, { status: 500 });
    }

    const mapped = (semesters || []).map((s: any) => ({
        ...s,
        startDate: s.start_date,
        endDate: s.end_date,
        isActive: s.status === 'ACTIVE',
        isCurrent: s.status === 'ACTIVE',
    }));

    return NextResponse.json({ success: true, data: mapped });
}
