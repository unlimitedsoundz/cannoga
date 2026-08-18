import { NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';

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

    const adminClient = createServiceRoleClient();

    const { data, error } = await adminClient
        .from('tuition_payments')
        .select(`
            *,
            offer:admission_offers(
                id,
                tuition_fee,
                status,
                application:applications(
                    id,
                    application_number,
                    status,
                    personal_info,
                    course:Course(title, school:School(name)),
                    user:profiles(first_name, last_name, email)
                )
            )
        `)
        .in('status', ['pending_admin_verification', 'PENDING_VERIFICATION', 'PENDING', 'pending'])
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[GET /api/payments/admin/verification-queue]', error);
        return NextResponse.json({ error: 'Failed to fetch queue', details: error.message }, { status: 500 });
    }

    // Flatten application from offer relation for consumers
    const formattedQueue = (data || []).map((item: any) => ({
        ...item,
        application: item.offer?.application || null,
        wire_tracking_ref: item.fx_metadata?.wire_tracking_ref || item.transaction_reference,
        local_currency: item.currency || item.fx_metadata?.localCurrency,
        local_amount: item.fx_metadata?.localAmount || item.amount,
        exchange_rate_applied: item.fx_metadata?.rate || 1,
        country_code: item.country || item.fx_metadata?.country_code,
        student_proof_ref: item.fx_metadata?.student_bank_ref || item.transaction_reference,
        proof_submitted_at: item.created_at,
    }));

    return NextResponse.json({ queue: formattedQueue, count: formattedQueue.length });
}
