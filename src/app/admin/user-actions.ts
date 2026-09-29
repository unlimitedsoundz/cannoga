// This file no longer uses 'use server' to allow static export compatibility.
// Logic relies on client-side Supabase client.

import { createAdminClient } from '@/utils/supabase/admin';

export async function togglePortalAccess(userId: string, disabled: boolean) {
    return toggleStudentPortalAccess(userId, disabled);
}

export async function toggleStudentPortalAccess(studentIdOrUserId: string, disabled: boolean) {
    console.log('toggleStudentPortalAccess called for', studentIdOrUserId, 'disabled:', disabled);
    const adminClient = createAdminClient();
    try {
        // Resolve student and profile records
        const { data: student } = await adminClient
            .from('students')
            .select('id, user_id, student_id, portal_access_disabled, sis_access_disabled')
            .or(`id.eq.${studentIdOrUserId},student_id.eq.${studentIdOrUserId},user_id.eq.${studentIdOrUserId}`)
            .maybeSingle();

        const userId = student?.user_id || studentIdOrUserId;

        const { data: profile } = await adminClient
            .from('profiles')
            .select('id, student_id, portal_access_disabled, sis_access_disabled')
            .or(`id.eq.${userId},student_id.eq.${studentIdOrUserId}`)
            .maybeSingle();

        const resolvedUserId = profile?.id || student?.user_id;

        // 1. Update profiles table
        if (resolvedUserId) {
            const { error: profErr } = await adminClient
                .from('profiles')
                .update({ portal_access_disabled: disabled })
                .eq('id', resolvedUserId);
            if (profErr) throw profErr;
        }

        // 2. Update students table
        if (student?.id) {
            await adminClient
                .from('students')
                .update({ portal_access_disabled: disabled })
                .eq('id', student.id);
        } else if (resolvedUserId) {
            await adminClient
                .from('students')
                .update({ portal_access_disabled: disabled })
                .eq('user_id', resolvedUserId);
        }

        // 3. Auth ban check: only ban if BOTH portal and SIS access are disabled
        const sisDisabled = student?.sis_access_disabled ?? profile?.sis_access_disabled ?? false;
        if (resolvedUserId) {
            try {
                if (disabled && sisDisabled) {
                    await adminClient.auth.admin.updateUserById(resolvedUserId, { ban_duration: '876600h' });
                } else {
                    await adminClient.auth.admin.updateUserById(resolvedUserId, { ban_duration: 'none' });
                }
            } catch (authErr) {
                console.error('toggleStudentPortalAccess Auth ban/unban error:', authErr);
            }
        }

        // 4. Audit Log
        try {
            await adminClient.from('audit_logs').insert({
                action: disabled ? 'DISABLE_STUDENT_PORTAL_ACCESS' : 'ENABLE_STUDENT_PORTAL_ACCESS',
                entity_table: 'students',
                entity_id: student?.id || studentIdOrUserId,
                metadata: {
                    student_id: student?.student_id || profile?.student_id,
                    user_id: resolvedUserId,
                    portal_access_disabled: disabled,
                    sis_access_disabled: sisDisabled,
                }
            });
        } catch (auditErr) {
            console.warn('Audit log error:', auditErr);
        }

        return { success: true };
    } catch (e: any) {
        console.error('toggleStudentPortalAccess Error:', e);
        return { success: false, error: e.message };
    }
}

export async function toggleStudentSISAccess(studentIdOrUserId: string, disabled: boolean) {
    console.log('toggleStudentSISAccess called for', studentIdOrUserId, 'disabled:', disabled);
    const adminClient = createAdminClient();
    try {
        // Resolve student and profile records
        const { data: student } = await adminClient
            .from('students')
            .select('id, user_id, student_id, portal_access_disabled, sis_access_disabled')
            .or(`id.eq.${studentIdOrUserId},student_id.eq.${studentIdOrUserId},user_id.eq.${studentIdOrUserId}`)
            .maybeSingle();

        const userId = student?.user_id || studentIdOrUserId;

        const { data: profile } = await adminClient
            .from('profiles')
            .select('id, student_id, portal_access_disabled, sis_access_disabled')
            .or(`id.eq.${userId},student_id.eq.${studentIdOrUserId}`)
            .maybeSingle();

        const resolvedUserId = profile?.id || student?.user_id;

        // 1. Update profiles table
        if (resolvedUserId) {
            const { error: profErr } = await adminClient
                .from('profiles')
                .update({ sis_access_disabled: disabled })
                .eq('id', resolvedUserId);
            if (profErr) throw profErr;
        }

        // 2. Update students table
        if (student?.id) {
            await adminClient
                .from('students')
                .update({ sis_access_disabled: disabled })
                .eq('id', student.id);
        } else if (resolvedUserId) {
            await adminClient
                .from('students')
                .update({ sis_access_disabled: disabled })
                .eq('user_id', resolvedUserId);
        }

        // 3. Auth ban check: only ban if BOTH portal and SIS access are disabled
        const portalDisabled = student?.portal_access_disabled ?? profile?.portal_access_disabled ?? false;
        if (resolvedUserId) {
            try {
                if (disabled && portalDisabled) {
                    await adminClient.auth.admin.updateUserById(resolvedUserId, { ban_duration: '876600h' });
                } else {
                    await adminClient.auth.admin.updateUserById(resolvedUserId, { ban_duration: 'none' });
                }
            } catch (authErr) {
                console.error('toggleStudentSISAccess Auth ban/unban error:', authErr);
            }
        }

        // 4. Audit Log
        try {
            await adminClient.from('audit_logs').insert({
                action: disabled ? 'DISABLE_STUDENT_SIS_ACCESS' : 'ENABLE_STUDENT_SIS_ACCESS',
                entity_table: 'students',
                entity_id: student?.id || studentIdOrUserId,
                metadata: {
                    student_id: student?.student_id || profile?.student_id,
                    user_id: resolvedUserId,
                    sis_access_disabled: disabled,
                    portal_access_disabled: portalDisabled,
                }
            });
        } catch (auditErr) {
            console.warn('Audit log error:', auditErr);
        }

        return { success: true };
    } catch (e: any) {
        console.error('toggleStudentSISAccess Error:', e);
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

