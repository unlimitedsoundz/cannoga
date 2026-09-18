// ==============================================================================
// GET /api/sis/admin/integrations/microsoft/export-sds
// Generates official Microsoft School Data Sync (SDS) CSV files from Cannoga SIS.
// Admin-only endpoint.
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export const dynamic = 'force-dynamic';

function escapeCsv(val: any): string {
    if (val === null || val === undefined) return '';
    const str = String(val).trim();
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

export async function GET(request: NextRequest) {
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
        const { searchParams } = new URL(request.url);
        const fileType = searchParams.get('file') || 'users';

        // 1. ORGS.CSV
        if (fileType === 'orgs') {
            const rows = [
                ['sourcedId', 'name', 'type', 'status'],
                ['cannoga-college', 'Cannoga College', 'school', 'active'],
            ];
            const csv = rows.map(r => r.map(escapeCsv).join(',')).join('\n');
            return new NextResponse(csv, {
                headers: {
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': 'attachment; filename="orgs.csv"',
                },
            });
        }

        // 2. USERS.CSV (Students and Faculty)
        if (fileType === 'users') {
            const { data: students } = await adminClient
                .from('students')
                .select('id, student_id, institutional_email, personal_email, user_id');

            const { data: profiles } = await adminClient
                .from('profiles')
                .select('id, first_name, last_name, email, role');

            const profileMap = new Map((profiles || []).map(p => [p.id, p]));

            const rows = [
                ['sourcedId', 'givenName', 'familyName', 'email', 'role', 'username', 'orgSourcedIds', 'status'],
            ];

            (students || []).forEach(s => {
                const prof = s.user_id ? profileMap.get(s.user_id) : null;
                const email = s.institutional_email || prof?.email || s.personal_email || `${s.student_id}@cannogacollege.ca`;
                const firstName = prof?.first_name || 'Student';
                const lastName = prof?.last_name || s.student_id;
                rows.push([
                    s.student_id,
                    firstName,
                    lastName,
                    email,
                    'student',
                    email.split('@')[0],
                    'cannoga-college',
                    'active',
                ]);
            });

            (profiles || []).filter(p => p.role === 'FACULTY' || p.role === 'ADMIN').forEach(f => {
                rows.push([
                    f.id,
                    f.first_name || 'Faculty',
                    f.last_name || 'Member',
                    f.email,
                    f.role === 'FACULTY' ? 'teacher' : 'administrator',
                    f.email.split('@')[0],
                    'cannoga-college',
                    'active',
                ]);
            });

            const csv = rows.map(r => r.map(escapeCsv).join(',')).join('\n');
            return new NextResponse(csv, {
                headers: {
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': 'attachment; filename="users.csv"',
                },
            });
        }

        // 3. COURSES.CSV
        if (fileType === 'courses') {
            const { data: modules } = await adminClient
                .from('modules')
                .select('id, code, title, department_id');

            const rows = [
                ['sourcedId', 'courseTitle', 'courseCode', 'orgSourcedId', 'status'],
            ];

            (modules || []).forEach(m => {
                rows.push([
                    m.code,
                    m.title,
                    m.code,
                    'cannoga-college',
                    'active',
                ]);
            });

            const csv = rows.map(r => r.map(escapeCsv).join(',')).join('\n');
            return new NextResponse(csv, {
                headers: {
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': 'attachment; filename="courses.csv"',
                },
            });
        }

        // 4. CLASSES.CSV (Course Sections)
        if (fileType === 'classes') {
            const { data: sections } = await adminClient
                .from('course_sections')
                .select(`
                    id,
                    code,
                    module_id,
                    semester_id,
                    modules (code, title),
                    semesters (id, name)
                `);

            const rows = [
                ['sourcedId', 'title', 'courseSourcedId', 'termSourcedId', 'orgSourcedId', 'status'],
            ];

            (sections || []).forEach(s => {
                const moduleCode = (s.modules as any)?.code || s.module_id;
                const moduleTitle = (s.modules as any)?.title || 'Course';
                const classTitle = `${moduleCode} - ${moduleTitle} (Sec ${s.code})`;
                rows.push([
                    s.id,
                    classTitle,
                    moduleCode,
                    s.semester_id,
                    'cannoga-college',
                    'active',
                ]);
            });

            const csv = rows.map(r => r.map(escapeCsv).join(',')).join('\n');
            return new NextResponse(csv, {
                headers: {
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': 'attachment; filename="classes.csv"',
                },
            });
        }

        // 5. ENROLLMENTS.CSV
        if (fileType === 'enrollments') {
            const { data: enrollments } = await adminClient
                .from('module_enrollments')
                .select(`
                    id,
                    module_id,
                    student_id,
                    students (student_id),
                    status
                `);

            const rows = [
                ['classSourcedId', 'userSourcedId', 'role', 'status'],
            ];

            (enrollments || []).forEach(e => {
                const studentId = (e.students as any)?.student_id || e.student_id;
                rows.push([
                    e.module_id,
                    studentId,
                    'student',
                    e.status === 'ENROLLED' ? 'active' : 'inactive',
                ]);
            });

            const csv = rows.map(r => r.map(escapeCsv).join(',')).join('\n');
            return new NextResponse(csv, {
                headers: {
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': 'attachment; filename="enrollments.csv"',
                },
            });
        }

        // 6. ACADEMIC SESSIONS.CSV
        if (fileType === 'academicSessions') {
            const { data: semesters } = await adminClient
                .from('semesters')
                .select('id, name, start_date, end_date');

            const rows = [
                ['sourcedId', 'title', 'type', 'startDate', 'endDate', 'status'],
            ];

            (semesters || []).forEach(sem => {
                rows.push([
                    sem.id,
                    sem.name,
                    'semester',
                    sem.start_date || '2026-09-01',
                    sem.end_date || '2026-12-20',
                    'active',
                ]);
            });

            const csv = rows.map(r => r.map(escapeCsv).join(',')).join('\n');
            return new NextResponse(csv, {
                headers: {
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': 'attachment; filename="academicSessions.csv"',
                },
            });
        }

        return NextResponse.json({ error: 'Invalid file parameter. Use orgs, users, courses, classes, enrollments, or academicSessions.' }, { status: 400 });
    } catch (err: any) {
        console.error('[API /sis/admin/integrations/microsoft/export-sds] Error:', err);
        return NextResponse.json({ error: err?.message || 'Failed to export SDS roster' }, { status: 500 });
    }
}
