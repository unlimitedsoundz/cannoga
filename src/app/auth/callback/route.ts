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

    let next = requestUrl.searchParams.get('next') ?? '/sis/';

    if (!next.startsWith('/') || next.startsWith('//')) {
        next = '/sis/';
    }
    if (next === '/sis') {
        next = '/sis/';
    }

    const publicOrigin = getPublicOrigin(request, requestUrl);

    if (!code) {
        console.error('[AUTH CALLBACK] Missing code');

        return NextResponse.redirect(
            `${publicOrigin}/portal/account/login/?error=missing_code`
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
                `${publicOrigin}/portal/account/login/?error=${encodeURIComponent(error.message)}`
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
            `${publicOrigin}${next}`
        );
    } catch (error: any) {
        console.error('[AUTH CALLBACK] Unexpected failure:', error);

        return NextResponse.redirect(
            `${publicOrigin}/portal/account/login/?error=callback_failure`
        );
    }
}
