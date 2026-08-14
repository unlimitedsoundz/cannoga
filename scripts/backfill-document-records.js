require('dotenv').config({ path: require('path').join(process.cwd(), '.env.local') });

const path = require('path');
const { createClient } = require('@supabase/supabase-js');

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

async function upsertDocumentRecord(payload) {
  const { data: existing } = await supabase
    .from('document_records')
    .select('id')
    .eq('student_id', payload.student_id)
    .eq('document_type', payload.document_type)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase
      .from('document_records')
      .update(payload)
      .eq('id', existing.id);
    return error ? false : true;
  }

  const { error } = await supabase
    .from('document_records')
    .insert(payload);
  return error ? false : true;
}

async function backfillDocumentRecords() {
  console.log('Fetching all students...');
  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('id, user_id, application_id, student_id, enrollment_status');

  if (studentsError) {
    console.error('Error fetching students:', studentsError);
    process.exit(1);
  }

  console.log(`Found ${students.length} students\n`);

  let totalCreated = 0;
  let totalSkipped = 0;

  for (const student of students) {
    console.log(`Processing student: ${student.student_id} (${student.id})`);
    console.log(`  - student.application_id: ${student.application_id}`);
    console.log(`  - student.user_id: ${student.user_id}`);

    let application = null;

    if (student.application_id) {
      const { data: appByAppId, error: appErrorByAppId } = await supabase
        .from('applications')
        .select('id, user_id, status, course_id, intake, personal_info, updated_at, created_at')
        .eq('id', student.application_id)
        .single();

      console.log(`  - Lookup by application_id:`, appErrorByAppId ? appErrorByAppId.message : 'found', appByAppId?.id);

      if (!appErrorByAppId && appByAppId) {
        application = appByAppId;
      }
    }

    if (!application && student.user_id) {
      const { data: appByUserId, error: appErrorByUserId } = await supabase
        .from('applications')
        .select('id, user_id, status, course_id, intake, personal_info, updated_at, created_at')
        .eq('user_id', student.user_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log(`  - Lookup by user_id:`, appErrorByUserId ? appErrorByUserId.message : 'found', appByUserId?.id);

      if (!appErrorByUserId && appByUserId) {
        application = appByUserId;
      }
    }

    if (!application) {
      console.log(`  - No application found, skipping`);
      totalSkipped++;
      continue;
    }

    // Fetch related data
    const [{ data: course }, { data: offer }] = await Promise.all([
      supabase.from('Course').select('id, title, slug, degreeLevel, schoolId').eq('id', application.course_id).maybeSingle(),
      supabase.from('admission_offers').select('id, document_url, accepted_at, created_at').eq('application_id', application.id).maybeSingle(),
    ]);

    const selectedOffer = Array.isArray(offer) ? offer[0] : offer;

    // 1. LOA document
    if (selectedOffer?.document_url) {
      await supabase.from('document_records')
        .delete()
        .eq('student_id', student.id)
        .eq('document_type', 'enrollment_confirmation');

      const ok = await upsertDocumentRecord({
        student_id: student.id,
        document_type: 'loa',
        title: `Letter of Acceptance - ${course?.title || 'Program'}`,
        programme: course?.title || '',
        status: 'active',
        storage_path: selectedOffer.document_url,
        is_official: true,
        is_student_visible: true,
        version: 1,
        issue_date: selectedOffer.accepted_at || selectedOffer.created_at || new Date().toISOString(),
        metadata: {
          application_id: application.id,
          course_id: course?.id,
          degree_level: course?.degreeLevel,
          programme_slug: course?.slug,
          offer_id: selectedOffer.id,
        },
      });

      if (ok) {
        console.log(`  - LOA document recorded`);
        totalCreated++;
      } else {
        console.error(`  - Error creating LOA record`);
      }
    }

    // 2. Invoices as documents
    const { data: invoices } = await supabase
      .from('invoices')
      .select('*')
      .eq('student_id', student.id)
      .order('issued_date', { ascending: false });

    if (invoices && invoices.length > 0) {
      for (const invoice of invoices) {
        const invoiceType = invoice.type === 'TUITION' ? 'tuition_invoice' : invoice.type.toLowerCase();

        const ok = await upsertDocumentRecord({
          student_id: student.id,
          document_type: invoiceType,
          title: `${invoice.type} Invoice - ${invoice.term}`,
          programme: course?.title || '',
          status: invoice.status === 'PAID' ? 'issued' : 'pending',
          storage_path: null,
          is_official: true,
          is_student_visible: true,
          version: 1,
          issue_date: invoice.issued_date || new Date().toISOString(),
          metadata: {
            invoice_id: invoice.id,
            invoice_number: invoice.invoice_number,
            amount: invoice.amount,
            paid: invoice.paid,
            balance: invoice.balance,
            due_date: invoice.due_date,
          },
        });

        if (ok) {
          console.log(`  - Invoice recorded: ${invoice.invoice_number}`);
          totalCreated++;
        } else {
          console.error(`  - Error creating invoice record`);
        }
      }
    }

    // 4. Tuition receipts for verified payments
    const { data: payments } = await supabase
      .from('tuition_payments')
      .select('*')
      .eq('offer_id', selectedOffer?.id)
      .eq('status', 'verified');

    if (payments && payments.length > 0) {
      for (const payment of payments) {
        const receiptUrl = `https://lbkrzyqpdqgtqbodkcyi.supabase.co/storage/v1/object/public/application-documents/receipt-${payment.id}.pdf`;

        const ok = await upsertDocumentRecord({
          student_id: student.id,
          document_type: 'tuition_receipt',
          title: `Tuition Receipt - ${payment.transaction_reference || payment.id}`,
          programme: course?.title || '',
          status: 'issued',
          storage_path: receiptUrl,
          is_official: true,
          is_student_visible: true,
          version: 1,
          issue_date: payment.created_at || new Date().toISOString(),
          metadata: {
            payment_id: payment.id,
            transaction_reference: payment.transaction_reference,
            amount: payment.amount,
            invoice_type: payment.invoice_type,
            payment_method: payment.payment_method,
          },
        });

        if (ok) {
          console.log(`  - Receipt recorded: ${payment.transaction_reference}`);
          totalCreated++;
        } else {
          console.error(`  - Error creating receipt record`);
        }
      }
    }

    console.log('');
  }

  console.log('=== Backfill Complete ===');
  console.log(`Total records created/updated: ${totalCreated}`);
  console.log(`Students skipped (no data): ${totalSkipped}`);
}

backfillDocumentRecords()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
