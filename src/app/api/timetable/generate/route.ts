import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { NextRequest, NextResponse } from 'next/server';
import { loadSchedulingData } from '@/lib/timetable/engine/loader';
import { TimetableScheduler, SchedulingSolution } from '@/lib/timetable/engine/scheduler';
import { detectConflicts } from '@/lib/timetable/engine/conflicts';
import { validateSolution } from '@/lib/timetable/engine/validator';

export async function POST(request: NextRequest) {
  console.log('[TimetableGeneration] API route hit');
  const adminClient = createServiceRoleClient();

  let runId: string | null = null;

  try {
    const { termId, runId: rid, constraintWeights } = await request.json();
    runId = rid;

    console.log('[TimetableGeneration] Starting generation', { termId, runId });

    if (!termId || !runId) {
      return NextResponse.json({ error: 'termId and runId are required' }, { status: 400 });
    }

    await adminClient
      .from('timetable_runs')
      .update({ status: 'RUNNING', started_at: new Date().toISOString(), progress: 5 })
      .eq('id', runId);

    console.log('[TimetableGeneration] Ensuring sections exist for all enrolled modules...');
    const { data: enrollments } = await adminClient
      .from('module_enrollments')
      .select('module_id, semester_id')
      .eq('semester_id', termId)
      .eq('status', 'REGISTERED');

    if (enrollments && enrollments.length > 0) {
      const moduleIds = [...new Set(enrollments.map(e => e.module_id))];

      const { data: existingSections } = await adminClient
        .from('course_sections')
        .select('module_id')
        .eq('semester_id', termId)
        .in('module_id', moduleIds);

      const existingModuleIds = new Set((existingSections || []).map(s => s.module_id));
      const missingModuleIds = moduleIds.filter(id => !existingModuleIds.has(id));

      if (missingModuleIds.length > 0) {
        console.log(`[TimetableGeneration] Creating sections for ${missingModuleIds.length} modules without sections`);
        const { data: modules } = await adminClient
          .from('modules')
          .select('id, code, title, credits')
          .in('id', missingModuleIds);

        const sectionRows = (modules || []).map(m => ({
          code: `${m.code || 'MOD'}-A`,
          module_id: m.id,
          semester_id: termId,
          capacity: 30,
          enrolled_count: 0,
          status: 'PENDING',
          required_room_type: 'LECTURE_ROOM',
          delivery_mode: 'IN_PERSON',
          session_type: 'LECTURE',
        }));

        const { error: sectionError } = await adminClient
          .from('course_sections')
          .insert(sectionRows);

        if (sectionError) {
          console.error('[TimetableGeneration] Failed to create missing sections:', sectionError);
        } else {
          console.log(`[TimetableGeneration] Created ${sectionRows.length} missing sections`);

          if (sectionRows.length > 0) {
            const createdSections = await adminClient
              .from('course_sections')
              .select('id')
              .eq('semester_id', termId)
              .in('module_id', missingModuleIds);

            const sectionIds = (createdSections.data || []).map((s: any) => s.id);
            if (sectionIds.length > 0) {
              const meetingRows = sectionIds.map(sectionId => ({
                section_id: sectionId,
                meeting_index: 0,
                day_of_week: 1,
                start_time: '09:00:00',
                end_time: '10:30:00',
                duration_minutes: 90,
                room_id: null,
                instructor_id: null,
                is_fixed: false,
              }));

              const { error: meetingError } = await adminClient
                .from('course_section_meetings')
                .insert(meetingRows);

              if (meetingError) {
                console.error('[TimetableGeneration] Failed to create default meetings:', meetingError);
              } else {
                console.log(`[TimetableGeneration] Created ${meetingRows.length} default meetings`);
              }
            }
          }
        }
      }
    }

    console.log('[TimetableGeneration] Loading scheduling data...');
    const problem = await loadSchedulingData(termId);
    console.log('[TimetableGeneration] Data loaded', {
      sections: problem.sections.length,
      rooms: problem.rooms.length,
      timeSlots: problem.timeSlots.length,
      meetings: problem.sections.reduce((sum, s) => sum + s.meetings.length, 0),
    });

    await adminClient
      .from('timetable_runs')
      .update({ progress: 15 })
      .eq('id', runId);

    console.log('[TimetableGeneration] Running scheduler...');
    const scheduler = new TimetableScheduler();
    
    let solution: SchedulingSolution;
    try {
      solution = await Promise.race([
        scheduler.schedule(problem),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Scheduler timeout: took longer than 30 seconds')), 30000)
        ),
      ]);
    } catch (schedulerError: any) {
      console.error('[TimetableGeneration] Scheduler error:', schedulerError);
      await adminClient
        .from('timetable_runs')
        .update({
          status: 'FAILED',
          completed_at: new Date().toISOString(),
          progress: 100,
          error_message: schedulerError.message || 'Scheduler failed',
        })
        .eq('id', runId);
      
      return NextResponse.json({
        success: false,
        runId,
        error: `Scheduler failed: ${schedulerError.message}`,
      }, { status: 500 });
    }
    
    console.log('[TimetableGeneration] Scheduler completed', {
      assignments: solution.assignments.length,
      conflicts: solution.conflicts.length,
      unschedulable: solution.unschedulableSections.length,
    });

    await adminClient
      .from('timetable_runs')
      .update({ progress: 75 })
      .eq('id', runId);

    const conflicts = detectConflicts(solution, problem);
    const validation = validateSolution(solution, problem);

    const hardViolations = conflicts.filter(c => c.severity === 'HARD').length;
    const softViolations = conflicts.filter(c => c.severity === 'SOFT').length;

    const existingVersions = await adminClient
      .from('timetable_versions')
      .select('id')
      .eq('semester_id', termId)
      .eq('version_number', 1);

    if (!existingVersions.error && existingVersions.data && existingVersions.data.length > 0) {
      const idsToDelete = existingVersions.data.map(v => v.id);
      await adminClient
        .from('timetable_assignments')
        .delete()
        .in('version_id', idsToDelete);
      await adminClient
        .from('timetable_conflicts')
        .delete()
        .in('version_id', idsToDelete);
      await adminClient
        .from('timetable_versions')
        .delete()
        .in('id', idsToDelete);
    }

    const versionResult = await adminClient
      .from('timetable_versions')
      .insert({
        semester_id: termId,
        run_id: runId,
        version_number: 1,
        label: `Generated ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
        status: solution.conflicts.length === 0 ? 'PUBLISHED' : 'UNDER_REVIEW',
        is_published: solution.conflicts.length === 0,
        metadata: { constraintWeights },
      })
      .select('id')
      .single();

    if (versionResult.error) throw versionResult.error;
    const versionId = versionResult.data.id;

    const assignmentRows = solution.assignments.map(a => ({
      version_id: versionId,
      run_id: runId,
      section_id: a.sectionId,
      meeting_id: a.meetingId,
      room_id: a.roomId,
      instructor_id: a.instructorId,
      day_of_week: a.dayOfWeek,
      start_time: a.startTime,
      end_time: a.endTime,
      start_date: a.startDate,
      end_date: a.endDate,
      is_override: a.isOverride,
      override_reason: a.overrideReason,
    }));

    console.log('[TimetableGeneration] Inserting assignments', { count: assignmentRows.length });

    const { error: assignmentsError } = await adminClient
      .from('timetable_assignments')
      .insert(assignmentRows);

    if (assignmentsError) throw assignmentsError;

    const scheduledSectionIds = [...new Set(solution.assignments.map(a => a.sectionId))];
    if (scheduledSectionIds.length > 0) {
      await adminClient
        .from('course_sections')
        .update({ status: 'SCHEDULED' })
        .in('id', scheduledSectionIds);
    }

    const conflictRows = conflicts.map(c => ({
      version_id: versionId,
      run_id: runId,
      conflict_type: c.type,
      severity: c.severity,
      assignment_a_id: c.assignmentAId,
      assignment_b_id: c.assignmentBId,
      description: c.description,
    }));

    if (conflictRows.length > 0) {
      const { error: conflictsError } = await adminClient
        .from('timetable_conflicts')
        .insert(conflictRows);

      if (conflictsError) throw conflictsError;
    }

    const { error: scoreError } = await adminClient
      .from('timetable_scores')
      .insert({
        run_id: runId,
        version_id: versionId,
        overall_score: solution.score.overallScore,
        hard_violation_count: hardViolations,
        soft_violation_count: softViolations,
        student_gap_score: solution.score.studentGapScore,
        instructor_gap_score: solution.score.instructorGapScore,
        room_utilization_score: solution.score.roomUtilizationScore,
        building_change_score: solution.score.buildingChangeScore,
        preference_score: solution.score.preferenceScore,
        details: solution.score.details,
      });

    if (scoreError) throw scoreError;

    const status = hardViolations === 0 ? 'COMPLETED' : 'PARTIAL';

    await adminClient
      .from('timetable_runs')
      .update({
        status,
        completed_at: new Date().toISOString(),
        progress: 100,
        courses_count: new Set(solution.assignments.map(a => a.sectionId)).size,
        sections_count: new Set(solution.assignments.map(a => a.sectionId)).size,
        assignments_count: solution.assignments.length,
        hard_violations: hardViolations,
        soft_score: solution.score.overallScore,
      })
      .eq('id', runId);

    console.log('[TimetableGeneration] Completed successfully', { status, assignments: solution.assignments.length });

    return NextResponse.json({
      success: true,
      runId,
      versionId,
      status,
      stats: {
        totalSections: solution.stats.totalSections,
        scheduledSections: solution.stats.scheduledSections,
        unschedulableSections: solution.stats.unschedulableSections,
        totalAssignments: solution.assignments.length,
        hardViolations,
        softViolations,
        overallScore: solution.score.overallScore,
      },
      unschedulableSections: solution.unschedulableSections,
    });

  } catch (error: any) {
    console.error('[TimetableGeneration] Error:', error);

    if (runId) {
      try {
        await adminClient
          .from('timetable_runs')
          .update({
            status: 'FAILED',
            completed_at: new Date().toISOString(),
            error_message: error.message || 'Generation failed',
          })
          .eq('id', runId);
      } catch (updateError) {
        console.error('[TimetableGeneration] Failed to update run status:', updateError);
      }
    }

    return NextResponse.json(
      { error: error.message || 'Generation failed' },
      { status: 500 }
    );
  }
}