'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { TimetableAssignment, CourseSection, Module, Room } from '@/types/database';

export async function getFacultyTimetable(facultyId: string, termId: string): Promise<TimetableAssignment[]> {
  const adminClient = createServiceRoleClient();

  try {
    const { data: versions } = await adminClient
      .from('timetable_versions')
      .select('id')
      .eq('semester_id', termId)
      .eq('status', 'PUBLISHED')
      .order('version_number', { ascending: false })
      .limit(1);

    if (!versions || versions.length === 0) return [];

    const { data, error } = await adminClient
      .from('timetable_assignments')
      .select(`
        *,
        section:course_sections(id, code, session_type, capacity, enrolled_count, module:modules(id, code, title, credits)),
        room:rooms(id, name, building, room_number, capacity)
      `)
      .eq('version_id', versions[0].id)
      .eq('instructor_id', facultyId)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return (data || []) as TimetableAssignment[];
  } catch (e: any) {
    console.error('getFacultyTimetable Error:', e);
    return [];
  }
}

export async function getFacultySections(facultyId: string, termId: string): Promise<CourseSection[]> {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('course_sections')
      .select(`
        *,
        module:modules(id, code, title, credits)
      `)
      .eq('semester_id', termId)
      .eq('instructor_id', facultyId)
      .order('code', { ascending: true });

    if (error) throw error;
    return (data || []) as CourseSection[];
  } catch (e: any) {
    console.error('getFacultySections Error:', e);
    return [];
  }
}