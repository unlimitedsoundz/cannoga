import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export const runtime = 'nodejs';

function getDateRange() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());

  return { startOfDay, startOfWeek };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const recent = searchParams.get('recent') === 'true';

  const adminClient = createServiceRoleClient();
  const { startOfDay, startOfWeek } = getDateRange();

  try {
    const [
      callsTodayResult,
      callsThisWeekResult,
      totalCallsResult,
      avgDurationResult,
      transfersResult,
      callbacksResult,
      unresolvedResult,
      recentCallsResult,
    ] = await Promise.all([
      adminClient.from('voice_calls').select('*', { count: 'exact', head: true }).gte('started_at', startOfDay.toISOString()),
      adminClient.from('voice_calls').select('*', { count: 'exact', head: true }).gte('started_at', startOfWeek.toISOString()),
      adminClient.from('voice_calls').select('*', { count: 'exact', head: true }),
      adminClient.from('voice_calls').select('duration_seconds').not('duration_seconds', 'is', null),
      adminClient.from('voice_calls').select('*', { count: 'exact', head: true }).eq('transferred', true),
      adminClient.from('voice_agent_callbacks').select('*', { count: 'exact', head: true }),
      adminClient.from('voice_calls').select('*', { count: 'exact', head: true }).in('status', ['pending', 'ringing', 'answered']),
      adminClient.from('voice_calls').select('id, caller_phone, called_phone, status, started_at, ended_at, duration_seconds, transferred, transfer_target, summary').order('started_at', { ascending: false }).limit(20),
    ]);

    const callsToday = callsTodayResult.count || 0;
    const callsThisWeek = callsThisWeekResult.count || 0;
    const totalCalls = totalCallsResult.count || 0;

    const durations = (avgDurationResult.data || []).map((c: { duration_seconds?: number | null }) => c.duration_seconds).filter((v): v is number => v !== null && v !== undefined);
    const avgDurationSeconds = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

    const transferCount = transfersResult.count || 0;
    const transferRate = totalCalls > 0 ? Math.round((transferCount / totalCalls) * 100) : 0;

    const callbackRequests = callbacksResult.count || 0;
    const unresolvedCalls = unresolvedResult.count || 0;

    const stats = {
      callsToday,
      callsThisWeek,
      totalCalls,
      avgDurationSeconds,
      transferRate,
      callbackRequests,
      unresolvedCalls,
    };

    if (recent) {
      return NextResponse.json({ stats, recentCalls: recentCallsResult.data || [] });
    }

    return NextResponse.json(stats);
  } catch (err) {
    console.error('Voice stats API error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}
