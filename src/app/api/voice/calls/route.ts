import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');
  const offset = (page - 1) * pageSize;

  const adminClient = createServiceRoleClient();

  try {
    let query = adminClient
      .from('voice_calls')
      .select('id, agent_id, provider, provider_call_id, caller_phone, called_phone, direction, status, started_at, answered_at, ended_at, duration_seconds, transferred, transfer_target, intent, summary, student_id, application_id')
      .order('started_at', { ascending: false });

    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      query = query.or(`caller_phone.ilike.%${lowerSearch}%,called_phone.ilike.%${lowerSearch}%,status.ilike.%${lowerSearch}%,provider_call_id.ilike.%${lowerSearch}%,id.ilike.%${lowerSearch}%`);
    }

    const { data: calls, error, count } = await query.range(offset, offset + pageSize - 1);

    if (error) throw error;

    return NextResponse.json({
      calls: calls || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    });
  } catch (err) {
    console.error('Voice calls API error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}
