import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { getTuitionFee, mapSchoolToTuitionField, getProgramYears } from '@/utils/tuition';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import LetterOfAcceptancePDF from '@/components/portal/pdf/LetterOfAcceptancePDF';

async function getSystemSetting(key: string) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('system_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error) {
    console.error(`Error fetching setting ${key}:`, error.message || error);
    return null;
  }
  return data.value;
}

const INTAKE_START_DATES: Record<string, string> = {
  'Fall 2026': '2026-09-19',
  'Fall': '2026-09-19',
  'Winter 2027': '2027-01-19',
  'Winter': '2027-01-19',
  'Fall 2027': '2027-09-19',
};

function getStartDateForIntake(intake?: string | null, rawStartDate?: string | null): string {
  if (intake && typeof intake === 'string') {
    const trimmed = intake.trim();
    if (INTAKE_START_DATES[trimmed]) {
      return INTAKE_START_DATES[trimmed];
    }
    const lower = trimmed.toLowerCase();
    if (lower.includes('fall') && lower.includes('2027')) return '2027-09-19';
    if (lower.includes('fall')) return '2026-09-19';
    if (lower.includes('winter') && lower.includes('2027')) return '2027-01-19';
    if (lower.includes('winter')) return '2027-01-19';
  }

  if (rawStartDate) {
    try {
      const parsed = new Date(rawStartDate);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString('en-CA');
      }
    } catch (e) {}
  }

  return '2026-09-19';
}

function getVisaDeadlineForIntake(intake?: string | null): string | null {
  const startDateStr = getStartDateForIntake(intake);
  const startDate = new Date(startDateStr);
  const visaDeadline = new Date(startDate);
  visaDeadline.setDate(visaDeadline.getDate() - 27);
  return visaDeadline.toLocaleDateString('en-CA');
}

export async function mapApplicationToTemplateData(application: any, logoUrl: string | null, signatureUrl: string | null) {
  const course = application.course || {};
  const school = course.school || {};
  const user = application.user || {};
  const offer = application.offer || {};
  const personalInfo = application.personal_info || {};

  const firstName = personalInfo.firstName || user.first_name || '';
  const lastName = personalInfo.lastName || user.last_name || '';
  let studentId = user.student_id || application.id.slice(0, 8).toUpperCase();
  if (!studentId.startsWith('CC')) {
    studentId = studentId.replace(/^(SYK|KC|KU|HU)/, 'CC');
  }
  
  const addressParts = [
    personalInfo.streetAddress || user.address || '',
    [personalInfo.city || user.city, user.state_province, user.zipcode].filter(Boolean).join(', '),
    personalInfo.country || user.country_of_residence
  ].filter(Boolean);
  const address = addressParts.join(', ') || 'Address Pending';

  const degreeLevelRaw = (course.degreeLevel || '').toUpperCase();
  const credential = (degreeLevelRaw === 'MASTER' || degreeLevelRaw === 'ADVANCED_DIPLOMA') ? "Ontario College Advanced Diploma"
    : degreeLevelRaw === 'BACHELOR' ? "Bachelor's Degree"
    : degreeLevelRaw === 'DIPLOMA' ? 'Ontario College Diploma'
    : degreeLevelRaw === 'CERTIFICATE' ? 'Ontario College Certificate'
    : "Bachelor's Degree";

  const schoolSlug = (school.slug || 'technology').toLowerCase();
  const tuitionField = mapSchoolToTuitionField(schoolSlug);
  const studentType = (personalInfo.studentType || '').toLowerCase();
  const isDomestic = studentType === 'domestic';
  const tuitionFee = await getTuitionFee(degreeLevelRaw, tuitionField, isDomestic);
  const { ANCILLARY_FEES_TOTAL } = await import('@/utils/tuition');
  const ancillaryFee = ANCILLARY_FEES_TOTAL;
  const totalAnnual = tuitionFee + ancillaryFee;
  const deposit = 2000;
  const remainingBalance = totalAnnual - deposit;
  const installment2 = Math.round(remainingBalance / 2);
  const installment3 = remainingBalance - installment2;

  const admissionTimestamp = offer.accepted_at || offer.created_at || application.updated_at || application.submitted_at || application.created_at || new Date().toISOString();
  const issueDate = new Date(admissionTimestamp).toLocaleDateString('en-CA');
  const issueDateObj = new Date(admissionTimestamp);
  const expiryDate = new Date(issueDateObj);
  expiryDate.setMonth(expiryDate.getMonth() + 3);
  const expiryLabel = expiryDate.toLocaleDateString('en-CA');
  const dueDate1 = new Date(issueDateObj);
  dueDate1.setDate(dueDate1.getDate() + 14);
  const dueDate2 = new Date(dueDate1);
  dueDate2.setMonth(dueDate2.getMonth() + 3);
  const dueDate3 = new Date(dueDate2);
  dueDate3.setMonth(dueDate3.getMonth() + 3);
  const dueDate1Label = dueDate1.toLocaleDateString('en-CA');
  const dueDate2Label = dueDate2.toLocaleDateString('en-CA');
  const dueDate3Label = dueDate3.toLocaleDateString('en-CA');

  const schoolType = school.slug === 'business' ? 'Private' : 'Private';
  const intake = application.intake || '';
  const resolvedStartDate = getStartDateForIntake(intake, application.start_date);

  const visaDeadline = getVisaDeadlineForIntake(intake);
  const fallVisaDeadline = getVisaDeadlineForIntake('Fall 2026') || 'August 15, 2026';
  const winterVisaDeadline = getVisaDeadlineForIntake('Winter 2027') || 'December 15, 2026';

  return {
    issueDate,
    intake,
    college: {
      name: 'Cannoga College',
      logoUrl: logoUrl || 'https://lbkrzyqpdqgtqbodkcyi.supabase.co/storage/v1/object/public/application-documents/logo-cannoga.png',
      campus: 'Ottawa',
      address: '81 Montreal Road, Ottawa, Ontario, K1L 6E8, Canada',
      phone: '+1 782 206-3309',
      email: 'admissions@cannogacollege.ca',
      type: schoolType,
      website: 'cannogacollege.ca',
      dliNumber: 'O19394821',
    },
    student: {
      id: studentId,
      familyName: lastName,
      givenName: firstName,
      dob: user.date_of_birth || personalInfo.dateOfBirth ? new Date(user.date_of_birth || personalInfo.dateOfBirth).toLocaleDateString('en-CA') : '',
      caq: 'Not Applicable',
      address: address,
      agent: '-',
    },
    program: {
      name: course.title || 'Program',
      status: 'Full-Time',
      campus: 'Ottawa',
      length: `${getProgramYears(course.duration || '', course.degreeLevel)} Years`,
      startDate: resolvedStartDate,
      completionDate: (() => {
        const start = new Date(resolvedStartDate);
        const years = getProgramYears(course.duration || '', course.degreeLevel);
        const completion = new Date(start);
        completion.setFullYear(completion.getFullYear() + years);
        return completion.toLocaleDateString('en-CA');
      })(),
      credential: credential,
      level: (degreeLevelRaw === 'MASTER' || degreeLevelRaw === 'ADVANCED_DIPLOMA') ? 'Level 6' : degreeLevelRaw === 'BACHELOR' ? 'Level 6' : 'Level 5',
      hoursPerWeek: (degreeLevelRaw === 'MASTER' || degreeLevelRaw === 'ADVANCED_DIPLOMA') ? '2,400' : degreeLevelRaw === 'BACHELOR' ? '2,400' : '1,200',
      exchangeProgram: 'No',
      internship: 'Available',
      financialAid: '-',
      conditions: 'Formal acceptance of this offer via the student portal.',
      expiryDate: expiryLabel,
    },
    fees: {
      payments: [
        { amount: `$${deposit.toLocaleString()} CAD`, dueDate: dueDate1Label },
        { amount: `$${installment2.toLocaleString()} CAD`, dueDate: dueDate2Label },
        { amount: `$${installment3.toLocaleString()} CAD`, dueDate: dueDate3Label },
      ],
      tuition: `$${tuitionFee.toLocaleString()} CAD`,
      ancillary: `$${ancillaryFee.toLocaleString()} CAD`,
      totalAnnual: `$${totalAnnual.toLocaleString()} CAD`,
    },
    registrar: {
      name: 'Todd Banning',
      title: 'Registrar',
      signatureUrl: signatureUrl || 'https://lbkrzyqpdqgtqbodkcyi.supabase.co/storage/v1/object/public/application-documents/registrar-signature.png',
    },
    visaDeadlines: {
      fall: fallVisaDeadline,
      winter: winterVisaDeadline,
    },
  };
}

export async function generateAndStoreLOA(applicationId: string, application: any): Promise<{ success: boolean; url?: string; pdfBuffer?: Buffer; error?: string }> {
  const supabase = createServiceRoleClient();

  try {
    const offer = application.offer || {};
    const [logoUrl, signatureUrl] = await Promise.all([
      getSystemSetting('letter_logo_url'),
      getSystemSetting('letter_signature_url'),
    ]);

    const templateData = await mapApplicationToTemplateData(application, logoUrl, signatureUrl);

    let pdfBuffer: Buffer;

    try {
      pdfBuffer = Buffer.from(await renderToBuffer(React.createElement(LetterOfAcceptancePDF, { data: templateData }) as any));
    } catch (pdfError) {
      console.error('PDF generation error:', pdfError);
      return { success: false, error: `Failed to generate PDF: ${pdfError instanceof Error ? pdfError.message : 'Unknown error'}` };
    }

    const fileName = `letter-of-acceptance-${application.course?.slug || application.id}.pdf`;
    const storagePath = `student-documents/${application.user?.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('application-documents')
      .upload(storagePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('PDF upload error:', uploadError);
      return { success: false, error: `Failed to upload PDF: ${uploadError.message}` };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('application-documents')
      .getPublicUrl(storagePath);

    const { data: student } = await supabase
      .from('students')
      .select('id')
      .eq('user_id', application.user_id)
      .maybeSingle();

    if (student) {
      await supabase.from('document_records')
        .delete()
        .eq('student_id', student.id)
        .eq('document_type', 'enrollment_confirmation');

      const { error: docError } = await supabase
        .from('document_records')
        .upsert({
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
        }, {
          onConflict: 'student_id,document_type',
        });

      if (docError) {
        console.error('Document record creation error:', docError);
      }
    }

    return { success: true, url: publicUrl, pdfBuffer };
  } catch (error) {
    console.error('PDF generation error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to generate PDF' };
  }
}
