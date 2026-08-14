import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

async function diagnoseStudentTimetable() {
  // Use the student from the earlier finance diagnosis
  const userId = 'f620d9a9-d16d-48c0-9e85-0ce047f16569';
  
  console.log('=== DIAGNOSING STUDENT TIMETABLE ===\n');

  // 1. Get student record
  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('*')
    .eq('user_id', userId)
    .single();

  console.log('1. STUDENT RECORD:');
  console.log(JSON.stringify({
    id: student?.id,
    student_id: student?.student_id,
    program_id: student?.program_id,
    current_semester_id: student?.current_semester_id,
    enrollment_status: student?.enrollment_status,
  }, null, 2));

  if (studentError) {
    console.log('Student error:', studentError);
    return;
  }

  const currentStudentId = student?.id;
  const currentSemesterId = student?.current_semester_id;

  if (!currentSemesterId) {
    console.log('\n❌ NO CURRENT_SEMESTER_ID - timetable fetch will be skipped');
    return;
  }

  // 2. Get program subjects
  const { data: subjects } = await supabase
    .from('Subject')
    .select('id')
    .eq('courseId', student?.program_id);

  console.log('\n2. PROGRAM SUBJECTS:', subjects?.length || 0);

  // 3. Get enrollments
  const { data: enrollments } = await supabase
    .from('module_enrollments')
    .select('module_id, status')
    .eq('student_id', currentStudentId);

  console.log('\n3. MODULE ENROLLMENTS:', enrollments?.length || 0);
  console.log('Enrollment statuses:', [...new Set(enrollments?.map(e => e.status) || [])]);
  
  const registeredEnrollments = enrollments?.filter(e => e.status === 'REGISTERED') || [];
  console.log('REGISTERED enrollments:', registeredEnrollments.length);
  console.log('Registered module_ids:', registeredEnrollments.map(e => e.module_id));

  const moduleIds = registeredEnrollments.map(e => e.module_id);
  if (moduleIds.length === 0) {
    console.log('\n❌ NO REGISTERED ENROLLMENTS - timetable fetch stops here');
    return;
  }

  // 4. Get sections
  const { data: sections } = await supabase
    .from('course_sections')
    .select('id, module_id, code, status')
    .eq('semester_id', currentSemesterId)
    .in('module_id', moduleIds);

  console.log('\n4. COURSE SECTIONS for student modules:', sections?.length || 0);
  console.log('Sections:', sections?.map(s => ({ id: s.id, code: s.code, module_id: s.module_id, status: s.status })));

  const sectionIds = sections?.map(s => s.id) || [];
  if (sectionIds.length === 0) {
    console.log('\n❌ NO SECTIONS - timetable fetch stops here');
    return;
  }

  // 5. Get published versions
  const { data: versions } = await supabase
    .from('timetable_versions')
    .select('id, version_number, status, is_published, semester_id')
    .eq('semester_id', currentSemesterId)
    .eq('status', 'PUBLISHED')
    .order('version_number', { ascending: false })
    .limit(1);

  console.log('\n5. PUBLISHED VERSIONS for semester:', versions?.length || 0);
  console.log('Versions:', versions);

  if (!versions || versions.length === 0) {
    console.log('\n❌ NO PUBLISHED VERSION - timetable fetch stops here');
    
    // Check all versions for this semester
    const { data: allVersions } = await supabase
      .from('timetable_versions')
      .select('id, version_number, status, is_published')
      .eq('semester_id', currentSemesterId);
    
    console.log('ALL versions for semester:', allVersions);
    return;
  }

  // 6. Get assignments
  const { data: assignments } = await supabase
    .from('timetable_assignments')
    .select('id, section_id, version_id')
    .eq('version_id', versions[0].id)
    .in('section_id', sectionIds);

  console.log('\n6. ASSIGNMENTS for student sections:', assignments?.length || 0);
  console.log('Assignment section_ids:', assignments?.map(a => a.section_id));
  
  // Check if there are assignments for ANY section in this version
  const { data: allAssignments } = await supabase
    .from('timetable_assignments')
    .select('id, section_id')
    .eq('version_id', versions[0].id);
    
  console.log('ALL assignments in version:', allAssignments?.length || 0);
  console.log('All section_ids in version:', allAssignments?.map(a => a.section_id));
  
  const studentSectionIdsSet = new Set(sectionIds);
  const matchingAssignments = allAssignments?.filter(a => studentSectionIdsSet.has(a.section_id)) || [];
  console.log('Matching assignments:', matchingAssignments.length);
}

diagnoseStudentTimetable().catch(console.error);
