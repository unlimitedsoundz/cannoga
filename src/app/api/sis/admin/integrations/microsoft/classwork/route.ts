// ==============================================================================
// GET  /api/sis/admin/integrations/microsoft/classwork?sectionId=...
// POST /api/sis/admin/integrations/microsoft/classwork
// Manage Cannoga classwork units and queue their Microsoft sync.
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
        const { data: units } = await adminClient
            .from('module_classwork_units')
            .select('*')
            .eq('course_section_id', sectionId)
            .order('display_order', { ascending: true });

        return NextResponse.json({ ok: true, units: units || [] });
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
            title,
            description,
            display_order = 0,
            week_number,
            status = 'DRAFT',
            syncToMicrosoft = false,
        } = body;

        if (!course_section_id || !title) {
            return NextResponse.json({ error: 'course_section_id and title required' }, { status: 400 });
        }

        const adminClient = createServiceRoleClient();

        let unitId: string;

        if (existingId) {
            // Update existing unit
            const { data, error } = await adminClient
                .from('module_classwork_units')
                .update({
                    title,
                    description,
                    display_order,
                    week_number,
                    status,
                    updated_at: new Date().toISOString(),
                    ...(status === 'PUBLISHED' || status === 'DRAFT'
                        ? { microsoft_sync_status: 'UNSYNCED' }
                        : {}),
                })
                .eq('id', existingId)
                .select('id')
                .single();

            if (error) return NextResponse.json({ error: error.message }, { status: 500 });
            unitId = data.id;
        } else {
            // Create new unit
            const { data, error } = await adminClient
                .from('module_classwork_units')
                .insert({
                    course_section_id,
                    title,
                    description,
                    display_order,
                    week_number,
                    status,
                    created_by: user.id,
                })
                .select('id')
                .single();

            if (error) return NextResponse.json({ error: error.message }, { status: 500 });
            unitId = data.id;
        }

        // Queue Microsoft sync if requested
        let queued = false;
        if (syncToMicrosoft) {
            const result = await enqueueSync(
                'classwork_unit',
                unitId,
                'sync_classwork',
                {},
                user.id
            );
            queued = result.queued;
        }

        return NextResponse.json({ ok: true, id: unitId, queued });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message }, { status: 500 });
    }
}
