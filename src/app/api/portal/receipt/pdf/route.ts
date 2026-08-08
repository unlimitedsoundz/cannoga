import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import ReceiptPDF from '@/components/portal/pdf/ReceiptPDF';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }

    const supabase = await createServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: payment, error: paymentError } = await supabase
      .from('tuition_payments')
      .select(`
        *,
        application:applications(
          *,
          course:Course(*, school:School(*)),
          user:profiles(*),
          personal_info:profiles(*)
        )
      `)
      .eq('id', paymentId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const pdfBuffer = Buffer.from(await renderToBuffer(React.createElement(ReceiptPDF, { application: payment.application, payment }) as any));

    try {
        const fileName = `receipt-${payment.transaction_reference || payment.id}.pdf`;
        const storagePath = `student-documents/${payment.application.user_id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('application-documents')
            .upload(storagePath, pdfBuffer, {
                contentType: 'application/pdf',
                upsert: true,
            });

        if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
                .from('application-documents')
                .getPublicUrl(storagePath);

            const { data: student } = await supabase
                .from('students')
                .select('id')
                .eq('user_id', payment.application.user_id)
                .maybeSingle();

            if (student) {
                await supabase.from('document_records').upsert({
                    student_id: student.id,
                    document_type: 'tuition_receipt',
                    title: `Tuition Receipt - ${payment.transaction_reference || payment.id}`,
                    programme: payment.application.course?.title || '',
                    status: 'issued',
                    storage_path: publicUrl,
                    is_official: true,
                    is_student_visible: true,
                    issue_date: new Date().toISOString(),
                    metadata: {
                        payment_id: payment.id,
                        transaction_reference: payment.transaction_reference,
                        amount: payment.amount,
                        invoice_type: payment.invoice_type,
                        payment_method: payment.payment_method,
                    },
                }, { onConflict: 'student_id,document_type' });
            }
        }
    } catch (dbError) {
        console.error('Receipt DB update error:', dbError);
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="receipt-${payment.transaction_reference}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}