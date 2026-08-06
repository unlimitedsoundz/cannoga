
import { createClient } from '@/utils/supabase/client';

export async function updateWindowStatus(windowId: string, status: 'OPEN' | 'CLOSED') {
    const supabase = createClient();
    const { data, error } = await supabase.functions.invoke('handle-registrar-actions', {
        body: { action: 'UPDATE_WINDOW_STATUS', payload: { id: windowId, status } }
    });
    if (error || !data?.success) throw new Error(error?.message || data?.error || 'Update failed');
    return { success: true };
}

export async function saveWindow(data: any, id?: string) {
    const supabase = createClient();
    const { data: result, error } = await supabase.functions.invoke('handle-registrar-actions', {
        body: { action: 'SAVE_WINDOW', payload: { id, data } }
    });
    if (error || !result?.success) throw new Error(error?.message || result?.error || 'Save failed');
    return { success: true };
}

export async function saveSemester(data: any, id?: string) {
    const supabase = createClient();
    const { data: result, error } = await supabase.functions.invoke('handle-registrar-actions', {
        body: { action: 'SAVE_SEMESTER', payload: { id, data } }
    });
    if (error || !result?.success) throw new Error(error?.message || result?.error || 'Save failed');
    return { success: true };
}

export async function updateSemesterStatus(semesterId: string, status: 'ACTIVE' | 'COMPLETED' | 'UPCOMING') {
    const supabase = createClient();
    const { data: result, error } = await supabase.functions.invoke('handle-registrar-actions', {
        body: { action: 'UPDATE_SEMESTER_STATUS', payload: { id: semesterId, status } }
    });
    if (error || !result?.success) throw new Error(error?.message || result?.error || 'Update failed');
    return { success: true };
}

export async function finalizeGrade(enrollmentId: string) {
    const supabase = createClient();
    const { data: result, error } = await supabase.functions.invoke('handle-registrar-actions', {
        body: { action: 'CANALIZE_GRADE', payload: { id: enrollmentId } }
    });
    if (error || !result?.success) throw new Error(error?.message || result?.error || 'Update failed');
    return { success: true };
}

export async function updateStudentStatusRegistrar(studentId: string, status: string) {
    const supabase = createClient();
    const { data: result, error } = await supabase.functions.invoke('handle-registrar-actions', {
        body: { action: 'UPDATE_STUDENT_STATUS', payload: { id: studentId, status } }
    });
    if (error || !result?.success) throw new Error(error?.message || result?.error || 'Update failed');
    return { success: true };
}

export async function saveSession(data: any, id?: string) {
    const supabase = createClient();
    const { data: result, error } = await supabase.functions.invoke('handle-registrar-actions', {
        body: { action: 'SAVE_SESSION', payload: { id, data } }
    });
    if (error || !result?.success) throw new Error(error?.message || result?.error || 'Save failed');
    return { success: true };
}

export async function deleteSession(id: string) {
    const supabase = createClient();
    const { data: result, error } = await supabase.functions.invoke('handle-registrar-actions', {
        body: { action: 'DELETE_ENTITY', payload: { table: 'class_sessions', id } }
    });
    if (error || !result?.success) throw new Error(error?.message || result?.error || 'Delete failed');
    return { success: true };
}

export async function deleteWindow(id: string) {
    const supabase = createClient();
    const { data: result, error } = await supabase.functions.invoke('handle-registrar-actions', {
        body: { action: 'DELETE_ENTITY', payload: { table: 'registration_windows', id } }
    });
    if (error || !result?.success) throw new Error(error?.message || result?.error || 'Delete failed');
    return { success: true };
}

export async function deleteSemester(id: string) {
    const supabase = createClient();
    const { data: result, error } = await supabase.functions.invoke('handle-registrar-actions', {
        body: { action: 'DELETE_ENTITY', payload: { table: 'semesters', id } }
    });
    if (error || !result?.success) throw new Error(error?.message || result?.error || 'Delete failed');
    return { success: true };
}
