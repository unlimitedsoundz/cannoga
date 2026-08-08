'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export async function getStudentLifeData(studentId: string) {
    const supabase = createServiceRoleClient();

    if (!studentId) {
        return { success: false, error: 'Missing student ID', data: null };
    }

    try {
        const [messagesResult, complianceResult, libraryResult, healthResult, unreadResult] = await Promise.all([
            supabase
                .from('student_messages')
                .select('*')
                .or(`sender_id.eq.${studentId},recipient_id.eq.${studentId}`)
                .order('created_at', { ascending: false }),
            supabase
                .from('compliance_trackers')
                .select('*')
                .eq('student_id', studentId)
                .order('due_date', { ascending: true }),
            supabase
                .from('library_holds')
                .select('*')
                .eq('student_id', studentId)
                .order('hold_date', { ascending: false }),
            supabase
                .from('health_bookings')
                .select('*')
                .eq('student_id', studentId)
                .order('appointment_date', { ascending: true }),
            supabase
                .from('student_messages')
                .select('id', { count: 'exact', head: true })
                .eq('recipient_id', studentId)
                .is('read_at', null),
        ]);

        return {
            success: true,
            data: {
                messages: messagesResult.data || [],
                compliance: complianceResult.data || [],
                library: libraryResult.data || [],
                health: healthResult.data || [],
                unreadCount: unreadResult.count || 0,
            },
        };
    } catch (error) {
        console.error('Error fetching student life data:', error);
        return { success: false, error: 'Failed to load student life data', data: null };
    }
}

export async function sendMessage(data: {
    senderId: string;
    recipientId: string;
    subject: string;
    body: string;
    category?: string;
    priority?: string;
}) {
    const supabase = createServiceRoleClient();

    if (!data.senderId || !data.recipientId || !data.subject || !data.body) {
        return { success: false, error: 'Missing required message fields.' };
    }

    try {
        const { data: message, error } = await supabase
            .from('student_messages')
            .insert({
                sender_id: data.senderId,
                recipient_id: data.recipientId,
                subject: data.subject,
                body: data.body,
                category: data.category || 'GENERAL',
                priority: data.priority || 'NORMAL',
                status: 'sent',
            })
            .select()
            .single();

        if (error) {
            console.error('Send message error:', error);
            return { success: false, error: `Failed to send message: ${error.message}` };
        }

        return { success: true, data: message };
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to send message' };
    }
}

export async function getMessages(studentId: string) {
    const supabase = createServiceRoleClient();

    if (!studentId) {
        return { success: false, error: 'Missing student ID', data: [] };
    }

    try {
        const { data, error } = await supabase
            .from('student_messages')
            .select('*, sender:profiles!sender_id(first_name, last_name, email), recipient:profiles!recipient_id(first_name, last_name, email)')
            .or(`sender_id.eq.${studentId},recipient_id.eq.${studentId}`)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Get messages error:', error);
            return { success: false, error: error.message, data: [] };
        }

        return { success: true, data: data || [] };
    } catch (error: any) {
        return { success: false, error: error.message, data: [] };
    }
}

export async function markMessageRead(messageId: string) {
    const supabase = createServiceRoleClient();

    if (!messageId) {
        return { success: false, error: 'Missing message ID' };
    }

    try {
        const { error } = await supabase
            .from('student_messages')
            .update({ read_at: new Date().toISOString(), status: 'read' })
            .eq('id', messageId);

        if (error) {
            console.error('Mark message read error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getUnreadMessageCount(studentId: string) {
    const supabase = createServiceRoleClient();

    if (!studentId) {
        return { success: false, error: 'Missing student ID', count: 0 };
    }

    try {
        const { count, error } = await supabase
            .from('student_messages')
            .select('*', { count: 'exact', head: true })
            .eq('recipient_id', studentId)
            .is('read_at', null);

        if (error) {
            console.error('Get unread count error:', error);
            return { success: false, error: error.message, count: 0 };
        }

        return { success: true, count: count || 0 };
    } catch (error: any) {
        return { success: false, error: error.message, count: 0 };
    }
}

export async function getComplianceTrackers(studentId: string) {
    const supabase = createServiceRoleClient();

    if (!studentId) {
        return { success: false, error: 'Missing student ID', data: [] };
    }

    try {
        const { data, error } = await supabase
            .from('compliance_trackers')
            .select('*')
            .eq('student_id', studentId)
            .order('due_date', { ascending: true });

        if (error) {
            console.error('Get compliance trackers error:', error);
            return { success: false, error: error.message, data: [] };
        }

        return { success: true, data: data || [] };
    } catch (error: any) {
        return { success: false, error: error.message, data: [] };
    }
}

export async function updateComplianceTracker(id: string, updates: Record<string, any>) {
    const supabase = createServiceRoleClient();

    if (!id) {
        return { success: false, error: 'Missing tracker ID' };
    }

    try {
        const { data, error } = await supabase
            .from('compliance_trackers')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Update compliance tracker error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getLibraryHolds(studentId: string) {
    const supabase = createServiceRoleClient();

    if (!studentId) {
        return { success: false, error: 'Missing student ID', data: [] };
    }

    try {
        const { data, error } = await supabase
            .from('library_holds')
            .select('*')
            .eq('student_id', studentId)
            .order('hold_date', { ascending: false });

        if (error) {
            console.error('Get library holds error:', error);
            return { success: false, error: error.message, data: [] };
        }

        return { success: true, data: data || [] };
    } catch (error: any) {
        return { success: false, error: error.message, data: [] };
    }
}

export async function addLibraryHold(data: {
    studentId: string;
    bookTitle: string;
    author: string;
    isbn?: string;
    expiryDate?: string;
}) {
    const supabase = createServiceRoleClient();

    if (!data.studentId || !data.bookTitle || !data.author) {
        return { success: false, error: 'Missing required fields.' };
    }

    try {
        const { data: hold, error } = await supabase
            .from('library_holds')
            .insert({
                student_id: data.studentId,
                book_title: data.bookTitle,
                author: data.author,
                isbn: data.isbn || null,
                expiry_date: data.expiryDate || null,
                status: 'active',
            })
            .select()
            .single();

        if (error) {
            console.error('Add library hold error:', error);
            return { success: false, error: `Failed to add hold: ${error.message}` };
        }

        return { success: true, data: hold };
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to add hold' };
    }
}

export async function cancelLibraryHold(id: string) {
    const supabase = createServiceRoleClient();

    if (!id) {
        return { success: false, error: 'Missing hold ID' };
    }

    try {
        const { error } = await supabase
            .from('library_holds')
            .update({ status: 'cancelled' })
            .eq('id', id);

        if (error) {
            console.error('Cancel library hold error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getHealthBookings(studentId: string) {
    const supabase = createServiceRoleClient();

    if (!studentId) {
        return { success: false, error: 'Missing student ID', data: [] };
    }

    try {
        const { data, error } = await supabase
            .from('health_bookings')
            .select('*')
            .eq('student_id', studentId)
            .order('appointment_date', { ascending: true });

        if (error) {
            console.error('Get health bookings error:', error);
            return { success: false, error: error.message, data: [] };
        }

        return { success: true, data: data || [] };
    } catch (error: any) {
        return { success: false, error: error.message, data: [] };
    }
}

export async function bookAppointment(data: {
    studentId: string;
    bookingType: string;
    providerName: string;
    appointmentDate: string;
    appointmentTime: string;
    location?: string;
    notes?: string;
}) {
    const supabase = createServiceRoleClient();

    if (!data.studentId || !data.bookingType || !data.providerName || !data.appointmentDate || !data.appointmentTime) {
        return { success: false, error: 'Missing required fields.' };
    }

    try {
        const { data: booking, error } = await supabase
            .from('health_bookings')
            .insert({
                student_id: data.studentId,
                booking_type: data.bookingType,
                provider_name: data.providerName,
                appointment_date: data.appointmentDate,
                appointment_time: data.appointmentTime,
                location: data.location || null,
                notes: data.notes || null,
                status: 'scheduled',
            })
            .select()
            .single();

        if (error) {
            console.error('Book appointment error:', error);
            return { success: false, error: `Failed to book appointment: ${error.message}` };
        }

        return { success: true, data: booking };
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to book appointment' };
    }
}

export async function cancelBooking(id: string) {
    const supabase = createServiceRoleClient();

    if (!id) {
        return { success: false, error: 'Missing booking ID' };
    }

    try {
        const { error } = await supabase
            .from('health_bookings')
            .update({ status: 'cancelled' })
            .eq('id', id);

        if (error) {
            console.error('Cancel booking error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
