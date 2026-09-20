// ==============================================================================
// GET /api/sis/education/classes
// Returns connected Microsoft Education classes and Cannoga enrollments.
// Cannoga module_enrollments are the source of truth.
// Microsoft Graph classes are supplementary/display data only.
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
            // Join through course_sections to also include Microsoft mapping fields
            const { data: enrollments } = await supabase
                .from('module_enrollments')
                .select(`
                    id,
                    status,
                    grade,
                    grade_status,
                    microsoft_sync_status,
                    modules (id, code, title, credits),
                    semesters (id, name, start_date, end_date),
                    course_sections!inner (
                        id, code,
                        microsoft_class_id,
                        microsoft_team_id,
                        microsoft_sync_status
                    )
                `)
                .eq('student_id', student.id)
                .eq('status', 'REGISTERED');

            // Flatten the course_sections join into enrollment-level fields
            localEnrollments = (enrollments || []).map((enr: any) => {
                const sections = (enr as any).course_sections;
                const section = Array.isArray(sections) ? sections[0] : sections;
                return {
                    ...enr,
                    microsoft_class_id: section?.microsoft_class_id || null,
                    microsoft_team_id: section?.microsoft_team_id || null,
                    course_sections: undefined, // don't expose raw join
                };
            });
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
