import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

function getPublicOrigin(request: Request, requestUrl: URL): string {
    const forwardedHost = request.headers.get('x-forwarded-host');
    if (forwardedHost && !forwardedHost.includes('0.0.0.0') && !forwardedHost.includes('127.0.0.1')) {
        return `https://${forwardedHost.split(',')[0].trim()}`;
    }
    const host = request.headers.get('host');
    if (host && !host.includes('0.0.0.0') && !host.includes('127.0.0.1') && !host.includes('localhost')) {
        return `https://${host.split(':')[0].trim()}`;
    }
    if (requestUrl.origin && !requestUrl.origin.includes('0.0.0.0') && !requestUrl.origin.includes('127.0.0.1')) {
        return requestUrl.origin;
    }
    return 'https://cannogacollege.ca';
}

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);

    const code = requestUrl.searchParams.get('code');
    const flowId = requestUrl.searchParams.get('sb_flow_id');
    const next = requestUrl.searchParams.get('next') || '/sis';

    console.log('[MICROSOFT CALLBACK] START');
    console.log('[MICROSOFT CALLBACK] code:', !!code);
    console.log('[MICROSOFT CALLBACK] flowId:', flowId);

    const publicOrigin = getPublicOrigin(request, requestUrl);

    // Normalise target path
    let targetPath = next.startsWith('/') ? next : '/sis';
    if (!targetPath.endsWith('/')) targetPath = `${targetPath}/`;

    const redirectUrl = new URL(targetPath, publicOrigin);
    const errorUrl = (msg: string) =>
        new URL(`/portal/account/login/?error=${encodeURIComponent(msg)}`, publicOrigin);

    if (!code) {
        return NextResponse.redirect(errorUrl('no_code'));
    }

    try {
        console.log('[MICROSOFT CALLBACK] creating Supabase client');

        // Build the redirect response FIRST so we can attach cookies to it
        const response = NextResponse.redirect(redirectUrl);

        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    // Write cookies to BOTH the cookie store AND the redirect response
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                            response.cookies.set(name, value, options);
                        });
                    },
                },
            }
        );

        console.log('[MICROSOFT CALLBACK] Supabase client created');

        const result = await supabase.auth.exchangeCodeForSession(
            code,
            flowId ? { flowId } : undefined
        );

        console.log('[MICROSOFT CALLBACK] exchange completed');

        if (result.error) {
            console.error('[MICROSOFT CALLBACK] exchange error', {
                message: result.error.message,
                code: result.error.code,
                status: result.error.status,
            });
            return NextResponse.redirect(errorUrl(result.error.message));
        }

        console.log('[MICROSOFT CALLBACK] SUCCESS');
        console.log('[MICROSOFT CALLBACK] user:', result.data.user?.id);

        // Auto-link student profile for @cannogacollege.ca accounts
        try {
            const user = result.data.user;
            const userEmail = user?.email?.toLowerCase().trim() || '';
            if (user && userEmail) {
                const { createServiceRoleClient } = await import('@/utils/supabase/server-admin');
                const adminClient = createServiceRoleClient();
                const { data: student } = await adminClient
                    .from('students')
                    .select('id, user_id, student_id')
                    .or(`institutional_email.eq.${userEmail},personal_email.eq.${userEmail}`)
                    .maybeSingle();

                if (student) {
                    if (student.user_id !== user.id) {
                        await adminClient
                            .from('students')
                            .update({ user_id: user.id })
                            .eq('id', student.id);
                    }
                    await adminClient
                        .from('profiles')
                        .update({ role: 'STUDENT', student_id: student.student_id })
                        .eq('id', user.id);
                }
            }
        } catch (linkErr) {
            console.warn('[MICROSOFT CALLBACK] Non-fatal student linking note:', linkErr);
        }

        // Return the redirect response — session cookies are already attached
        return response;

    } catch (error) {
        console.error('[MICROSOFT CALLBACK] CRASH', error);
        const message = error instanceof Error ? error.message : 'Unknown callback error';
        return NextResponse.redirect(errorUrl(message));
    }
}
