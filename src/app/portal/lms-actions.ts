
import { createAdminClient } from '@/utils/supabase/admin';
import { AuditLog } from '@/types/database';

/**
 * Simulates provisioning an account in the external LMS (e.g. Moodle, Canvas)
 * Triggered automatically upon student enrollment.
 */
export async function provisionLmsAccount(studentId: string, email: string) {
    const adminClient = createAdminClient();

    console.log(`[LMS Simulation] Provisioning account for ${studentId} (${email})...`);

    try {
        // 1. Logic to hit external LMS API would go here
        // simulate a small delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const lmsToken = `LX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

        // 2. Update Student record with LMS data
        const { error } = await adminClient
            .from('students')
            .update({
                lms_access_data: {
                    account_provisioned: true,
                    provisioned_at: new Date().toISOString(),
                    lms_token: lmsToken,
                    sync_status: 'SYNCED'
                }
            })
            .eq('id', studentId);

        if (error) throw error;

        // 3. Log System Action
        await adminClient.from('audit_logs').insert({
            action: 'LMS_ACCOUNT_PROVISIONED',
            entity_table: 'students',
            entity_id: studentId,
            metadata: { lms_token: lmsToken, email }
        });

        console.log(`[LMS Simulation] Account provisioned successfully for ${studentId}`);
        return { success: true, lmsToken };

    } catch (error: any) {
        console.error('[LMS Simulation] Provisioning failed:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Simulates granting course access in the LMS
 * Triggered when a student registers for a module.
 */
export async function syncEnrollmentToLms(studentId: string, moduleId: string, semesterId: string) {
    const adminClient = createAdminClient();

    console.log(`[LMS Simulation] Syncing module ${moduleId} to LMS for student ${studentId}...`);

    try {
        // simulate communication with LMS
        await new Promise(resolve => setTimeout(resolve, 500));

        // In a real system, this ensures the student is enrolled in the LMS course shell

        await adminClient.from('audit_logs').insert({
            action: 'LMS_COURSE_SYNC',
            entity_table: 'module_enrollments',
            entity_id: `${studentId}:${moduleId}`,
            metadata: {
                student_id: studentId,
                module_id: moduleId,
                semester_id: semesterId,
                status: 'GRANTED'
            }
        });

        console.log(`[LMS Simulation] Sync completed for ${studentId} -> ${moduleId}`);
        return { success: true };

    } catch (error: any) {
        console.error('[LMS Simulation] Sync failed:', error.message);
        return { success: false, error: error.message };
    }
}
