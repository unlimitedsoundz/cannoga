import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const redirectParam = searchParams.get('redirect') || searchParams.get('redirectedFrom') || '';

    // If attempting to reach admin or sis admin areas, redirect to admin login
    const isAdminTarget =
        redirectParam.includes('admin') ||
        redirectParam.includes('/sis/admin');

    const targetUrl = new URL(
        isAdminTarget ? '/portal/account/admin-login/' : '/portal/account/login/',
        request.url
    );

    if (redirectParam) {
        targetUrl.searchParams.set('redirectedFrom', redirectParam);
    }

    return NextResponse.redirect(targetUrl, 307);
}
