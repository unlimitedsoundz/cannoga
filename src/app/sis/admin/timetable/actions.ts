'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import type { TimetableVersion, TimetableAssignment, TimetableConflict, Room, Profile, Semester, CourseSection, Module } from '@/types/database';

export async function getPublishedTimetable(termId: string): Promise<TimetableAssignment[]> {
  const adminClient = createServiceRoleClient();

  try {
    const { data: version, error: versionError } = await adminClient
      .from('timetable_versions')
      .select('id')
      .eq('semester_id', termId)
      .eq('is_published', true)
      .maybeSingle();

    if (versionError) throw versionError;
    if (!version) return [];

    const { data: assignments, error: assignmentsError } = await adminClient
      .from('timetable_assignments')
      .select(`
        *,
        section:course_sections(
          *,
          module:modules(code, title, credits),
          instructor:profiles!course_sections_instructor_id_fkey(first_name, last_name, email),
          student_group:student_groups(id, name, code)
        ),
        room:rooms(id, name, building, room_number, capacity, room_type)
      `)
      .eq('version_id', version.id)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    if (assignmentsError) throw assignmentsError;

    const mapped = (assignments || []).map((a: any) => ({
      ...a,
      section: Array.isArray(a.section) ? a.section[0] : a.section,
      room: Array.isArray(a.room) ? a.room[0] : a.room,
    }));

    return mapped as any[];
  } catch (e: any) {
    console.error('getPublishedTimetable Error:', e);
    throw new Error(e.message || 'Failed to load timetable');
  }
}

export async function getTimetableVersions(termId: string): Promise<TimetableVersion[]> {
  const adminClient = createServiceRoleClient();

  try {
    const { data: versions, error } = await adminClient
      .from('timetable_versions')
      .select('*')
      .eq('semester_id', termId)
      .order('version_number', { ascending: false });

    if (error) throw error;

    return versions || [];
  } catch (e: any) {
    console.error('getTimetableVersions Error:', e);
    throw new Error(e.message || 'Failed to load versions');
  }
}

export async function getConflicts(versionId: string): Promise<TimetableConflict[]> {
  const adminClient = createServiceRoleClient();

  try {
    const { data: conflicts, error } = await adminClient
      .from('timetable_conflicts')
      .select(`
        *,
        assignment_a:timetable_assignments!timetable_conflicts_assignment_a_id_fkey(
          *,
          section:course_sections(code, module:modules(code, title))
        ),
        assignment_b:timetable_assignments!timetable_conflicts_assignment_b_id_fkey(
          *,
          section:course_sections(code, module:modules(code, title))
        ),
        resolver:profiles!timetable_conflicts_resolved_by_fkey(id, first_name, last_name, email)
      `)
      .eq('version_id', versionId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const mapped = (conflicts || []).map((c: any) => ({
      ...c,
      assignment_a: Array.isArray(c.assignment_a) ? c.assignment_a[0] : c.assignment_a,
      assignment_b: Array.isArray(c.assignment_b) ? c.assignment_b[0] : c.assignment_b,
      resolver: Array.isArray(c.resolver) ? c.resolver[0] : c.resolver,
    }));

    return mapped;
  } catch (e: any) {
    console.error('getConflicts Error:', e);
    throw new Error(e.message || 'Failed to load conflicts');
  }
}

export async function resolveConflict(conflictId: string, resolution: string): Promise<void> {
  const adminClient = createServiceRoleClient();

  try {
    const { error } = await adminClient
      .from('timetable_conflicts')
      .update({
        resolution,
        resolved_at: new Date().toISOString(),
        resolved_by: null,
      })
      .eq('id', conflictId);

    if (error) throw error;
  } catch (e) {
    console.error('resolveConflict Error:', e);
    throw new Error('Failed to resolve conflict');
  }
}

export async function moveAssignment(
  assignmentId: string,
  newDay: number,
  newStartTime: string,
  newEndTime: string,
  newRoomId: string,
  reason: string
): Promise<TimetableAssignment> {
  const adminClient = createServiceRoleClient();

  try {
    const { data: result, error } = await adminClient
      .from('timetable_assignments')
      .update({
        day_of_week: newDay,
        start_time: newStartTime,
        end_time: newEndTime,
        room_id: newRoomId,
        is_override: true,
        override_reason: reason,
        override_by: null,
        override_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', assignmentId)
      .select()
      .single();

    if (error) throw error;
    return result;
  } catch (e) {
    console.error('moveAssignment Error:', e);
    throw new Error('Failed to move assignment');
  }
}

export async function validateAssignmentMove(
  assignmentId: string,
  newDay: number,
  newStartTime: string,
  newEndTime: string,
  newRoomId: string
): Promise<{ valid: boolean; errors: string[] }> {
  const adminClient = createServiceRoleClient();
  const errors: string[] = [];

  try {
    const { data: assignment, error: assignmentError } = await adminClient
      .from('timetable_assignments')
      .select('version_id, section_id, instructor_id')
      .eq('id', assignmentId)
      .single();

    if (assignmentError || !assignment) {
      return { valid: false, errors: ['Assignment not found'] };
    }

    const { data: roomBlocks, error: roomError } = await adminClient
      .from('room_availability')
      .select('*')
      .eq('room_id', newRoomId)
      .eq('block_type', 'maintenance')
      .lte('start_datetime', `${new Date().toISOString().split('T')[0]}T${newEndTime}`)
      .gte('end_datetime', `${new Date().toISOString().split('T')[0]}T${newStartTime}`);

    if (roomError) throw roomError;
    if (roomBlocks && roomBlocks.length > 0) {
      errors.push('Room is blocked for maintenance during the selected time');
    }

    const { data: roomConflicts, error: roomConflictError } = await adminClient
      .from('timetable_assignments')
      .select('id, start_time, end_time')
      .eq('version_id', assignment.version_id)
      .eq('room_id', newRoomId)
      .eq('day_of_week', newDay)
      .neq('id', assignmentId)
      .gte('start_time', newStartTime)
      .lt('end_time', newEndTime);

    if (roomConflictError) throw roomConflictError;
    if (roomConflicts && roomConflicts.length > 0) {
      errors.push('Room is already booked during the selected time');
    }

    if (assignment.instructor_id) {
      const { data: instructorConflicts, error: instructorConflictError } = await adminClient
        .from('timetable_assignments')
        .select('id, start_time, end_time')
        .eq('version_id', assignment.version_id)
        .eq('instructor_id', assignment.instructor_id)
        .eq('day_of_week', newDay)
        .neq('id', assignmentId)
        .gte('start_time', newStartTime)
        .lt('end_time', newEndTime);

      if (instructorConflictError) throw instructorConflictError;
      if (instructorConflicts && instructorConflicts.length > 0) {
        errors.push('Instructor has a scheduling conflict during the selected time');
      }
    }

    return { valid: errors.length === 0, errors };
  } catch (e: any) {
    console.error('validateAssignmentMove Error:', e);
    return { valid: false, errors: [e.message || 'Validation failed'] };
  }
}

export async function getSemesters(): Promise<Semester[]> {
  const adminClient = createServiceRoleClient();

  try {
    const { data: semesters, error } = await adminClient
      .from('semesters')
      .select('id, name, start_date, end_date, status')
      .order('start_date', { ascending: false });

    if (error) throw error;

    return (semesters || []).map((s: any) => ({
      ...s,
      startDate: s.start_date,
      endDate: s.end_date,
      isActive: s.status === 'ACTIVE',
    })) as Semester[];
  } catch (e: any) {
    console.error('getSemesters Error:', e);
    throw new Error(e.message || 'Failed to load semesters');
  }
}

export async function getRooms(): Promise<Room[]> {
  const adminClient = createServiceRoleClient();

  try {
    const { data: rooms, error } = await adminClient
      .from('rooms')
      .select('*')
      .eq('status', 'ACTIVE')
      .order('building', { ascending: true })
      .order('room_number', { ascending: true });

    if (error) throw error;

    return rooms || [];
  } catch (e: any) {
    console.error('getRooms Error:', e);
    throw new Error(e.message || 'Failed to load rooms');
  }
}

export async function getInstructors(): Promise<Profile[]> {
  const adminClient = createServiceRoleClient();

  try {
    const { data: instructors, error } = await adminClient
      .from('profiles')
      .select('id, first_name, last_name, email')
      .in('role', ['FACULTY', 'ADMIN', 'REGISTRAR'])
      .order('first_name', { ascending: true });

    if (error) throw error;

    return instructors as Profile[];
  } catch (e: any) {
    console.error('getInstructors Error:', e);
    throw new Error(e.message || 'Failed to load instructors');
  }
}
