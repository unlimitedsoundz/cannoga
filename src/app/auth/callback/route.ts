import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const requestUrl = new URL(request.url);

        const code = requestUrl.searchParams.get('code');
        let next = requestUrl.searchParams.get('next') ?? '/sis';

        // Prevent external redirect injection
        if (!next.startsWith('/') || next.startsWith('//')) {
            next = '/sis';
        }

        // Resolve public origin (accounting for Hostinger reverse proxy 0.0.0.0:3000)
        const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
        const proto = request.headers.get('x-forwarded-proto') || 'https';
        const publicOrigin = host && !host.includes('0.0.0.0') ? `${proto}://${host}` : requestUrl.origin;

        if (!code) {
            console.error('[AUTH CALLBACK] Missing authorization code');
            return NextResponse.redirect(
                new URL('/portal/account/login/?error=missing_auth_code', publicOrigin)
            );
        }

        console.log('[AUTH CALLBACK] Authorization code received');

        const supabase = await createClient();

        console.log('[AUTH CALLBACK] Supabase server client created');

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error('[AUTH CALLBACK] exchangeCodeForSession failed:', {
                message: error.message,
                status: error.status,
                code: error.code,
            });

            return NextResponse.redirect(
                new URL(
                    `/portal/account/login/?error=${encodeURIComponent(error.message)}`,
                    publicOrigin
                )
            );
        }

        console.log(
            '[AUTH CALLBACK] Session created:',
            Boolean(data.session)
        );

        // Auto-link student profile if @cannogacollege.ca account
        try {
            const user = data?.session?.user;
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
            console.warn('[AUTH CALLBACK] Non-fatal student linking note:', linkErr);
        }

        return NextResponse.redirect(
            new URL(next, publicOrigin)
        );
    } catch (error: any) {
        console.error('[AUTH CALLBACK] Unhandled callback error:', error);

        const requestUrl = new URL(request.url);
        const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
        const proto = request.headers.get('x-forwarded-proto') || 'https';
        const publicOrigin = host && !host.includes('0.0.0.0') ? `${proto}://${host}` : requestUrl.origin;

        return NextResponse.redirect(
            new URL(
                `/portal/account/login/?error=${encodeURIComponent(error?.message || 'callback_server_error')}`,
                publicOrigin
            )
        );
    }
}
