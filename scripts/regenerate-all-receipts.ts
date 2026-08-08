import { createClient } from '@supabase/supabase-js';
import puppeteer from 'puppeteer';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import ReceiptPDF from '../src/components/portal/pdf/ReceiptPDF';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lbkrzyqpdqgtqbodkcyi.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function regenerateAllReceipts() {
  console.log('Fetching tuition payments...');
  const { data: payments, error } = await supabase
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

  if (error) {
    console.error('Error fetching payments:', error);
    process.exit(1);
  }

  console.log(`Found ${payments?.length || 0} payments`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const payment of payments || []) {
    try {
      console.log(`Processing payment ${payment.transaction_reference || payment.id}...`);
      
      const pdfBuffer = Buffer.from(await renderToBuffer(
        React.createElement(ReceiptPDF, { 
          application: payment.application, 
          payment 
        }) as any
      ));

      const fileName = `receipt-${payment.transaction_reference || payment.id}.pdf`;
      const storagePath = `student-documents/${payment.application?.user_id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('application-documents')
        .upload(storagePath, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (uploadError) {
        console.error(`  Upload error:`, uploadError.message);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('application-documents')
        .getPublicUrl(storagePath);

      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', payment.application?.user_id)
        .maybeSingle();

      if (student) {
        const { error: docError } = await supabase
          .from('document_records')
          .upsert({
            student_id: student.id,
            document_type: 'tuition_receipt',
            title: `Tuition Receipt - ${payment.transaction_reference || payment.id}`,
            programme: payment.application?.course?.title || '',
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
              payment_method: payment.payment_method,
            },
          }, { onConflict: 'student_id,document_type' });

        if (docError) {
          console.error(`  Document record error:`, docError.message);
        } else {
          console.log(`  ✓ Saved receipt for ${payment.transaction_reference || payment.id}`);
        }
      }
    } catch (err) {
      console.error(`  Error processing payment ${payment.id}:`, err);
    }
  }

  await browser.close();
  console.log('Done regenerating receipts');
}

regenerateAllReceipts().catch(console.error);
