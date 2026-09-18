import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);

    const code = requestUrl.searchParams.get('code');
    const flowId = requestUrl.searchParams.get('sb_flow_id');

    let next = requestUrl.searchParams.get('next') ?? '/sis';

    if (!next.startsWith('/') || next.startsWith('//')) {
        next = '/sis';
    }

    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    const publicOrigin = host && !host.includes('0.0.0.0') ? `${proto}://${host}` : requestUrl.origin;

    if (!code) {
        console.error('[AUTH CALLBACK] Missing code');

        return NextResponse.redirect(
            new URL('/portal/account/login/?error=missing_code', publicOrigin)
        );
    }

    try {
        const supabase = await createClient();

        const { data, error } = await supabase.auth.exchangeCodeForSession(
            code,
            flowId ? { flowId } : undefined
        );

        if (error) {
            console.error('[AUTH CALLBACK] Exchange failed:', {
                message: error.message,
                code: error.code,
                status: error.status,
                flowId,
            });

            return NextResponse.redirect(
                new URL(
                    `/portal/account/login/?error=${encodeURIComponent(error.message)}`,
                    publicOrigin
                )
            );
        }

        console.log('[AUTH CALLBACK] SUCCESS', {
            hasSession: !!data.session,
            userId: data.user?.id,
        });

        // Auto-link student profile if @cannogacollege.ca account
        try {
            const user = data?.session?.user || data?.user;
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
    } catch (error) {
        console.error('[AUTH CALLBACK] Unexpected failure:', error);

        return NextResponse.redirect(
            new URL(
                '/portal/account/login/?error=callback_failure',
                publicOrigin
            )
        );
    }
}
