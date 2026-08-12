
import { createClient } from '@/utils/supabase/client';

/**
 * Register a student for a specific curriculum subject via Edge Function
 */
export async function registerForModule(moduleId: string) {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.functions.invoke('handle-portal-registration', {
            body: { action: 'REGISTER_MODULE', payload: { moduleId } }
        });

        if (error) throw error;
        if (!data?.success) throw new Error(data?.error || 'Registration failed');

        return { success: true };
    } catch (error: any) {
        console.error('Registration Error:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Drop a module via Edge Function
 */
export async function dropModule(enrollmentId: string) {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.functions.invoke('handle-portal-registration', {
            body: { action: 'DROP_MODULE', payload: { enrollmentId } }
        });

        if (error) throw error;
        if (!data?.success) throw new Error(data?.error || 'Drop failed');

        return { success: true };
    } catch (error: any) {
        console.error('Drop Error:', error.message);
        return { success: false, error: error.message };
    }
}
