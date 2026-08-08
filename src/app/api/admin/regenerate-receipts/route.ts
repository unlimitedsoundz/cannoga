import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import ReceiptPDF from '@/components/portal/pdf/ReceiptPDF';

export async function GET(request: NextRequest) {
  try {
    const adminClient = createServiceRoleClient();

    const { data: payments, error } = await adminClient
      .from('tuition_payments')
      .select(`
        id,
        transaction_reference,
        amount,
        currency,
        country,
        fx_metadata,
        offer_id,
        application:applications(
          id,
          user_id,
          course:Course(title),
          user:profiles(first_name, last_name, student_id, email)
        )
      `)
      .order('created_at', { ascending: true });

    const paymentsList = (payments as any[]) || [];
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const results = [];
    for (const payment of paymentsList) {
      try {
        const application = (payment.application as any)?.[0] || payment.application;
        const pdfBuffer = Buffer.from(await renderToBuffer(
          React.createElement(ReceiptPDF, { 
            application, 
            payment 
          }) as any
        ));

        const fileName = `receipt-${payment.transaction_reference || payment.id}.pdf`;
        const storagePath = `student-documents/${application?.user_id}/${fileName}`;

        const { error: uploadError } = await adminClient.storage
          .from('application-documents')
          .upload(storagePath, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: true,
          });

        if (uploadError) {
          results.push({ id: payment.id, error: uploadError.message });
          continue;
        }

        const { data: { publicUrl } } = adminClient.storage
          .from('application-documents')
          .getPublicUrl(storagePath);

        const { data: student } = await adminClient
          .from('students')
          .select('id')
          .eq('user_id', application?.user_id)
          .maybeSingle();

        if (student) {
          const { error: docError } = await adminClient
            .from('document_records')
            .upsert({
              student_id: student.id,
              document_type: 'tuition_receipt',
              title: `Tuition Receipt - ${payment.transaction_reference || payment.id}`,
              programme: application?.course?.title || '',
              status: 'issued',
              storage_path: publicUrl,
              is_official: true,
              is_student_visible: true,
              issue_date: new Date().toISOString(),
              metadata: {
                payment_id: payment.id,
                transaction_reference: payment.transaction_reference,
                amount: payment.amount,
                invoice_type: (payment as any).invoice_type,
                payment_method: (payment as any).payment_method,
              },
            }, { onConflict: 'student_id,document_type' });

          if (docError) {
            results.push({ id: payment.id, error: docError.message });
          } else {
            results.push({ id: payment.id, success: true, url: publicUrl });
          }
        }
      } catch (err: any) {
        results.push({ id: payment.id, error: err.message });
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed: results.length,
      results 
    });
  } catch (error: any) {
    console.error('Regenerate receipts error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
