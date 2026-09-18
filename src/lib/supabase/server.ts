import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll().map((cookie) => {
                        let value = cookie.value;
                        if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
                            value = value.slice(1, -1);
                        }
                        return { name: cookie.name, value };
                    });
                },

                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch (error) {
                        console.error('Supabase cookie write failed:', error);
                    }
                },
            },
        }
    );
}

export { createClient as createServerClient };
