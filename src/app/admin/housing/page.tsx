'use client';

import { createClient } from '@/utils/supabase/client';
import { Link } from "@aalto-dx/react-components";
import { CaretLeft as ArrowLeft, CircleNotch as Loader2 } from "@phosphor-icons/react";
import HousingManagementClient from './HousingManagementClient';
import { useState, useEffect } from 'react';

export default function AdminHousingPage() {
    const [data, setData] = useState<{
        applications: any[];
        availableRooms: any[];
        assignments: any[];
        buildings: any[];
    }>({
        applications: [],
        availableRooms: [],
        assignments: [],
        buildings: []
    });
    const [loading, setLoading] = useState(true);

    const fetchHousingData = async (isRefresh = false) => {
        console.log('fetchHousingData called, isRefresh:', isRefresh);
        if (!isRefresh) setLoading(true);
        
        const supabase = createClient();
        
        try {
            console.log('Fetching fresh housing data...');
            
            // Fetch all data in parallel for speed and consistency
            const [appsRes, roomsRes, assignRes, bldgsRes] = await Promise.all([
                supabase
                    .from('housing_applications')
                    .select('*, student:students(*, user:profiles(*)), semester:semesters(name), preferred_building:housing_buildings(name, campus_location)')
                    .order('created_at', { ascending: false }),
                supabase
                    .from('housing_rooms')
                    .select('*, building:housing_buildings(*)')
                    .order('building_id'),
                supabase
                    .from('housing_assignments')
                    .select(`
                        *,
                        student:students(*, user:profiles(*)),
                        room:housing_rooms(
                            *,
                            building:housing_buildings(*)
                        )
                    `)
                    .order('created_at', { ascending: false }),
                supabase
                    .from('housing_buildings')
                    .select('*')
                    .order('name')
            ]);

            if (appsRes.error) throw appsRes.error;
            if (roomsRes.error) throw roomsRes.error;
            if (assignRes.error) throw assignRes.error;
            if (bldgsRes.error) throw bldgsRes.error;

            console.log(`Update successful: ${appsRes.data?.length} apps, ${assignRes.data?.length} assignments`);

            setData({
                applications: appsRes.data || [],
                availableRooms: roomsRes.data || [],
                assignments: assignRes.data || [],
                buildings: bldgsRes.data || []
            });
        } catch (error) {
            console.error("Error refreshing housing data:", error);
            alert("Failed to refresh data. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHousingData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50/50 p-4 md:p-8 font-sans animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-black transition-colors"
                    >
                        <ArrowLeft size={14} /> Back to Admin Dashboard
                    </Link>
                </div>

                <HousingManagementClient
                    applications={data.applications}
                    rooms={data.availableRooms}
                    assignments={data.assignments}
                    buildings={data.buildings}
                    onRefresh={() => fetchHousingData(true)}
                />
            </div>
        </div>
    );
}
