import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password,
    });

    if (authError) {
        return NextResponse.redirect(
            new URL(`/portal/account/login?error=${encodeURIComponent(authError.message)}`, request.url)
        );
    }

    if (!authData.user) {
        return NextResponse.redirect(
            new URL('/portal/account/login?error=login_failed', request.url)
        );
    }

    const serviceClient = createServiceRoleClient();

    const { data: profile } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

    if (profile?.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/sis/admin', request.url), { headers: { 'x-auth-success': 'true' } });
    }

    const { data: enrollment } = await serviceClient
        .from('students')
        .select('enrollment_status')
        .eq('user_id', authData.user.id)
        .single();

    if (enrollment?.enrollment_status === 'CONFIRMED' || enrollment?.enrollment_status === 'ACTIVE') {
        return NextResponse.redirect(new URL('/sis', request.url));
    }

    return NextResponse.redirect(new URL('/portal/dashboard', request.url));
}