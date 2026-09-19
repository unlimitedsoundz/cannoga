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
            .select('id, user_id, student_id, personal_email, institutional_email')
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

            // Check if any other profile is holding this student_id (e.g. earlier applicant account)
            const { data: conflictingProfiles } = await adminClient
                .from('profiles')
                .select('*')
                .eq('student_id', student.student_id)
                .neq('id', user.id);

            let donorProfile = conflictingProfiles?.[0];

            if (conflictingProfiles && conflictingProfiles.length > 0) {
                for (const oldProf of conflictingProfiles) {
                    // Free the unique student_id constraint on the applicant profile
                    const releasedId = 'APP' + student.student_id.replace(/^CC/i, '');
                    await adminClient
                        .from('profiles')
                        .update({ student_id: releasedId })
                        .eq('id', oldProf.id);
                }
            }

            if (!donorProfile && student.personal_email) {
                const { data: pProf } = await adminClient
                    .from('profiles')
                    .select('*')
                    .eq('email', student.personal_email.toLowerCase().trim())
                    .neq('id', user.id)
                    .maybeSingle();
                if (pProf) donorProfile = pProf;
            }

            const profileUpdate: Record<string, any> = {
                role: 'STUDENT',
                student_id: student.student_id,
            };
            if (microsoftUserId) profileUpdate.microsoft_user_id = microsoftUserId;
            if (microsoftUpn) profileUpdate.microsoft_upn = microsoftUpn;

            if (donorProfile) {
                const copyFields = [
                    'first_name', 'last_name', 'middle_name', 'phone_number', 'phone_code',
                    'date_of_birth', 'citizenship', 'gender', 'address', 'city',
                    'state_province', 'zipcode', 'country_of_residence', 'passport_number',
                    'local_address', 'local_city', 'local_country', 'local_state_province',
                    'local_zipcode', 'contact_first_name', 'contact_last_name',
                    'contact_phone', 'contact_email', 'avatar_url', 'enrollment_date'
                ];
                for (const field of copyFields) {
                    if (donorProfile[field] !== null && donorProfile[field] !== undefined) {
                        profileUpdate[field] = donorProfile[field];
                    }
                }
            } else {
                const fullName = (user.user_metadata as any)?.full_name || (user.user_metadata as any)?.name || '';
                if (fullName) {
                    const parts = fullName.trim().split(/\s+/);
                    profileUpdate.first_name = parts[0];
                    profileUpdate.last_name = parts.slice(1).join(' ') || parts[0];
                }
            }

            const { error: profErr } = await adminClient
                .from('profiles')
                .update(profileUpdate)
                .eq('id', user.id);

            if (profErr) {
                console.warn('[LINK-STUDENT] Profile update error, retrying without student_id:', profErr);
                delete profileUpdate.student_id;
                await adminClient
                    .from('profiles')
                    .update(profileUpdate)
                    .eq('id', user.id);
            }
        }

        return NextResponse.json({ ok: true });
    } catch (err: any) {
        console.warn('[LINK-STUDENT] Error linking student:', err);
        return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
    }
}
