'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { TimetableConstraint, TimetablePreference, AcademicDay, TimeSlot, Holiday } from '@/types/database';

export async function getTimetableConstraints() {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('timetable_constraints')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return { success: true, data: (data || []) as TimetableConstraint[] };
  } catch (e: any) {
    console.error('getTimetableConstraints Error:', e);
    return { success: false, error: e.message, data: [] };
  }
}

export async function updateTimetableConstraint(id: string, data: { weight?: number; is_enabled?: boolean; parameters?: any; description?: string | null }) {
  const adminClient = createServiceRoleClient();

  try {
    const { data: result, error } = await adminClient
      .from('timetable_constraints')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: result as TimetableConstraint };
  } catch (e: any) {
    console.error('updateTimetableConstraint Error:', e);
    return { success: false, error: e.message };
  }
}

export async function createTimetableConstraint(data: { name: string; constraint_type: string; is_enabled?: boolean; weight?: number; parameters?: any; description?: string | null }) {
  const adminClient = createServiceRoleClient();

  try {
    const { data: result, error } = await adminClient
      .from('timetable_constraints')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: result as TimetableConstraint };
  } catch (e: any) {
    console.error('createTimetableConstraint Error:', e);
    return { success: false, error: e.message };
  }
}

export async function deleteTimetableConstraint(id: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { error } = await adminClient.from('timetable_constraints').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    console.error('deleteTimetableConstraint Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getTimetablePreferences() {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('timetable_preferences')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return { success: true, data: (data || []) as TimetablePreference[] };
  } catch (e: any) {
    console.error('getTimetablePreferences Error:', e);
    return { success: false, error: e.message, data: [] };
  }
}

export async function updateTimetablePreference(id: string, data: { weight?: number; is_enabled?: boolean; parameters?: any; description?: string | null }) {
  const adminClient = createServiceRoleClient();

  try {
    const { data: result, error } = await adminClient
      .from('timetable_preferences')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: result as TimetablePreference };
  } catch (e: any) {
    console.error('updateTimetablePreference Error:', e);
    return { success: false, error: e.message };
  }
}

export async function createTimetablePreference(data: { name: string; weight: number; is_enabled?: boolean; parameters?: any; description?: string | null }) {
  const adminClient = createServiceRoleClient();

  try {
    const { data: result, error } = await adminClient
      .from('timetable_preferences')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: result as TimetablePreference };
  } catch (e: any) {
    console.error('createTimetablePreference Error:', e);
    return { success: false, error: e.message };
  }
}

export async function deleteTimetablePreference(id: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { error } = await adminClient.from('timetable_preferences').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    console.error('deleteTimetablePreference Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getAcademicDays() {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('academic_days')
      .select('*')
      .order('day_of_week', { ascending: true });

    if (error) throw error;
    return { success: true, data: (data || []) as AcademicDay[] };
  } catch (e: any) {
    console.error('getAcademicDays Error:', e);
    return { success: false, error: e.message, data: [] };
  }
}

export async function updateAcademicDay(id: string, data: { name?: string; abbreviation?: string; is_teaching_day?: boolean }) {
  const adminClient = createServiceRoleClient();

  try {
    const { data: result, error } = await adminClient
      .from('academic_days')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: result as AcademicDay };
  } catch (e: any) {
    console.error('updateAcademicDay Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getTimeSlots(filters: { dayOfWeek?: number } = {}) {
  const adminClient = createServiceRoleClient();

  try {
    let query = adminClient
      .from('time_slots')
      .select('*')
      .order('day_of_week', { ascending: true })
      .order('slot_index', { ascending: true });

    if (filters.dayOfWeek !== undefined) {
      query = query.eq('day_of_week', filters.dayOfWeek);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data: (data || []) as TimeSlot[] };
  } catch (e: any) {
    console.error('getTimeSlots Error:', e);
    return { success: false, error: e.message, data: [] };
  }
}

export async function createTimeSlot(data: Partial<TimeSlot>) {
  const adminClient = createServiceRoleClient();

  try {
    const payload = {
      slot_index: data.slot_index,
      day_of_week: data.day_of_week,
      start_time: data.start_time,
      end_time: data.end_time,
      slot_duration: data.slot_duration || 30,
      is_break: data.is_break ?? false,
      break_name: data.break_name || null,
    };

    const { data: result, error } = await adminClient.from('time_slots').insert(payload).select().single();
    if (error) throw error;
    return { success: true, data: result as TimeSlot };
  } catch (e: any) {
    console.error('createTimeSlot Error:', e);
    return { success: false, error: e.message };
  }
}

export async function updateTimeSlot(id: string, data: Partial<TimeSlot>) {
  const adminClient = createServiceRoleClient();

  try {
    const payload: any = {};
    const fields = ['slot_index', 'day_of_week', 'start_time', 'end_time', 'slot_duration', 'is_break', 'break_name'];
    for (const field of fields) {
      if (data[field as keyof TimeSlot] !== undefined) {
        payload[field] = data[field as keyof TimeSlot];
      }
    }

    const { data: result, error } = await adminClient.from('time_slots').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return { success: true, data: result as TimeSlot };
  } catch (e: any) {
    console.error('updateTimeSlot Error:', e);
    return { success: false, error: e.message };
  }
}

export async function deleteTimeSlot(id: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { error } = await adminClient.from('time_slots').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    console.error('deleteTimeSlot Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getHolidays(filters: { fromDate?: string; toDate?: string } = {}) {
  const adminClient = createServiceRoleClient();

  try {
    let query = adminClient.from('holidays').select('*').order('start_date', { ascending: true });

    if (filters.fromDate) {
      query = query.lte('end_date', filters.toDate || '9999-12-31');
    }
    if (filters.toDate) {
      query = query.gte('start_date', filters.fromDate || '0001-01-01');
    }

    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data: (data || []) as Holiday[] };
  } catch (e: any) {
    console.error('getHolidays Error:', e);
    return { success: false, error: e.message, data: [] };
  }
}

export async function createHoliday(data: Partial<Holiday>) {
  const adminClient = createServiceRoleClient();

  try {
    const payload = {
      name: data.name,
      start_date: data.start_date,
      end_date: data.end_date,
      block_type: data.block_type || 'HOLIDAY',
      affects_scheduling: data.affects_scheduling ?? true,
    };

    const { data: result, error } = await adminClient.from('holidays').insert(payload).select().single();
    if (error) throw error;
    return { success: true, data: result as Holiday };
  } catch (e: any) {
    console.error('createHoliday Error:', e);
    return { success: false, error: e.message };
  }
}

export async function updateHoliday(id: string, data: Partial<Holiday>) {
  const adminClient = createServiceRoleClient();

  try {
    const payload: any = {};
    const fields = ['name', 'start_date', 'end_date', 'block_type', 'affects_scheduling'];
    for (const field of fields) {
      if (data[field as keyof Holiday] !== undefined) {
        payload[field] = data[field as keyof Holiday];
      }
    }

    const { data: result, error } = await adminClient.from('holidays').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return { success: true, data: result as Holiday };
  } catch (e: any) {
    console.error('updateHoliday Error:', e);
    return { success: false, error: e.message };
  }
}

export async function deleteHoliday(id: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { error } = await adminClient.from('holidays').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    console.error('deleteHoliday Error:', e);
    return { success: false, error: e.message };
  }
}
