'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export async function getSISAdminDashboardStats() {
  const adminClient = createServiceRoleClient();

  try {
    const [
      { count: studentCount },
      { count: activeStudentCount },
      { count: applicationCount },
      { count: pendingApplicationCount },
      { count: courseCount },
      { count: moduleCount },
      { count: enrollmentCount },
      { count: facultyCount },
      { count: departmentCount },
      { count: schoolCount },
      { count: auditLogCount },
      { data: recentStudents },
      { data: pendingApplications },
      { data: recentEnrollments },
      { data: allApplications },
      { data: allEnrollments },
    ] = await Promise.all([
      adminClient.from('students').select('*', { count: 'exact', head: true }),
      adminClient.from('students').select('*', { count: 'exact', head: true }).eq('enrollment_status', 'ACTIVE'),
      adminClient.from('applications').select('*', { count: 'exact', head: true }),
      adminClient.from('applications').select('*', { count: 'exact', head: true }).in('status', ['SUBMITTED', 'UNDER_REVIEW', 'DOCS_REQUIRED']),
      adminClient.from('Course').select('*', { count: 'exact', head: true }),
      adminClient.from('modules').select('*', { count: 'exact', head: true }),
      adminClient.from('module_enrollments').select('*', { count: 'exact', head: true }),
      adminClient.from('Faculty').select('*', { count: 'exact', head: true }),
      adminClient.from('Department').select('*', { count: 'exact', head: true }),
      adminClient.from('School').select('*', { count: 'exact', head: true }),
      adminClient.from('audit_logs').select('*', { count: 'exact', head: true }),
      adminClient.from('students').select('id, student_id, enrollment_status, start_date, program_id, user_id, current_stage, pal_status, pal_required, study_permit_status, arrival_status, checkin_status, orientation_status, registration_status').order('created_at', { ascending: false }).limit(5),
      adminClient.from('applications').select('id, application_number, status, course_id, user_id, submitted_at').order('submitted_at', { ascending: false }).limit(5).neq('status', 'DRAFT'),
      adminClient.from('module_enrollments').select(`
        id, student_id, module_id, semester_id, status, grade,
        student:students(student_id, enrollment_status, user:profiles(first_name, last_name)),
        module:modules(code, title),
        semester:semesters(name)
      `).order('created_at', { ascending: false }).limit(5),
      adminClient.from('applications').select('*, status', { count: 'exact' }),
      adminClient.from('module_enrollments').select('*, status', { count: 'exact' }),
    ]);

    const statusCounts = {
      SUBMITTED: allApplications?.filter((s: any) => s.status === 'SUBMITTED').length || 0,
      UNDER_REVIEW: allApplications?.filter((s: any) => s.status === 'UNDER_REVIEW' || s.status === 'DOCS_REQUIRED').length || 0,
      ADMITTED: allApplications?.filter((s: any) => s.status === 'ADMITTED' || s.status === 'OFFER_ACCEPTED').length || 0,
      REJECTED: allApplications?.filter((s: any) => s.status === 'REJECTED' || s.status === 'OFFER_DECLINED').length || 0,
    };

    const enrollmentStatusCounts = {
      REGISTERED: allEnrollments?.filter((e: any) => e.status === 'REGISTERED').length || 0,
      DROPPED: allEnrollments?.filter((e: any) => e.status === 'DROPPED').length || 0,
      COMPLETED: allEnrollments?.filter((e: any) => e.status === 'COMPLETED').length || 0,
      FAILED: allEnrollments?.filter((e: any) => e.status === 'FAILED').length || 0,
    };

    const normalizedRecentEnrollments = (recentEnrollments || []).map((enrollment: any) => ({
      ...enrollment,
      module: Array.isArray(enrollment.module) ? enrollment.module[0] : enrollment.module,
      student: Array.isArray(enrollment.student) ? enrollment.student[0] : enrollment.student,
      semester: Array.isArray(enrollment.semester) ? enrollment.semester[0] : enrollment.semester,
    }));

    return {
      success: true,
      stats: {
        totalStudents: studentCount || 0,
        activeStudents: activeStudentCount || 0,
        totalApplications: applicationCount || 0,
        pendingApplications: pendingApplicationCount || 0,
        totalCourses: courseCount || 0,
        totalModules: moduleCount || 0,
        totalEnrollments: enrollmentCount || 0,
        totalFaculty: facultyCount || 0,
        totalDepartments: departmentCount || 0,
        totalSchools: schoolCount || 0,
        totalAuditLogs: auditLogCount || 0,
        statusCounts,
        enrollmentStatusCounts,
      },
      recentStudents: recentStudents || [],
      pendingApplications: pendingApplications || [],
      recentEnrollments: normalizedRecentEnrollments,
    };
  } catch (e: any) {
    console.error('getSISAdminDashboardStats Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getSISStudentDetail(studentId: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { data: student, error } = await adminClient
      .from('students')
      .select(`
        *,
        user:profiles(first_name, last_name, email, phone_number, date_of_birth, address, city, country_of_residence, student_id),
        program:Course(title, school:School(name)),
        application:applications(*, course:Course(title, slug)),
        enrollments:module_enrollments(*, module:modules(code, title), semester:semesters(name))
      `)
      .eq('id', studentId)
      .maybeSingle();

    if (error) throw error;

    if (student) {
      return { success: true, data: student };
    }

    // Fallback: If studentId corresponds to an application id or user_id
    const { data: appData } = await adminClient
      .from('applications')
      .select(`
        id,
        user_id,
        course_id,
        status,
        submitted_at,
        created_at,
        user:profiles(*),
        course:Course(title, school:School(name)),
        offer:admission_offers(*)
      `)
      .or(`id.eq.${studentId},user_id.eq.${studentId}`)
      .maybeSingle();

    if (appData) {
      const user = Array.isArray(appData.user) ? appData.user[0] : appData.user;
      const course = Array.isArray(appData.course) ? appData.course[0] : appData.course;
      const syntheticStudent = {
        id: appData.id,
        student_id: user?.student_id || `CC${appData.id.slice(0, 6).toUpperCase()}`,
        enrollment_status: appData.status || 'ACTIVE',
        user_id: appData.user_id,
        program_id: appData.course_id,
        application_id: appData.id,
        user,
        program: course,
        application: appData,
        enrollments: [],
      };
      return { success: true, data: syntheticStudent };
    }

    return { success: true, data: null };
  } catch (e: any) {
    console.error('getSISStudentDetail Error:', e);
    return { success: false, error: e.message };
  }
}

export async function updateStudentEnrollmentStatus(studentId: string, status: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { error } = await adminClient
      .from('students')
      .update({ enrollment_status: status, updated_at: new Date().toISOString() })
      .eq('student_id', studentId);

    if (error) throw error;

    return { success: true };
  } catch (e: any) {
    console.error('updateStudentEnrollmentStatus Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getSISAuditLogs(limit: number = 20) {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (e: any) {
    console.error('getSISAuditLogs Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getSISAdmissionsApplications() {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('applications')
      .select(`
        *,
        course:Course(title, slug, degreeLevel),
        user:profiles(first_name, last_name, email, student_id)
      `)
      .neq('status', 'DRAFT')
      .order('submitted_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (e: any) {
    console.error('getSISAdmissionsApplications Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getSISFinanceAccounts() {
  const adminClient = createServiceRoleClient();

  try {
    const [studentsResult, applicationsResult, paymentsResult] = await Promise.all([
      adminClient
        .from('students')
        .select(`
          id, student_id, enrollment_status, program_id,
          user:profiles(first_name, last_name, email),
          course:Course(title, school:School(name), degreeLevel),
          tuition_deposit_paid, tuition_deposit_paid_at,
          full_tuition_paid, full_tuition_paid_at,
          housing_fee_paid, housing_fee_paid_at
        `)
        .order('created_at', { ascending: false })
        .limit(20),
      adminClient
        .from('applications')
        .select(`
          id, application_number, status, course_id, user_id, submitted_at,
          personal_info,
          user:profiles(first_name, last_name, email),
          course:Course(title, school:School(name), degreeLevel, duration),
          offer:admission_offers(
            id, tuition_fee, payment_deadline, offer_type, status, invoice_type, invoice_pushed, invoice_sent_at
          )
        `)
        .in('status', ['OFFER_ACCEPTED', 'PAYMENT_SUBMITTED'])
        .order('submitted_at', { ascending: false })
        .limit(20),
      adminClient
        .from('tuition_payments')
        .select(`
          id, offer_id, amount, status, transaction_reference, payment_method, created_at,
          offer:admission_offers(application_id)
        `)
        .order('created_at', { ascending: false })
        .limit(50),
    ]);

    if (studentsResult.error) throw studentsResult.error;
    if (applicationsResult.error) throw applicationsResult.error;
    if (paymentsResult.error) throw paymentsResult.error;

    const paymentsByApplicationId = new Map<string, any[]>();
    for (const payment of paymentsResult.data || []) {
      const offer = Array.isArray(payment.offer) ? payment.offer[0] : payment.offer;
      const appId = offer?.application_id;
      if (!appId) continue;
      if (!paymentsByApplicationId.has(appId)) {
        paymentsByApplicationId.set(appId, []);
      }
      paymentsByApplicationId.get(appId)!.push(payment);
    }

    const students = (studentsResult.data || []).map((s: any) => ({
      ...s,
      account_type: 'student' as const,
      payments: [],
    }));

    const applications = (applicationsResult.data || []).map((a: any) => ({
      ...a,
      account_type: 'application' as const,
      student_id: a.application_number,
      enrollment_status: a.status,
      program_id: a.course_id,
      tuition_deposit_paid: false,
      tuition_deposit_paid_at: null,
      full_tuition_paid: false,
      full_tuition_paid_at: null,
      housing_fee_paid: false,
      housing_fee_paid_at: null,
      payments: paymentsByApplicationId.get(a.id) || [],
    }));

    const combined = [...students, ...applications].sort((a, b) => {
      const dateA = new Date(a.submitted_at || a.created_at || 0).getTime();
      const dateB = new Date(b.submitted_at || b.created_at || 0).getTime();
      return dateB - dateA;
    });

    return { success: true, data: combined };
  } catch (e: any) {
    console.error('getSISFinanceAccounts Error:', e);
    return { success: false, error: e.message };
  }
}

export async function verifySISTuitionPayment(paymentId: string, applicationId: string) {
  const supabase = createServiceRoleClient();

  try {
    const { data: paymentRecord, error: paymentFetchError } = await supabase
      .from('tuition_payments')
      .select('amount, invoice_type, transaction_reference, payment_method, currency, status, offer_id')
      .eq('id', paymentId)
      .single();

    if (paymentFetchError || !paymentRecord) {
      throw new Error('Payment record not found');
    }

    const { error: updateError } = await supabase
      .from('tuition_payments')
      .update({ status: 'COMPLETED' })
      .eq('id', paymentId)
      .in('status', ['PENDING_VERIFICATION', 'verified']);

    if (updateError) throw updateError;

    const { error: appError } = await supabase
      .from('applications')
      .update({ status: 'ENROLLED', updated_at: new Date().toISOString() })
      .eq('id', applicationId);

    if (appError) throw appError;

    return { success: true };
  } catch (e: any) {
    console.error('verifySISTuitionPayment Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getSISAcademicPrograms() {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('Course')
      .select(`
        *,
        school:School(name, slug),
        departmentId:Department(name, slug)
      `)
      .order('title', { ascending: true });

    if (error) throw error;

    const mapped = (data || []).map((p: any) => ({
      ...p,
      department: Array.isArray(p.departmentId) ? p.departmentId[0] : p.departmentId,
    }));

    return { success: true, data: mapped };
  } catch (e: any) {
    console.error('getSISAcademicPrograms Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getSISAcademicProgram(id: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('Course')
      .select(`
        *,
        school:School(name, slug),
        departmentId:Department(name, slug)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    const mapped = {
      ...data,
      department: Array.isArray(data?.departmentId) ? data.departmentId[0] : data?.departmentId,
    };

    return { success: true, data: mapped };
  } catch (e: any) {
    console.error('getSISAcademicProgram Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getSISAcademicModules() {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('modules')
      .select(`
        *,
        departmentId:Department(name, slug)
      `)
      .order('code', { ascending: true })
      .limit(20);

    if (error) throw error;

    const mapped = (data || []).map((m: any) => ({
      ...m,
      department: Array.isArray(m.departmentId) ? m.departmentId[0] : m.departmentId,
    }));

    return { success: true, data: mapped };
  } catch (e: any) {
    console.error('getSISAcademicModules Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getSISAcademicModule(id: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('modules')
      .select(`
        *,
        departmentId:Department(name, slug),
        school:School(name, slug)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    const mapped = {
      ...data,
      department: Array.isArray(data?.departmentId) ? data.departmentId[0] : data?.departmentId,
    };

    return { success: true, data: mapped };
  } catch (e: any) {
    console.error('getSISAcademicModule Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getSISRegistrationById(id: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('module_enrollments')
      .select(`
        *,
        student:students(student_id, enrollment_status, user:profiles(first_name, last_name, email)),
        module:modules(code, title, credits, description),
        semester:semesters(name, start_date, end_date)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    return { success: true, data: data || null };
  } catch (e: any) {
    console.error('getSISRegistrationById Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getSISRegistrations() {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('module_enrollments')
      .select(`
        *,
        student:students(student_id, enrollment_status, user:profiles(first_name, last_name)),
        module:modules(code, title),
        semester:semesters(name)
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (e: any) {
    console.error('getSISRegistrations Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getSISDocuments() {
  const adminClient = createServiceRoleClient();

  try {
    const { data: apps, error: appError } = await adminClient
      .from('applications')
      .select(`
        id, status, user_id,
        user:profiles(first_name, last_name, email),
        documents:application_documents(*),
        course:Course(title, degreeLevel)
      `)
      .neq('status', 'DRAFT')
      .order('submitted_at', { ascending: false })
      .limit(10);

    if (appError) throw appError;

    return { success: true, data: apps || [] };
  } catch (e: any) {
    console.error('getSISDocuments Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getSISFaculty() {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('Faculty')
      .select(`
        id, name, role, bio, imageUrl, email, schoolId, departmentId, createdAt,
        school:School(name),
        departmentId:Department(name)
      `)
      .order('name', { ascending: true });

    if (error) throw error;

    const mapped = (data || []).map((f: any) => ({
      id: f.id,
      name: f.name,
      role: f.role,
      bio: f.bio,
      imageUrl: f.imageUrl,
      email: f.email,
      schoolId: f.schoolId,
      departmentId: f.departmentId,
      createdAt: f.createdAt,
      school: Array.isArray(f.school) ? f.school[0] : f.school,
      department: Array.isArray(f.departmentId) ? f.departmentId[0] : f.departmentId,
    }));

    return { success: true, data: mapped };
  } catch (e: any) {
    console.error('getSISFaculty Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getSISCourseMap() {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('Course')
      .select('id, title, degreeLevel');

    if (error) throw error;

    const formatDegreeLevel = (level: string) => {
      if (!level) return '';
      return level.charAt(0) + level.slice(1).toLowerCase();
    };

    const map: Record<string, string> = {};
    for (const c of data || []) {
      map[c.id] = c.degreeLevel ? `${c.title} ${formatDegreeLevel(c.degreeLevel)}` : (c.title || c.id);
    }

    console.log('Course map loaded:', Object.keys(map).length, 'courses');
    console.log('Sample courses:', Object.entries(map).slice(0, 3));

    return { success: true, data: map };
  } catch (e: any) {
    console.error('getSISCourseMap Error:', e);
    return { success: false, error: e.message };
  }
}

export async function uploadStudentDocument(studentId: string, file: File, documentType: string, title: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { data: student, error: studentError } = await adminClient
      .from('students')
      .select('user_id')
      .eq('id', studentId)
      .single();

    if (studentError || !student) {
      return { success: false, error: 'Student not found' };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${documentType}-${Date.now()}-${file.name}`;
    const storagePath = `student-documents/${student.user_id}/${fileName}`;

    const { error: uploadError } = await adminClient.storage
      .from('application-documents')
      .upload(storagePath, buffer, {
        contentType: file.type || 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { success: false, error: 'Failed to upload document' };
    }

    const { data: { publicUrl } } = adminClient.storage
      .from('application-documents')
      .getPublicUrl(storagePath);

    const { error: docError } = await adminClient
      .from('document_records')
      .upsert({
        student_id: studentId,
        document_type: documentType,
        title,
        programme: '',
        status: 'active',
        storage_path: publicUrl,
        is_official: true,
        is_student_visible: true,
        version: 1,
        issue_date: new Date().toISOString(),
        metadata: {
          uploaded_by: 'admin',
          uploaded_at: new Date().toISOString(),
        },
      }, {
        onConflict: 'student_id,document_type',
      });

    if (docError) {
      console.error('Document record error:', docError);
      return { success: false, error: 'Failed to save document record' };
    }

    return { success: true, url: publicUrl };
  } catch (e: any) {
    console.error('uploadStudentDocument error:', e);
    return { success: false, error: e.message };
  }
}

export async function getStudentFinancialDetails(studentId: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { data: student, error: studentError } = await adminClient
      .from('students')
      .select(`
        *,
        user:profiles(first_name, last_name, email, phone_number, student_id),
        course:Course(title, school:School(name), degreeLevel, duration, credits),
        application:applications(*, course:Course(title, slug))
      `)
      .eq('id', studentId)
      .maybeSingle();

    if (studentError) throw studentError;

    const application = Array.isArray(student?.application) ? student.application[0] : student?.application;
    const applicationId = application?.id;

    let offer = null;
    let payments: any[] = [];
    let invoices: any[] = [];
    let financeDocuments: any[] = [];

    if (applicationId) {
      const [{ data: offerData }, { data: invoiceData }, { data: documentData }] = await Promise.all([
        adminClient
          .from('admission_offers')
          .select('*')
          .eq('application_id', applicationId)
          .maybeSingle(),
        adminClient
          .from('invoices')
          .select('*')
          .eq('student_id', studentId)
          .order('issued_date', { ascending: false }),
        adminClient
          .from('document_records')
          .select('*')
          .eq('student_id', studentId)
          .in('document_type', ['tuition_receipt', 'tuition_invoice', 'pal', 'loa'])
          .order('issue_date', { ascending: false }),
      ]);

      offer = offerData;
      invoices = invoiceData || [];
      financeDocuments = documentData || [];

      if (offer?.id) {
        const { data: paymentsData } = await adminClient
          .from('tuition_payments')
          .select('*')
          .eq('offer_id', offer.id)
          .order('created_at', { ascending: false });

        payments = paymentsData || [];
      }
    }

    const tuitionFee = offer?.tuition_fee || 0;
    const ancillaryFee = 700;
    const totalAnnual = tuitionFee + ancillaryFee;
    const totalPaid = payments
      .filter((p: any) => p.status === 'COMPLETED' || p.status === 'verified')
      .reduce((sum: number, p: any) => sum + Number(p.amount), 0);
    const totalInvoiced = invoices.reduce((sum: number, inv: any) => sum + Number(inv.amount || 0), 0);
    const totalBalance = invoices.reduce((sum: number, inv: any) => sum + Number(inv.balance || 0), 0);
    const outstandingBalance = Math.max(0, totalInvoiced - totalPaid);

    return {
      success: true,
      data: {
        student,
        offer,
        payments,
        invoices,
        financeDocuments,
        summary: {
          tuitionFee,
          ancillaryFee,
          totalAnnual,
          totalInvoiced,
          totalPaid,
          totalBalance,
          outstandingBalance,
          depositPaid: student?.tuition_deposit_paid || false,
          fullTuitionPaid: student?.full_tuition_paid || false,
          housingPaid: student?.housing_fee_paid || false,
          paymentCount: payments.filter((p: any) => p.status === 'COMPLETED' || p.status === 'verified').length,
          pendingPayments: payments.filter((p: any) => p.status === 'PENDING_VERIFICATION' || p.status === 'PENDING').length,
        },
      },
    };
  } catch (e: any) {
    console.error('getStudentFinancialDetails Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getSISStudents() {
  const adminClient = createServiceRoleClient();

  try {
    const [studentsResult, enrolledAppsResult, studentProfilesResult] = await Promise.all([
      adminClient
        .from('students')
        .select(`
          id,
          student_id,
          enrollment_status,
          start_date,
          user_id,
          program_id,
          application_id,
          user:profiles(first_name, last_name, email, student_id),
          program:Course(title, school:School(name)),
          application:applications(course:Course(title, school:School(name)))
        `)
        .order('created_at', { ascending: false }),
      adminClient
        .from('applications')
        .select(`
          id,
          user_id,
          course_id,
          status,
          submitted_at,
          created_at,
          user:profiles(first_name, last_name, email, student_id),
          course:Course(title, school:School(name))
        `)
        .in('status', ['ENROLLED', 'OFFER_ACCEPTED', 'PAYMENT_SUBMITTED', 'ADMITTED', 'ACCEPTED', 'PROVISIONAL_ENROLLED', 'REGISTERED'])
        .order('created_at', { ascending: false }),
      adminClient
        .from('profiles')
        .select('id, first_name, last_name, email, student_id, role, created_at')
        .eq('role', 'STUDENT')
        .order('created_at', { ascending: false }),
    ]);

    const existingStudentUserIds = new Set<string>();
    const existingAppIds = new Set<string>();

    const formattedStudents = (studentsResult.data || []).map((s: any) => {
      if (s.user_id) existingStudentUserIds.add(s.user_id);
      if (s.application_id) existingAppIds.add(s.application_id);

      const course = Array.isArray(s.program) ? s.program[0] : s.program || (Array.isArray(s.application?.course) ? s.application?.course[0] : s.application?.course);
      const user = Array.isArray(s.user) ? s.user[0] : s.user;

      return {
        id: s.id,
        student_id: s.student_id || user?.student_id || 'N/A',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        program: course?.title || s.program_id || '—',
        school: course?.school?.name || 'Cannoga College',
        status: s.enrollment_status || 'ACTIVE',
        enrollment_status: s.enrollment_status || 'ACTIVE',
        advisor: 'Admissions Office',
        hold: false,
      };
    });

    // Add any enrolled / accepted applicants that haven't been mapped to a students row yet
    (enrolledAppsResult.data || []).forEach((app: any) => {
      if (!existingStudentUserIds.has(app.user_id) && !existingAppIds.has(app.id)) {
        if (app.user_id) existingStudentUserIds.add(app.user_id);
        existingAppIds.add(app.id);

        const user = Array.isArray(app.user) ? app.user[0] : app.user;
        const course = Array.isArray(app.course) ? app.course[0] : app.course;

        formattedStudents.push({
          id: app.id,
          student_id: user?.student_id || `CC${app.id.slice(0, 6).toUpperCase()}`,
          first_name: user?.first_name || '',
          last_name: user?.last_name || '',
          email: user?.email || '',
          program: course?.title || '—',
          school: course?.school?.name || 'Cannoga College',
          status: app.status === 'OFFER_ACCEPTED' || app.status === 'PAYMENT_SUBMITTED' ? 'ACTIVE' : (app.status || 'ACTIVE'),
          enrollment_status: app.status || 'ACTIVE',
          advisor: 'Admissions Office',
          hold: false,
        });
      }
    });

    // Add any profile users with role STUDENT who don't have an entry yet
    (studentProfilesResult.data || []).forEach((prof: any) => {
      if (!existingStudentUserIds.has(prof.id)) {
        existingStudentUserIds.add(prof.id);
        formattedStudents.push({
          id: prof.id,
          student_id: prof.student_id || `CC${prof.id.slice(0, 6).toUpperCase()}`,
          first_name: prof.first_name || '',
          last_name: prof.last_name || '',
          email: prof.email || '',
          program: 'Cannoga Academic Program',
          school: 'Cannoga College',
          status: 'ACTIVE',
          enrollment_status: 'ACTIVE',
          advisor: 'Admissions Office',
          hold: false,
        });
      }
    });

    return { success: true, data: formattedStudents };
  } catch (e: any) {
    console.error('getSISStudents Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getSISSystemSettings() {
  const adminClient = createServiceRoleClient();

  try {
    // 1. Fetch system_settings key-value pairs
    const { data: settingsData, error: settingsError } = await adminClient
      .from('system_settings')
      .select('*');

    const settingsMap: Record<string, string> = {};
    if (!settingsError && settingsData) {
      settingsData.forEach((row: any) => {
        if (row.key && row.value !== undefined) {
          settingsMap[row.key] = row.value;
        }
      });
    }

    // 2. Fetch admin profile from profiles table if available
    const { data: adminProfile } = await adminClient
      .from('profiles')
      .select('first_name, last_name, email, role')
      .or('role.eq.ADMIN,role.eq.admin,role.eq.SUPER_ADMIN')
      .limit(1)
      .maybeSingle();

    const fullName = adminProfile
      ? `${adminProfile.first_name || ''} ${adminProfile.last_name || ''}`.trim()
      : '';

    return {
      success: true,
      data: {
        academic_term: settingsMap.academic_term || 'Fall 2026',
        registration_window: settingsMap.registration_window || 'Nov 1 - Dec 15, 2026',
        display_name: settingsMap.display_name || fullName || 'Admin User',
        email: settingsMap.email || adminProfile?.email || 'admin@cannogacollege.ca',
        department: settingsMap.department || 'Administration',
      },
    };
  } catch (e: any) {
    console.error('getSISSystemSettings Error:', e);
    return {
      success: true,
      data: {
        academic_term: 'Fall 2026',
        registration_window: 'Nov 1 - Dec 15, 2026',
        display_name: 'Admin User',
        email: 'admin@cannogacollege.ca',
        department: 'Administration',
      },
    };
  }
}

export async function updateSISSystemSettings(settings: Record<string, string | undefined>) {
  const adminClient = createServiceRoleClient();

  try {
    const updates = Object.entries(settings)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => ({
        key,
        value: String(value),
        updated_at: new Date().toISOString(),
      }));

    if (updates.length > 0) {
      const { error: upsertError } = await adminClient
        .from('system_settings')
        .upsert(updates, { onConflict: 'key' });

      if (upsertError) {
        console.warn('system_settings upsert error:', upsertError.message);
      }
    }

    await adminClient.from('audit_logs').insert({
      action: 'UPDATE_SYSTEM_SETTINGS',
      entity_table: 'system_settings',
      entity_id: 'global',
      metadata: settings,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  } catch (e: any) {
    console.error('updateSISSystemSettings Error:', e);
    return { success: false, error: e.message || 'Failed to update system settings in database' };
  }
}

export async function updateSISAdminProfile(payload: { displayName: string; email: string; department: string }) {
  const adminClient = createServiceRoleClient();

  try {
    // Save to key-value settings table
    const settingsRes = await updateSISSystemSettings({
      display_name: payload.displayName,
      email: payload.email,
      department: payload.department,
    });

    if (!settingsRes.success) {
      throw new Error(settingsRes.error || 'Failed to save system settings');
    }

    // Split name for profiles table update
    const parts = payload.displayName.trim().split(/\s+/);
    const firstName = parts[0] || 'Admin';
    const lastName = parts.slice(1).join(' ') || 'User';

    // Update matching admin profiles
    const { data: adminProfiles } = await adminClient
      .from('profiles')
      .select('id')
      .or('role.eq.ADMIN,role.eq.admin,role.eq.SUPER_ADMIN')
      .limit(5);

    if (adminProfiles && adminProfiles.length > 0) {
      for (const p of adminProfiles) {
        await adminClient
          .from('profiles')
          .update({
            first_name: firstName,
            last_name: lastName,
            email: payload.email,
            updated_at: new Date().toISOString(),
          })
          .eq('id', p.id);
      }
    }

    await adminClient.from('audit_logs').insert({
      action: 'UPDATE_ADMIN_PROFILE',
      entity_table: 'profiles',
      entity_id: 'admin',
      metadata: payload,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  } catch (e: any) {
    console.error('updateSISAdminProfile Error:', e);
    return { success: false, error: e.message || 'Failed to update admin profile' };
  }
}


