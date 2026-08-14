import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase URL or Service Role Key in environment');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function regenerateAllReceipts() {
  console.log('Fetching all receipt document records...');

  const { data: receiptRecords, error: fetchError } = await supabase
    .from('document_records')
    .select('id, student_id, metadata, title, storage_path')
    .eq('document_type', 'tuition_receipt');

  if (fetchError) {
    console.error('Error fetching receipt records:', fetchError);
    return;
  }

  console.log(`Found ${receiptRecords?.length || 0} receipt records`);

  for (const record of receiptRecords || []) {
    try {
      let paymentId = record.metadata?.payment_id;
      let payment = null;
      let application = null;

      if (paymentId) {
        const { data: p, error: pError } = await supabase
          .from('tuition_payments')
          .select('*')
          .eq('id', paymentId)
          .single();

        if (!pError && p) {
          payment = p;
          
          const { data: app } = await supabase
            .from('applications')
            .select(`
              *,
              course:Course(*, school:School(*)),
              user:profiles(*)
            `)
            .eq('id', p.offer_id ? undefined : p.id)
            .or(`id.eq.${p.application_id}`)
            .single();
          
          // Better approach: get application via offer
          if (p.offer_id) {
            const { data: offer } = await supabase
              .from('admission_offers')
              .select('application_id')
              .eq('id', p.offer_id)
              .single();
            
            if (offer) {
              const { data: appData } = await supabase
                .from('applications')
                .select(`
                  *,
                  course:Course(*, school:School(*)),
                  user:profiles(*)
                `)
                .eq('id', offer.application_id)
                .single();
              
              application = appData;
            }
          }
        }
      }

      if (!payment || !application) {
        console.log(`Skipping ${record.id}: could not find payment/application`);
        continue;
      }

      console.log(`Regenerating receipt for payment ${payment.id}...`);

      // Generate PDF using the same logic as the API route
      const { renderToBuffer } = require('@react-pdf/renderer');
      const React = require('react');
      const ReceiptPDF = require('../src/components/portal/pdf/ReceiptPDF').default;

      const pdfBuffer = Buffer.from(await renderToBuffer(React.createElement(ReceiptPDF, { application, payment })));

      const fileName = `receipt-${payment.transaction_reference || payment.id}.pdf`;
      const storagePath = `student-documents/${application.user_id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('application-documents')
        .upload(storagePath, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (uploadError) {
        console.error(`  Upload error: ${uploadError.message}`);
        continue;
      }

      const { data: { publicUrl } } = await supabase.storage
        .from('application-documents')
        .getPublicUrl(storagePath);

      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', application.user_id)
        .maybeSingle();

      if (student) {
        await supabase.from('document_records').upsert({
          student_id: student.id,
          document_type: 'tuition_receipt',
          title: `Tuition Receipt - ${payment.transaction_reference || payment.id}`,
          programme: application.course?.title || '',
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

      console.log(`✓ Regenerated receipt for payment ${payment.id}: ${publicUrl}`);
    } catch (error) {
      console.error(`✗ Error processing ${record.id}:`, error);
    }
  }

  console.log('Done regenerating receipts');
}

regenerateAllReceipts().catch(console.error);
