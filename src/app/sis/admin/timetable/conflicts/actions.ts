'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import type { TimetableConflict } from '@/types/database';

export async function getConflicts(versionId: string, filters: { severity?: string; conflict_type?: string; status?: string } = {}) {
  const adminClient = createServiceRoleClient();

  try {
    let query = adminClient
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

    if (filters.severity) {
      query = query.eq('severity', filters.severity);
    }
    if (filters.conflict_type) {
      query = query.eq('conflict_type', filters.conflict_type);
    }
    if (filters.status === 'resolved') {
      query = query.not('resolution', 'is', null);
    } else if (filters.status === 'open') {
      query = query.is('resolution', null);
    }

    const { data: conflicts, error } = await query;

    if (error) throw error;

    const mapped = (conflicts || []).map((c: any) => ({
      ...c,
      assignment_a: Array.isArray(c.assignment_a) ? c.assignment_a[0] : c.assignment_a,
      assignment_b: Array.isArray(c.assignment_b) ? c.assignment_b[0] : c.assignment_b,
      resolver: Array.isArray(c.resolver) ? c.resolver[0] : c.resolver,
    }));

    return { success: true, data: mapped };
  } catch (e: any) {
    console.error('getConflicts Error:', e);
    return { success: false, error: e.message };
  }
}

export async function resolveConflict(conflictId: string, resolution: string, resolvedBy: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { error } = await adminClient
      .from('timetable_conflicts')
      .update({
        resolution,
        resolved_at: new Date().toISOString(),
        resolved_by: resolvedBy,
      })
      .eq('id', conflictId);

    if (error) throw error;

    return { success: true };
  } catch (e: any) {
    console.error('resolveConflict Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getConflictSuggestions(conflictId: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { data: conflict, error: conflictError } = await adminClient
      .from('timetable_conflicts')
      .select('*')
      .eq('id', conflictId)
      .single();

    if (conflictError || !conflict) throw new Error('Conflict not found');

    const { data: assignmentA } = await adminClient
      .from('timetable_assignments')
      .select('room_id, day_of_week, start_time, end_time')
      .eq('id', conflict.assignment_a_id)
      .single();

    const { data: assignmentB } = await adminClient
      .from('timetable_assignments')
      .select('room_id, day_of_week, start_time, end_time')
      .eq('id', conflict.assignment_b_id)
      .single();

    const suggestions: string[] = [];

    if (conflict.conflict_type === 'room_double_booked' && assignmentA && assignmentB) {
      if (assignmentA.room_id !== assignmentB.room_id) {
        suggestions.push('Assign both sections to different rooms');
      }
      suggestions.push('Move one section to a different time slot');
      suggestions.push('Reschedule one session to a different day');
      suggestions.push('Convert one session to online/hybrid delivery');
    } else if (conflict.conflict_type === 'instructor_double_booked') {
      suggestions.push('Assign a substitute instructor for one section');
      suggestions.push('Reschedule one section to avoid conflict');
      suggestions.push('Merge sections if capacity allows');
    } else if (conflict.conflict_type === 'student_conflict') {
      suggestions.push('Adjust student group assignments');
      suggestions.push('Reschedule one of the conflicting sections');
      suggestions.push('Offer an alternative section for affected students');
    } else {
      suggestions.push('Review conflict details and adjust assignments manually');
      suggestions.push('Contact the scheduling team for complex resolution');
    }

    if (conflict.severity === 'SOFT') {
      suggestions.push('Accept soft conflict if it does not impact learning outcomes');
    }

    return { success: true, data: suggestions };
  } catch (e: any) {
    console.error('getConflictSuggestions Error:', e);
    return { success: false, error: e.message, data: [] };
  }
}

export async function bulkResolveConflicts(conflictIds: string[], resolution: string, resolvedBy: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { error } = await adminClient
      .from('timetable_conflicts')
      .update({
        resolution,
        resolved_at: new Date().toISOString(),
        resolved_by: resolvedBy,
      })
      .in('id', conflictIds);

    if (error) throw error;

    return { success: true };
  } catch (e: any) {
    console.error('bulkResolveConflicts Error:', e);
    return { success: false, error: e.message };
  }
}
