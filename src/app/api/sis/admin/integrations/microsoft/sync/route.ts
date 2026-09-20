// ==============================================================================
// POST /api/sis/admin/integrations/microsoft/sync
// Trigger sync queue processing. Admin only.
// GET  /api/sis/admin/integrations/microsoft/sync
// Return queue statistics. Admin only.
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { processSyncQueue, getQueueStats } from '@/lib/microsoft/sync-queue';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
    if (profile?.role !== 'ADMIN') return null;
    return user;
}

export async function GET() {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: 'Forbidden. Admin role required.' }, { status: 403 });

    try {
        const stats = await getQueueStats();
        return NextResponse.json({ ok: true, stats });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: 'Forbidden. Admin role required.' }, { status: 403 });

    try {
        const body = await request.json().catch(() => ({}));
        const batchSize = Math.min(Number(body.batchSize) || 10, 50);

        const result = await processSyncQueue(batchSize);

        return NextResponse.json({
            ok: true,
            processed: result.processed,
            errors: result.errors,
        });
    } catch (err: any) {
        console.error('[API /sis/admin/integrations/microsoft/sync] Error:', err);
        return NextResponse.json({ error: err?.message }, { status: 500 });
    }
}
