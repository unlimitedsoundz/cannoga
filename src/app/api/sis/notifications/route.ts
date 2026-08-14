import { createServerClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const supabase = await createServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();

    const studentId = student?.id;
    let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });

    if (studentId) {
        query = query.or(`recipient_type.eq.all,recipient_ids.cs.{${studentId}}`);
    } else {
        query = query.eq('recipient_type', 'all');
    }

    const { data: notifications, error } = await query;

    if (error) {
        return NextResponse.json({ notifications: [], error: error.message }, { status: 500 });
    }

    return NextResponse.json({ notifications: notifications || [] });
}

export async function POST(request: NextRequest) {
    const supabase = await createServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (!student) {
        return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const { id, read } = body;

    if (!id) {
        return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    const { data: notification, error } = await supabase
        .from('notifications')
        .update({
            read: read !== false,
            read_at: read !== false ? new Date().toISOString() : null,
        })
        .eq('id', id)
        .contains('recipient_ids', [student.id])
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ notification });
}
