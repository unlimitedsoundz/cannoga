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
            application_id: inv.application_id || student?.application_id
        }));
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