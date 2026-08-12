'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { InstructorAvailability } from '@/types/database';

export async function getInstructorAvailability(filters: { instructorId?: string; dayOfWeek?: number; fromDate?: string; toDate?: string } = {}) {
  const adminClient = createServiceRoleClient();

  try {
    let query = adminClient
      .from('instructor_availability')
      .select('*, instructor:Faculty!instructor_availability_instructor_id_fkey(id, name, email)')
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    if (filters.instructorId) {
      query = query.eq('instructor_id', filters.instructorId);
    }
    if (filters.dayOfWeek !== undefined) {
      query = query.eq('day_of_week', filters.dayOfWeek);
    }
    if (filters.fromDate) {
      query = query.lte('effective_date', filters.toDate || '9999-12-31');
    }
    if (filters.toDate) {
      query = query.or(`expiry_date.is.null,expiry_date.gte.${filters.toDate}`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data: (data || []) as any[] };
  } catch (e: any) {
    console.error('getInstructorAvailability Error:', e);
    return { success: false, error: e.message, data: [] };
  }
}

export async function getInstructorAvailabilityWeek(instructorId: string, startDate: string) {
  const adminClient = createServiceRoleClient();

  try {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    const endDateStr = endDate.toISOString().split('T')[0];

    const { data, error } = await adminClient
      .from('instructor_availability')
      .select('*')
      .eq('instructor_id', instructorId)
      .or(`effective_date.lte.${endDateStr},and(effective_date.lte.${endDateStr},expiry_date.gte.${startDate})`)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return { success: true, data: (data || []) as InstructorAvailability[] };
  } catch (e: any) {
    console.error('getInstructorAvailabilityWeek Error:', e);
    return { success: false, error: e.message, data: [] };
  }
}

export async function createInstructorAvailability(data: Partial<InstructorAvailability>) {
  const adminClient = createServiceRoleClient();

  try {
    const payload = {
      instructor_id: data.instructor_id,
      day_of_week: data.day_of_week,
      start_time: data.start_time,
      end_time: data.end_time,
      availability_type: data.availability_type || 'AVAILABLE',
      effective_date: data.effective_date,
      expiry_date: data.expiry_date || null,
      notes: data.notes || null,
    };

    const { data: result, error } = await adminClient.from('instructor_availability').insert(payload).select().single();
    if (error) throw error;
    return { success: true, data: result as InstructorAvailability };
  } catch (e: any) {
    console.error('createInstructorAvailability Error:', e);
    return { success: false, error: e.message };
  }
}

export async function updateInstructorAvailability(id: string, data: Partial<InstructorAvailability>) {
  const adminClient = createServiceRoleClient();

  try {
    const payload: any = {};
    const fields = ['instructor_id', 'day_of_week', 'start_time', 'end_time', 'availability_type', 'effective_date', 'expiry_date', 'notes'];
    for (const field of fields) {
      if (data[field as keyof InstructorAvailability] !== undefined) {
        payload[field] = data[field as keyof InstructorAvailability];
      }
    }

    const { data: result, error } = await adminClient.from('instructor_availability').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return { success: true, data: result as InstructorAvailability };
  } catch (e: any) {
    console.error('updateInstructorAvailability Error:', e);
    return { success: false, error: e.message };
  }
}

export async function deleteInstructorAvailability(id: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { error } = await adminClient.from('instructor_availability').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    console.error('deleteInstructorAvailability Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getInstructors() {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('Faculty')
      .select('id, name, email')
      .order('name', { ascending: true });

    if (error) throw error;
    return { success: true, data: (data || []) as any[] };
  } catch (e: any) {
    console.error('getInstructors Error:', e);
    return { success: false, error: e.message, data: [] };
  }
}

export async function bulkSetAvailability(instructorId: string, entries: { day_of_week: number; start_time: string; end_time: string; availability_type: string; effective_date: string; expiry_date?: string | null }[]) {
  const adminClient = createServiceRoleClient();

  try {
    const payload = entries.map(e => ({
      instructor_id: instructorId,
      day_of_week: e.day_of_week,
      start_time: e.start_time,
      end_time: e.end_time,
      availability_type: e.availability_type,
      effective_date: e.effective_date,
      expiry_date: e.expiry_date || null,
    }));

    const { error } = await adminClient.from('instructor_availability').insert(payload);
    if (error) throw error;
    return { success: true, count: payload.length };
  } catch (e: any) {
    console.error('bulkSetAvailability Error:', e);
    return { success: false, error: e.message };
  }
}
