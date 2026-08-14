const { createClient } = require('@supabase/supabase-js');
const { pdf } = require('@react-pdf/renderer');
const React = require('react');
const path = require('path');

require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function generateLOA(applicationId) {
  console.log(`\n=== Generating LOA for ${applicationId} ===`);

  const { data: application, error: appError } = await supabase
    .from('applications')
    .select(`
      *,
      course:Course(*, school:School(*)),
      user:profiles(*),
      offer:admission_offers(*)
    `)
    .eq('id', applicationId)
    .single();

  if (appError || !application) {
    console.error('Application not found:', appError);
    return null;
  }

  const offer = Array.isArray(application.offer) ? application.offer[0] : application.offer;
  const user = Array.isArray(application.user) ? application.user[0] : application.user;

  console.log('Application:', application.id);
  console.log('User:', user?.id, user?.email);
  console.log('Course:', application.course?.title);
  console.log('Offer:', offer?.id, offer?.document_url);

  try {
    const LetterOfAcceptancePDF = require(path.join(process.cwd(), 'src/components/portal/pdf/LetterOfAcceptancePDF')).default;
    const pdfBlob = await pdf(
      React.createElement(LetterOfAcceptancePDF, { application, admissionDetails: application })
    ).toBlob();

    console.log('PDF generated, size:', pdfBlob.size || 'unknown');

    const fileName = `letter-of-acceptance-${application.course?.slug || application.id}.pdf`;
    const storagePath = `student-documents/${user?.id}/${fileName}`;

    console.log(`Uploading to: ${storagePath}`);

    const { error: uploadError } = await supabase.storage
      .from('application-documents')
      .upload(storagePath, pdfBlob, { contentType: 'application/pdf', upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = await supabase.storage
      .from('application-documents')
      .getPublicUrl(storagePath);

    console.log(`Uploaded: ${publicUrl}`);

    const { data: student } = await supabase
      .from('students')
      .select('id')
      .eq('user_id', user?.id)
      .maybeSingle();

    console.log('Student record:', student?.id || 'not found');

    if (student) {
      await supabase.from('document_records')
        .delete()
        .eq('student_id', student.id)
        .eq('document_type', 'enrollment_confirmation');

      const { data: existingDoc } = await supabase
        .from('document_records')
        .select('id')
        .eq('student_id', student.id)
        .eq('document_type', 'loa')
        .maybeSingle();

      const docPayload = {
        student_id: student.id,
        document_type: 'loa',
        title: `Letter of Acceptance - ${application.course?.title || 'Program'}`,
        programme: application.course?.title || '',
        status: 'active',
        storage_path: publicUrl,
        is_official: true,
        is_student_visible: true,
        version: 1,
        issue_date: offer?.accepted_at || offer?.created_at || new Date().toISOString(),
        metadata: {
          application_id: application.id,
          course_id: application.course?.id,
          degree_level: application.course?.degreeLevel,
          programme_slug: application.course?.slug,
          offer_id: offer?.id,
        },
      };

      if (existingDoc?.id) {
        await supabase.from('document_records').update(docPayload).eq('id', existingDoc.id);
      } else {
        await supabase.from('document_records').insert(docPayload);
      }

      console.log('Document record upserted');
    } else {
      console.log('No student record found, skipping document_records insert');
    }

    if (offer?.id) {
      const { error: offerError } = await supabase
        .from('admission_offers')
        .update({ document_url: publicUrl })
        .eq('id', offer.id);

      if (offerError) {
        console.error('Offer update error:', offerError);
      } else {
        console.log('Offer document_url updated');
      }
    }

    return publicUrl;
  } catch (e) {
    console.error('LOA generation error:', e);
    return null;
  }
}

async function main() {
  const applicationId = '572e319b-51d3-439e-9a16-b30ba4da88d0';

  try {
    const loaUrl = await generateLOA(applicationId);
    console.log('\nLOA Result:', loaUrl || 'FAILED');
  } catch (e) {
    console.error('LOA failed:', e);
  }

  console.log('\n=== Complete ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
