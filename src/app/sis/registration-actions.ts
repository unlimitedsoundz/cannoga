'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export async function registerForCourse(studentId: string, courseId: string, term: string, semesterNumber: number) {
    const supabase = createServiceRoleClient();

    const { data: existing } = await supabase
        .from('module_enrollments')
        .select('id')
        .eq('student_id', studentId)
        .eq('module_id', courseId)
        .maybeSingle();

    if (existing) {
        return { success: false, error: 'You are already registered for this course.' };
    }

    const { data: semester } = await supabase
        .from('semesters')
        .select('id')
        .eq('name', term)
        .maybeSingle();

    if (!semester) {
        return { success: false, error: `No active semester found for "${term}". Please contact registrar.` };
    }

    const { error } = await supabase
        .from('module_enrollments')
        .insert({
            student_id: studentId,
            module_id: courseId,
            semester_id: semester.id,
            status: 'REGISTERED',
            grade_status: 'PROVISIONAL',
        });

    if (error) {
        console.error('Registration error:', error);
        return { success: false, error: error.message || 'Failed to register for course' };
    }

    return { success: true };
}
