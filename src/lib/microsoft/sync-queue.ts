// ==============================================================================
// Microsoft Sync Queue Service
// Processes the microsoft_sync_queue table with idempotency and retry logic.
//
// ARCHITECTURE RULE: Microsoft Graph calls must never happen inside Cannoga
// SIS database transactions. All provisioning/roster changes are queued here
// and processed asynchronously.
//
// Idempotency: Running the processor twice will NOT create duplicates.
// Each action checks stored Microsoft IDs and Graph object existence first.
// ==============================================================================

import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import {
    getOrCreateEducationClass,
    getOrCreateClassTeam,
    addStudentToClass,
    removeStudentFromClass,
    addTeacherToClass,
    removeTeacherFromClass,
    createOrUpdateAssignment,
    resolveEducationUserId,
} from './provisioning';
import { getOrCreateClassworkModule, publishClassworkModule } from './classwork';

export interface QueueStats {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    skipped: number;
}

// ---------------------------------------------------------------------------
// Enqueue a sync operation. Deduplicates: if an identical pending item exists
// for the same entity_type + entity_id + action, it is not duplicated.
// ---------------------------------------------------------------------------
export async function enqueueSync(
    entityType: string,
    entityId: string,
    action: string,
    payload: Record<string, any> = {},
    createdBy?: string
): Promise<{ queued: boolean; id?: string; error?: string }> {
    const adminClient = createServiceRoleClient();

    // Dedup check: avoid creating the same pending item twice
    const { data: existing } = await adminClient
        .from('microsoft_sync_queue')
        .select('id')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .eq('action', action)
        .in('status', ['PENDING', 'PROCESSING'])
        .maybeSingle();

    if (existing?.id) {
        return { queued: false, id: existing.id };
    }

    const { data, error } = await adminClient
        .from('microsoft_sync_queue')
        .insert({
            entity_type: entityType,
            entity_id: entityId,
            action,
            payload,
            status: 'PENDING',
            created_by: createdBy || null,
        })
        .select('id')
        .single();

    if (error) {
        return { queued: false, error: error.message };
    }

    return { queued: true, id: data.id };
}

// ---------------------------------------------------------------------------
// Get queue statistics
// ---------------------------------------------------------------------------
export async function getQueueStats(): Promise<QueueStats> {
    const adminClient = createServiceRoleClient();

    const statuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'SKIPPED'] as const;
    const stats: QueueStats = { pending: 0, processing: 0, completed: 0, failed: 0, skipped: 0 };

    await Promise.all(
        statuses.map(async (status) => {
            const { count } = await adminClient
                .from('microsoft_sync_queue')
                .select('id', { count: 'exact', head: true })
                .eq('status', status);
            const key = status.toLowerCase() as keyof QueueStats;
            stats[key] = count || 0;
        })
    );

    return stats;
}

// ---------------------------------------------------------------------------
// Process a batch of pending sync queue items.
// Returns number of items processed and any critical errors.
// ---------------------------------------------------------------------------
export async function processSyncQueue(
    batchSize: number = 10
): Promise<{ processed: number; errors: string[] }> {
    const adminClient = createServiceRoleClient();
    const errors: string[] = [];
    let processed = 0;

    // Fetch pending items that haven't exceeded max_attempts (5 by default)
    const { data: pendingItems } = await adminClient
        .from('microsoft_sync_queue')
        .select('*')
        .eq('status', 'PENDING')
        .lte('attempts', 4) // 5 max_attempts, so attempt index 0–4
        .order('scheduled_at', { ascending: true })
        .limit(batchSize);

    const toProcess = pendingItems || [];

    for (const item of toProcess) {
        // Mark as processing
        await adminClient
            .from('microsoft_sync_queue')
            .update({ status: 'PROCESSING', started_at: new Date().toISOString() })
            .eq('id', item.id);

        try {
            const result = await processQueueItem(item);

            if (result.success) {
                await adminClient
                    .from('microsoft_sync_queue')
                    .update({
                        status: result.skipped ? 'SKIPPED' : 'COMPLETED',
                        processed_at: new Date().toISOString(),
                        attempts: item.attempts + 1,
                        last_error: null,
                    })
                    .eq('id', item.id);
            } else {
                const newAttempts = item.attempts + 1;
                const exhausted = newAttempts >= item.max_attempts;

                await adminClient
                    .from('microsoft_sync_queue')
                    .update({
                        status: exhausted ? 'FAILED' : 'PENDING',
                        attempts: newAttempts,
                        last_error: result.error || 'Unknown error',
                        // Exponential back-off: schedule retry after 2^attempt minutes
                        scheduled_at: exhausted
                            ? new Date().toISOString()
                            : new Date(Date.now() + Math.pow(2, newAttempts) * 60 * 1000).toISOString(),
                    })
                    .eq('id', item.id);

                if (!result.skipped) {
                    errors.push(`[${item.entity_type}/${item.entity_id}/${item.action}]: ${result.error}`);
                }
            }
        } catch (err: any) {
            const message = err?.message || 'Unexpected processing error';
            errors.push(`[${item.entity_type}/${item.entity_id}/${item.action}]: ${message}`);
            await adminClient
                .from('microsoft_sync_queue')
                .update({
                    status: item.attempts + 1 >= item.max_attempts ? 'FAILED' : 'PENDING',
                    attempts: item.attempts + 1,
                    last_error: message,
                })
                .eq('id', item.id);
        }

        processed++;
    }

    return { processed, errors };
}

// ---------------------------------------------------------------------------
// Reset failed items back to PENDING so they will be retried.
// ---------------------------------------------------------------------------
export async function retryFailedItems(
    entityType?: string
): Promise<{ reset: number }> {
    const adminClient = createServiceRoleClient();

    // Count first
    let countQuery = adminClient
        .from('microsoft_sync_queue')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'FAILED');

    if (entityType) {
        countQuery = countQuery.eq('entity_type', entityType);
    }

    const { count } = await countQuery;

    // Then reset
    let updateQuery = adminClient
        .from('microsoft_sync_queue')
        .update({ status: 'PENDING', attempts: 0, last_error: null })
        .eq('status', 'FAILED');

    if (entityType) {
        updateQuery = updateQuery.eq('entity_type', entityType);
    }

    await updateQuery;

    return { reset: count || 0 };
}

// ---------------------------------------------------------------------------
// Internal: process a single queue item.
// ---------------------------------------------------------------------------
interface ProcessResult {
    success: boolean;
    skipped?: boolean;
    error?: string;
}

async function processQueueItem(item: any): Promise<ProcessResult> {
    const adminClient = createServiceRoleClient();
    const payload = item.payload || {};

    switch (`${item.entity_type}/${item.action}`) {
        // ---------------------------------------------------------------
        // COURSE SECTION: provision Microsoft Education Class + Team
        // ---------------------------------------------------------------
        case 'course_section/create': {
            const { data: section } = await adminClient
                .from('course_sections')
                .select(`
                    id, code, module_id, semester_id,
                    microsoft_class_id, microsoft_team_id,
                    modules (code, title),
                    semesters (name)
                `)
                .eq('id', item.entity_id)
                .maybeSingle();

            if (!section) return { success: true, skipped: true, error: 'Section not found (may have been deleted)' };

            const mod = section.modules as any;
            const sem = section.semesters as any;

            // Create Education Class
            const classResult = await getOrCreateEducationClass({
                storedClassId: section.microsoft_class_id,
                sectionCode: section.code,
                moduleCode: mod?.code || '',
                moduleTitle: mod?.title || '',
                semesterName: sem?.name || '',
                externalId: section.id,
            });

            if (!classResult.success) {
                if (classResult.notConfigured) return { success: true, skipped: true, error: classResult.error };
                return { success: false, error: classResult.error };
            }

            // Update stored class ID + sync status
            await adminClient
                .from('course_sections')
                .update({
                    microsoft_class_id: classResult.microsoftId,
                    microsoft_sync_status: 'SYNCED',
                    microsoft_last_synced_at: new Date().toISOString(),
                    microsoft_sync_error: null,
                })
                .eq('id', section.id);

            // Create Class Team
            if (classResult.microsoftId) {
                const teamResult = await getOrCreateClassTeam({
                    storedTeamId: section.microsoft_team_id,
                    educationClassId: classResult.microsoftId,
                });
                if (teamResult.success && teamResult.microsoftId) {
                    await adminClient
                        .from('course_sections')
                        .update({
                            microsoft_team_id: teamResult.microsoftId,
                            microsoft_group_id: teamResult.microsoftId,
                        })
                        .eq('id', section.id);
                }
            }

            return { success: true };
        }

        // ---------------------------------------------------------------
        // ENROLLMENT: add student to Microsoft class
        // ---------------------------------------------------------------
        case 'enrollment/add_student': {
            const enrollmentId = item.entity_id;
            const { data: enrollment } = await adminClient
                .from('module_enrollments')
                .select('id, status, module_id, semester_id, student_id')
                .eq('id', enrollmentId)
                .maybeSingle();

            if (!enrollment) return { success: true, skipped: true, error: 'Enrollment not found' };

            // Find student
            const { data: student } = await adminClient
                .from('students')
                .select('id, student_id, institutional_email, microsoft_user_id')
                .or(`id.eq.${enrollment.student_id},student_id.eq.${enrollment.student_id}`)
                .maybeSingle();

            // Find course section matching module_id and semester_id
            const { data: section } = await adminClient
                .from('course_sections')
                .select('id, microsoft_class_id, microsoft_team_id')
                .eq('module_id', enrollment.module_id)
                .eq('semester_id', enrollment.semester_id)
                .maybeSingle();

            const classId = section?.microsoft_class_id;
            if (!classId) {
                return { success: false, error: 'Course section has no Microsoft class provisioned yet' };
            }

            let microsoftUserId = student?.microsoft_user_id;

            // Resolve Microsoft Entra Object ID if missing or non-UUID (e.g. pairwise OAuth sub)
            const isGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(microsoftUserId || '');
            if (!isGuid && student?.institutional_email) {
                const resolvedId = await resolveEducationUserId(student.institutional_email);
                if (resolvedId) {
                    microsoftUserId = resolvedId;
                    await adminClient
                        .from('students')
                        .update({ microsoft_user_id: resolvedId })
                        .eq('id', student.id);
                }
            }

            if (!microsoftUserId) {
                return { success: true, skipped: true, error: 'Student has no Microsoft identity linked' };
            }

            const result = await addStudentToClass({ educationClassId: classId, microsoftUserId });

            if (result.success) {
                await adminClient
                    .from('module_enrollments')
                    .update({
                        microsoft_sync_status: 'SYNCED',
                        microsoft_last_synced_at: new Date().toISOString(),
                    })
                    .eq('id', enrollmentId);
            }

            return result.success
                ? { success: true }
                : { success: false, error: result.error };
        }

        // ---------------------------------------------------------------
        // ENROLLMENT: remove student from Microsoft class
        // ---------------------------------------------------------------
        case 'enrollment/remove_student': {
            const microsoftUserId = payload.microsoft_user_id;
            const classId = payload.microsoft_class_id;

            if (!microsoftUserId || !classId) {
                return { success: true, skipped: true, error: 'Missing Microsoft IDs in payload' };
            }

            const result = await removeStudentFromClass({ educationClassId: classId, microsoftUserId });

            if (result.success) {
                await adminClient
                    .from('module_enrollments')
                    .update({
                        microsoft_sync_status: 'REMOVED',
                        microsoft_last_synced_at: new Date().toISOString(),
                    })
                    .eq('id', item.entity_id);
            }

            return result.success
                ? { success: true }
                : { success: false, error: result.error };
        }

        // ---------------------------------------------------------------
        // FACULTY: add teacher to Microsoft class
        // ---------------------------------------------------------------
        case 'course_section/add_teacher': {
            const { data: section } = await adminClient
                .from('course_sections')
                .select('id, microsoft_class_id, instructor_id')
                .eq('id', item.entity_id)
                .maybeSingle();

            if (!section) return { success: true, skipped: true, error: 'Section not found' };

            const classId = section.microsoft_class_id;
            if (!classId) {
                return { success: false, error: 'Section has no Microsoft class provisioned yet' };
            }

            let microsoftUserId: string | null = null;

            if (section.instructor_id) {
                // First check profiles table
                const { data: profile } = await adminClient
                    .from('profiles')
                    .select('id, email, microsoft_user_id')
                    .eq('id', section.instructor_id)
                    .maybeSingle();

                let instructorEmail = profile?.email;
                microsoftUserId = profile?.microsoft_user_id || null;

                // If not found in profiles, check Faculty table
                if (!instructorEmail) {
                    const { data: faculty } = await adminClient
                        .from('Faculty')
                        .select('id, email')
                        .eq('id', section.instructor_id)
                        .maybeSingle();
                    if (faculty?.email) instructorEmail = faculty.email;
                }

                const isGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(microsoftUserId || '');
                if (!isGuid && instructorEmail) {
                    const resolvedId = await resolveEducationUserId(instructorEmail);
                    if (resolvedId) {
                        microsoftUserId = resolvedId;
                        if (profile?.id) {
                            await adminClient
                                .from('profiles')
                                .update({ microsoft_user_id: resolvedId })
                                .eq('id', profile.id);
                        }
                    }
                }
            }

            if (!microsoftUserId) {
                // Fallback to default tenant administrator/educator
                microsoftUserId = process.env.AZURE_DEFAULT_OWNER_ID || 'bae9c8de-847f-4e63-a9ba-aa0c085761ad';
            }

            const result = await addTeacherToClass({ educationClassId: classId, microsoftUserId });
            return result.success
                ? { success: true }
                : { success: false, error: result.error };
        }

        // ---------------------------------------------------------------
        // CLASSWORK UNIT: sync to Microsoft Classwork
        // ---------------------------------------------------------------
        case 'classwork_unit/sync_classwork': {
            const { data: unit } = await adminClient
                .from('module_classwork_units')
                .select(`
                    id, title, description, status, microsoft_module_id,
                    course_section_id,
                    course_sections!inner (microsoft_class_id)
                `)
                .eq('id', item.entity_id)
                .maybeSingle();

            if (!unit) return { success: true, skipped: true, error: 'Classwork unit not found' };

            const section = (unit as any).course_sections;
            const classId = section?.microsoft_class_id;

            if (!classId) {
                return { success: false, error: 'Course section has no Microsoft class provisioned yet' };
            }

            const result = await getOrCreateClassworkModule({
                educationClassId: classId,
                storedModuleId: unit.microsoft_module_id,
                title: unit.title,
                description: unit.description || undefined,
            });

            if (!result.success) {
                if (result.notConfigured) return { success: true, skipped: true };
                return { success: false, error: result.error };
            }

            await adminClient
                .from('module_classwork_units')
                .update({
                    microsoft_module_id: result.microsoftId,
                    microsoft_sync_status: 'SYNCED',
                    microsoft_last_synced_at: new Date().toISOString(),
                    microsoft_sync_error: null,
                })
                .eq('id', unit.id);

            // Publish if status is PUBLISHED
            if (unit.status === 'PUBLISHED' && result.microsoftId) {
                await publishClassworkModule(classId, result.microsoftId);
            }

            return { success: true };
        }

        // ---------------------------------------------------------------
        // ASSIGNMENT: sync to Microsoft Education assignment
        // ---------------------------------------------------------------
        case 'assignment/sync_assignment': {
            const { data: assignment } = await adminClient
                .from('cannoga_assignments')
                .select(`
                    id, title, instructions, due_date, points_possible, status,
                    microsoft_assignment_id, course_section_id,
                    course_sections!inner (microsoft_class_id)
                `)
                .eq('id', item.entity_id)
                .maybeSingle();

            if (!assignment) return { success: true, skipped: true, error: 'Assignment not found' };

            const section = (assignment as any).course_sections;
            const classId = section?.microsoft_class_id;

            if (!classId) {
                return { success: false, error: 'Course section has no Microsoft class provisioned yet' };
            }

            const shouldPublish = payload.publish === true || assignment.status === 'PUBLISHED';

            const result = await createOrUpdateAssignment({
                educationClassId: classId,
                storedAssignmentId: assignment.microsoft_assignment_id,
                title: assignment.title,
                instructions: assignment.instructions || undefined,
                dueDateTime: assignment.due_date || undefined,
                pointsPossible: assignment.points_possible || undefined,
                publish: shouldPublish,
            });

            if (!result.success) {
                if (result.notConfigured) return { success: true, skipped: true };
                return { success: false, error: result.error };
            }

            await adminClient
                .from('cannoga_assignments')
                .update({
                    microsoft_assignment_id: result.microsoftId,
                    microsoft_sync_status: 'SYNCED',
                    microsoft_last_synced_at: new Date().toISOString(),
                    microsoft_sync_error: null,
                })
                .eq('id', assignment.id);

            return { success: true };
        }

        default:
            return {
                success: true,
                skipped: true,
                error: `Unknown action: ${item.entity_type}/${item.action}`,
            };
    }
}
