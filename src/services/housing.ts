import { createClient } from "@/utils/supabase/client";

export async function submitHousingApplication(data: {
    semesterId: string;
    preferredBuildingId: string | null;
    moveInDate: string;
    moveOutDate: string;
    leaseDuration?: number;
    totalContractValue?: number;
    roomType?: string;
    notes?: string;
}): Promise<{ success: boolean; application?: any; error?: string }> {
    try {
        const supabase = createClient();

        // 1. Auth & Student Check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Not authenticated' };

        const { data: student } = await supabase
            .from('students')
            .select('id, enrollment_status')
            .eq('user_id', user.id)
            .single();

        if (!student) return { success: false, error: 'Student record not found' };
        if (student.enrollment_status !== 'ACTIVE') {
            return { success: false, error: 'Housing is only available to active students' };
        }

        // 2. Check for existing application
        const { data: existing } = await supabase
            .from('housing_applications')
            .select('id, status')
            .eq('student_id', student.id)
            .eq('semester_id', data.semesterId)
            .single();

        if (existing && existing.status !== 'REJECTED') {
            return { success: false, error: 'You already have an application for this semester' };
        }

        // 3. Calculate priority score (simple example: year of study, GPA)
        const priorityScore = Math.floor(Math.random() * 100); // Placeholder logic

        // 4. Create application
        const { data: application, error } = await supabase
            .from('housing_applications')
            .insert({
                student_id: student.id,
                semester_id: data.semesterId,
                preferred_building_id: data.preferredBuildingId,
                move_in_date: data.moveInDate,
                move_out_date: data.moveOutDate,
                lease_duration: data.leaseDuration || 1,
                total_contract_value: data.totalContractValue,
                room_type: data.roomType,
                notes: data.notes,
                priority_score: priorityScore,
                status: 'PENDING'
            })
            .select()
            .single();

        if (error) return { success: false, error: error.message };

        // 6. Notify Admin & Student via Edge Function
        try {
            const { data: fullInfo } = await supabase
                .from('housing_applications')
                .select('*, semester:semesters(name), building:housing_buildings(name)')
                .eq('id', application.id)
                .single();

            await supabase.functions.invoke('send-notification', {
                body: {
                    type: 'HOUSING_SUBMITTED',
                    applicationId: application.application_id || undefined, // Base application ID if linked
                    additionalData: {
                        semesterName: fullInfo?.semester?.name || 'Unknown',
                        preferredBuilding: fullInfo?.building?.name || 'No Preference',
                        moveInDate: application.move_in_date,
                    }
                }
            });
        } catch (notifyError) {
            console.error('Failed to trigger housing notification:', notifyError);
        }

        return { success: true, application };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function createBuilding(data: { name: string, campus_location: string }) {
    const supabase = createClient();

    // 1. Auth Check (RLS will verify Admin)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: building, error } = await supabase
        .from('housing_buildings')
        .insert(data)
        .select()
        .single();

    if (error) throw error;
    return { success: true, building };
}

export async function createRoom(data: {
    building_id: string,
    room_number: string,
    capacity: number,
    monthly_rate: number,
    amenities?: string[]
}) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: room, error } = await supabase
        .from('housing_rooms')
        .insert({
            ...data,
            amenities: data.amenities || []
        })
        .select()
        .single();

    if (error) throw error;
    return { success: true, room };
}

export async function processDeposit(applicationId: string, amount: number) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (!student) throw new Error('Student record not found');

    // Simulate payment processing
    const transactionId = `TXN-${Date.now()}`;

    const { data: deposit, error } = await supabase
        .from('housing_deposits')
        .insert({
            application_id: applicationId,
            student_id: student.id,
            amount,
            payment_status: 'PAID',
            payment_method: 'CARD',
            transaction_id: transactionId,
            paid_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) throw error;

    // Update application status to APPROVED after deposit
    await supabase
        .from('housing_applications')
        .update({ status: 'APPROVED' })
        .eq('id', applicationId);

    return { success: true, deposit };
}

export async function allocateRoom(applicationId: string, roomId: string) {
    const supabase = createClient();

    // Admin/Registrar check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Fetch application
    const { data: application } = await supabase
        .from('housing_applications')
        .select('*, student:students(*)')
        .eq('id', applicationId)
        .single();

    if (!application) throw new Error('Application not found');

    // Check room availability
    const { data: room } = await supabase
        .from('housing_rooms')
        .select('*')
        .eq('id', roomId)
        .single();

    if (!room || room.status !== 'AVAILABLE') {
        throw new Error('Room is not available');
    }

    // Create assignment
    const { data: assignment, error } = await supabase
        .from('housing_assignments')
        .insert({
            application_id: applicationId,
            room_id: roomId,
            student_id: application.student_id,
            start_date: application.move_in_date,
            end_date: application.move_out_date,
            status: 'ASSIGNED'
        })
        .select()
        .single();

    if (error) throw error;

    // Update room status
    await supabase
        .from('housing_rooms')
        .update({ status: 'OCCUPIED' })
        .eq('id', roomId);

    // Email Sending disabled for static export
    // Notification logic can be added here (e.g. insert to notifications table)

    return { success: true, assignment };
}

export async function deleteHousingApplication(applicationId: string) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // 1. Get associated invoices
    const { data: invoices } = await supabase
        .from('housing_invoices')
        .select('id')
        .eq('application_id', applicationId);

    if (invoices && invoices.length > 0) {
        const invoiceIds = invoices.map(inv => inv.id);

        // 2. Delete payments and items
        await supabase.from('housing_payments').delete().in('invoice_id', invoiceIds);
        await supabase.from('housing_invoice_items').delete().in('invoice_id', invoiceIds);

        // 3. Delete invoices
        await supabase.from('housing_invoices').delete().in('id', invoiceIds);
    }

    // 4. Delete deposits, assignments, audit logs
    await supabase.from('housing_deposits').delete().eq('application_id', applicationId);

    // Check for assignments to free up rooms
    const { data: assignments } = await supabase
        .from('housing_assignments')
        .select('room_id')
        .eq('application_id', applicationId);

    if (assignments && assignments.length > 0) {
        const roomIds = assignments.map(a => a.room_id);
        await supabase.from('housing_assignments').delete().eq('application_id', applicationId);
        await supabase.from('housing_rooms').update({ status: 'AVAILABLE' }).in('id', roomIds);
    }

    await supabase.from('housing_audit_logs').delete().eq('target_id', applicationId);

    // 5. Delete application
    const { error } = await supabase
        .from('housing_applications')
        .delete()
        .eq('id', applicationId);

    if (error) throw error;

    return { success: true };
}

export async function deleteHousingAssignment(assignmentId: string) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // 1. Get assignment info to find the room
    const { data: assignment } = await supabase
        .from('housing_assignments')
        .select('room_id')
        .eq('id', assignmentId)
        .single();

    if (!assignment) throw new Error('Assignment not found');

    // 2. Delete assignment
    const { error } = await supabase
        .from('housing_assignments')
        .delete()
        .eq('id', assignmentId);

    if (error) throw error;

    // 3. Set room back to available
    await supabase
        .from('housing_rooms')
        .update({ status: 'AVAILABLE' })
        .eq('id', assignment.room_id);

    return { success: true };
}

export async function deleteHousingRoom(roomId: string) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check for active assignments
    const { data: hasAssignments } = await supabase
        .from('housing_assignments')
        .select('id')
        .eq('room_id', roomId)
        .limit(1);

    if (hasAssignments && hasAssignments.length > 0) {
        throw new Error('Cannot delete room with active or past assignments. Delete assignments first.');
    }

    const { error } = await supabase
        .from('housing_rooms')
        .delete()
        .eq('id', roomId);

    if (error) throw error;

    return { success: true };
}

export async function deleteHousingBuilding(buildingId: string) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check for rooms
    const { data: hasRooms } = await supabase
        .from('housing_rooms')
        .select('id')
        .eq('building_id', buildingId)
        .limit(1);

    if (hasRooms && hasRooms.length > 0) {
        throw new Error('Cannot delete building with existing rooms. Delete rooms first.');
    }

    const { error } = await supabase
        .from('housing_buildings')
        .delete()
        .eq('id', buildingId);

    if (error) throw error;

    return { success: true };
}

export async function updateBuilding(id: string, data: { name: string, campus_location: string }) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
        .from('housing_buildings')
        .update(data)
        .eq('id', id);

    if (error) throw error;
    return { success: true };
}

export async function updateRoom(id: string, data: {
    room_number: string,
    capacity: number,
    monthly_rate: number,
    amenities?: string[]
}) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
        .from('housing_rooms')
        .update({
            ...data,
            amenities: data.amenities || []
        })
        .eq('id', id);

    if (error) throw error;
    return { success: true };
}
