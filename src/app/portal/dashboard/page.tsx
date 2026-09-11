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
    const { data: profile } = await adminClient
        .from('profiles')
        .select('role, portal_access_disabled')
        .eq('id', user.id)
        .single();

    if (profile?.portal_access_disabled) {
        redirect('/portal/account/login?message=access_disabled');
        return null;
    }

    if (profile?.role === 'ADMIN') {
        redirect('/sis/admin');
        return null;
    }

    const { data: enrollment } = await adminClient
        .from('students')
        .select('enrollment_status, tuition_deposit_paid')
        .eq('user_id', user.id)
        .single();

    const sisReady =
        (enrollment?.enrollment_status === 'CONFIRMED' || enrollment?.enrollment_status === 'ACTIVE') &&
        enrollment?.tuition_deposit_paid === true;

    if (sisReady) {
        redirect('/sis');
        return null;
    }

    // Prefer the application that has an admission offer (student may have multiple apps)
    const { data: allApps } = await adminClient
        .from('applications')
        .select('id, status, admission_offers(id, status)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    let applicationId: string | null = null;
    let hasOffer = false;
    let applicationStatus: string | null = null;

    if (allApps && allApps.length > 0) {
        // Pick the one with an offer first, otherwise the most recent
        const withOffer = allApps.find((a: any) => a.admission_offers && (Array.isArray(a.admission_offers) ? a.admission_offers.length > 0 : a.admission_offers));
        const chosenApp = withOffer ?? allApps[0];
        applicationId = chosenApp.id;
        applicationStatus = chosenApp.status;
        hasOffer = !!(chosenApp.admission_offers && (Array.isArray(chosenApp.admission_offers) ? chosenApp.admission_offers.length > 0 : chosenApp.admission_offers)) ||
            ['ADMITTED', 'OFFER_ACCEPTED', 'PAYMENT_SUBMITTED', 'ENROLLED'].includes(chosenApp.status);
    }

    const DashboardClient = (await import('./DashboardClient')).default;
    return (
        <DashboardClient
            applicationId={applicationId}
            hasOffer={hasOffer}
            applicationStatus={applicationStatus}
        />
    );
}