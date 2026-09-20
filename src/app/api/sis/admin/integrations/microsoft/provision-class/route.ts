// ==============================================================================
// POST /api/sis/admin/integrations/microsoft/provision-class
// Provision a Microsoft Education Class + Team for a Cannoga course section.
// Admin only. Idempotent — safe to call multiple times.
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
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
        const { sectionId } = body;

        if (!sectionId) {
            return NextResponse.json({ error: 'sectionId is required' }, { status: 400 });
        }

        // Validate section exists
        const { data: section } = await supabase
            .from('course_sections')
            .select('id, code')
            .eq('id', sectionId)
            .maybeSingle();

        if (!section) {
            return NextResponse.json({ error: 'Course section not found' }, { status: 404 });
        }

        // Queue the provisioning — does not call Graph directly in this transaction
        const result = await enqueueSync('course_section', sectionId, 'create', {}, user.id);

        return NextResponse.json({
            ok: true,
            queued: result.queued,
            queueItemId: result.id,
            message: result.queued
                ? 'Class provisioning queued. Run sync to process.'
                : 'Provisioning already queued or in progress.',
        });
    } catch (err: any) {
        console.error('[API /sis/admin/integrations/microsoft/provision-class] Error:', err);
        return NextResponse.json({ error: err?.message }, { status: 500 });
    }
}
