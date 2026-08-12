// This file no longer uses 'use server' to allow static export compatibility.
// Logic relies on client-side Supabase client.

import { createAdminClient } from '@/utils/supabase/admin';

export async function togglePortalAccess(userId: string, disabled: boolean) {
    console.log('SERVER ACTION: togglePortalAccess called for', userId, 'disabled:', disabled);
    const adminClient = createAdminClient();
    try {
        const { error } = await adminClient
            .from('profiles')
            .update({ portal_access_disabled: disabled })
            .eq('id', userId);
        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error('togglePortalAccess Error:', e);
        return { success: false, error: e.message };
    }
}
