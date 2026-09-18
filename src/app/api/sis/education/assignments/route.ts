// ==============================================================================
// GET /api/sis/education/assignments
// Returns Microsoft Education assignments for the authenticated student.
// ==============================================================================

import { NextResponse } from 'next/server';
import { getMicrosoftSessionAuth } from '@/lib/microsoft/auth';
import { getStudentAssignments } from '@/lib/microsoft/education';
import { getTeamsAssignmentWebUrl } from '@/lib/microsoft/teams';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { providerToken, userId, error: authError } = await getMicrosoftSessionAuth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!providerToken) {
            return NextResponse.json({
                ok: true,
                connected: false,
                message: 'No Microsoft 365 session token active. Sign in with Microsoft to view live Teams assignments.',
                assignments: [],
            });
        }

        const assignRes = await getStudentAssignments(providerToken);

        if (assignRes.error) {
            return NextResponse.json({
                ok: true,
                connected: true,
                error: assignRes.error,
                requiresAdminConsent: assignRes.requiresAdminConsent,
                needsReauth: assignRes.needsReauth,
                assignments: [],
            });
        }

        const rawAssignments = assignRes.data?.value || [];
        const enriched = rawAssignments.map((a) => ({
            id: a.id,
            classId: a.classId,
            title: a.displayName,
            dueDateTime: a.dueDateTime,
            assignedDateTime: a.assignedDateTime,
            status: a.status,
            webUrl: a.webUrl || getTeamsAssignmentWebUrl(a.classId, a.id),
        }));

        return NextResponse.json({
            ok: true,
            connected: true,
            assignments: enriched,
            count: enriched.length,
        });
    } catch (err: any) {
        console.error('[API /sis/education/assignments] Error:', err);
        return NextResponse.json(
            { ok: false, error: err?.message || 'Failed to fetch assignments' },
            { status: 500 }
        );
    }
}
