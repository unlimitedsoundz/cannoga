import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/sis';

    if (code) {
        const cookieStore = await cookies();
        let response = NextResponse.redirect(`${origin}${next}`);

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) => {
                                cookieStore.set(name, value, options);
                                response.cookies.set(name, value, options);
                            });
                        } catch (err) {
                            // Cookie setting fallback
                        }
                    },
                },
            }
        );

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data?.session?.user) {
            const userEmail = data.session.user.email?.toLowerCase() || '';
            const destination = userEmail.endsWith('@cannogacollege.ca') ? '/sis' : next;
            
            const forwardedHost = request.headers.get('x-forwarded-host');
            const isLocalEnv = origin.includes('localhost');
            const redirectBase = isLocalEnv ? origin : (forwardedHost ? `https://${forwardedHost}` : origin);

            response = NextResponse.redirect(`${redirectBase}${destination}`);
            
            // Re-apply any session cookies onto final redirect response
            const allCookies = cookieStore.getAll();
            allCookies.forEach(c => {
                if (c.name.startsWith('sb-')) {
                    response.cookies.set(c.name, c.value, { path: '/' });
                }
            });

            return response;
        }

        console.error('[Auth Callback] Code exchange error:', error);
        return NextResponse.redirect(`${origin}/portal/account/login?error=${encodeURIComponent(error?.message || 'Authentication exchange failed')}`);
    }

    // Check for provider error in search parameters
    const errorParam = searchParams.get('error_description') || searchParams.get('error');
    if (errorParam) {
        return NextResponse.redirect(`${origin}/portal/account/login?error=${encodeURIComponent(errorParam)}`);
    }

    return NextResponse.redirect(`${origin}/portal/account/login?error=no_code_provided`);
}
