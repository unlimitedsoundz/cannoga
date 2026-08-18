import { NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

// GET /api/payments/admin/verification-queue
// Returns all payments pending admin wire verification
export async function GET() {
    const supabase = await createServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin/Finance guard
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || !['ADMIN', 'REGISTRAR', 'FINANCE_OFFICER'].includes(profile.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const adminClient = createAdminClient();

    const { data, error } = await adminClient
        .from('tuition_payments')
        .select(`
            *,
            application:applications(
                id,
                application_number,
                status,
                personal_info,
                course:Course(title, school:School(name)),
                user:profiles(first_name, last_name, email)
            ),
            offer:admission_offers(id, tuition_fee, offer_type, status)
        `)
        .eq('status', 'pending_admin_verification')
        .order('proof_submitted_at', { ascending: true });

    if (error) {
        console.error('[GET /api/payments/admin/verification-queue]', error);
        return NextResponse.json({ error: 'Failed to fetch queue', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ queue: data ?? [], count: data?.length ?? 0 });
}
