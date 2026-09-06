import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export interface StudentLookupParams {
  query?: string;
  student_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  application_number?: string;
  record_type?: 'all' | 'student' | 'applicant';
  limit?: number;
}

export interface StudentLookupResultItem {
  record_type: 'ENROLLED_STUDENT' | 'APPLICANT';
  student_id: string;
  application_number?: string;
  full_name: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  phone_number?: string;
  country_of_residence?: string;
  status: string; // 'ACTIVE', 'ADMITTED', 'UNDER_REVIEW', 'SUBMITTED', 'DRAFT', etc.
  program: {
    title: string;
    degree_level?: string;
    school_name?: string;
    duration?: string;
    credits?: string;
  };
  tuition: {
    currency: string;
    tuition_fee: number;
    tuition_deposit_paid: boolean;
    tuition_deposit_paid_at?: string | null;
    full_tuition_paid: boolean;
    full_tuition_paid_at?: string | null;
    total_invoiced: number;
    total_paid: number;
    outstanding_balance: number;
    payment_deadline?: string | null;
    offer_status?: string | null;
    offer_type?: string | null;
  };
  journey?: {
    current_stage?: string;
    pal_status?: string;
    study_permit_status?: string;
    start_date?: string;
  };
  invoices: Array<{
    invoice_number: string;
    description: string;
    amount: number;
    paid: number;
    balance: number;
    status: string;
    due_date?: string;
  }>;
  recent_payments: Array<{
    amount: number;
    status: string;
    payment_method?: string;
    transaction_reference?: string;
    created_at?: string;
  }>;
  voice_summary: string;
}

export interface StudentLookupResponse {
  success: boolean;
  count: number;
  message: string;
  voice_summary: string;
  students: StudentLookupResultItem[];
  error?: string;
}

/**
 * Clean and format numbers as currency for voice and display
 */
function formatCAD(amount: number | null | undefined): string {
  const num = Number(amount || 0);
  return `$${num.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} CAD`;
}

/**
 * Format date nicely for human speech
 */
function formatDateForSpeech(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

/**
 * Generate a spoken sentence for voice agent TTS
 */
function buildVoiceSummary(item: StudentLookupResultItem): string {
  const name = item.full_name || 'The student';
  const idText = item.student_id ? `Student ID ${item.student_id}` : (item.application_number ? `Application number ${item.application_number}` : '');
  const program = item.program.title || 'their registered program';
  const roleText = item.record_type === 'ENROLLED_STUDENT' ? 'an active enrolled student' : 'an applicant';
  const statusText = item.status ? `with status ${item.status.replace(/_/g, ' ').toLowerCase()}` : '';

  let tuitionText = '';
  if (item.tuition.tuition_deposit_paid || item.tuition.full_tuition_paid) {
    if (item.tuition.full_tuition_paid) {
      tuitionText = `Full tuition has been paid in full.`;
    } else {
      tuitionText = `The tuition deposit has been paid.`;
    }
  } else if (item.tuition.tuition_fee > 0) {
    tuitionText = `The tuition obligation is ${formatCAD(item.tuition.tuition_fee)}`;
    if (item.tuition.payment_deadline) {
      tuitionText += `, due on ${formatDateForSpeech(item.tuition.payment_deadline)}.`;
    } else {
      tuitionText += '.';
    }
  }

  let balanceText = '';
  if (item.tuition.outstanding_balance > 0) {
    balanceText = `There is an outstanding balance of ${formatCAD(item.tuition.outstanding_balance)}.`;
  } else if (item.tuition.total_paid > 0 && item.tuition.outstanding_balance === 0) {
    balanceText = `The account has no outstanding balance.`;
  }

  let visaText = '';
  if (item.journey?.pal_status && item.journey.pal_status !== 'not_applicable') {
    visaText = `Provincial Attestation Letter status is ${item.journey.pal_status.replace(/_/g, ' ')}.`;
  }

  return `I found the record for ${name}${idText ? `, ${idText}` : ''}. ${name} is ${roleText} for ${program} ${statusText}. ${tuitionText} ${balanceText} ${visaText}`.replace(/\s+/g, ' ').trim();
}

/**
 * Main lookup function querying Supabase database
 */
export async function lookupStudentOrApplicant(
  params: StudentLookupParams,
  client?: ReturnType<typeof createServiceRoleClient>
): Promise<StudentLookupResponse> {
  const adminClient = client || createServiceRoleClient();

  const rawSearch = (params.query || params.student_id || params.name || params.email || params.phone || params.application_number || '').trim();
  const lowerSearch = rawSearch.toLowerCase();
  const digitsOnly = rawSearch.replace(/\D/g, '');
  const recordType = params.record_type || 'all';
  const limit = Math.min(params.limit || 5, 20);

  try {
    // 1. Concurrently query students, applications, and profiles
    const [studentsQuery, appsQuery, profilesQuery] = await Promise.all([
      adminClient
        .from('students')
        .select(`
          id, student_id, user_id, application_id, program_id, enrollment_status,
          institutional_email, personal_email, start_date, expected_graduation_date,
          tuition_deposit_paid, tuition_deposit_paid_at, full_tuition_paid, full_tuition_paid_at,
          current_stage, pal_status, study_permit_status,
          user:profiles!user_id(id, first_name, last_name, middle_name, email, phone_number, student_id, country_of_residence, role),
          course:Course!program_id(id, title, degreeLevel, duration, credits, school:School(name)),
          application:applications!application_id(id, application_number, status)
        `),
      adminClient
        .from('applications')
        .select(`
          id, user_id, course_id, application_number, status, submitted_at, created_at, personal_info,
          user:profiles!user_id(id, first_name, last_name, middle_name, email, phone_number, student_id, country_of_residence, role),
          course:Course!course_id(id, title, degreeLevel, duration, credits, school:School(name)),
          offers:admission_offers(id, tuition_fee, currency, payment_deadline, status, invoice_type, accepted_at)
        `),
      adminClient
        .from('profiles')
        .select('id, first_name, last_name, middle_name, email, phone_number, student_id, country_of_residence, role')
    ]);

    const allStudents = studentsQuery.data || [];
    const allApps = appsQuery.data || [];
    const allProfiles = profilesQuery.data || [];

    // Helper matcher
    const matchesRecord = (fields: Array<string | null | undefined>): boolean => {
      if (!rawSearch) return true; // if no query, return recent/top
      return fields.some(f => {
        if (!f) return false;
        const lowerF = f.toLowerCase();
        if (lowerF.includes(lowerSearch) || lowerSearch.includes(lowerF)) return true;
        if (digitsOnly && digitsOnly.length >= 4) {
          const fDigits = f.replace(/\D/g, '');
          if (fDigits && (fDigits.includes(digitsOnly) || digitsOnly.includes(fDigits))) return true;
        }
        return false;
      });
    };

    // Filter matched enrolled students
    const matchedStudents = (recordType === 'applicant' ? [] : allStudents).filter(s => {
      const u = s.user as any;
      const c = s.course as any;
      const a = s.application as any;
      const fullName = `${u?.first_name || ''} ${u?.last_name || ''}`.trim();

      return matchesRecord([
        s.student_id,
        u?.student_id,
        a?.application_number,
        u?.first_name,
        u?.last_name,
        fullName,
        s.institutional_email,
        s.personal_email,
        u?.email,
        u?.phone_number,
        c?.title,
        c?.school?.name
      ]);
    });

    // Filter matched applications
    const matchedApps = (recordType === 'student' ? [] : allApps).filter(a => {
      const u = a.user as any;
      const c = a.course as any;
      const fullName = `${u?.first_name || ''} ${u?.last_name || ''}`.trim();

      return matchesRecord([
        a.application_number,
        u?.student_id,
        u?.first_name,
        u?.last_name,
        fullName,
        u?.email,
        u?.phone_number,
        c?.title,
        c?.school?.name
      ]);
    });

    // Check if any profiles match who don't have student or application records
    const profileMap = new Map<string, any>(allProfiles.map(p => [p.id, p]));

    // Collect IDs to batch fetch invoices and payments
    const studentIds = new Set<string>();
    const userIds = new Set<string>();
    const applicationIds = new Set<string>();

    matchedStudents.forEach(s => {
      if (s.id) studentIds.add(s.id);
      if (s.user_id) userIds.add(s.user_id);
      if (s.application_id) applicationIds.add(s.application_id);
    });

    matchedApps.forEach(a => {
      if (a.user_id) userIds.add(a.user_id);
      if (a.id) applicationIds.add(a.id);
    });

    const [invoicesRes, paymentsRes, allOffersRes] = await Promise.all([
      adminClient
        .from('invoices')
        .select('*')
        .or(`student_id.in.(${Array.from(studentIds).concat(Array.from(userIds)).join(',') || '00000000-0000-0000-0000-000000000000'})`),
      adminClient
        .from('tuition_payments')
        .select('*')
        .or(`student_id.in.(${Array.from(studentIds).join(',') || '00000000-0000-0000-0000-000000000000'})`),
      adminClient
        .from('admission_offers')
        .select(`
          id, application_id, tuition_fee, currency, payment_deadline, invoice_type, status, accepted_at,
          payments:tuition_payments(*)
        `)
        .in('application_id', Array.from(applicationIds).length > 0 ? Array.from(applicationIds) : ['00000000-0000-0000-0000-000000000000'])
    ]);

    const invoicesData = invoicesRes.data || [];
    const directPaymentsData = paymentsRes.data || [];
    const offersData = allOffersRes.data || [];

    // Map offers by application_id
    const offersByApp = new Map<string, any[]>();
    offersData.forEach(o => {
      const list = offersByApp.get(o.application_id) || [];
      list.push(o);
      offersByApp.set(o.application_id, list);
    });

    // Assemble Enrolled Students
    const results: StudentLookupResultItem[] = [];

    for (const s of matchedStudents.slice(0, limit)) {
      const u = (s.user as any) || profileMap.get(s.user_id) || {};
      const c = (s.course as any) || {};
      const a = (s.application as any) || {};

      // Match invoices
      const relatedInvoices = invoicesData.filter(i => i.student_id === s.id || i.student_id === s.user_id);
      const totalInvoiced = relatedInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
      const invoicePaid = relatedInvoices.reduce((sum, inv) => sum + Number(inv.paid || 0), 0);
      const invoiceBalance = relatedInvoices.reduce((sum, inv) => sum + Number(inv.balance || 0), 0);

      // Match offers and payments
      const appOffers = s.application_id ? (offersByApp.get(s.application_id) || []) : [];
      const primaryOffer = appOffers[0] || null;

      const offerPayments = appOffers.flatMap((o: any) => o.payments || []);
      const directPayments = directPaymentsData.filter(p => p.student_id === s.id);
      const allPayments = [...offerPayments, ...directPayments];

      const paymentsPaid = allPayments
        .filter(p => p.status === 'COMPLETED' || p.status === 'verified')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);

      // Avoid double-counting if both invoices and payments record the same transaction
      const totalPaid = invoicePaid > 0 ? invoicePaid : paymentsPaid;
      const tuitionFee = totalInvoiced > 0 ? totalInvoiced : (primaryOffer?.tuition_fee ? Number(primaryOffer.tuition_fee) : 0);
      const outstandingBalance = invoiceBalance > 0 ? invoiceBalance : Math.max(0, tuitionFee - totalPaid);

      const studentItem: StudentLookupResultItem = {
        record_type: 'ENROLLED_STUDENT',
        student_id: s.student_id || u.student_id || `CC${s.id.slice(0, 7).toUpperCase()}`,
        application_number: a?.application_number,
        full_name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Enrolled Student',
        first_name: u.first_name || '',
        last_name: u.last_name || '',
        middle_name: u.middle_name || undefined,
        email: s.institutional_email || s.personal_email || u.email || '',
        phone_number: u.phone_number || undefined,
        country_of_residence: u.country_of_residence || undefined,
        status: s.enrollment_status || 'ACTIVE',
        program: {
          title: c.title || 'Academic Program',
          degree_level: c.degreeLevel || undefined,
          school_name: c.school?.name || undefined,
          duration: c.duration || undefined,
          credits: c.credits ? String(c.credits) : undefined
        },
        tuition: {
          currency: primaryOffer?.currency || 'CAD',
          tuition_fee: tuitionFee,
          tuition_deposit_paid: Boolean(s.tuition_deposit_paid || primaryOffer?.status === 'ACCEPTED'),
          tuition_deposit_paid_at: s.tuition_deposit_paid_at,
          full_tuition_paid: Boolean(s.full_tuition_paid),
          full_tuition_paid_at: s.full_tuition_paid_at,
          total_invoiced: totalInvoiced,
          total_paid: totalPaid,
          outstanding_balance: outstandingBalance,
          payment_deadline: primaryOffer?.payment_deadline || (relatedInvoices[0]?.due_date) || null,
          offer_status: primaryOffer?.status || null,
          offer_type: primaryOffer?.invoice_type || null
        },
        journey: {
          current_stage: s.current_stage || undefined,
          pal_status: s.pal_status || undefined,
          study_permit_status: s.study_permit_status || undefined,
          start_date: s.start_date ? formatDateForSpeech(s.start_date) : undefined
        },
        invoices: relatedInvoices.map(inv => ({
          invoice_number: inv.invoice_number,
          description: inv.type || 'Tuition & Fees',
          amount: Number(inv.amount || 0),
          paid: Number(inv.paid || 0),
          balance: Number(inv.balance || 0),
          status: inv.status,
          due_date: inv.due_date
        })),
        recent_payments: allPayments.slice(0, 5).map(p => ({
          amount: Number(p.amount || 0),
          status: p.status,
          payment_method: p.payment_method,
          transaction_reference: p.transaction_reference,
          created_at: p.created_at
        })),
        voice_summary: ''
      };

      studentItem.voice_summary = buildVoiceSummary(studentItem);
      results.push(studentItem);
    }

    // Assemble Applicants
    for (const a of matchedApps) {
      if (results.length >= limit) break;

      const userObj = ((Array.isArray(a.user) ? a.user[0] : a.user) || profileMap.get(a.user_id) || {}) as any;
      const courseObj = ((Array.isArray(a.course) ? a.course[0] : a.course) || {}) as any;

      // Skip if this applicant is already listed as an enrolled student
      const alreadyListed = results.some(r =>
        (a.application_number && r.application_number === a.application_number) ||
        (userObj.student_id && r.student_id === userObj.student_id)
      );
      if (alreadyListed) continue;

      const u = userObj;
      const c = courseObj;

      const appOffers = offersByApp.get(a.id) || (a.offers as any[]) || [];
      const primaryOffer = appOffers[0] || null;

      const offerPayments = appOffers.flatMap((o: any) => o.payments || []);
      const totalPaid = offerPayments
        .filter(p => p.status === 'COMPLETED' || p.status === 'verified')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);

      const tuitionFee = primaryOffer?.tuition_fee ? Number(primaryOffer.tuition_fee) : 0;
      const outstandingBalance = Math.max(0, tuitionFee - totalPaid);

      const applicantItem: StudentLookupResultItem = {
        record_type: 'APPLICANT',
        student_id: u.student_id || a.application_number || `APP${a.id.slice(0, 6).toUpperCase()}`,
        application_number: a.application_number || undefined,
        full_name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Applicant',
        first_name: u.first_name || '',
        last_name: u.last_name || '',
        middle_name: u.middle_name || undefined,
        email: u.email || '',
        phone_number: u.phone_number || undefined,
        country_of_residence: u.country_of_residence || undefined,
        status: a.status || 'SUBMITTED',
        program: {
          title: c.title || 'Applied Program',
          degree_level: c.degreeLevel || undefined,
          school_name: c.school?.name || undefined,
          duration: c.duration || undefined,
          credits: c.credits ? String(c.credits) : undefined
        },
        tuition: {
          currency: primaryOffer?.currency || 'CAD',
          tuition_fee: tuitionFee,
          tuition_deposit_paid: primaryOffer?.status === 'ACCEPTED' || totalPaid > 0,
          tuition_deposit_paid_at: primaryOffer?.accepted_at || null,
          full_tuition_paid: false,
          full_tuition_paid_at: null,
          total_invoiced: tuitionFee,
          total_paid: totalPaid,
          outstanding_balance: outstandingBalance,
          payment_deadline: primaryOffer?.payment_deadline || null,
          offer_status: primaryOffer?.status || null,
          offer_type: primaryOffer?.invoice_type || null
        },
        invoices: [],
        recent_payments: offerPayments.map((p: any) => ({
          amount: Number(p.amount || 0),
          status: p.status,
          payment_method: p.payment_method,
          transaction_reference: p.transaction_reference,
          created_at: p.created_at
        })),
        voice_summary: ''
      };

      applicantItem.voice_summary = buildVoiceSummary(applicantItem);
      results.push(applicantItem);
    }

    // Prepare top-level voice summary for the voice agent
    let overallVoiceSummary = '';
    if (results.length === 0) {
      overallVoiceSummary = rawSearch
        ? `I searched our student and applicant records for "${rawSearch}", but could not find a matching student ID or name. Could you please confirm your student ID or the spelling of your name?`
        : `I could not find any student or applicant records. Please provide your student ID or application number.`;
    } else if (results.length === 1) {
      overallVoiceSummary = results[0].voice_summary;
    } else {
      const names = results.map(r => `${r.full_name} (${r.record_type === 'ENROLLED_STUDENT' ? 'Student ID ' + r.student_id : 'Applicant ' + (r.application_number || r.student_id)})`).join('; ');
      overallVoiceSummary = `I found ${results.length} matching records: ${names}. Which one would you like me to look into, or could you provide your exact student ID?`;
    }

    return {
      success: true,
      count: results.length,
      message: results.length > 0 ? `Found ${results.length} record(s).` : 'No matching records found.',
      voice_summary: overallVoiceSummary,
      students: results
    };
  } catch (err: any) {
    console.error('Error in lookupStudentOrApplicant:', err);
    return {
      success: false,
      count: 0,
      message: 'Failed to query student and applicant database.',
      voice_summary: 'I encountered a system error while accessing our student records database. Please try again in a moment or speak with an admissions representative.',
      students: [],
      error: err instanceof Error ? err.message : String(err)
    };
  }
}

/**
 * Standard Vapi Tool Definition schema
 */
export const VAPI_STUDENT_LOOKUP_TOOL_DEFINITION = {
  type: 'function',
  function: {
    name: 'lookup_student',
    description: 'Look up student or applicant records from the Cannoga College database. Searches by student ID (e.g. CC6883340), application number (e.g. SK0782734), student name (first or last), email, phone, or program. Returns enrollment status, academic program, tuition fee, deposit paid status, balance, and payment deadlines with a voice-optimized summary.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'General search term: student ID, name, email, phone number, application number, or program.'
        },
        student_id: {
          type: 'string',
          description: 'Student ID (e.g., CC6883340 or digits 6883340) or application number.'
        },
        name: {
          type: 'string',
          description: 'Full name, first name, or last name of the student or applicant.'
        },
        email: {
          type: 'string',
          description: 'Email address of the student or applicant.'
        },
        phone: {
          type: 'string',
          description: 'Phone number of the student or applicant.'
        },
        application_number: {
          type: 'string',
          description: 'Application reference number (e.g. SK0782734 or CC3050222).'
        },
        record_type: {
          type: 'string',
          enum: ['all', 'student', 'applicant'],
          description: 'Filter by record type: "all" for both students and applicants, "student" for enrolled students only, "applicant" for applicants only. Defaults to "all".'
        }
      },
      required: []
    }
  }
};
