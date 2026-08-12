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
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role === 'ADMIN') {
        redirect('/sis/admin');
        return null;
    }

    const { data: enrollment } = await adminClient
        .from('students')
        .select('enrollment_status')
        .eq('user_id', user.id)
        .single();

    if (enrollment?.enrollment_status === 'CONFIRMED' || enrollment?.enrollment_status === 'ACTIVE') {
        redirect('/sis');
        return null;
    }

    const DashboardClient = (await import('./DashboardClient')).default;
    return <DashboardClient />;
}