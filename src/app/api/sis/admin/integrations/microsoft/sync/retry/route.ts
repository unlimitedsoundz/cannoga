// ==============================================================================
// POST /api/sis/admin/integrations/microsoft/sync/retry
// Reset failed sync queue items back to PENDING for retry. Admin only.
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { retryFailedItems } from '@/lib/microsoft/sync-queue';

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
        const entityType = body.entityType as string | undefined;

        const result = await retryFailedItems(entityType);

        return NextResponse.json({ ok: true, reset: result.reset });
    } catch (err: any) {
        console.error('[API /sis/admin/integrations/microsoft/sync/retry] Error:', err);
        return NextResponse.json({ error: err?.message }, { status: 500 });
    }
}
