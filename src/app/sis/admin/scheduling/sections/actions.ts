'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { CourseSection, CourseSectionMeeting, Module, Profile, StudentGroup } from '@/types/database';

export async function getAvailableModules(termId: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('modules')
      .select('id, code, title, credits, capacity')
      .order('code', { ascending: true });

    if (error) throw error;
    return { success: true, data: (data || []) as Module[] };
  } catch (e: any) {
    console.error('getAvailableModules Error:', e);
    return { success: false, error: e.message, data: [] };
  }
}

export async function getAllSections(termId: string, filters: { status?: string; search?: string } = {}) {
  const adminClient = createServiceRoleClient();

  try {
    let query = adminClient
      .from('course_sections')
      .select(`
        *,
        module:modules(id, code, title, credits),
        instructor:profiles!course_sections_instructor_id_fkey(id, first_name, last_name, email),
        student_group:student_groups(id, name, code)
      `)
      .eq('semester_id', termId)
      .order('code', { ascending: true });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.search) {
      query = query.or(`code.ilike.%${filters.search}%,module.title.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data: (data || []) as any[] };
  } catch (e: any) {
    console.error('getAllSections Error:', e);
    return { success: false, error: e.message, data: [] };
  }
}

export async function getSectionById(id: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('course_sections')
      .select(`
        *,
        module:modules(id, code, title, credits),
        instructor:profiles!course_sections_instructor_id_fkey(id, first_name, last_name, email),
        student_group:student_groups(id, name, code)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { success: true, data: data as any };
  } catch (e: any) {
    console.error('getSectionById Error:', e);
    return { success: false, error: e.message };
  }
}

export async function createSection(data: Partial<CourseSection>) {
  const adminClient = createServiceRoleClient();

  try {
    const payload = {
      code: data.code,
      module_id: data.module_id,
      semester_id: data.semester_id,
      instructor_id: data.instructor_id || null,
      capacity: data.capacity || 30,
      enrolled_count: data.enrolled_count || 0,
      session_type: data.session_type || 'LECTURE',
      delivery_mode: data.delivery_mode || 'IN_PERSON',
      required_room_type: data.required_room_type || null,
      required_features: data.required_features || [],
      duration_minutes: data.duration_minutes || 60,
      meetings_per_week: data.meetings_per_week || 1,
      consecutive_sessions: data.consecutive_sessions ?? false,
      max_daily_sessions: data.max_daily_sessions || null,
      preferred_days: data.preferred_days || [],
      blocked_days: data.blocked_days || [],
      preferred_times: data.preferred_times || [],
      blocked_times: data.blocked_times || [],
      student_group_id: data.student_group_id || null,
      department_id: data.department_id || null,
      notes: data.notes || null,
      status: data.status || 'DRAFT',
    };

    const { data: result, error } = await adminClient.from('course_sections').insert(payload).select().single();
    if (error) throw error;
    return { success: true, data: result as CourseSection };
  } catch (e: any) {
    console.error('createSection Error:', e);
    return { success: false, error: e.message };
  }
}

export async function updateSection(id: string, data: Partial<CourseSection>) {
  const adminClient = createServiceRoleClient();

  try {
    const payload: any = {};
    const fields = ['code', 'module_id', 'semester_id', 'instructor_id', 'capacity', 'enrolled_count', 'session_type', 'delivery_mode', 'required_room_type', 'required_features', 'duration_minutes', 'meetings_per_week', 'consecutive_sessions', 'max_daily_sessions', 'preferred_days', 'blocked_days', 'preferred_times', 'blocked_times', 'student_group_id', 'department_id', 'notes', 'status'];
    for (const field of fields) {
      if (data[field as keyof CourseSection] !== undefined) {
        payload[field] = data[field as keyof CourseSection];
      }
    }

    const { data: result, error } = await adminClient.from('course_sections').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return { success: true, data: result as CourseSection };
  } catch (e: any) {
    console.error('updateSection Error:', e);
    return { success: false, error: e.message };
  }
}

export async function deleteSection(id: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { error } = await adminClient.from('course_sections').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    console.error('deleteSection Error:', e);
    return { success: false, error: e.message };
  }
}

export async function bulkCreateSections(termId: string, moduleIds: string[], countPerModule: number = 1) {
  const adminClient = createServiceRoleClient();

  try {
    const { data: modules, error: modulesError } = await adminClient
      .from('modules')
      .select('id, code, title, credits, capacity')
      .in('id', moduleIds);

    if (modulesError) throw modulesError;

    const sectionsToInsert: any[] = [];
    for (const module of (modules || [])) {
      for (let i = 1; i <= countPerModule; i++) {
        sectionsToInsert.push({
          code: `${(module as any).code}-${String(i).padStart(2, '0')}`,
          module_id: (module as any).id,
          semester_id: termId,
          capacity: (module as any).capacity || 30,
          enrolled_count: 0,
          session_type: 'LECTURE',
          delivery_mode: 'IN_PERSON',
          duration_minutes: 60,
          meetings_per_week: 1,
          status: 'DRAFT',
        });
      }
    }

    if (sectionsToInsert.length > 0) {
      const { error: insertError } = await adminClient.from('course_sections').insert(sectionsToInsert);
      if (insertError) throw insertError;
    }

    return { success: true, count: sectionsToInsert.length };
  } catch (e: any) {
    console.error('bulkCreateSections Error:', e);
    return { success: false, error: e.message };
  }
}

export async function assignInstructor(sectionId: string, instructorId: string | null) {
  const adminClient = createServiceRoleClient();

  try {
    const { data: result, error } = await adminClient
      .from('course_sections')
      .update({ instructor_id: instructorId })
      .eq('id', sectionId)
      .select('id, instructor_id')
      .single();

    if (error) throw error;
    return { success: true, data: result as CourseSection };
  } catch (e: any) {
    console.error('assignInstructor Error:', e);
    return { success: false, error: e.message };
  }
}

export async function updateSectionRequirements(id: string, data: { required_room_type?: string | null; required_features?: any; duration_minutes?: number; meetings_per_week?: number; consecutive_sessions?: boolean; max_daily_sessions?: number | null; preferred_days?: number[]; blocked_days?: number[]; preferred_times?: string[]; blocked_times?: string[]; student_group_id?: string | null; notes?: string | null }) {
  const adminClient = createServiceRoleClient();

  try {
    const payload: any = {};
    const fields = ['required_room_type', 'required_features', 'duration_minutes', 'meetings_per_week', 'consecutive_sessions', 'max_daily_sessions', 'preferred_days', 'blocked_days', 'preferred_times', 'blocked_times', 'student_group_id', 'notes'];
    for (const field of fields) {
      if (data[field as keyof typeof data] !== undefined) {
        payload[field] = data[field as keyof typeof data];
      }
    }

    const { data: result, error } = await adminClient.from('course_sections').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return { success: true, data: result as CourseSection };
  } catch (e: any) {
    console.error('updateSectionRequirements Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getInstructors() {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('profiles')
      .select('id, first_name, last_name, email')
      .in('role', ['FACULTY', 'ADMIN', 'REGISTRAR'])
      .order('first_name', { ascending: true });

    if (error) throw error;
    return { success: true, data: (data || []) as Profile[] };
  } catch (e: any) {
    console.error('getInstructors Error:', e);
    return { success: false, error: e.message, data: [] };
  }
}

export async function getStudentGroups() {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('student_groups')
      .select('id, name, code, total_students, is_active')
      .order('name', { ascending: true });

    if (error) throw error;
    return { success: true, data: (data || []) as StudentGroup[] };
  } catch (e: any) {
    console.error('getStudentGroups Error:', e);
    return { success: false, error: e.message, data: [] };
  }
}

export async function getSectionMeetings(sectionId: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('course_section_meetings')
      .select('*')
      .eq('section_id', sectionId)
      .order('meeting_index', { ascending: true });

    if (error) throw error;
    return { success: true, data: (data || []) as CourseSectionMeeting[] };
  } catch (e: any) {
    console.error('getSectionMeetings Error:', e);
    return { success: false, error: e.message, data: [] };
  }
}

export async function createSectionMeeting(data: Partial<CourseSectionMeeting>) {
  const adminClient = createServiceRoleClient();

  try {
    const payload = {
      section_id: data.section_id,
      meeting_index: data.meeting_index,
      day_of_week: data.day_of_week,
      start_time: data.start_time,
      end_time: data.end_time,
      duration_minutes: data.duration_minutes,
      room_id: data.room_id || null,
      instructor_id: data.instructor_id || null,
      is_fixed: data.is_fixed ?? false,
    };

    const { data: result, error } = await adminClient.from('course_section_meetings').insert(payload).select().single();
    if (error) throw error;
    return { success: true, data: result as CourseSectionMeeting };
  } catch (e: any) {
    console.error('createSectionMeeting Error:', e);
    return { success: false, error: e.message };
  }
}

export async function deleteSectionMeeting(id: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { error } = await adminClient.from('course_section_meetings').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    console.error('deleteSectionMeeting Error:', e);
    return { success: false, error: e.message };
  }
}
