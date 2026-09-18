// ==============================================================================
// GET /api/sis/admin/integrations/microsoft/status
// Returns integration metrics and health for Microsoft 365 Education.
// Admin-only endpoint.
// ==============================================================================

import { NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify ADMIN role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden. Admin role required.' }, { status: 403 });
        }

        const adminClient = createServiceRoleClient();

        // 1. Students stats
        const { count: totalStudents } = await adminClient
            .from('students')
            .select('id', { count: 'exact', head: true });

        const { count: linkedStudents } = await adminClient
            .from('students')
            .select('id', { count: 'exact', head: true })
            .not('microsoft_user_id', 'is', null);

        // 2. Faculty stats
        const { count: totalFaculty } = await adminClient
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'FACULTY');

        const { count: linkedFaculty } = await adminClient
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'FACULTY')
            .not('microsoft_user_id', 'is', null);

        // 3. Course Sections stats
        const { count: totalSections } = await adminClient
            .from('course_sections')
            .select('id', { count: 'exact', head: true });

        const { count: mappedSections } = await adminClient
            .from('course_sections')
            .select('id', { count: 'exact', head: true })
            .not('microsoft_class_id', 'is', null);

        const clientId = process.env.AZURE_CLIENT_ID || '5548838a-7cd2-4be6-9f5d-116f8e8a200f';
        const tenantId = process.env.AZURE_TENANT_ID || '559051ae-ebf4-496a-8dbb-128aac57d721';

        return NextResponse.json({
            ok: true,
            configuration: {
                tenantConfigured: !!tenantId,
                tenantId,
                clientId,
                graphConfigured: true,
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
            },
            requiredPermissions: [
                { name: 'User.Read', type: 'Delegated', purpose: 'Read signed-in student/faculty profile', status: 'Active' },
                { name: 'Mail.Read', type: 'Delegated', purpose: 'Student Mail integration in SIS', status: 'Active' },
                { name: 'Calendars.Read', type: 'Delegated', purpose: 'Class schedules & timetable sync', status: 'Active' },
                { name: 'EduRoster.ReadBasic', type: 'Delegated', purpose: 'Class rosters and membership', status: 'Recommended' },
                { name: 'EduAssignments.ReadBasic', type: 'Delegated', purpose: 'View student coursework and due dates', status: 'Recommended' },
            ],
        });
    } catch (err: any) {
        console.error('[API /sis/admin/integrations/microsoft/status] Error:', err);
        return NextResponse.json({ error: err?.message || 'Failed to retrieve integration status' }, { status: 500 });
    }
}
