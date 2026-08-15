import { createClient } from '@supabase/supabase-js';

/**
 * Server-side admin Supabase client using the Service Role key.
 * Bypasses RLS call only from Server Actions or Route Handlers.
 * NEVER import this into client components.
 */
export function createAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error(
            'Missing Supabase configuration: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set.'
        );
    }

    return createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
