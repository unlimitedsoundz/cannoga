import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import type { SignContractPayload } from '@/types/housing';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const supabase    = await createServerClient();
    const adminClient = createServiceRoleClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: SignContractPayload = await req.json();
    const { applicationId, signatureName, mealPlanId, moveInDate, moveOutDate, specialAccommodations } = body;

    if (!applicationId || !signatureName) {
        return NextResponse.json({ error: 'applicationId and signatureName are required' }, { status: 400 });
    }

    // Verify the application belongs to this student
    const { data: application, error: appErr } = await adminClient
        .from('housing_applications')
        .select('*, assigned_room:assigned_room_id(*), homestay_host:homestay_host_id(*)')
        .eq('id', applicationId)
        .eq('student_id', user.id)
        .maybeSingle();

    if (appErr || !application) {
        return NextResponse.json({ error: 'Application not found or access denied' }, { status: 403 });
    }

    if (application.status === 'contract_signed' || application.status === 'deposit_paid' || application.status === 'confirmed') {
        return NextResponse.json({ error: 'Contract already signed for this application' }, { status: 409 });
    }

    const now = new Date().toISOString();

    // Compute deposit amount: $500 CAD = 50000 minor units
    const DEPOSIT_CAD = 500.00;

    // Create a housing deposit invoice record in housing_invoices
    // Generate a human-readable reference
    const invRef = `HDEP-${Date.now().toString().slice(-8)}`;

    const { data: invoice, error: invErr } = await adminClient
        .from('housing_invoices')
        .insert({
            reference_number: invRef,
            student_id:       user.id,
            application_id:   applicationId,
            total_amount:     DEPOSIT_CAD,
            paid_amount:      0,
            currency:         'CAD',
            status:           'PENDING',
            due_date:         new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            metadata: {
                purpose:          'housing_deposit',
                application_id:   applicationId,
                student_id:       user.id,
                building_name:    (application.assigned_room as any)?.building?.name ?? 'Homestay',
                room_code:        (application.assigned_room as any)?.full_room_code ?? null,
                meal_plan_id:     mealPlanId,
            },
        })
        .select()
        .single();

    if (invErr) {
        console.error('[POST /api/housing/sign-contract] invoice creation:', invErr);
        // Continue anyway — contract is still recorded
        // Trigger in-app notification and email dispatch
        try {
            const bName = (application.assigned_room as any)?.building?.name ?? 'Residence';
            const rCode = (application.assigned_room as any)?.full_room_code ? ` · Room ${(application.assigned_room as any)?.full_room_code}` : '';
            
            // 1. In-app notification
            await adminClient.from('notifications').insert({
                user_id: user.id,
                title: 'New Invoice Issued: Housing Security Deposit',
                message: `An official Housing Security Deposit invoice of $500.00 CAD has been issued for your room reservation (${bName}${rCode}). Due date: ${invoice?.due_date || '7 days'}.`,
                category: 'Finance',
                priority: 'high',
                recipient_type: 'individual',
                recipient_ids: [user.id],
                related_id: applicationId,
                related_type: 'housing_invoice',
                link: '/sis/payments',
                read: false,
                created_at: now
            });

            // 2. Email notification via Edge Function / triggerNotification
            const { triggerNotification } = await import('@/lib/email');
            await triggerNotification({
                type: 'INVOICE_READY',
                applicationId: applicationId,
                additionalData: {
                    userEmail: user.email,
                    amount: DEPOSIT_CAD,
                    currency: 'CAD',
                    invoiceType: 'HOUSING_DEPOSIT',
                    invoiceNumber: invRef,
                    description: `Housing Security Deposit (${bName}${rCode})`,
                    dueDate: invoice?.due_date,
                    link: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cannoga.vercel.app'}/sis/payments`
                }
            });
        } catch (notifErr) {
            console.warn('[housing sign-contract] Could not dispatch notification/email:', notifErr);
        }
    }

    // Update the housing application
    const { data: updated, error: updateErr } = await adminClient
        .from('housing_applications')
        .update({
            status:                  'contract_signed',
            signature_name:          signatureName,
            signed_at:               now,
            selected_meal_plan_id:   mealPlanId ?? null,
            move_in_date:            moveInDate,
            move_out_date:           moveOutDate,
            special_accommodations:  specialAccommodations ?? null,
            deposit_invoice_id:      invoice?.id ?? null,
            updated_at:              now,
        })
        .eq('id', applicationId)
        .select()
        .single();

    if (updateErr) {
        console.error('[POST /api/housing/sign-contract] application update:', updateErr);
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // Fetch bank accounts for payment instructions
    const { data: bankAccounts } = await adminClient
        .from('institutional_bank_accounts')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

    return NextResponse.json({
        success: true,
        application: updated,
        invoice: invoice ?? null,
        deposit: {
            amount_cad:      DEPOSIT_CAD,
            reference:       invRef,
            due_date:        invoice?.due_date,
        },
        bankAccounts: bankAccounts ?? [],
    });
}
