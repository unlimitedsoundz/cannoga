import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-voice-signature');

  if (signature) {
    const secret = process.env.VOICE_WEBHOOK_SECRET;
    if (secret) {
      const expected = Buffer.from(`${rawBody}.${secret}`).toString('base64');
      if (signature !== expected) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }
  }

  const contentType = request.headers.get('content-type') || '';
  let payload: Record<string, unknown> = {};

  try {
    if (contentType.includes('application/json')) {
      payload = JSON.parse(rawBody);
    } else {
      payload = Object.fromEntries(new URLSearchParams(rawBody));
    }
  } catch {
    return NextResponse.json({ error: 'Invalid payload format' }, { status: 400 });
  }

  const adminClient = createServiceRoleClient();

  try {
    const callId = payload.callId || payload.CallSid;
    const eventType: string = (payload.event || payload.EventType || 'unknown') as string;

    if (!callId) {
      return NextResponse.json({ error: 'callId is required' }, { status: 400 });
    }

    let { data: call } = await adminClient
      .from('voice_calls')
      .select('id, status, agent_id')
      .eq('id', callId)
      .maybeSingle();

    if (!call) {
      const { data: pCall } = await adminClient
        .from('voice_calls')
        .select('id, status, agent_id')
        .eq('provider_call_id', callId)
        .maybeSingle();
      call = pCall;
    }

    if (!call) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 });
    }

    const eventMap: Record<string, string> = {
      'initiated': 'call.started',
      'ringing': 'call.answered',
      'answered': 'call.answered',
      'completed': 'call.ended',
      'failed': 'call.failed',
      'busy': 'call.failed',
      'no-answer': 'call.abandoned',
      'transferred': 'call.transferred',
    };

    const mappedEvent = eventMap[eventType] || eventType;

    if (mappedEvent === 'call.ended') {
      const endedAt = new Date().toISOString();
      const { data: callData } = await adminClient
        .from('voice_calls')
        .select('started_at')
        .eq('id', call.id)
        .single();

      const startedAt = callData?.started_at ? new Date(callData.started_at) : new Date();
      const durationSeconds = Math.floor((new Date(endedAt).getTime() - startedAt.getTime()) / 1000);

      await adminClient
        .from('voice_calls')
        .update({
          status: 'completed',
          ended_at: endedAt,
          duration_seconds: Math.max(0, durationSeconds),
        })
        .eq('id', call.id);
    } else if (mappedEvent === 'call.transferred') {
      await adminClient
        .from('voice_calls')
        .update({
          status: 'transferred',
          transferred: true,
          transfer_target: payload.destination || payload.transferTarget || null,
          ended_at: new Date().toISOString(),
        })
        .eq('id', call.id);

      if (payload.reason || payload.transferReason) {
        await adminClient
          .from('voice_agent_transfers')
          .insert({
            call_id: call.id,
            reason: payload.reason || payload.transferReason || 'Transfer initiated',
            department: payload.department || null,
            destination: payload.destination || payload.transferTarget || '',
            status: 'completed',
            completed_at: new Date().toISOString(),
          });
      }
    } else if (mappedEvent === 'call.failed' || mappedEvent === 'call.abandoned') {
      await adminClient
        .from('voice_calls')
        .update({
          status: mappedEvent === 'call.failed' ? 'failed' : 'abandoned',
          ended_at: new Date().toISOString(),
        })
        .eq('id', call.id);
    }

    if (payload.transcript || payload.transcription || payload.message) {
      const transcriptText = payload.transcript || payload.transcription || payload.message;
      const role = payload.role || 'caller';

      const { count } = await adminClient
        .from('voice_call_messages')
        .select('*', { count: 'exact', head: true })
        .eq('call_id', call.id);

      await adminClient.from('voice_call_messages').insert({
        call_id: call.id,
        role,
        message: transcriptText,
        sequence: count || 0,
        metadata: { event: mappedEvent, rawPayload: payload },
      });
    }

    if (payload.toolName && payload.toolResult !== undefined) {
      await adminClient.from('voice_call_tool_events').insert({
        call_id: call.id,
        tool_name: payload.toolName,
        arguments: payload.toolArguments || {},
        result: payload.toolResult,
        success: payload.toolSuccess !== false,
        error: payload.toolError || null,
      });
    }

    return NextResponse.json({ received: true, event: mappedEvent });
  } catch (err) {
    console.error('Voice events webhook error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: 'voice/events' });
}
