import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PORTAL_PUBLIC_PATHS = [
    '/portal/account/login',
    '/portal/account/register',
    '/portal/account/admin-login',
    '/portal/account/reset-password',
];

const ADMIN_PATHS = ['/sis/admin'];

const AUTH_REQUIRED_PATHS = ['/sis'];

export async function proxy(request: NextRequest) {
    const host = request.headers.get('host') || '';
    if (host.startsWith('www.cannogacollege.ca')) {
        const newUrl = request.nextUrl.clone();
        newUrl.host = 'cannogacollege.ca';
        newUrl.protocol = 'https';
        newUrl.port = '';
        return NextResponse.redirect(newUrl, { status: 301 });
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
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: profile, error: profileError } = await (async () => {
        if (!user) return { data: null, error: null };
        return await supabase.from('profiles').select('role').eq('id', user.id).single();
    })();

    const pathname = request.nextUrl.pathname;

    if (pathname.startsWith('/portal')) {
        const isPublicPortalPath = PORTAL_PUBLIC_PATHS.some(
            (p) => pathname === p || pathname.startsWith(p + '/')
        );

        if (!isPublicPortalPath && !user) {
            const loginUrl = request.nextUrl.clone();
            loginUrl.pathname = '/portal/account/login';
            loginUrl.searchParams.set('redirectedFrom', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
        const sisAdminUrl = request.nextUrl.clone();
        sisAdminUrl.pathname = pathname.replace('/admin', '/sis/admin');
        return NextResponse.redirect(sisAdminUrl);
    }

    if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
        if (!user) {
            const adminLoginUrl = request.nextUrl.clone();
            adminLoginUrl.pathname = '/portal/account/admin-login';
            adminLoginUrl.searchParams.set('redirectedFrom', pathname);
            return NextResponse.redirect(adminLoginUrl);
        }
        return supabaseResponse;
    }

    if (AUTH_REQUIRED_PATHS.some((p) => pathname.startsWith(p))) {
        if (!user) {
            const loginUrl = request.nextUrl.clone();
            loginUrl.pathname = '/portal/account/login';
            loginUrl.searchParams.set('redirectedFrom', pathname);
            return NextResponse.redirect(loginUrl);
        }

        if (profile?.role === 'ADMIN') {
            const adminUrl = request.nextUrl.clone();
            adminUrl.pathname = '/sis/admin';
            return NextResponse.redirect(adminUrl);
        }

        return supabaseResponse;
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|images/|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};