import { createServerClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import TimetablePDF from '@/components/sis/pdf/TimetablePDF';

export async function GET(request: NextRequest) {
  const supabase = await createServerClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !['ADMIN', 'REGISTRAR', 'STUDENT_SERVICES'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const versionId = searchParams.get('versionId');
  const format = searchParams.get('format') as 'pdf' | 'csv' | 'excel';
  const type = searchParams.get('type') as 'master' | 'student' | 'faculty' | 'room';

  if (!versionId || !format || !type) {
    return NextResponse.json({ error: 'versionId, format, and type are required' }, { status: 400 });
  }

  try {
    const { data: version, error: versionError } = await supabase
      .from('timetable_versions')
      .select(`
        *,
        semester:semesters(id, name, start_date, end_date)
      `)
      .eq('id', versionId)
      .single();

    if (versionError || !version) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 });
    }

    const { data: assignments, error: assignmentsError } = await supabase
      .from('timetable_assignments')
      .select(`
        *,
        section:course_sections(
          *,
          module:modules(code, title, credits),
          instructor:Faculty!course_sections_instructor_id_fkey(name, email),
          enrollments:module_enrollments(student_id, student:students(institutional_email, user:profiles(first_name, last_name)))
        ),
        room:rooms(id, name, building, campus)
      `)
      .eq('version_id', versionId)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    if (assignmentsError) {
      return NextResponse.json({ error: assignmentsError.message }, { status: 500 });
    }

    const mappedAssignments = (assignments || []).map((a: any) => ({
      ...a,
      section: Array.isArray(a.section) ? a.section[0] : a.section,
      room: Array.isArray(a.room) ? a.room[0] : a.room,
    }));

    const semester = Array.isArray(version.semester) ? version.semester[0] : version.semester;

    if (format === 'csv' || format === 'excel') {
      const headers = ['Day', 'Start Time', 'End Time', 'Module Code', 'Module Title', 'Section', 'Room', 'Building', 'Instructor', 'Campus'];
      const rows: string[][] = [headers];

      for (const assignment of mappedAssignments) {
        const section = assignment.section || {};
        const module = Array.isArray(section.module) ? section.module[0] : section.module;
        const instructor = Array.isArray(section.instructor) ? section.instructor[0] : section.instructor;
        const room = assignment.room || {};

        rows.push([
          ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][assignment.day_of_week] || String(assignment.day_of_week),
          assignment.start_time,
          assignment.end_time,
          module?.code || '',
          module?.title || '',
          section.code || '',
          room.name || '',
          room.building || '',
          instructor ? `${instructor.first_name} ${instructor.last_name}` : 'TBD',
          room.campus || '',
        ]);
      }

      const csvContent = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
      const fileName = `timetable-${type}-v${version.version_number}-${semester.name.replace(/\s+/g, '-')}.${format === 'excel' ? 'xls' : 'csv'}`;
      const mimeType = format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv';

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': mimeType,
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      });
    }

    const pdfBuffer = await renderToBuffer(
      React.createElement(TimetablePDF, {
        version,
        semester,
        assignments: mappedAssignments,
        exportType: type,
      }) as any
    );

    const fileName = `timetable-${type}-v${version.version_number}-${semester.name.replace(/\s+/g, '-')}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer as Buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (e: any) {
    console.error('Export error:', e);
    return NextResponse.json({ error: e.message || 'Export failed' }, { status: 500 });
  }
}
