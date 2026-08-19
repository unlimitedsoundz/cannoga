import { createServerClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
        return NextResponse.json({ invoices: [], error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'REGISTRAR' || profile?.role === 'FINANCE_OFFICER';

    const { data: student, error: studentError } = await supabase
        .from('students')
        .select(`
            id,
            application_id,
            enrollment_status,
            course:Course(title)
        `)
        .eq('user_id', user.id)
        .maybeSingle();

    const studentId = student?.id;
    let dbInvoices: any[] = [];

    // 1. Fetch formal invoices
    let invQuery = supabase
        .from('invoices')
        .select('*')
        .order('issued_date', { ascending: false });

    if (!isAdmin) {
        if (studentId) {
            invQuery = invQuery.eq('student_id', studentId);
        } else {
            invQuery = invQuery.eq('student_id', '00000000-0000-0000-0000-000000000000');
        }
    }

    const { data: invData } = await invQuery;
    
    if (invData && invData.length > 0) {
        dbInvoices = invData.map((inv: any) => ({
            id: inv.id,
            invoice_number: inv.invoice_number || `INV-${inv.id.slice(0, 8).toUpperCase()}`,
            description: inv.description || inv.type || 'Tuition & Fees',
            total: Number(inv.amount || 0),
            paid: Number(inv.paid || 0),
            balance: Number(inv.balance || (inv.amount - (inv.paid || 0))),
            status: inv.status || (inv.balance <= 0 ? 'PAID' : 'ISSUED'),
            due_date: inv.due_date,
            action: inv.balance <= 0 ? 'SETTLED' : 'PAY_NOW',
            application_id: inv.application_id || student?.application_id,
            invoice_type: 'TUITION'
        }));
    }

    // 1b. Fetch Housing Invoices & Auto-Generate if signed contract exists
    const studentUserIds = [user.id, studentId].filter(Boolean);

    let housingInvQuery = supabase
        .from('housing_invoices')
        .select('*')
        .order('created_at', { ascending: false });

    if (!isAdmin) {
        housingInvQuery = housingInvQuery.in('student_id', studentUserIds);
    }

    const { data: housingInvData } = await housingInvQuery;
    const existingHousingInvoices = housingInvData || [];

    // Also check if student has signed a housing application that needs an invoice auto-generated
    const { data: signedHousingApps } = await supabase
        .from('housing_applications')
        .select('id, student_id, status, assigned_room:assigned_room_id(full_room_code), building:building_id(name), homestay_host:homestay_host_id(host_name), created_at')
        .in('student_id', studentUserIds)
        .in('status', ['contract_signed', 'deposit_paid', 'confirmed']);

    if (signedHousingApps && signedHousingApps.length > 0) {
        for (const app of signedHousingApps) {
            const hasExisting = existingHousingInvoices.some((hi: any) => hi.application_id === app.id);
            if (!hasExisting) {
                // Synthesize or record the $500 housing deposit invoice
                const autoRef = `HDEP-${app.id.replace(/[^0-9]/g, '').slice(-6) || '50001'}`;
                const bName = (app.building as any)?.name ?? (app.homestay_host as any)?.host_name ?? 'Residence';
                const rCode = (app.assigned_room as any)?.full_room_code ?? '';
                const isPaid = app.status === 'deposit_paid' || app.status === 'confirmed';

                dbInvoices.push({
                    id: `hdep-${app.id}`,
                    invoice_number: autoRef,
                    description: `Housing Security Deposit (${bName}${rCode ? ` · Room ${rCode}` : ''})`,
                    total: 500,
                    paid: isPaid ? 500 : 0,
                    balance: isPaid ? 0 : 500,
                    status: isPaid ? 'PAID' : 'ISSUED',
                    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    action: isPaid ? 'SETTLED' : 'PAY_NOW',
                    application_id: app.id,
                    invoice_type: 'HOUSING_DEPOSIT'
                });
            }
        }
    }

    if (existingHousingInvoices.length > 0) {
        for (const hInv of existingHousingInvoices) {
            const total = Number(hInv.total_amount || 500);
            const paid = Number(hInv.paid_amount || 0);
            const balance = Math.max(0, total - paid);
            const st = String(hInv.status || '').toUpperCase();
            const isPaid = st === 'PAID' || st === 'COMPLETED' || balance <= 0;

            const purposeMeta = hInv.metadata?.building_name 
                ? `Housing Security Deposit (${hInv.metadata.building_name}${hInv.metadata.room_code ? ` · Room ${hInv.metadata.room_code}` : ''})`
                : 'Housing Security Deposit (Residence Placement)';

            if (!dbInvoices.some(i => i.id === hInv.id || i.invoice_number === hInv.reference_number)) {
                dbInvoices.push({
                    id: hInv.id,
                    invoice_number: hInv.reference_number || `HDEP-${hInv.id.slice(0, 8).toUpperCase()}`,
                    description: purposeMeta,
                    total: total,
                    paid: paid,
                    balance: balance,
                    status: isPaid ? 'PAID' : 'ISSUED',
                    due_date: hInv.due_date,
                    action: isPaid ? 'SETTLED' : 'PAY_NOW',
                    application_id: hInv.application_id || student?.application_id,
                    invoice_type: 'HOUSING_DEPOSIT',
                    metadata: hInv.metadata
                });
            }
        }
    }

    // 2. Fetch admission offers & tuition payments to dynamically assemble institutional invoices
    let offerInvoices: any[] = [];
    let offersQuery = supabase
        .from('admission_offers')
        .select(`
            id,
            application_id,
            tuition_fee,
            payment_deadline,
            invoice_pushed,
            invoice_type,
            status,
            application:applications(
                id,
                user_id,
                course:Course(title)
            )
        `)
        .order('created_at', { ascending: false });

    if (!isAdmin) {
        // Only student's offers
        const { data: offers } = await offersQuery;
        var myOffers = (offers || []).filter((o: any) => o.application?.user_id === user.id);
    } else {
        const { data: offers } = await offersQuery;
        var myOffers = (offers || []);
    }

    for (const offer of myOffers) {
        // Fetch all verified/completed payments for this offer
        const { data: offerPayments } = await supabase
            .from('tuition_payments')
            .select('amount, status, invoice_type')
            .eq('offer_id', offer.id);

        const verifiedPayments = (offerPayments || []).filter(
            (p: any) => p.status === 'COMPLETED' || p.status === 'verified'
        );

        const totalPaid = verifiedPayments.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);
        const tuitionAmount = Number(offer.tuition_fee || 0);
        const balance = Math.max(0, tuitionAmount - totalPaid);
        const courseTitle = offer.application?.course?.title || 'Program Tuition';

        const invNum = `INV-2026-${offer.id.replace(/-/g, '').slice(0, 5).toUpperCase()}`;
        const purpose = offer.invoice_type === 'TUITION_FULL'
            ? `Fall Semester Full Tuition (${courseTitle})`
            : `Letter of Acceptance / Tuition Deposit Obligation`;

        offerInvoices.push({
            id: offer.id,
            invoice_number: invNum,
            description: purpose,
            total: tuitionAmount,
            paid: totalPaid,
            balance: balance,
            status: balance <= 0 && totalPaid > 0 ? 'PAID' : 'ISSUED',
            due_date: offer.payment_deadline,
            action: balance <= 0 && totalPaid > 0 ? 'SETTLED' : 'PAY_NOW',
            application_id: offer.application_id,
            invoice_type: offer.invoice_type || 'TUITION_DEPOSIT'
        });
    }

    // Combine any formal invoices and offer invoices without duplication
    const combinedInvoices = [...dbInvoices];
    for (const offInv of offerInvoices) {
        if (!combinedInvoices.some(i => i.id === offInv.id)) {
            combinedInvoices.push(offInv);
        }
    }

    return NextResponse.json({ invoices: combinedInvoices });
}