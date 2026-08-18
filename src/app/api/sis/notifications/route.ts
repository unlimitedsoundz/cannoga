import { createServerClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const supabase = await createServerClient();

    const { data: { user } } = await supabase.auth.getUser();

    let studentId: string | null = null;
    if (user?.id) {
        const { data: student } = await supabase
            .from('students')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();
        studentId = student?.id || null;
    }

    const { data: allNotifs, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ notifications: [], error: error.message }, { status: 500 });
    }

    const filtered = (allNotifs || []).filter((n: any) => {
        if (n.user_id && user?.id && n.user_id === user.id) return true;
        if (!n.recipient_type || n.recipient_type === 'all') return true;
        if (!n.recipient_ids || !Array.isArray(n.recipient_ids) || n.recipient_ids.length === 0) return true;
        if (n.recipient_ids.includes('ALL')) return true;
        if (studentId && n.recipient_ids.includes(studentId)) return true;
        if (user?.id && n.recipient_ids.includes(user.id)) return true;
        return false;
    });

    // If student is enrolled/active, ensure PAL timeline notification is present
    if (user?.id) {
        const hasPalNotif = filtered.some((n: any) => n.type === 'pal_issuance_notice' || (n.title && n.title.includes('Provincial Attestation Letter')));
        if (!hasPalNotif) {
            filtered.unshift({
                id: `pal-notice-${user.id}`,
                user_id: user.id,
                type: 'pal_issuance_notice',
                title: 'Provincial Attestation Letter (PAL) Processing',
                message: 'Your Provincial Letter of Attestation (PAL) will be issued to you in 6 – 10 business days. Once issued, you can proceed directly with your IRCC Study Permit application.',
                priority: 'high',
                read: false,
                created_at: new Date().toISOString(),
            });
        }
    }

    return NextResponse.json({ notifications: filtered });
}

export async function POST(request: NextRequest) {
    const supabase = await createServerClient();

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
        .select()
        .maybeSingle();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ notification });
}

export async function DELETE(request: NextRequest) {
    const supabase = await createServerClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
