import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
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
    const adminSupabase = createServiceRoleClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let payment: any = null;

    const query = `
      *,
      offer:admission_offers(
        id,
        tuition_fee,
        status,
        application:applications(
          *,
          course:Course(*, school:School(*)),
          user:profiles(*),
          personal_info:profiles(*)
        )
      )
    `;

    const { data: paymentById, error: errorById } = await adminSupabase
      .from('tuition_payments')
      .select(query)
      .eq('id', paymentId)
      .maybeSingle();

    if (paymentById && !errorById) {
      payment = paymentById;
    } else {
      const { data: paymentByRef } = await adminSupabase
        .from('tuition_payments')
        .select(query)
        .eq('transaction_reference', paymentId)
        .maybeSingle();

      if (paymentByRef) {
        payment = paymentByRef;
      }
    }

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const resolvedApplication = payment.offer?.application || payment.application;

    const pdfBuffer = Buffer.from(
      await renderToBuffer(
        React.createElement(ReceiptPDF, {
          application: resolvedApplication,
          payment: { ...payment, application: resolvedApplication }
        }) as any
      )
    );

    try {
        if (resolvedApplication?.user_id) {
            const fileName = `receipt-${payment.transaction_reference || payment.id}.pdf`;
            const storagePath = `student-documents/${resolvedApplication.user_id}/${fileName}`;

            const { error: uploadError } = await adminSupabase.storage
                .from('application-documents')
                .upload(storagePath, pdfBuffer, {
                    contentType: 'application/pdf',
                    upsert: true,
                });

            if (!uploadError) {
                const { data: { publicUrl } } = adminSupabase.storage
                    .from('application-documents')
                    .getPublicUrl(storagePath);

                const { data: student } = await adminSupabase
                    .from('students')
                    .select('id')
                    .eq('user_id', resolvedApplication.user_id)
                    .maybeSingle();

                if (student) {
                    await adminSupabase.from('document_records').upsert({
                        student_id: student.id,
                        document_type: 'tuition_receipt',
                        title: `Tuition Receipt - ${payment.transaction_reference || payment.id}`,
                        programme: resolvedApplication.course?.title || '',
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
        }
    } catch (dbError) {
        console.error('Receipt DB update error:', dbError);
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="receipt-${payment.transaction_reference}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}