'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import type { TimetableVersion, TimetableRun, TimetableScore, TimetableConflict } from '@/types/database';

export async function getVersionsForPublish(termId: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { data: versions, error } = await adminClient
      .from('timetable_versions')
      .select(`
        *,
        run:timetable_runs(*),
        score:timetable_scores(*)
      `)
      .eq('semester_id', termId)
      .order('version_number', { ascending: false });

    if (error) throw error;

    const mapped = (versions || []).map((v: any) => ({
      ...v,
      run: Array.isArray(v.run) ? v.run[0] : v.run,
      score: Array.isArray(v.score) ? v.score[0] : v.score,
    }));

    return { success: true, data: mapped };
  } catch (e: any) {
    console.error('getVersionsForPublish Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getVersionSummary(versionId: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { data: version, error: versionError } = await adminClient
      .from('timetable_versions')
      .select(`
        *,
        run:timetable_runs(*),
        score:timetable_scores(*)
      `)
      .eq('id', versionId)
      .single();

    if (versionError || !version) throw new Error('Version not found');

    const { count: assignmentsCount } = await adminClient
      .from('timetable_assignments')
      .select('*', { count: 'exact', head: true })
      .eq('version_id', versionId);

    const { count: conflictsCount } = await adminClient
      .from('timetable_conflicts')
      .select('*', { count: 'exact', head: true })
      .eq('version_id', versionId)
      .is('resolution', null);

    const { count: hardConflicts } = await adminClient
      .from('timetable_conflicts')
      .select('*', { count: 'exact', head: true })
      .eq('version_id', versionId)
      .is('resolution', null)
      .eq('severity', 'HARD');

    const { count: sectionsCount } = await adminClient
      .from('timetable_assignments')
      .select('section_id', { count: 'exact', head: true })
      .eq('version_id', versionId);

    const run = Array.isArray(version.run) ? version.run[0] : version.run;
    const score = Array.isArray(version.score) ? version.score[0] : version.score;

    return {
      success: true,
      data: {
        version,
        run,
        score,
        assignmentsCount: assignmentsCount || 0,
        conflictsCount: conflictsCount || 0,
        hardConflicts: hardConflicts || 0,
        sectionsCount: sectionsCount || 0,
      },
    };
  } catch (e: any) {
    console.error('getVersionSummary Error:', e);
    return { success: false, error: e.message };
  }
}

export async function publishTimetableVersion(versionId: string, notes: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { data: version, error: versionError } = await adminClient
      .from('timetable_versions')
      .select('semester_id, status, is_published')
      .eq('id', versionId)
      .single();

    if (versionError || !version) throw new Error('Version not found');

    if (version.status === 'PUBLISHED') {
      throw new Error('Version is already published');
    }

    const { error: publishError } = await adminClient
      .from('timetable_versions')
      .update({
        status: 'PUBLISHED',
        is_published: true,
        published_at: new Date().toISOString(),
        published_by: null,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', versionId);

    if (publishError) throw publishError;

    const { error: archiveError } = await adminClient
      .from('timetable_versions')
      .update({ status: 'ARCHIVED' })
      .eq('semester_id', version.semester_id)
      .neq('id', versionId)
      .eq('is_published', true);

    if (archiveError) throw archiveError;

    try {
      const notifyPromises = [];
      const studentNotify = notifyStrandedStudents(versionId);
      const facultyNotify = notifyFaculty(versionId);
      notifyPromises.push(studentNotify, facultyNotify);
      await Promise.all(notifyPromises);
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
    }

    return { success: true };
  } catch (e: any) {
    console.error('publishTimetableVersion Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getPublishHistory(termId: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { data: history, error } = await adminClient
      .from('timetable_versions')
      .select(`
        id,
        version_number,
        label,
        status,
        is_published,
        published_at,
        published_by,
        notes,
        created_at,
        publisher:profiles!timetable_versions_published_by_fkey(id, first_name, last_name, email)
      `)
      .eq('semester_id', termId)
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;

    const mapped = (history || []).map((h: any) => ({
      ...h,
      publisher: Array.isArray(h.publisher) ? h.publisher[0] : h.publisher,
    }));

    return { success: true, data: mapped };
  } catch (e: any) {
    console.error('getPublishHistory Error:', e);
    return { success: false, error: e.message };
  }
}

export async function notifyStrandedStudents(versionId: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { data: assignments, error: assignmentsError } = await adminClient
      .from('timetable_assignments')
      .select(`
        *,
        section:course_sections(
          *,
          module:modules(code, title),
          enrollments:module_enrollments(student_id)
        )
      `)
      .eq('version_id', versionId);

    if (assignmentsError) throw assignmentsError;

    const studentSectionMap = new Map<string, { section: any; assignment: any }[]>();

    for (const assignment of assignments || []) {
      const section = Array.isArray(assignment.section) ? assignment.section[0] : assignment.section;
      if (!section) continue;

      const enrollments = section.enrollments || [];
      for (const enrollment of enrollments) {
        const studentId = typeof enrollment === 'string' ? enrollment : enrollment.student_id;
        if (!studentSectionMap.has(studentId)) {
          studentSectionMap.set(studentId, []);
        }
        studentSectionMap.get(studentId)!.push({ section, assignment });
      }
    }

    const notificationsToInsert: any[] = [];

    for (const [studentId, items] of studentSectionMap.entries()) {
      const sectionCodes = [...new Set(items.map(i => i.section.code))];
      const message = `Your timetable has been updated. Affected sections: ${sectionCodes.join(', ')}. Please review your schedule.`;

      notificationsToInsert.push({
        title: 'Timetable Updated',
        message,
        category: 'Academics',
        priority: 'high',
        recipient_type: 'individual',
        recipient_ids: [studentId],
        related_id: versionId,
        related_type: 'timetable_version',
      });
    }

    if (notificationsToInsert.length > 0) {
      const { error: notifError } = await adminClient
        .from('notifications')
        .insert(notificationsToInsert);

      if (notifError) throw notifError;
    }

    return { success: true, count: notificationsToInsert.length };
  } catch (e: any) {
    console.error('notifyStrandedStudents Error:', e);
    return { success: false, error: e.message };
  }
}

export async function notifyFaculty(versionId: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { data: assignments, error: assignmentsError } = await adminClient
      .from('timetable_assignments')
      .select(`
        *,
        section:course_sections(
          *,
          module:modules(code, title)
        )
      `)
      .eq('version_id', versionId)
      .not('instructor_id', 'is', null);

    if (assignmentsError) throw assignmentsError;

    const instructorMap = new Map<string, { sections: string[]; modules: string[] }>();

    for (const assignment of assignments || []) {
      const instructorId = assignment.instructor_id;
      if (!instructorId) continue;

      const section = Array.isArray(assignment.section) ? assignment.section[0] : assignment.section;
      if (!section) continue;

      const module = Array.isArray(section.module) ? section.module[0] : section.module;

      if (!instructorMap.has(instructorId)) {
        instructorMap.set(instructorId, { sections: [], modules: [] });
      }

      const entry = instructorMap.get(instructorId)!;
      if (!entry.sections.includes(section.code)) {
        entry.sections.push(section.code);
      }
      if (module && !entry.modules.includes(module.title)) {
        entry.modules.push(module.title);
      }
    }

    const notificationsToInsert: any[] = [];

    for (const [instructorId, data] of instructorMap.entries()) {
      const message = `Timetable updated. You have teaching assignments for: ${data.modules.join(', ')} in sections ${data.sections.join(', ')}.`;

      notificationsToInsert.push({
        title: 'Teaching Schedule Updated',
        message,
        category: 'Academics',
        priority: 'normal',
        recipient_type: 'individual',
        recipient_ids: [instructorId],
        related_id: versionId,
        related_type: 'timetable_version',
      });
    }

    if (notificationsToInsert.length > 0) {
      const { error: notifError } = await adminClient
        .from('notifications')
        .insert(notificationsToInsert);

      if (notifError) throw notifError;
    }

    return { success: true, count: notificationsToInsert.length };
  } catch (e: any) {
    console.error('notifyFaculty Error:', e);
    return { success: false, error: e.message };
  }
}
