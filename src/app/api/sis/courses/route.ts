import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const subject = searchParams.get('subject');
    const status = searchParams.get('status');
    const term = searchParams.get('term');
    const courseId = searchParams.get('courseId');

    const adminClient = createServiceRoleClient();

    let query = adminClient
      .from('Subject')
      .select(`
        id,
        code,
        name,
        creditUnits,
        semester,
        courseId,
        Course:courseId(
          id,
          title,
          slug,
          degreeLevel,
          duration,
          schoolId,
          School:schoolId(name, slug),
          Department:departmentId(name, slug)
        )
      `)
      .order('semester', { ascending: true });

    if (courseId) {
      query = query.eq('courseId', courseId);
    }

    const { data: subjects, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const cleanName = (raw: string | null | undefined): string => {
      if (!raw) return '';
      let str = String(raw);
      str = str.replace(/^(?:Advanced\s+)?\(\s*['"]([^'"]+)['"]\s*,\s*['"][^'"]*['"]\s*\)$/i, (m, p1) => raw.startsWith('Advanced') ? `Advanced ${p1}` : p1);
      str = str.replace(/\[object\s+[^\]]+\]/gi, '');
      str = str.replace(/\(\s*['"]([^'"]+)['"]\s*,\s*['"][^'"]*['"]\s*\)/gi, '$1');
      str = str.replace(/['"]\s*,\s*['"]previous['"]\s*\)/gi, '');
      str = str.replace(/\s+/g, ' ').trim();
      return str || 'General';
    };

    let courses = (subjects || []).map((subject: any) => {
      const course = subject.Course || {};
      const school = course.School || {};
      const department = course.Department || {};
      const cleanSubjectTitle = cleanName(subject.name);
      
      return {
        id: subject.id,
        code: subject.code || subject.id,
        title: cleanSubjectTitle || 'Untitled',
        subject: cleanSubjectTitle || 'General',
        credits: subject.creditUnits,
        term: term || 'Fall 2026',
        semester: subject.semester,
        instructor: 'TBD',
        schedule: 'TBD',
        location: 'TBD',
        capacity: 30,
        enrolled: Math.floor(Math.random() * 25),
        status: 'Open',
        waitlist: Math.floor(Math.random() * 5),
        courseId: subject.courseId,
        degreeLevel: course.degreeLevel,
        school: school.name,
        department: department.name,
        description: course.description,
      };
    });

    if (search) {
      const s = search.toLowerCase();
      courses = courses.filter(c =>
        c.code.toLowerCase().includes(s) ||
        c.title.toLowerCase().includes(s) ||
        c.subject.toLowerCase().includes(s)
      );
    }

    if (subject) {
      courses = courses.filter(c => c.subject === subject);
    }

    if (status) {
      courses = courses.filter(c => c.status === status);
    }

    const availableSubjects = Array.from(new Set(courses.map(c => c.subject))).sort();

    return NextResponse.json({
      courses,
      subjects: availableSubjects,
      total: courses.length
    });
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
