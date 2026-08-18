import { createServerClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
        return NextResponse.json({ payments: [], receipts: [], error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'REGISTRAR' || profile?.role === 'FINANCE_OFFICER';
    const adminClient = createAdminClient();

    // 1. Get user's application IDs
    const { data: applications } = await adminClient
        .from('applications')
        .select('id')
        .eq('user_id', user.id);

    const appIds = (applications || []).map(a => a.id);

    // 2. Get user's student record
    const { data: student } = await adminClient
        .from('students')
        .select('id, application_id')
        .eq('user_id', user.id)
        .maybeSingle();

    if (student?.application_id && !appIds.includes(student.application_id)) {
        appIds.push(student.application_id);
    }

    // 3. Get user's admission offer IDs
    let offerIds: string[] = [];
    if (appIds.length > 0) {
        const { data: offers } = await adminClient
            .from('admission_offers')
            .select('id')
            .in('application_id', appIds);
        offerIds = (offers || []).map(o => o.id);
    }

    // 4. Fetch tuition payments
    let query = adminClient
        .from('tuition_payments')
        .select(`
            id,
            offer_id,
            transaction_reference,
            wire_tracking_ref,
            amount,
            local_amount,
            local_currency,
            country_code,
            payment_method,
            status,
            created_at,
            invoice_id,
            invoice_type,
            student_id,
            fx_metadata
        `)
        .order('created_at', { ascending: false });

    if (!isAdmin) {
        const filterClauses: string[] = [];
        if (student?.id) {
            filterClauses.push(`student_id.eq.${student.id}`);
        }
        if (offerIds.length > 0) {
            filterClauses.push(`offer_id.in.(${offerIds.join(',')})`);
        }
        if (filterClauses.length > 0) {
            query = query.or(filterClauses.join(','));
        } else {
            query = query.eq('student_id', '00000000-0000-0000-0000-000000000000');
        }
    }

    const { data: payments, error: paymentsError } = await query;

    if (paymentsError) {
        console.error('Error fetching payments:', paymentsError);
        return NextResponse.json({ payments: [], receipts: [], error: 'Failed to fetch payments' }, { status: 500 });
    }

    // Fetch official receipt PDFs from document_records for these payments / students
    let receiptDocs: any[] = [];
    try {
        const studentIds = [student?.id, ...(payments || []).map((p: any) => p.student_id)].filter(Boolean);
        if (studentIds.length > 0) {
            const { data: docRecords } = await adminClient
                .from('document_records')
                .select('id, student_id, document_type, title, storage_path, metadata')
                .eq('document_type', 'tuition_receipt')
                .in('student_id', studentIds);
            receiptDocs = docRecords || [];
        }
    } catch (docErr) {
        console.warn('Error fetching receipt doc records:', docErr);
    }

    // Transform payments into verified receipts if status is completed/verified
    const verifiedReceipts = (payments || [])
        .filter((p: any) => {
            const st = String(p.status || '').toLowerCase();
            return st === 'completed' || st === 'verified' || st === 'paid';
        })
        .map((p: any) => {
            const rawRef = p.wire_tracking_ref || p.transaction_reference || `PAY-${p.id.slice(0, 6)}`;
            const digits = rawRef.replace(/[^0-9]/g, '');
            const receiptNum = digits.length >= 4 ? `REC-2026-${digits.slice(-6)}` : `REC-2026-${p.id.slice(0, 6).toUpperCase()}`;
            const channel = p.country_code
                ? `Bank Wire (${p.country_code})`
                : (p.payment_method === 'ng_bank' ? 'Bank Wire (Nigeria)' : (p.payment_method?.replace(/_/g, ' ') || 'Direct Payment'));
            
            const fx = p.fx_metadata || {};
            const localAmount = p.local_amount || fx.localAmount || null;
            const localCurrency = p.local_currency || fx.localCurrency || (p.payment_method === 'ng_bank' ? 'NGN' : null);

            // Find matching PDF from document_records table
            const matchingDoc = receiptDocs.find((doc: any) => 
                doc.metadata?.payment_id === p.id ||
                doc.metadata?.transaction_reference === p.transaction_reference ||
                (p.wire_tracking_ref && doc.metadata?.transaction_reference === p.wire_tracking_ref) ||
                (doc.storage_path && (
                    doc.storage_path.includes(p.id) || 
                    (p.transaction_reference && doc.storage_path.includes(p.transaction_reference))
                ))
            );

            const pdfUrl = matchingDoc?.storage_path || `/api/portal/receipt/pdf?paymentId=${p.id}`;

            return {
                receipt_number: receiptNum,
                payment_reference: rawRef,
                channel: channel,
                amount_cad: Number(p.amount || 0),
                local_amount: localAmount ? Number(localAmount) : null,
                local_currency: localCurrency,
                issued_at: p.created_at,
                payment_id: p.id,
                pdf_url: pdfUrl,
                application_id: student?.application_id || (appIds.length > 0 ? appIds[0] : undefined)
            };
        });

    return NextResponse.json({ payments: payments || [], receipts: verifiedReceipts });
}