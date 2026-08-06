import { createBrowserClient } from '@supabase/ssr';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error('Supabase environment variables are missing!');
}

export function createClient() {
    if (!url || !key) {
        throw new Error('Missing Supabase configuration');
    }
    return createBrowserClient(url, key);
}

export { createBrowserClient } from '@supabase/ssr';