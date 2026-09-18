import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/sis';
    const errorParam = searchParams.get('error_description') || searchParams.get('error');

    if (errorParam) {
        console.error('[Auth Callback] Provider error:', errorParam);
        return NextResponse.redirect(`${origin}/portal/account/login/?error=${encodeURIComponent(errorParam)}`);
    }

    if (!code) {
        return NextResponse.redirect(`${origin}/portal/account/login/?error=no_code_provided`);
    }

    try {
        const cookieStore = await cookies();
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
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // Ignored if called in read-only context
                        }
                    },
                },
            }
        );

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error || !data?.session?.user) {
            console.error('[Auth Callback] Code exchange error:', error);
            return NextResponse.redirect(`${origin}/portal/account/login/?error=${encodeURIComponent(error?.message || 'Authentication exchange failed')}`);
        }

        const user = data.session.user;
        const userEmail = user.email?.toLowerCase().trim() || '';

        // Destination default
        let destination = userEmail.endsWith('@cannogacollege.ca') ? '/sis' : next;

        // Auto-link student record
        try {
            const adminClient = createServiceRoleClient();
            const { data: student } = await adminClient
                .from('students')
                .select('id, user_id, student_id')
                .or(`institutional_email.eq.${userEmail},personal_email.eq.${userEmail}`)
                .maybeSingle();

            if (student) {
                destination = '/sis';
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
        } catch (linkErr) {
            console.warn('[Auth Callback] Non-fatal student linking note:', linkErr);
        }

        const forwardedHost = request.headers.get('x-forwarded-host');
        const isLocalEnv = origin.includes('localhost');
        const redirectBase = isLocalEnv ? origin : (forwardedHost ? `https://${forwardedHost}` : origin);

        return NextResponse.redirect(`${redirectBase}${destination}`);

    } catch (err: any) {
        console.error('[Auth Callback] Exception:', err);
        return NextResponse.redirect(`${origin}/portal/account/login/?error=${encodeURIComponent(err?.message || 'Server error')}`);
    }
}
