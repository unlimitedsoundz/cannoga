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

    if (!profile || profile.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const scope = searchParams.get('scope'); // 'all' returns everything (for sent history), default filters out student-only notifs

    if (id) {
        const { data: notification, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ notification });
    }

    const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ notifications: [], error: error.message }, { status: 500 });
    }

    let result = notifications || [];

    // If fetching for admin bell / dashboard (default), exclude notifications targeted exclusively to students
    if (scope !== 'all') {
        result = result.filter((n: any) => {
            // Notifications specifically meant for individual students
            if (n.user_id && n.user_id !== user.id) return false;
            if (n.recipient_type === 'individual' || n.recipient_type === 'program') return false;
            
            // Student-specific system automated notifications
            const studentTypes = [
                'pal_issuance_notice',
                'wire_payment_approved',
                'student_welcome',
                'course_enrolled',
                'timetable_published',
                'housing_contract_signed',
                'DOCS_REQUIRED',
            ];
            if (n.type && studentTypes.includes(n.type)) return false;

            // Student-specific titles
            const titleLower = (n.title || '').toLowerCase();
            if (
                titleLower.includes('provincial attestation letter') ||
                titleLower.includes('pal processing') ||
                titleLower.includes('housing deposit verified') ||
                titleLower.includes('action required: additional documents')
            ) {
                return false;
            }

            return true;
        });
    }

    return NextResponse.json({ notifications: result });
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

    if (!profile || profile.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, message, category, priority, recipient_type, recipient_ids, related_id, related_type } = body;

    if (!title || !message) {
        return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
    }

    let targetStudentIds: string[] = [];

    if (recipient_type === 'all') {
        const { data: allStudents } = await supabase
            .from('students')
            .select('id');

        const ids = allStudents?.map((s: { id: string }) => s.id) || [];
        targetStudentIds = ['ALL', ...ids];
    } else if (recipient_type === 'program' && recipient_ids && Array.isArray(recipient_ids)) {
        const { data: programStudents, error: programError } = await supabase
            .from('students')
            .select('id')
            .in('program_id', recipient_ids);

        if (programError) {
            return NextResponse.json({ error: programError.message }, { status: 500 });
        }

        targetStudentIds = programStudents?.map((s: { id: string }) => s.id) || [];
    } else if (recipient_type === 'individual' && recipient_ids && Array.isArray(recipient_ids)) {
        targetStudentIds = recipient_ids;
    }

    if (targetStudentIds.length === 0) {
        return NextResponse.json({ error: 'No valid recipients found' }, { status: 400 });
    }

    const { data: notifications, error } = await supabase
        .from('notifications')
        .insert({
            title,
            message,
            category: category || 'General',
            priority: priority || 'normal',
            recipient_type,
            recipient_ids: targetStudentIds,
            related_id: related_id || null,
            related_type: related_type || null,
        })
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ notifications }, { status: 201 });
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
        .from('notifications')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
