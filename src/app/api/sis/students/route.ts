import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = createServiceRoleClient();

  try {
    // 1. Fetch raw students table entries
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    // 2. Fetch profiles table entries
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role');

    // 3. Fetch applications table entries
    const { data: applications } = await supabase
      .from('applications')
      .select('id, student_id, user_id, first_name, last_name, email');

    const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));
    const appMapByUser = new Map((applications || []).filter((a: any) => a.user_id).map((a: any) => [a.user_id, a]));
    const appMapByStudent = new Map((applications || []).filter((a: any) => a.student_id).map((a: any) => [a.student_id, a]));

    // Determine target list: use students table if available, else non-ADMIN profiles
    let sourceList: any[] = students || [];
    if (sourceList.length === 0 && profiles && profiles.length > 0) {
      sourceList = profiles.filter((p: any) => p.role !== 'ADMIN');
    }

    const formattedStudents = sourceList.map((s: any) => {
      const prof = profileMap.get(s.user_id || s.id);
      const app = appMapByUser.get(s.user_id || s.id) || appMapByStudent.get(s.id) || appMapByStudent.get(s.student_id);

      let firstName = s.first_name || prof?.first_name || app?.first_name || '';
      let lastName = s.last_name || prof?.last_name || app?.last_name || '';
      let email = s.email || prof?.email || app?.email || '';

      if (!firstName && !lastName && email) {
        const username = email.split('@')[0].replace(/[._-]/g, ' ');
        const parts = username.split(' ');
        firstName = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : '';
        lastName = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
      }

      if (!firstName && !lastName) {
        firstName = 'Student';
        lastName = s.student_id ? `#${s.student_id}` : (s.id ? `#${s.id.substring(0, 6)}` : '');
      }

      return {
        id: s.id,
        student_id: s.student_id || s.id,
        first_name: firstName,
        last_name: lastName,
        email: email,
        enrollment_status: s.enrollment_status || 'ACTIVE',
        start_date: s.start_date,
      };
    });

    return NextResponse.json({ students: formattedStudents });
  } catch (error: any) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ students: [], error: error.message }, { status: 500 });
  }
}