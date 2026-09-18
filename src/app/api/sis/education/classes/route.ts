// ==============================================================================
// GET /api/sis/education/classes
// Returns connected Microsoft Education classes and Teams for current user.
// ==============================================================================

import { NextResponse } from 'next/server';
import { getMicrosoftSessionAuth } from '@/lib/microsoft/auth';
import { getStudentEducationClasses } from '@/lib/microsoft/education';
import { createServerClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { providerToken, userId, error: authError } = await getMicrosoftSessionAuth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch user's enrolled course sections from Cannoga SIS database (System of Record)
        const supabase = await createServerClient();
        const { data: student } = await supabase
            .from('students')
            .select('id, student_id')
            .eq('user_id', userId)
            .maybeSingle();

        let localEnrollments: any[] = [];
        if (student) {
            const { data: enrollments } = await supabase
                .from('module_enrollments')
                .select(`
                    id,
                    status,
                    grade,
                    grade_status,
                    modules (id, code, title, credits),
                    semesters (id, name, start_date, end_date)
                `)
                .eq('student_id', student.id);

            localEnrollments = enrollments || [];
        }

        // If Microsoft provider token exists, fetch live Microsoft Education / Teams classes
        let microsoftClasses: any[] = [];
        let graphWarning: string | null = null;
        let requiresAdminConsent = false;

        if (providerToken) {
            const graphRes = await getStudentEducationClasses(providerToken);
            if (graphRes.data?.value) {
                microsoftClasses = graphRes.data.value;
            } else if (graphRes.error) {
                graphWarning = graphRes.error;
                requiresAdminConsent = !!graphRes.requiresAdminConsent;
            }
        }

        return NextResponse.json({
            ok: true,
            hasMicrosoftSession: !!providerToken,
            enrollments: localEnrollments,
            microsoftClasses,
            graphWarning,
            requiresAdminConsent,
        });
    } catch (err: any) {
        console.error('[API /sis/education/classes] Error:', err);
        return NextResponse.json(
            { ok: false, error: err?.message || 'Failed to fetch education classes' },
            { status: 500 }
        );
    }
}
