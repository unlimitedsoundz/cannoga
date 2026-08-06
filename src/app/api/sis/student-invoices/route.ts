import { createServerClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
        return NextResponse.json({ invoices: [], error: 'Unauthorized' }, { status: 401 });
    }

    const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (studentError || !student) {
        return NextResponse.json({ invoices: [], error: 'Student not found' }, { status: 404 });
    }

    const { data: invoices, error: invoicesError } = await supabase
        .from('tuition_payments')
        .select('id, transaction_reference, amount, status, created_at, invoice_id')
        .eq('student_id', student.id)
        .order('created_at', { ascending: false });

    if (invoicesError) {
        console.error('Error fetching invoices:', invoicesError);
        return NextResponse.json({ invoices: [], error: 'Failed to fetch invoices' }, { status: 500 });
    }

    return NextResponse.json({ invoices: invoices || [] });
}