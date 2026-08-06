/**
 * Utility for invoking Supabase Edge Functions with direct fetch.
 * This provides better resilience and transparency than the standard SDK invoke
 * in certain client environments (e.g. static exports, React 19).
 */

export interface InvokeOptions {
    method?: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
}

export async function invokeEdgeFunction<T = any>(
    functionName: string,
    options: InvokeOptions = {}
): Promise<{ data: T | null; error: Error | null }> {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Supabase configuration missing');
        }

        const url = `${supabaseUrl}/functions/v1/${functionName}`;
        const method = options.method || 'POST';

        // Get the session to pass the authorization header if available
        // Since we are in a static export/browser context, we might need to get it from local storage
        // or just use the SDK to get the current session.
        let authHeader = `Bearer ${supabaseAnonKey}`;

        try {
            // Lazy load to avoid circular dependencies or server-side issues
            const { createClient } = await import('./client');
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
                authHeader = `Bearer ${session.access_token}`;
            }
        } catch (e) {
            console.warn('Failed to retrieve session for edge function call, using anon key:', e);
        }

        console.log(`[Edge Function] Invoking ${functionName}...`, { url, method });

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
                'apikey': supabaseAnonKey,
                ...options.headers,
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { message: errorText };
            }

            console.error(`[Edge Function] ${functionName} failed:`, errorData);
            return {
                data: null,
                error: new Error(errorData.error || errorData.message || `HTTP ${response.status}`)
            };
        }

        const data = await response.json();
        console.log(`[Edge Function] ${functionName} success:`, data);
        return { data, error: null };

    } catch (error: any) {
        console.error(`[Edge Function] Unexpected error invoking ${functionName}:`, error);
        return { data: null, error };
    }
}
