// ==============================================================================
// POST /api/sis/admin/integrations/microsoft/sync-all
// Queues sync operations for all active enrollments and course sections.
// Admin only. Idempotent — duplicate queue items are suppressed.
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { enqueueSync } from '@/lib/microsoft/sync-queue';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden. Admin role required.' }, { status: 403 });
        }

        const body = await request.json().catch(() => ({}));
        const {
            syncSections = true,
            syncEnrollments = true,
            syncFaculty = true,
        } = body;

        const adminClient = createServiceRoleClient();
        let queued = 0;

        // 1. Queue class provisioning for all active sections without a Microsoft class
        if (syncSections) {
            const { data: unmappedSections } = await adminClient
                .from('course_sections')
                .select('id')
                .is('microsoft_class_id', null)
                .not('status', 'in', '("CANCELLED","ARCHIVED")');

            for (const section of unmappedSections || []) {
                const r = await enqueueSync('course_section', section.id, 'create', {}, user.id);
                if (r.queued) queued++;
            }
        }

        // 2. Queue active enrollment roster additions
        if (syncEnrollments) {
            const { data: activeEnrollments } = await adminClient
                .from('module_enrollments')
                .select('id, microsoft_sync_status')
                .eq('status', 'REGISTERED')
                .in('microsoft_sync_status', ['UNSYNCED', 'ERROR']);

            for (const enrollment of activeEnrollments || []) {
                const r = await enqueueSync('enrollment', enrollment.id, 'add_student', {}, user.id);
                if (r.queued) queued++;
            }
        }

        // 3. Queue faculty/teacher mappings
        if (syncFaculty) {
            const { data: sectionsWithInstructor } = await adminClient
                .from('course_sections')
                .select('id, instructor_id, microsoft_class_id')
                .not('instructor_id', 'is', null)
                .not('microsoft_class_id', 'is', null);

            for (const section of sectionsWithInstructor || []) {
                const r = await enqueueSync('course_section', section.id, 'add_teacher', {}, user.id);
                if (r.queued) queued++;
            }
        }

        return NextResponse.json({
            ok: true,
            queued,
            message: `${queued} sync operations queued. Use the sync trigger to process them.`,
        });
    } catch (err: any) {
        console.error('[API /sis/admin/integrations/microsoft/sync-all] Error:', err);
        return NextResponse.json({ error: err?.message }, { status: 500 });
    }
}
