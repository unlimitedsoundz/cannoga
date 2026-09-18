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

        return NextResponse.json({ ok: true });
    } catch (err: any) {
        console.warn('[LINK-STUDENT] Error linking student:', err);
        return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
    }
}
