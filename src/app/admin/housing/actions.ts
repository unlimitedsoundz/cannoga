
'use server';

import { createServerClient } from '@/utils/supabase/server';

interface AssignRoomParams {
    applicationId: string;
    roomId: string;
    studentId: string;
    startDate: string;
    endDate: string;
    monthlyRate: number;
}

export async function assignHousingRoom({
    applicationId,
    roomId,
    studentId,
    startDate,
    endDate,
    monthlyRate
}: AssignRoomParams) {
    const supabase = await createServerClient();
    try {
        const { data: result, error: functionError } = await supabase.functions.invoke('handle-housing-assignment', {
            body: {
                applicationId,
                roomId,
                studentId,
                startDate,
                endDate,
                monthlyRate
            }
        });

        if (functionError || !result?.success) {
            throw new Error(functionError?.message || result?.error || 'Failed to assign room');
        }
        return { success: true };
    } catch (error: any) {
        console.error('Error assigning housing room:', error);
        return { success: false, error: error.message };
    }
}
