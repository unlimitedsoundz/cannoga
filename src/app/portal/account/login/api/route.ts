import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const identifier = (formData.get('identifier') || formData.get('email')) as string;
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

    let email = identifier.trim();

    if (!email) {
        const response = NextResponse.json({ error: 'Email or identifier is required.' }, { status: 400 });
        supabaseResponse.cookies.getAll().forEach(({ name, value, ...options }) => {
            response.cookies.set(name, value, options);
        });
        return response;
    }

    if (!email.includes('@')) {
        const serviceClient = createServiceRoleClient();
        const { data: student } = await serviceClient
            .from('students')
            .select('user_id')
            .eq('student_id', identifier.trim().toUpperCase())
            .maybeSingle();

        if (!student?.user_id) {
            const response = NextResponse.json({ error: 'Student ID not found. Please check and try again.' }, { status: 401 });
            supabaseResponse.cookies.getAll().forEach(({ name, value, ...options }) => {
                response.cookies.set(name, value, options);
            });
            return response;
        }

        const { data: authUser } = await serviceClient.auth.admin.getUserById(student.user_id);
        if (!authUser?.user?.email) {
            const response = NextResponse.json({ error: 'Unable to retrieve account email. Please contact support.' }, { status: 401 });
            supabaseResponse.cookies.getAll().forEach(({ name, value, ...options }) => {
                response.cookies.set(name, value, options);
            });
            return response;
        }

        email = authUser.user.email;
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password,
    });

    if (authError) {
        const response = NextResponse.json({ error: authError.message }, { status: 401 });
        supabaseResponse.cookies.getAll().forEach(({ name, value, ...options }) => {
            response.cookies.set(name, value, options);
        });
        return response;
    }

    if (!authData.user) {
        const response = NextResponse.json({ error: 'login_failed' }, { status: 401 });
        supabaseResponse.cookies.getAll().forEach(({ name, value, ...options }) => {
            response.cookies.set(name, value, options);
        });
        return response;
    }

    const serviceClient = createServiceRoleClient();

    const { data: profile } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

    if (profile?.role === 'ADMIN') {
        const response = NextResponse.json({ success: true, redirect: '/sis/admin' }, { headers: { 'x-auth-success': 'true' } });
        supabaseResponse.cookies.getAll().forEach(({ name, value, ...options }) => {
            response.cookies.set(name, value, options);
        });
        return response;
    }

    const { data: enrollment } = await serviceClient
        .from('students')
        .select('enrollment_status')
        .eq('user_id', authData.user.id)
        .single();

    if (enrollment?.enrollment_status === 'CONFIRMED' || enrollment?.enrollment_status === 'ACTIVE') {
        const response = NextResponse.json({ success: true, redirect: '/sis' });
        supabaseResponse.cookies.getAll().forEach(({ name, value, ...options }) => {
            response.cookies.set(name, value, options);
        });
        return response;
    }

    const response = NextResponse.json({ success: true, redirect: '/portal/dashboard' });
    supabaseResponse.cookies.getAll().forEach(({ name, value, ...options }) => {
        response.cookies.set(name, value, options);
    });
    return response;
}