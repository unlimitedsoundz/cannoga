import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    },
                },
            }
        );

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user || !user.email) {
            return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
        }

        const userEmail = user.email.toLowerCase().trim();
        const adminClient = createServiceRoleClient();

        // Extract Microsoft identity metadata if authenticated via Azure OAuth
        const azureIdentity = user.identities?.find((i: any) => i.provider === 'azure');
        const microsoftUserId = azureIdentity?.id || (user.user_metadata as any)?.sub || null;
        const microsoftUpn = (user.user_metadata as any)?.preferred_username || (user.user_metadata as any)?.upn || userEmail;
        const microsoftTenantId = (user.user_metadata as any)?.tid || null;

        const { data: student } = await adminClient
            .from('students')
            .select('id, user_id, student_id')
            .or(`institutional_email.eq.${userEmail},personal_email.eq.${userEmail}`)
            .maybeSingle();

        if (student) {
            const studentUpdate: Record<string, any> = { user_id: user.id };
            if (microsoftUserId) studentUpdate.microsoft_user_id = microsoftUserId;
            if (microsoftUpn) studentUpdate.microsoft_upn = microsoftUpn;
            if (microsoftTenantId) studentUpdate.microsoft_tenant_id = microsoftTenantId;

            await adminClient
                .from('students')
                .update(studentUpdate)
                .eq('id', student.id);

            const profileUpdate: Record<string, any> = { role: 'STUDENT', student_id: student.student_id };
            if (microsoftUserId) profileUpdate.microsoft_user_id = microsoftUserId;
            if (microsoftUpn) profileUpdate.microsoft_upn = microsoftUpn;

            await adminClient
                .from('profiles')
                .update(profileUpdate)
                .eq('id', user.id);
        }

        return NextResponse.json({ ok: true });
    } catch (err: any) {
        console.warn('[LINK-STUDENT] Error linking student:', err);
        return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
    }
}
