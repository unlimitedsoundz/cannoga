'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export async function registerForCourse(studentId: string, course: any, term: string) {
    const supabase = createServiceRoleClient();

    if (!studentId || !course?.id) {
        return { success: false, error: 'Missing student or course information.' };
    }

    const { data: existing } = await supabase
        .from('module_enrollments')
        .select('id')
        .eq('student_id', studentId)
        .eq('module_id', course.id)
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

    let moduleId = course.id;

    const { data: existingModule } = await supabase
        .from('modules')
        .select('id')
        .eq('code', course.code)
        .maybeSingle();

    if (existingModule) {
        moduleId = existingModule.id;
    } else {
        const { data: newModule, error: moduleError } = await supabase
            .from('modules')
            .insert({
                code: course.code || `MOD-${Date.now()}`,
                title: course.title || 'Untitled Course',
                description: course.description || '',
                credits: course.credits || 3,
                capacity: course.capacity || 30,
            })
            .select('id')
            .single();

        if (moduleError || !newModule?.id) {
            console.error('Module creation error:', moduleError);
            return { success: false, error: `Failed to create course module: ${moduleError?.message || 'Unknown error'}` };
        }

        moduleId = newModule.id;
    }

    const { error } = await supabase
        .from('module_enrollments')
        .insert({
            student_id: studentId,
            module_id: moduleId,
            semester_id: semester.id,
            status: 'REGISTERED',
            grade_status: 'PROVISIONAL',
        });

    if (error) {
        console.error('Enrollment error:', error);
        return { success: false, error: `Failed to register: ${error.message}` };
    }

    return { success: true };
}
