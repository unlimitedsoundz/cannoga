'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';

export async function exportTimetablePDF(versionId: string, type: 'master' | 'student' | 'faculty' | 'room') {
  const adminClient = createServiceRoleClient();

  try {
    const { data: version, error: versionError } = await adminClient
      .from('timetable_versions')
      .select(`
        *,
        semester:semesters(id, name, start_date, end_date)
      `)
      .eq('id', versionId)
      .single();

    if (versionError || !version) throw new Error('Version not found');

    const { data: assignments, error: assignmentsError } = await adminClient
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

    if (assignmentsError) throw assignmentsError;

    const mappedAssignments = (assignments || []).map((a: any) => ({
      ...a,
      section: Array.isArray(a.section) ? a.section[0] : a.section,
      room: Array.isArray(a.room) ? a.room[0] : a.room,
    }));

    const semester = Array.isArray(version.semester) ? version.semester[0] : version.semester;

    const pdfBuffer = await renderToBuffer(
      React.createElement(TimetablePDF, {
        version,
        semester,
        assignments: mappedAssignments,
        exportType: type,
      }) as any
    );

    return { success: true, data: pdfBuffer };
  } catch (e: any) {
    console.error('exportTimetablePDF Error:', e);
    return { success: false, error: e.message };
  }
}

export async function exportTimetableCSV(versionId: string, type: 'master' | 'student' | 'faculty' | 'room') {
  const adminClient = createServiceRoleClient();

  try {
    const { data: version, error: versionError } = await adminClient
      .from('timetable_versions')
      .select(`
        *,
        semester:semesters(id, name, start_date, end_date)
      `)
      .eq('id', versionId)
      .single();

    if (versionError || !version) throw new Error('Version not found');

    const { data: assignments, error: assignmentsError } = await adminClient
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

    if (assignmentsError) throw assignmentsError;

    const mappedAssignments = (assignments || []).map((a: any) => ({
      ...a,
      section: Array.isArray(a.section) ? a.section[0] : a.section,
      room: Array.isArray(a.room) ? a.room[0] : a.room,
    }));

    const semester = Array.isArray(version.semester) ? version.semester[0] : version.semester;

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
        instructor ? `${instructor.name}` : 'TBD',
        room.campus || '',
      ]);
    }

    const csvContent = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const fileName = `timetable-${type}-v${version.version_number}-${semester.name.replace(/\s+/g, '-')}.csv`;

    return { success: true, data: csvContent, fileName };
  } catch (e: any) {
    console.error('exportTimetableCSV Error:', e);
    return { success: false, error: e.message };
  }
}

export async function exportTimetableExcel(versionId: string, type: 'master' | 'student' | 'faculty' | 'room') {
  const adminClient = createServiceRoleClient();

  try {
    const { data: version, error: versionError } = await adminClient
      .from('timetable_versions')
      .select(`
        *,
        semester:semesters(id, name, start_date, end_date)
      `)
      .eq('id', versionId)
      .single();

    if (versionError || !version) throw new Error('Version not found');

    const { data: assignments, error: assignmentsError } = await adminClient
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

    if (assignmentsError) throw assignmentsError;

    const mappedAssignments = (assignments || []).map((a: any) => ({
      ...a,
      section: Array.isArray(a.section) ? a.section[0] : a.section,
      room: Array.isArray(a.room) ? a.room[0] : a.room,
    }));

    const semester = Array.isArray(version.semester) ? version.semester[0] : version.semester;

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
        instructor ? `${instructor.name}` : 'TBD',
        room.campus || '',
      ]);
    }

    const csvContent = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const fileName = `timetable-${type}-v${version.version_number}-${semester.name.replace(/\s+/g, '-')}.xls`;

    return { success: true, data: csvContent, fileName };
  } catch (e: any) {
    console.error('exportTimetableExcel Error:', e);
    return { success: false, error: e.message };
  }
}

const TimetablePDF = ({ version, semester, assignments, exportType }: any) => {
  const styles = {
    page: {
      flexDirection: 'column' as const,
      backgroundColor: '#ffffff',
      padding: 40,
      fontFamily: 'Helvetica',
      fontSize: 10,
      lineHeight: 1.5,
    },
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: 20,
      borderBottomWidth: 2,
      borderBottomColor: '#1a1a1a',
      paddingBottom: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold' as const,
      color: '#1a1a1a',
      textTransform: 'uppercase' as const,
    },
    subtitle: {
      fontSize: 10,
      color: '#666666',
    },
    table: {
      display: 'table' as const,
      width: '100%',
      borderCollapse: 'collapse' as const,
      marginBottom: 20,
    },
    tableRow: {
      flexDirection: 'row' as const,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    tableHeader: {
      backgroundColor: '#f5f5f5',
      fontWeight: 'bold' as const,
      fontSize: 9,
      textTransform: 'uppercase' as const,
      color: '#666666',
    },
    tableCell: {
      padding: 6,
      fontSize: 9,
      color: '#1a1a1a',
    },
    footer: {
      position: 'absolute' as const,
      bottom: 30,
      left: 40,
      right: 40,
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      fontSize: 8,
      color: '#999999',
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
      paddingTop: 5,
    },
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const columns = ['Day', 'Time', 'Module', 'Section', 'Room', 'Building', 'Instructor', 'Campus'];

  return React.createElement(
    'Document',
    null,
    React.createElement(
      'Page',
      { size: 'A4', style: styles.page },
      React.createElement(
        'View',
        { style: styles.header },
        React.createElement('Text', { style: styles.title }, `Cannoga College - Timetable`),
        React.createElement('Text', { style: styles.subtitle }, `${semester.name} | Version ${version.version_number} | ${exportType.toUpperCase()}`)
      ),
      React.createElement(
        'View',
        { style: styles.table },
        React.createElement(
          'View',
          { style: { ...styles.tableRow, ...styles.tableHeader } },
          ...columns.map(col =>
            React.createElement('Text', { key: col, style: { flex: 1, padding: 6, fontSize: 9, fontWeight: 'bold', color: '#666666', textTransform: 'uppercase' } }, col)
          )
        ),
        ...assignments.map((a: any, idx: number) => {
          const section = a.section || {};
          const module = Array.isArray(section.module) ? section.module[0] : section.module;
          const instructor = Array.isArray(section.instructor) ? section.instructor[0] : section.instructor;
          const room = a.room || {};
          return React.createElement(
            'View',
            { key: idx, style: { ...styles.tableRow, backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa' } },
            ...[
              days[a.day_of_week] || String(a.day_of_week),
              `${a.start_time} - ${a.end_time}`,
              module?.title || module?.code || '—',
              section.code || '—',
              room.name || '—',
              room.building || '—',
              instructor ? `${instructor.name}` : 'TBD',
              room.campus || '—',
            ].map((cell, cellIdx) =>
              React.createElement('Text', { key: cellIdx, style: { flex: 1, padding: 6, fontSize: 9, color: '#1a1a1a' } }, cell)
            )
          );
        })
      ),
      React.createElement(
        'View',
        { style: styles.footer },
        React.createElement('Text', null, `Generated on ${new Date().toLocaleDateString('en-CA')}`),
        React.createElement('Text', null, `Cannoga College Timetable Export | ${exportType.toUpperCase()}`)
      )
    )
  );
};
