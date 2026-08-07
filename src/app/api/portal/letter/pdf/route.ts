import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { getTuitionFee, mapSchoolToTuitionField, getProgramYears } from '@/utils/tuition';

async function getPuppeteerBrowser() {
  try {
    const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    return await puppeteer.launch({
      headless: true,
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
    });
  } catch (launchError) {
    console.error('Puppeteer launch failed:', launchError);
    throw new Error('Failed to launch browser for PDF generation');
  }
}

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
  'Fall 2026': '2026-09-11',
  'Winter 2027': '2027-01-18',
  'Fall 2027': '2027-09-11',
};

function getVisaDeadlineForIntake(intake?: string | null): string | null {
  if (!intake) return null;
  const startDateStr = INTAKE_START_DATES[intake.trim()];
  if (!startDateStr) return null;
  const startDate = new Date(startDateStr);
  const visaDeadline = new Date(startDate);
  visaDeadline.setDate(visaDeadline.getDate() - 27);
  return visaDeadline.toLocaleDateString('en-CA');
}

async function mapApplicationToTemplateData(application: any, logoUrl: string | null, signatureUrl: string | null) {
  const course = application.course || {};
  const school = course.school || {};
  const user = application.user || {};
  const offer = application.offer || {};
  const personalInfo = application.personal_info || {};

  const firstName = personalInfo.firstName || user.first_name || '';
  const lastName = personalInfo.lastName || user.last_name || '';
  const studentId = user.student_id || application.id.slice(0, 8).toUpperCase();
  
  const addressParts = [
    personalInfo.streetAddress || user.address || '',
    [personalInfo.city || user.city, personalInfo.state_province, personalInfo.zipcode].filter(Boolean).join(', '),
    personalInfo.country || user.country_of_residence
  ].filter(Boolean);
  const address = addressParts.join(', ') || 'Address Pending';

  const degreeLevelRaw = (course.degreeLevel || '').toUpperCase();
  const credential = degreeLevelRaw === 'MASTER' ? "Master's Degree"
    : degreeLevelRaw === 'BACHELOR' ? "Bachelor's Degree"
    : degreeLevelRaw === 'DIPLOMA' ? 'Ontario College Diploma'
    : degreeLevelRaw === 'CERTIFICATE' ? 'Ontario College Certificate'
    : "Bachelor's Degree";

  const schoolSlug = (school.slug || 'technology').toLowerCase();
  const tuitionField = mapSchoolToTuitionField(schoolSlug);
  const studentType = (personalInfo.studentType || '').toLowerCase();
  const isDomestic = studentType === 'domestic';
  const tuitionFee = await getTuitionFee(degreeLevelRaw, tuitionField, isDomestic);
  const ancillaryFee = 700;
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
  dueDate2.setDate(dueDate2.getDate() + 14);
  const dueDate3 = new Date(dueDate2);
  dueDate3.setDate(dueDate3.getDate() + 14);
  const dueDate1Label = dueDate1.toLocaleDateString('en-CA');
  const dueDate2Label = dueDate2.toLocaleDateString('en-CA');
  const dueDate3Label = dueDate3.toLocaleDateString('en-CA');

  const schoolType = school.slug === 'business' ? 'Private' : 'Private';
  const intake = application.intake || '';

  const visaDeadline = getVisaDeadlineForIntake(intake);
  const fallVisaDeadline = getVisaDeadlineForIntake('Fall 2026') || 'August 15, 2026';
  const winterVisaDeadline = getVisaDeadlineForIntake('Winter 2027') || 'December 15, 2026';
  const summerVisaDeadline = getVisaDeadlineForIntake('Summer 2026') || 'April 15, 2026';

  return {
    issueDate,
    intake,
    college: {
      name: 'Cannoga College',
      logoUrl: logoUrl || 'https://lbkrzyqpdqgtqbodkcyi.supabase.co/storage/v1/object/public/application-documents/logo-cannoga.png',
      campus: 'Ottawa',
      address: '81 Montreal Road, Ottawa, Ontario, K1L 6E8, Canada',
      phone: '+1 (613) 555-0181',
      email: 'admissions@cannogacollege.ca',
      type: schoolType,
      website: 'cannogacollege.ca',
      dliNumber: 'O22203958882',
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
      startDate: new Date(application.start_date || Date.now()).toLocaleDateString('en-CA'),
      completionDate: (() => {
        const start = application.start_date ? new Date(application.start_date) : new Date();
        const years = getProgramYears(course.duration || '', course.degreeLevel);
        const completion = new Date(start);
        completion.setFullYear(completion.getFullYear() + years);
        return completion.toLocaleDateString('en-CA');
      })(),
      credential: credential,
      level: degreeLevelRaw === 'MASTER' ? 'Level 7' : degreeLevelRaw === 'BACHELOR' ? 'Level 6' : 'Level 5',
      hoursPerWeek: degreeLevelRaw === 'MASTER' ? '1,800' : degreeLevelRaw === 'BACHELOR' ? '2,400' : '1,200',
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
      summer: summerVisaDeadline,
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    const supabase = await createServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: application, error } = await supabase
      .from('applications')
      .select(`
        *,
        course:Course(*, school:School(*)),
        user:profiles(*),
        offer:admission_offers(*)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const [logoUrl, signatureUrl] = await Promise.all([
      getSystemSetting('letter_logo_url'),
      getSystemSetting('letter_signature_url'),
    ]);

    const templateData = await mapApplicationToTemplateData(application, logoUrl, signatureUrl);

    const templatePath = path.join(process.cwd(), 'src', 'app', 'api', 'portal', 'letter', 'pdf', 'loa-template.html');
    const templateHtml = await fs.readFile(templatePath, 'utf8');
    const compiledTemplate = Handlebars.compile(templateHtml);
    const finalHtml = compiledTemplate(templateData);

    const browser = await getPuppeteerBrowser();
    const page = await browser.newPage();
    await page.setContent(finalHtml, { waitUntil: 'load' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    });

    await browser.close();

    // Upload PDF to Supabase storage
    const serviceClient = createServiceRoleClient();
    const fileName = `letter-of-acceptance-${application.course?.slug || application.id}.pdf`;
    const storagePath = `student-documents/${application.user?.id}/${fileName}`;

    const pdfData = Buffer.from(pdfBuffer);
    const { error: uploadError } = await serviceClient.storage
      .from('application-documents')
      .upload(storagePath, pdfData, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('PDF upload error:', uploadError);
    }

    const { data: { publicUrl } } = serviceClient.storage
      .from('application-documents')
      .getPublicUrl(storagePath);

    // Find student record
    const { data: student } = await serviceClient
      .from('students')
      .select('id')
      .eq('user_id', application.user_id)
      .maybeSingle();

    if (student) {
      const { error: docError } = await serviceClient
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
          metadata: {
            application_id: application.id,
            course_id: application.course?.id,
            degree_level: application.course?.degreeLevel,
            programme_slug: application.course?.slug,
          },
        }, {
          onConflict: 'student_id,document_type',
        });

      if (docError) {
        console.error('Document record creation error:', docError);
      }
    }

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate PDF';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}