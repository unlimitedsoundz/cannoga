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

        try {
            if (disabled) {
                await adminClient.auth.admin.updateUserById(userId, { ban_duration: '876600h' });
            } else {
                await adminClient.auth.admin.updateUserById(userId, { ban_duration: 'none' });
            }
        } catch (authErr) {
            console.error('togglePortalAccess Auth ban/unban error:', authErr);
        }

        return { success: true };
    } catch (e: any) {
        console.error('togglePortalAccess Error:', e);
        return { success: false, error: e.message };
    }
}

export async function toggleAncillaryFees(studentIdOrUserId: string, disableAncillary: boolean) {
    console.log('toggleAncillaryFees called for', studentIdOrUserId, 'disableAncillary:', disableAncillary);
    const adminClient = createAdminClient();
    try {
        const { data: profile } = await adminClient
            .from('profiles')
            .select('id')
            .or(`id.eq.${studentIdOrUserId},student_id.eq.${studentIdOrUserId}`)
            .maybeSingle();

        const userId = profile?.id || studentIdOrUserId;

        const { data: apps } = await adminClient
            .from('applications')
            .select('id')
            .eq('user_id', userId);

        if (!apps || apps.length === 0) {
            return { success: false, error: 'No application found for student' };
        }

        const appIds = apps.map(a => a.id);

        const { error } = await adminClient
            .from('admission_offers')
            .update({ ancillary_charged: disableAncillary })
            .in('application_id', appIds);

        if (error) throw error;

        return { success: true };
    } catch (e: any) {
        console.error('toggleAncillaryFees Error:', e);
        return { success: false, error: e.message };
    }
}

