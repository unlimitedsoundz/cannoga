'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { Semester, CourseSection, TimetableRun, TimetableVersion, TimetableAssignment, TimetableConflict, TimetableScore } from '@/types/database';

export interface DashboardStats {
  termId: string;
  termName: string;
  totalSections: number;
  scheduledSections: number;
  unscheduledSections: number;
  totalRooms: number;
  totalFaculty: number;
  totalStudents: number;
  totalConflicts: number;
  optimizationScore: number | null;
  hasPublishedVersion: boolean;
  latestVersion: TimetableVersion | null;
}

export interface GenerationResult {
  success: boolean;
  runId: string | null;
  error?: string;
}

export interface ProgressUpdate {
  runId: string;
  status: string;
  progress: number;
  currentStage: string;
  coursesCount: number;
  sectionsCount: number;
  assignmentsCount: number;
  hardViolations: number;
  softScore: number | null;
  errorMessage: string | null;
}

export async function getSchedulingDashboard(termId: string): Promise<DashboardStats> {
  const adminClient = createServiceRoleClient();

  try {
    const [
      sectionsRes,
      scheduledRes,
      roomsRes,
      facultyRes,
      studentsRes,
      conflictsRes,
      scoresRes,
      versionsRes,
      termRes,
    ] = await Promise.all([
      adminClient.from('course_sections').select('id', { count: 'exact', head: true }).eq('semester_id', termId),
      adminClient.from('course_sections').select('id', { count: 'exact', head: true }).eq('semester_id', termId).in('status', ['SCHEDULED', 'PUBLISHED']),
      adminClient.from('rooms').select('id', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
      adminClient.from('profiles').select('id', { count: 'exact', head: true }).in('role', ['FACULTY', 'ADMIN', 'REGISTRAR']),
      adminClient.from('students').select('id', { count: 'exact', head: true }),
      adminClient.from('timetable_conflicts').select('id', { count: 'exact', head: true }),
      adminClient.from('timetable_scores').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle(),
      adminClient.from('timetable_versions').select('*').eq('semester_id', termId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      adminClient.from('semesters').select('id, name').eq('id', termId).single(),
    ]);

    if (termRes.error) throw termRes.error;

    const totalSections = sectionsRes.count || 0;
    const scheduledSections = scheduledRes.count || 0;

    return {
      termId,
      termName: (termRes.data as any)?.name || 'Unknown',
      totalSections,
      scheduledSections,
      unscheduledSections: totalSections - scheduledSections,
      totalRooms: roomsRes.count || 0,
      totalFaculty: facultyRes.count || 0,
      totalStudents: studentsRes.count || 0,
      totalConflicts: conflictsRes.count || 0,
      optimizationScore: (scoresRes.data as TimetableScore | null)?.overall_score || null,
      hasPublishedVersion: versionsRes.data ? (versionsRes.data as TimetableVersion).status === 'PUBLISHED' : false,
      latestVersion: versionsRes.data as TimetableVersion | null,
    };
  } catch (e: any) {
    console.error('getSchedulingDashboard Error:', e);
    throw new Error(e.message || 'Failed to load dashboard');
  }
}

export async function generateTimetable(termId: string, options: { constraintWeights?: Record<string, number> } = {}): Promise<GenerationResult> {
  const adminClient = createServiceRoleClient();

  try {
    const { data: run, error } = await adminClient
      .from('timetable_runs')
      .insert({
        semester_id: termId,
        status: 'PENDING',
        progress: 0,
        courses_count: 0,
        sections_count: 0,
        assignments_count: 0,
        hard_violations: 0,
        metadata: options.constraintWeights || {},
      })
      .select('id')
      .single();

    if (error) throw error;

    adminClient.channel('timetable-run').send({
      type: 'broadcast',
      event: 'new-run',
      payload: { runId: run.id },
    });

    return { success: true, runId: (run as any).id };
  } catch (e: any) {
    console.error('generateTimetable Error:', e);
    return { success: false, runId: null, error: e.message };
  }
}

export async function getGenerationProgress(runId: string): Promise<ProgressUpdate> {
  const adminClient = createServiceRoleClient();

  try {
    const { data: run, error } = await adminClient
      .from('timetable_runs')
      .select('*')
      .eq('id', runId)
      .single();

    if (error) throw error;

    const statusMap: Record<string, string> = {
      PENDING: 'Initializing',
      RUNNING: 'Optimizing',
      COMPLETED: 'Completed',
      PARTIAL: 'Partially Completed',
      FAILED: 'Failed',
      CANCELLED: 'Cancelled',
    };

    return {
      runId,
      status: (run as TimetableRun).status,
      progress: (run as TimetableRun).progress,
      currentStage: statusMap[(run as TimetableRun).status] || (run as TimetableRun).status,
      coursesCount: (run as TimetableRun).courses_count,
      sectionsCount: (run as TimetableRun).sections_count,
      assignmentsCount: (run as TimetableRun).assignments_count,
      hardViolations: (run as TimetableRun).hard_violations,
      softScore: (run as TimetableRun).soft_score,
      errorMessage: (run as TimetableRun).error_message,
    };
  } catch (e: any) {
    console.error('getGenerationProgress Error:', e);
    throw new Error(e.message || 'Failed to get progress');
  }
}

export async function publishTimetable(versionId: string): Promise<void> {
  const adminClient = createServiceRoleClient();

  try {
    await adminClient
      .from('timetable_versions')
      .update({
        status: 'PUBLISHED',
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .eq('id', versionId);
  } catch (e: any) {
    console.error('publishTimetable Error:', e);
    throw new Error(e.message || 'Failed to publish timetable');
  }
}

export async function getAllSections(termId: string): Promise<CourseSection[]> {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('course_sections')
      .select('*')
      .eq('semester_id', termId)
      .order('code', { ascending: true });

    if (error) throw error;
    return (data || []) as CourseSection[];
  } catch (e: any) {
    console.error('getAllSections Error:', e);
    return [];
  }
}

export async function getSectionsByStatus(termId: string, status: string): Promise<CourseSection[]> {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('course_sections')
      .select('*')
      .eq('semester_id', termId)
      .eq('status', status)
      .order('code', { ascending: true });

    if (error) throw error;
    return (data || []) as CourseSection[];
  } catch (e: any) {
    console.error('getSectionsByStatus Error:', e);
    return [];
  }
}
