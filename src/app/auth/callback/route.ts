import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    if (!code) {
        return NextResponse.redirect(
            new URL('/portal/account/login/?error=no_code', publicOrigin)
        );
    }

    try {
        console.log('[MICROSOFT CALLBACK] creating Supabase client');

        const supabase = await createClient();

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

            return NextResponse.redirect(
                new URL(
                    `/portal/account/login/?error=${encodeURIComponent(
                        result.error.message
                    )}`,
                    publicOrigin
                )
            );
        }

        console.log('[MICROSOFT CALLBACK] SUCCESS');
        console.log(
            '[MICROSOFT CALLBACK] user:',
            result.data.user?.id
        );

        // Auto-link student profile if @cannogacollege.ca account
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

        let targetPath = next.startsWith('/') ? next : '/sis';
        if (!targetPath.endsWith('/')) {
            targetPath = `${targetPath}/`;
        }

        return NextResponse.redirect(
            new URL(targetPath, publicOrigin)
        );
    } catch (error) {
        console.error('[MICROSOFT CALLBACK] CRASH', error);

        const message =
            error instanceof Error
                ? error.message
                : 'Unknown callback error';

        return NextResponse.redirect(
            new URL(
                `/portal/account/login/?error=${encodeURIComponent(message)}`,
                publicOrigin
            )
        );
    }
}
