'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export async function getSISTimetables(filters: { semesterId?: string; subjectId?: string; courseId?: string; instructorId?: string; type?: 'schedule' | 'session' } = {}) {
  const adminClient = createServiceRoleClient();

  try {
    let scheduleQuery = adminClient
      .from('class_schedules')
      .select(`
        *,
        subject:Subject(id, name, code, creditUnits),
        semester:semesters(id, name, start_date, end_date),
        course:Course(id, title, slug),
        instructor:profiles(id, first_name, last_name, email)
      `)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    let sessionQuery = adminClient
      .from('class_sessions')
      .select(`
        *,
        subject:Subject(id, name, code, creditUnits),
        semester:semesters(id, name, start_date, end_date),
        course:Course(id, title, slug),
        instructor:profiles(id, first_name, last_name, email),
        schedule:class_schedules(id, day_of_week, start_time, end_time, recurrence_pattern)
      `)
      .order('session_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (filters.semesterId) {
      scheduleQuery = scheduleQuery.eq('semester_id', filters.semesterId);
      sessionQuery = sessionQuery.eq('semester_id', filters.semesterId);
    }
    if (filters.subjectId) {
      scheduleQuery = scheduleQuery.eq('subject_id', filters.subjectId);
      sessionQuery = sessionQuery.eq('subject_id', filters.subjectId);
    }
    if (filters.courseId) {
      scheduleQuery = scheduleQuery.eq('course_id', filters.courseId);
      sessionQuery = sessionQuery.eq('course_id', filters.courseId);
    }
    if (filters.instructorId) {
      scheduleQuery = scheduleQuery.eq('instructor_id', filters.instructorId);
      sessionQuery = sessionQuery.eq('instructor_id', filters.instructorId);
    }

    const [schedules, sessions] = await Promise.all([
      filters.type !== 'session' ? scheduleQuery : Promise.resolve({ data: null as any, error: null }),
      filters.type !== 'schedule' ? sessionQuery : Promise.resolve({ data: null as any, error: null }),
    ]);

    if (schedules.error) throw schedules.error;
    if (sessions.error) throw sessions.error;

    return {
      success: true,
      data: {
        schedules: schedules.data || [],
        sessions: sessions.data || [],
      },
    };
  } catch (e: any) {
    console.error('getSISTimetables Error:', e);
    return { success: false, error: e.message };
  }
}

export async function saveTimetableSchedule(data: any, id?: string) {
  const adminClient = createServiceRoleClient();

  try {
    const payload = {
      subject_id: data.subject_id,
      semester_id: data.semester_id,
      course_id: data.course_id || null,
      instructor_id: data.instructor_id || null,
      day_of_week: data.day_of_week,
      start_time: data.start_time,
      end_time: data.end_time,
      room: data.room || null,
      building: data.building || null,
      session_type: data.session_type || 'Lecture',
      recurrence_pattern: data.recurrence_pattern || 'weekly',
      start_date: data.start_date || null,
      end_date: data.end_date || null,
      notes: data.notes || null,
      is_active: data.is_active ?? true,
    };

    let result;
    if (id) {
      result = await adminClient.from('class_schedules').update(payload).eq('id', id).select().single();
    } else {
      result = await adminClient.from('class_schedules').insert(payload).select().single();
    }

    if (result.error) throw result.error;

    return { success: true, data: result.data };
  } catch (e: any) {
    console.error('saveTimetableSchedule Error:', e);
    return { success: false, error: e.message };
  }
}

export async function deleteTimetableSchedule(id: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { error } = await adminClient.from('class_schedules').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    console.error('deleteTimetableSchedule Error:', e);
    return { success: false, error: e.message };
  }
}

export async function saveTimetableSession(data: any, id?: string) {
  const adminClient = createServiceRoleClient();

  try {
    const payload = {
      schedule_id: data.schedule_id || null,
      subject_id: data.subject_id,
      semester_id: data.semester_id,
      course_id: data.course_id || null,
      instructor_id: data.instructor_id || null,
      session_date: data.session_date,
      start_time: data.start_time,
      end_time: data.end_time,
      room: data.room || null,
      building: data.building || null,
      session_type: data.session_type || 'Lecture',
      status: data.status || 'scheduled',
      cancellation_reason: data.cancellation_reason || null,
      substitute_instructor_id: data.substitute_instructor_id || null,
      notes: data.notes || null,
    };

    let result;
    if (id) {
      result = await adminClient.from('class_sessions').update(payload).eq('id', id).select().single();
    } else {
      result = await adminClient.from('class_sessions').insert(payload).select().single();
    }

    if (result.error) throw result.error;

    return { success: true, data: result.data };
  } catch (e: any) {
    console.error('saveTimetableSession Error:', e);
    return { success: false, error: e.message };
  }
}

export async function deleteTimetableSession(id: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { error } = await adminClient.from('class_sessions').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    console.error('deleteTimetableSession Error:', e);
    return { success: false, error: e.message };
  }
}

export async function autoGenerateSessions(scheduleId: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { data: schedule, error: scheduleError } = await adminClient
      .from('class_schedules')
      .select('*')
      .eq('id', scheduleId)
      .single();

    if (scheduleError || !schedule) throw new Error('Schedule not found');

    const { data: semester, error: semesterError } = await adminClient
      .from('semesters')
      .select('start_date, end_date')
      .eq('id', schedule.semester_id)
      .single();

    if (semesterError || !semester) throw new Error('Semester not found');

    const startDate = new Date(schedule.start_date || semester.start_date);
    const endDate = new Date(schedule.end_date || semester.end_date);
    const sessionsToInsert: any[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (currentDate.getDay() === schedule.day_of_week) {
        const dateStr = currentDate.toISOString().split('T')[0];
        sessionsToInsert.push({
          schedule_id: schedule.id,
          subject_id: schedule.subject_id,
          semester_id: schedule.semester_id,
          course_id: schedule.course_id,
          instructor_id: schedule.instructor_id,
          session_date: dateStr,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          room: schedule.room,
          building: schedule.building,
          session_type: schedule.session_type,
          status: 'scheduled',
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (sessionsToInsert.length > 0) {
      const { error: insertError } = await adminClient.from('class_sessions').insert(sessionsToInsert);
      if (insertError) throw insertError;
    }

    return { success: true, count: sessionsToInsert.length };
  } catch (e: any) {
    console.error('autoGenerateSessions Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getTimetableLookups() {
  const adminClient = createServiceRoleClient();

  try {
    const [subjects, courses, semesters, instructors] = await Promise.all([
      adminClient.from('Subject').select('id, name, code, courseId').order('name'),
      adminClient.from('Course').select('id, title, slug').order('title'),
      adminClient.from('semesters').select('id, name, start_date, end_date, status').order('start_date', { ascending: false }),
      adminClient.from('profiles').select('id, first_name, last_name, email').in('role', ['ADMIN', 'ADMISSIONS', 'FACULTY']).order('first_name'),
    ]);

    if (subjects.error) throw subjects.error;
    if (courses.error) throw courses.error;
    if (semesters.error) throw semesters.error;
    if (instructors.error) throw instructors.error;

    return {
      success: true,
      data: {
        subjects: subjects.data || [],
        courses: courses.data || [],
        semesters: semesters.data || [],
        instructors: instructors.data || [],
      },
    };
  } catch (e: any) {
    console.error('getTimetableLookups Error:', e);
    return { success: false, error: e.message };
  }
}
