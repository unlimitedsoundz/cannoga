import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export async function GET(request: NextRequest) {
    const origin = request.nextUrl.origin;

    try {
        const searchParams = request.nextUrl.searchParams;
        const code = searchParams.get('code');
        const next = searchParams.get('next') ?? '/sis';
        const errorParam = searchParams.get('error_description') || searchParams.get('error');

        if (errorParam) {
            console.error('[Auth Callback] Provider error:', errorParam);
            return NextResponse.redirect(`${origin}/portal/account/login?error=${encodeURIComponent(errorParam)}`);
        }

        if (!code) {
            return NextResponse.redirect(`${origin}/portal/account/login?error=no_code_provided`);
        }

        let supabaseResponse = NextResponse.next({ request });

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
                        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error || !data?.session?.user) {
            console.error('[Auth Callback] Code exchange error:', error);
            return NextResponse.redirect(`${origin}/portal/account/login?error=${encodeURIComponent(error?.message || 'Authentication exchange failed')}`);
        }

        const user = data.session.user;
        const userEmail = user.email?.toLowerCase().trim() || '';

        // Determine destination based on user role & email
        let destination = next;
        if (userEmail.endsWith('@cannogacollege.ca')) {
            destination = '/sis';
        }

        // Link student profile if institutional email matches
        try {
            const adminClient = createServiceRoleClient();

            // Check if this email belongs to an enrolled student
            const { data: student } = await adminClient
                .from('students')
                .select('id, user_id, student_id')
                .or(`institutional_email.eq.${userEmail},personal_email.eq.${userEmail}`)
                .maybeSingle();

            if (student) {
                destination = '/sis';
                // Link student record to current auth user if not already linked
                if (student.user_id !== user.id) {
                    await adminClient
                        .from('students')
                        .update({ user_id: user.id })
                        .eq('id', student.id);
                }
                // Ensure profile is marked as STUDENT
                await adminClient
                    .from('profiles')
                    .update({ role: 'STUDENT', student_id: student.student_id })
                    .eq('id', user.id);
            }
        } catch (dbErr) {
            console.warn('[Auth Callback] Non-fatal student linking error:', dbErr);
        }

        const forwardedHost = request.headers.get('x-forwarded-host');
        const isLocalEnv = origin.includes('localhost');
        const redirectBase = isLocalEnv ? origin : (forwardedHost ? `https://${forwardedHost}` : origin);

        const finalRedirect = NextResponse.redirect(`${redirectBase}${destination}`);

        // Copy all auth cookies to the final redirect response
        supabaseResponse.cookies.getAll().forEach((cookie) => {
            finalRedirect.cookies.set(cookie);
        });

        return finalRedirect;

    } catch (err: any) {
        console.error('[Auth Callback] Unhandled exception:', err);
        return NextResponse.redirect(`${origin}/portal/account/login?error=${encodeURIComponent(err?.message || 'Server authentication error')}`);
    }
}
