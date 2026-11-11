import { redirect } from 'next/navigation';
import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export default async function DashboardPage() {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/portal/account/login');
        return null;
    }

    const adminClient = createServiceRoleClient();
    const [{ data: profile }, { data: enrollment }, { data: allApps }] = await Promise.all([
        adminClient
            .from('profiles')
            .select('role, portal_access_disabled, sis_access_disabled')
            .eq('id', user.id)
            .single(),
        adminClient
            .from('students')
            .select('enrollment_status, sis_access_disabled')
            .eq('user_id', user.id)
            .maybeSingle(),
        adminClient
            .from('applications')
            .select('id, status, admission_offers(id, status)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20),
    ]);

    if (profile?.portal_access_disabled) {
        redirect('/portal/account/login?message=access_disabled');
        return null;
    }

    if (profile?.role === 'ADMIN') {
        redirect('/sis/admin');
        return null;
    }

    const isSisAccessDisabled = !!(profile?.sis_access_disabled || enrollment?.sis_access_disabled);

    const sisReady =
        !isSisAccessDisabled &&
        ['CONFIRMED', 'ACTIVE', 'ENROLLED'].includes(enrollment?.enrollment_status || '');

    if (sisReady) {
        if (profile?.role !== 'STUDENT') {
            await adminClient.from('profiles').update({ role: 'STUDENT' }).eq('id', user.id);
        }
        redirect('/sis');
        return null;
    }

    let applicationId: string | null = null;
    let hasOffer = false;
    let applicationStatus: string | null = null;

    if (allApps && allApps.length > 0) {
        // Pick the one with an offer first, otherwise the most recent
        const withOffer = allApps.find((app) => {
            const offers = app.admission_offers;
            return Array.isArray(offers) ? offers.length > 0 : Boolean(offers);
        });
        const chosenApp = withOffer ?? allApps[0];
        applicationId = chosenApp.id;
        applicationStatus = chosenApp.status;
        const offers = chosenApp.admission_offers;
        hasOffer = (Array.isArray(offers) ? offers.length > 0 : Boolean(offers)) ||
            ['ADMITTED', 'OFFER_ACCEPTED', 'PAYMENT_SUBMITTED', 'ENROLLED'].includes(chosenApp.status);
    }

    const DashboardClient = (await import('./DashboardClient')).default;
    return (
        <DashboardClient
            applicationId={applicationId}
            hasOffer={hasOffer}
            applicationStatus={applicationStatus}
            sisAccessDisabled={isSisAccessDisabled}
        />
    );
}
