import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';

import { isBlockedEmail } from '@/utils/security-blocklist';

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const identifier = (formData.get('identifier') || formData.get('email')) as string;
    const password = formData.get('password') as string;

    // supabaseResponse is mutated by setAll() during signInWithPassword to hold auth cookies.
    // We must NOT discard it — copy its cookies to every response we return.
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
                    // Write to request so subsequent reads within this handler see the cookies
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    // Re-create supabaseResponse so cookies.set picks up the new request state
                    supabaseResponse = NextResponse.next({ request });
                    // Set with FULL options (httpOnly, secure, sameSite, maxAge, path, etc.)
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        } as any
    );

    // Helper: copy all auth cookies (with full options) from supabaseResponse to any response
    const withAuthCookies = (response: NextResponse) => {
        supabaseResponse.cookies.getAll().forEach((cookie) => {
            response.cookies.set(cookie);
        });
        return response;
    };

    let email = identifier?.trim() ?? '';

    if (!email) {
        return withAuthCookies(NextResponse.json({ error: 'Email or identifier is required.' }, { status: 400 }));
    }

    if (isBlockedEmail(email)) {
        return withAuthCookies(NextResponse.json({ error: 'Access restricted: This account is prohibited from accessing cannogacollege.ca.' }, { status: 403 }));
    }

    if (!email.includes('@')) {
        const serviceClient = createServiceRoleClient();
        const { data: student } = await serviceClient
            .from('students')
            .select('user_id')
            .eq('student_id', identifier.trim().toUpperCase())
            .maybeSingle();

        if (!student?.user_id) {
            return withAuthCookies(NextResponse.json({ error: 'Student ID not found. Please check and try again.' }, { status: 401 }));
        }

        const { data: authUser } = await serviceClient.auth.admin.getUserById(student.user_id);
        if (!authUser?.user?.email) {
            return withAuthCookies(NextResponse.json({ error: 'Unable to retrieve account email. Please contact support.' }, { status: 401 }));
        }

        email = authUser.user.email;
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password,
    });

    if (authError) {
        return withAuthCookies(NextResponse.json({ error: authError.message }, { status: 401 }));
    }

    if (!authData.user) {
        return withAuthCookies(NextResponse.json({ error: 'login_failed' }, { status: 401 }));
    }

    const serviceClient = createServiceRoleClient();

    const { data: profile } = await serviceClient
        .from('profiles')
        .select('role, portal_access_disabled')
        .eq('id', authData.user.id)
        .single();

    if (profile?.portal_access_disabled) {
        return withAuthCookies(NextResponse.json({ error: 'Access disabled: Your account has been restricted from accessing cannogacollege.ca.' }, { status: 403 }));
    }

    if (profile?.role === 'ADMIN') {
        return withAuthCookies(
            NextResponse.json({ success: true, redirect: '/sis/admin' }, { headers: { 'x-auth-success': 'true' } })
        );
    }

    const { data: enrollment } = await serviceClient
        .from('students')
        .select('enrollment_status, tuition_deposit_paid')
        .eq('user_id', authData.user.id)
        .single();

    const sisReady =
        (enrollment?.enrollment_status === 'CONFIRMED' || enrollment?.enrollment_status === 'ACTIVE') &&
        enrollment?.tuition_deposit_paid === true;

    if (sisReady) {
        return withAuthCookies(NextResponse.json({ success: true, redirect: '/sis' }));
    }

    return withAuthCookies(NextResponse.json({ success: true, redirect: '/portal/dashboard' }));
}