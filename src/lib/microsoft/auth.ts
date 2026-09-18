// ==============================================================================
// Server-Side Microsoft Provider Token Handling
// Securely retrieves the delegated Microsoft access token from the active session.
// ==============================================================================

import { createServerClient } from '@/utils/supabase/server';

export interface MicrosoftSessionAuth {
    providerToken: string | null;
    userEmail: string | null;
    userId: string | null;
    error?: string;
}

/**
 * Retrieves the Microsoft Graph provider token securely from the authenticated Supabase session.
 * Never exposes this token to the browser.
 */
export async function getMicrosoftSessionAuth(): Promise<MicrosoftSessionAuth> {
    try {
        const supabase = await createServerClient();
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
            return {
                providerToken: null,
                userEmail: null,
                userId: null,
                error: 'Not authenticated with active session',
            };
        }

        const providerToken = session.provider_token || null;
        const userEmail = session.user?.email || null;
        const userId = session.user?.id || null;

        return {
            providerToken,
            userEmail,
            userId,
            error: providerToken ? undefined : 'No Microsoft provider token found in session. User may need to sign out and sign in again.',
        };
    } catch (err: any) {
        return {
            providerToken: null,
            userEmail: null,
            userId: null,
            error: err?.message || 'Failed to retrieve session auth',
        };
    }
}
