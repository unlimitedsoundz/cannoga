import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = createServiceRoleClient();

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
        user:profiles(first_name, last_name, email),
        profiles(first_name, last_name, email),
        application:applications(first_name, last_name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Additional lookup from profiles table by user_id if needed
    const userIds = (students || []).map((s: any) => s.user_id).filter(Boolean);
    let profileMap = new Map<string, { first_name?: string; last_name?: string; email?: string }>();

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', userIds);

      if (profiles) {
        profiles.forEach((p: any) => {
          profileMap.set(p.id, p);
        });
      }
    }

    const formattedStudents = (students || []).map((s: any) => {
      const directProfile = profileMap.get(s.user_id);
      const userObj = s.user || (Array.isArray(s.profiles) ? s.profiles[0] : s.profiles) || s.application || directProfile || {};

      let firstName = directProfile?.first_name || userObj?.first_name || s.first_name || '';
      let lastName = directProfile?.last_name || userObj?.last_name || s.last_name || '';
      let email = directProfile?.email || userObj?.email || s.email || '';

      // If name is still missing, fallback to parsing email username or student ID
      if (!firstName && !lastName && email) {
        const username = email.split('@')[0].replace(/[._-]/g, ' ');
        const parts = username.split(' ');
        firstName = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : '';
        lastName = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : '';
      }

      if (!firstName && !lastName) {
        firstName = `Student`;
        lastName = s.student_id ? `#${s.student_id}` : s.id.substring(0, 6);
      }

      return {
        id: s.id,
        student_id: s.student_id,
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
    return NextResponse.json({ students: [], error: 'Failed to fetch students' }, { status: 500 });
  }
}