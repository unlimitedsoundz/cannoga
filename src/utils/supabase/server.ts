import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a cookie-aware Supabase client for use in Server Components,
 * Server Actions, and Route Handlers. Respects the authenticated user's
 * session via HTTP cookies.
 */
export async function createServerClient() {
    const cookieStore = await cookies();

    return createSupabaseServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method is called from a Server Component.
                        // Ignored if cookies cannot be set (read-only context).
                    }
                },
            },
        }
    );
}

/**
 * Creates a server-side Supabase client with service role privileges.
 * Bypasses RLS. Use only for admin operations in Server Actions.
 */
export { createServiceRoleClient } from './server-admin';
