// ==============================================================================
// GET /api/sis/admin/integrations/microsoft/status
// Returns integration metrics, sync queue health, and settings for Microsoft 365.
// Admin-only endpoint.
// ==============================================================================

import { NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { isAppGraphConfigured } from '@/lib/microsoft/app-auth';
import { getQueueStats } from '@/lib/microsoft/sync-queue';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden. Admin role required.' }, { status: 403 });
        }

        const adminClient = createServiceRoleClient();

        // --- Students stats ---
        const { count: totalStudents } = await adminClient
            .from('students')
            .select('id', { count: 'exact', head: true });

        const { count: linkedStudents } = await adminClient
            .from('students')
            .select('id', { count: 'exact', head: true })
            .not('microsoft_user_id', 'is', null);

        // --- Faculty stats ---
        const { count: totalFaculty } = await adminClient
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'FACULTY');

        const { count: linkedFaculty } = await adminClient
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'FACULTY')
            .not('microsoft_user_id', 'is', null);

        // --- Course sections stats ---
        const { count: totalSections } = await adminClient
            .from('course_sections')
            .select('id', { count: 'exact', head: true });

        const { count: mappedSections } = await adminClient
            .from('course_sections')
            .select('id', { count: 'exact', head: true })
            .not('microsoft_class_id', 'is', null);

        // --- Recent failed sync items ---
        const { data: recentFailures } = await adminClient
            .from('microsoft_sync_queue')
            .select('id, entity_type, entity_id, action, status, attempts, last_error, created_at, processed_at')
            .eq('status', 'FAILED')
            .order('created_at', { ascending: false })
            .limit(10);

        // --- Students missing Microsoft identity ---
        const { data: studentsWithoutMs } = await adminClient
            .from('students')
            .select('id, student_id, institutional_email')
            .is('microsoft_user_id', null)
            .limit(20);

        // --- Sync queue stats ---
        const queueStats = await getQueueStats();

        // --- Microsoft sync settings from system_settings ---
        const settingKeys = [
            'ms_auto_class_creation',
            'ms_auto_enrollment_sync',
            'ms_auto_faculty_sync',
            'ms_auto_classwork_sync',
            'ms_auto_assignment_sync',
            'ms_auto_publish_classwork',
            'ms_auto_publish_assignments',
        ];

        const { data: settingsRows } = await adminClient
            .from('system_settings')
            .select('key, value')
            .in('key', settingKeys);

        const settings: Record<string, boolean> = {};
        for (const key of settingKeys) {
            const row = (settingsRows || []).find((r) => r.key === key);
            settings[key] = row?.value === 'true';
        }

        // --- Sections with sync status ---
        const { data: sectionSyncStatus } = await adminClient
            .from('course_sections')
            .select(`
                id, code, microsoft_class_id, microsoft_team_id,
                microsoft_sync_status, microsoft_last_synced_at, microsoft_sync_error,
                modules (code, title),
                semesters (name)
            `)
            .order('created_at', { ascending: false })
            .limit(50);

        const clientId = process.env.AZURE_CLIENT_ID || '5548838a-7cd2-4be6-9f5d-116f8e8a200f';
        const tenantId = process.env.AZURE_TENANT_ID || '559051ae-ebf4-496a-8dbb-128aac57d721';
        const appConfigured = isAppGraphConfigured();

        return NextResponse.json({
            ok: true,
            configuration: {
                tenantConfigured: !!tenantId,
                tenantId,
                clientId,
                graphConfigured: true,
                appCredentialsConfigured: appConfigured,
                schoolDataSyncConfigured: true,
            },
            metrics: {
                totalStudents: totalStudents || 0,
                linkedStudents: linkedStudents || 0,
                totalFaculty: totalFaculty || 0,
                linkedFaculty: linkedFaculty || 0,
                totalSections: totalSections || 0,
                mappedSections: mappedSections || 0,
                unmappedSections: (totalSections || 0) - (mappedSections || 0),
                syncQueuePending: queueStats.pending,
                syncQueueFailed: queueStats.failed,
                syncQueueCompleted: queueStats.completed,
            },
            settings,
            recentFailures: recentFailures || [],
            studentsWithoutMicrosoft: studentsWithoutMs || [],
            sectionSyncStatus: sectionSyncStatus || [],
            requiredPermissions: [
                { name: 'User.Read', type: 'Delegated', purpose: 'Read signed-in student/faculty profile', status: 'Active', appLevel: false },
                { name: 'Mail.Read', type: 'Delegated', purpose: 'Student Mail integration in SIS', status: 'Active', appLevel: false },
                { name: 'Calendars.Read', type: 'Delegated', purpose: 'Class schedules & timetable sync', status: 'Active', appLevel: false },
                { name: 'EduRoster.ReadBasic', type: 'Delegated', purpose: 'View student\'s own classes', status: 'Recommended', appLevel: false },
                { name: 'EduAssignments.ReadBasic', type: 'Delegated', purpose: 'View student\'s own assignments', status: 'Recommended', appLevel: false },
                { name: 'EduRoster.ReadWrite.All', type: 'Application', purpose: 'Create classes, manage student/teacher rosters', status: appConfigured ? 'Required' : 'Not Configured', appLevel: true },
                { name: 'EduAssignments.ReadWrite.All', type: 'Application', purpose: 'Create/update Microsoft Education assignments', status: appConfigured ? 'Required' : 'Not Configured', appLevel: true },
                { name: 'Team.Create', type: 'Application', purpose: 'Create Class Teams for course sections', status: appConfigured ? 'Required' : 'Not Configured', appLevel: true },
                { name: 'Group.ReadWrite.All', type: 'Application', purpose: 'Manage Microsoft 365 class groups', status: appConfigured ? 'Required' : 'Not Configured', appLevel: true },
                { name: 'Sites.ReadWrite.All', type: 'Application', purpose: 'SharePoint course homepage creation', status: 'Optional', appLevel: true },
            ],
        });
    } catch (err: any) {
        console.error('[API /sis/admin/integrations/microsoft/status] Error:', err);
        return NextResponse.json({ error: err?.message || 'Failed to retrieve integration status' }, { status: 500 });
    }
}

// ==============================================================================
// PATCH /api/sis/admin/integrations/microsoft/status
// Update Microsoft sync settings. Admin only.
// ==============================================================================
export async function PATCH(request: Request) {
    try {
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
        }

        const body = await request.json();
        const adminClient = createServiceRoleClient();

        const allowedKeys = [
            'ms_auto_class_creation',
            'ms_auto_enrollment_sync',
            'ms_auto_faculty_sync',
            'ms_auto_classwork_sync',
            'ms_auto_assignment_sync',
            'ms_auto_publish_classwork',
            'ms_auto_publish_assignments',
        ];

        const updates = Object.entries(body)
            .filter(([key]) => allowedKeys.includes(key))
            .map(([key, value]) => ({ key, value: String(value) }));

        for (const update of updates) {
            await adminClient
                .from('system_settings')
                .upsert({ key: update.key, value: update.value }, { onConflict: 'key' });
        }

        return NextResponse.json({ ok: true, updated: updates.length });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message }, { status: 500 });
    }
}
