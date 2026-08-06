import { createServerClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
        return NextResponse.json({ payments: [], error: 'Unauthorized' }, { status: 401 });
    }

    const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (studentError || !student) {
        return NextResponse.json({ payments: [], error: 'Student not found' }, { status: 404 });
    }

    const { data: payments, error: paymentsError } = await supabase
        .from('tuition_payments')
        .select('id, transaction_reference, amount, status, created_at, invoice_id')
        .eq('student_id', student.id)
        .order('created_at', { ascending: false });

    if (paymentsError) {
        console.error('Error fetching payments:', paymentsError);
        return NextResponse.json({ payments: [], error: 'Failed to fetch payments' }, { status: 500 });
    }

    return NextResponse.json({ payments: payments || [] });
}