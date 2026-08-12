'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { Room, RoomFeature, RoomFeatureAssignment, RoomAvailability } from '@/types/database';

export async function getRooms(filters: { search?: string; building?: string; roomType?: string; status?: string } = {}) {
  const adminClient = createServiceRoleClient();

  try {
    let query = adminClient.from('rooms').select('*').order('building', { ascending: true }).order('room_number', { ascending: true });

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,room_number.ilike.%${filters.search}%,building.ilike.%${filters.search}%`);
    }
    if (filters.building) {
      query = query.eq('building', filters.building);
    }
    if (filters.roomType) {
      query = query.eq('room_type', filters.roomType);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data: (data || []) as Room[] };
  } catch (e: any) {
    console.error('getRooms Error:', e);
    return { success: false, error: e.message, data: [] };
  }
}

export async function createRoom(data: Partial<Room>) {
  const adminClient = createServiceRoleClient();

  try {
    const payload = {
      name: data.name,
      building: data.building,
      floor: data.floor || null,
      room_number: data.room_number,
      capacity: data.capacity,
      room_type: data.room_type || 'LECTURE_ROOM',
      campus: data.campus || 'MAIN',
      accessibility: data.accessibility ?? false,
      equipment: data.equipment || [],
      status: data.status || 'ACTIVE',
      notes: data.notes || null,
    };

    const { data: result, error } = await adminClient.from('rooms').insert(payload).select().single();
    if (error) throw error;
    return { success: true, data: result as Room };
  } catch (e: any) {
    console.error('createRoom Error:', e);
    return { success: false, error: e.message };
  }
}

export async function updateRoom(id: string, data: Partial<Room>) {
  const adminClient = createServiceRoleClient();

  try {
    const payload: any = {};
    const fields = ['name', 'building', 'floor', 'room_number', 'capacity', 'room_type', 'campus', 'accessibility', 'equipment', 'status', 'notes'];
    for (const field of fields) {
      if (data[field as keyof Room] !== undefined) {
        payload[field] = data[field as keyof Room];
      }
    }

    const { data: result, error } = await adminClient.from('rooms').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return { success: true, data: result as Room };
  } catch (e: any) {
    console.error('updateRoom Error:', e);
    return { success: false, error: e.message };
  }
}

export async function deleteRoom(id: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { error } = await adminClient.from('rooms').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    console.error('deleteRoom Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getRoomFeatures(filters: { category?: string; search?: string } = {}) {
  const adminClient = createServiceRoleClient();

  try {
    let query = adminClient.from('room_features').select('*').order('name', { ascending: true });

    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data: (data || []) as RoomFeature[] };
  } catch (e: any) {
    console.error('getRoomFeatures Error:', e);
    return { success: false, error: e.message, data: [] };
  }
}

export async function createRoomFeature(data: Partial<RoomFeature>) {
  const adminClient = createServiceRoleClient();

  try {
    const payload = {
      name: data.name,
      description: data.description || null,
      category: data.category || 'GENERAL',
    };

    const { data: result, error } = await adminClient.from('room_features').insert(payload).select().single();
    if (error) throw error;
    return { success: true, data: result as RoomFeature };
  } catch (e: any) {
    console.error('createRoomFeature Error:', e);
    return { success: false, error: e.message };
  }
}

export async function updateRoomFeature(id: string, data: Partial<RoomFeature>) {
  const adminClient = createServiceRoleClient();

  try {
    const payload: any = {};
    const fields = ['name', 'description', 'category'];
    for (const field of fields) {
      if (data[field as keyof RoomFeature] !== undefined) {
        payload[field] = data[field as keyof RoomFeature];
      }
    }

    const { data: result, error } = await adminClient.from('room_features').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return { success: true, data: result as RoomFeature };
  } catch (e: any) {
    console.error('updateRoomFeature Error:', e);
    return { success: false, error: e.message };
  }
}

export async function deleteRoomFeature(id: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { error } = await adminClient.from('room_features').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    console.error('deleteRoomFeature Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getRoomFeatureAssignments(roomId?: string) {
  const adminClient = createServiceRoleClient();

  try {
    let query = adminClient
      .from('room_feature_assignments')
      .select('*, feature:room_features(*)')
      .order('created_at', { ascending: false });

    if (roomId) {
      query = query.eq('room_id', roomId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data: (data || []) as any[] };
  } catch (e: any) {
    console.error('getRoomFeatureAssignments Error:', e);
    return { success: false, error: e.message, data: [] };
  }
}

export async function assignRoomFeature(roomId: string, featureId: string, notes?: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { data: result, error } = await adminClient
      .from('room_feature_assignments')
      .insert({ room_id: roomId, feature_id: featureId, notes: notes || null })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: result as RoomFeatureAssignment };
  } catch (e: any) {
    console.error('assignRoomFeature Error:', e);
    return { success: false, error: e.message };
  }
}

export async function removeRoomFeatureAssignment(id: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { error } = await adminClient.from('room_feature_assignments').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    console.error('removeRoomFeatureAssignment Error:', e);
    return { success: false, error: e.message };
  }
}

export async function getRoomAvailability(roomId?: string, filters: { fromDate?: string; toDate?: string } = {}) {
  const adminClient = createServiceRoleClient();

  try {
    let query = adminClient.from('room_availability').select('*').order('start_datetime', { ascending: true });

    if (roomId) {
      query = query.eq('room_id', roomId);
    }
    if (filters.fromDate) {
      query = query.gte('end_datetime', filters.fromDate);
    }
    if (filters.toDate) {
      query = query.lte('start_datetime', filters.toDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data: (data || []) as RoomAvailability[] };
  } catch (e: any) {
    console.error('getRoomAvailability Error:', e);
    return { success: false, error: e.message, data: [] };
  }
}

export async function createRoomAvailability(data: Partial<RoomAvailability>) {
  const adminClient = createServiceRoleClient();

  try {
    const payload = {
      room_id: data.room_id,
      block_type: data.block_type || 'MAINTENANCE',
      start_datetime: data.start_datetime,
      end_datetime: data.end_datetime,
      reason: data.reason || null,
      created_by: null,
    };

    const { data: result, error } = await adminClient.from('room_availability').insert(payload).select().single();
    if (error) throw error;
    return { success: true, data: result as RoomAvailability };
  } catch (e: any) {
    console.error('createRoomAvailability Error:', e);
    return { success: false, error: e.message };
  }
}

export async function updateRoomAvailability(id: string, data: Partial<RoomAvailability>) {
  const adminClient = createServiceRoleClient();

  try {
    const payload: any = {};
    const fields = ['room_id', 'block_type', 'start_datetime', 'end_datetime', 'reason'];
    for (const field of fields) {
      if (data[field as keyof RoomAvailability] !== undefined) {
        payload[field] = data[field as keyof RoomAvailability];
      }
    }

    const { data: result, error } = await adminClient.from('room_availability').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return { success: true, data: result as RoomAvailability };
  } catch (e: any) {
    console.error('updateRoomAvailability Error:', e);
    return { success: false, error: e.message };
  }
}

export async function deleteRoomAvailability(id: string) {
  const adminClient = createServiceRoleClient();

  try {
    const { error } = await adminClient.from('room_availability').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (e: any) {
    console.error('deleteRoomAvailability Error:', e);
    return { success: false, error: e.message };
  }
}
