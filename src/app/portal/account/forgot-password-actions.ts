'use server';

import { createServerClient } from '@/utils/supabase/server';

export async function requestPasswordReset(email: string) {
    const supabase = await createServerClient();
    const cleanEmail = email.toLowerCase().trim();

    try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const redirectTo = `${appUrl}/portal/account/reset-password`;

        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
            redirectTo,
        });

        if (error) {
            console.error('[AUTH] Password reset request error:', error);
            return { error: error.message };
        }

        return {
            success: true,
            message: 'Password reset instructions have been sent to your email address.'
        };
    } catch (e: any) {
        console.error('[AUTH] Password reset system error:', e);
        return { error: e?.message || 'Failed to process password reset request. Please try again.' };
    }
}

export async function updatePasswordWithToken(newPassword: string) {
    const supabase = await createServerClient();

    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            console.error('[AUTH] Password update error:', error);
            return { error: error.message };
        }

        return {
            success: true,
            message: 'Password updated successfully. You can now log in with your new password.'
        };
    } catch (e: any) {
        console.error('[AUTH] Password update system error:', e);
        return { error: e?.message || 'Failed to update password. Please try again.' };
    }
}
