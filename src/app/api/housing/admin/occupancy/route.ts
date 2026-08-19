import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import type { OccupancySummary } from '@/types/housing';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
    const supabase    = await createServerClient();
    const adminClient = createServiceRoleClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || !['ADMIN', 'REGISTRAR', 'FINANCE_OFFICER'].includes(profile.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Aggregate bed stats per building
    const { data: buildings } = await adminClient
        .from('housing_buildings')
        .select('id, name, code, total_beds')
        .eq('is_active', true);

    const buildingStats = await Promise.all(
        (buildings ?? []).map(async (b) => {
            const { data: rooms } = await adminClient
                .from('housing_rooms')
                .select('status')
                .eq('building_id', b.id);

            const occupied    = rooms?.filter(r => r.status === 'OCCUPIED').length ?? 0;
            const available   = rooms?.filter(r => r.status === 'AVAILABLE').length ?? 0;
            const maintenance = rooms?.filter(r => r.status === 'MAINTENANCE').length ?? 0;

            return { id: b.id, name: b.name, code: b.code, total_beds: rooms?.length ?? 0, occupied, available, maintenance };
        })
    );

    const totalBeds       = buildingStats.reduce((s, b) => s + b.total_beds, 0);
    const occupiedBeds    = buildingStats.reduce((s, b) => s + b.occupied, 0);
    const availableBeds   = buildingStats.reduce((s, b) => s + b.available, 0);
    const maintenanceBeds = buildingStats.reduce((s, b) => s + b.maintenance, 0);

    // Homestay placements
    const { count: homestayCount } = await adminClient
        .from('housing_applications')
        .select('*', { count: 'exact', head: true })
        .eq('housing_type', 'homestay')
        .in('status', ['confirmed', 'deposit_paid', 'contract_signed']);

    // Deposits collected (from housing_invoices)
    const { data: paidInvoices } = await adminClient
        .from('housing_invoices')
        .select('paid_amount')
        .eq('status', 'PAID');

    const depositsCollected = (paidInvoices ?? []).reduce((s, inv) => s + Number(inv.paid_amount), 0);

    // Open work orders
    const { count: openOrders } = await adminClient
        .from('housing_work_orders')
        .select('*', { count: 'exact', head: true })
        .in('status', ['open', 'assigned', 'in_progress']);

    const { count: urgentOrders } = await adminClient
        .from('housing_work_orders')
        .select('*', { count: 'exact', head: true })
        .in('urgency', ['urgent', 'emergency'])
        .in('status', ['open', 'assigned']);

    // Pending applications
    const { count: pendingApps } = await adminClient
        .from('housing_applications')
        .select('*', { count: 'exact', head: true })
        .in('status', ['submitted', 'room_selected', 'contract_signed']);

    const summary: OccupancySummary = {
        total_beds:           totalBeds,
        occupied_beds:        occupiedBeds,
        available_beds:       availableBeds,
        maintenance_beds:     maintenanceBeds,
        occupancy_rate:       totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
        homestay_placements:  homestayCount ?? 0,
        deposits_collected:   depositsCollected,
        open_work_orders:     openOrders ?? 0,
        urgent_work_orders:   urgentOrders ?? 0,
        pending_applications: pendingApps ?? 0,
        buildings:            buildingStats,
    };

    return NextResponse.json({ summary });
}
