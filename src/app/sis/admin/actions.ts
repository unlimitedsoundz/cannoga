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
      adminClient.from('module_enrollments').select('id, student_id, module_id, semester_id, status, grade').order('created_at', { ascending: false }).limit(5),
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
      recentEnrollments: recentEnrollments || [],
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
        user:profiles(first_name, last_name, email, phone_number, date_of_birth, address, city, country_of_residence),
        course:Course(title, school:School(name)),
        application:applications(*, course:Course(title, slug)),
        enrollments:module_enrollments(*, module:modules(code, title), semester:semesters(name))
      `)
      .eq('id', studentId)
      .maybeSingle();

    if (error) throw error;

    return { success: true, data: student };
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
    const { data, error } = await adminClient
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
      .limit(20);

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (e: any) {
    console.error('getSISFinanceAccounts Error:', e);
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
      map[c.id] = c.degreeLevel ? `${c.title} — ${formatDegreeLevel(c.degreeLevel)}` : (c.title || c.id);
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