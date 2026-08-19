import { NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';

// GET /api/payments/admin/verification-queue
// Returns all payments pending admin wire verification (tuition + housing)
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

    // 1. Tuition payments pending verification
    const { data: tuitionData, error: tuitionError } = await adminClient
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

    if (tuitionError) {
        console.error('[GET /api/payments/admin/verification-queue] tuition error:', tuitionError);
    }

    // 2. Housing payments pending verification (including completed-but-unsettled)
    const { data: housingData, error: housingError } = await adminClient
        .from('housing_payments')
        .select(`
            id,
            invoice_id,
            student_id,
            amount,
            currency,
            payment_method,
            transaction_reference,
            created_at,
            status,
            metadata,
            invoice:housing_invoices(id, status, paid_amount, total_amount),
            student:students(
                id,
                user:profiles(first_name, last_name, email),
                application:applications(
                    id,
                    application_number,
                    status,
                    personal_info,
                    course:Course(title, school:School(name))
                )
            )
        `)
        .in('status', ['pending', 'PENDING_VERIFICATION', 'PENDING', 'completed', 'COMPLETED'])
        .order('created_at', { ascending: false });

    if (housingError) {
        console.error('[GET /api/payments/admin/verification-queue] housing error:', housingError);
    }

    // Format tuition items
    const tuitionQueue = (tuitionData || []).map((item: any) => ({
        ...item,
        category: 'TUITION',
        application: item.offer?.application || null,
        wire_tracking_ref: item.fx_metadata?.wire_tracking_ref || item.transaction_reference,
        local_currency: item.currency || item.fx_metadata?.localCurrency,
        local_amount: item.fx_metadata?.localAmount || item.amount,
        exchange_rate_applied: item.fx_metadata?.rate || 1,
        country_code: item.country || item.fx_metadata?.country_code,
        student_proof_ref: item.fx_metadata?.student_bank_ref || item.transaction_reference,
        proof_submitted_at: item.created_at,
    }));

    // Format housing items — skip fully settled invoices
    const housingQueue = (housingData || [])
        .filter((h: any) => {
            const inv = h.invoice;
            const isPaid = inv &&
                Number(inv.paid_amount || 0) >= Number(inv.total_amount || 0) &&
                inv.status === 'PAID';
            return !isPaid;
        })
        .map((h: any) => ({
            id: h.id,
            category: 'HOUSING',
            invoice_type: 'HOUSING_DEPOSIT',
            amount: h.amount,
            currency: h.currency || 'CAD',
            status: h.status,
            transaction_reference: h.transaction_reference,
            created_at: h.created_at,
            wire_tracking_ref: h.transaction_reference,
            local_currency: h.currency || 'CAD',
            local_amount: h.amount,
            exchange_rate_applied: 1,
            country_code: null,
            student_proof_ref: h.transaction_reference,
            proof_submitted_at: h.created_at,
            application: h.student?.application
                ? { ...h.student.application, user: h.student?.user }
                : {
                    id: h.student_id,
                    status: 'ACTIVE',
                    personal_info: {},
                    course: { title: 'Housing Reservation Deposit' },
                    user: h.student?.user || { first_name: 'Student', last_name: '', email: '' },
                },
            offer: null,
        }));

    const formattedQueue = [...tuitionQueue, ...housingQueue]
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ queue: formattedQueue, count: formattedQueue.length });
}
