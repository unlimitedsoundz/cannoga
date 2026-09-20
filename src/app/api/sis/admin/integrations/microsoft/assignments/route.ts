// ==============================================================================
// GET  /api/sis/admin/integrations/microsoft/assignments?sectionId=...
// POST /api/sis/admin/integrations/microsoft/assignments
// Manage Cannoga assignments and queue Microsoft Education assignment sync.
// Admin/Faculty only.
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { enqueueSync } from '@/lib/microsoft/sync-queue';

export const dynamic = 'force-dynamic';

async function requireFacultyOrAdmin(supabase: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
    if (!profile || !['ADMIN', 'FACULTY'].includes(profile.role)) return null;
    return user;
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createServerClient();
        const user = await requireFacultyOrAdmin(supabase);
        if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const { searchParams } = new URL(request.url);
        const sectionId = searchParams.get('sectionId');
        if (!sectionId) return NextResponse.json({ error: 'sectionId required' }, { status: 400 });

        const adminClient = createServiceRoleClient();
        const { data: assignments } = await adminClient
            .from('cannoga_assignments')
            .select('*')
            .eq('course_section_id', sectionId)
            .order('created_at', { ascending: false });

        return NextResponse.json({ ok: true, assignments: assignments || [] });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createServerClient();
        const user = await requireFacultyOrAdmin(supabase);
        if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await request.json();
        const {
            id: existingId,
            course_section_id,
            classwork_unit_id,
            title,
            instructions,
            due_date,
            points_possible,
            status = 'DRAFT',
            syncToMicrosoft = false,
            publishInMicrosoft = false,
        } = body;

        if (!course_section_id || !title) {
            return NextResponse.json({ error: 'course_section_id and title required' }, { status: 400 });
        }

        const adminClient = createServiceRoleClient();

        let assignmentId: string;

        if (existingId) {
            const { data, error } = await adminClient
                .from('cannoga_assignments')
                .update({
                    title,
                    instructions,
                    due_date,
                    points_possible,
                    status,
                    classwork_unit_id: classwork_unit_id || null,
                    updated_at: new Date().toISOString(),
                    microsoft_sync_status: 'UNSYNCED',
                })
                .eq('id', existingId)
                .select('id')
                .single();

            if (error) return NextResponse.json({ error: error.message }, { status: 500 });
            assignmentId = data.id;
        } else {
            const { data, error } = await adminClient
                .from('cannoga_assignments')
                .insert({
                    course_section_id,
                    classwork_unit_id: classwork_unit_id || null,
                    title,
                    instructions,
                    due_date,
                    points_possible,
                    status,
                    created_by: user.id,
                })
                .select('id')
                .single();

            if (error) return NextResponse.json({ error: error.message }, { status: 500 });
            assignmentId = data.id;
        }

        let queued = false;
        if (syncToMicrosoft) {
            const result = await enqueueSync(
                'assignment',
                assignmentId,
                'sync_assignment',
                { publish: publishInMicrosoft },
                user.id
            );
            queued = result.queued;
        }

        return NextResponse.json({ ok: true, id: assignmentId, queued });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message }, { status: 500 });
    }
}
