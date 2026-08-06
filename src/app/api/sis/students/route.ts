import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = createServiceRoleClient();
  
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const program = searchParams.get('program') || '';

  try {
    const { data: students, error } = await supabase
      .from('students')
      .select(`
        id,
        student_id,
        enrollment_status,
        start_date,
        user_id,
        program_id,
        profiles(first_name, last_name, email),
        course:Course(title)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedStudents = students.map(s => ({
      id: s.id,
      student_id: s.student_id,
      first_name: s.profiles?.[0]?.first_name || '',
      last_name: s.profiles?.[0]?.last_name || '',
      email: s.profiles?.[0]?.email || '',
      enrollment_status: s.enrollment_status || 'ACTIVE',
      start_date: s.start_date,
      program_name: s.course?.[0]?.title || s.program_id || '',
      status: s.enrollment_status,
    }));

    return NextResponse.json({ students: formattedStudents });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ students: [], error: 'Failed to fetch students' }, { status: 500 });
  }
}