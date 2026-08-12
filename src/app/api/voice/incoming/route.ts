import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export const runtime = 'nodejs';

function verifySignature(body: string, signature: string | null): boolean {
  if (!signature) return true;
  const secret = process.env.VOICE_WEBHOOK_SECRET;
  if (!secret) return true;
  const expected = Buffer.from(`${body}.${secret}`).toString('base64');
  return signature === expected;
}

function getCallIdempotencyKey(request: NextRequest): string {
  return request.headers.get('x-call-id') || request.headers.get('x-voice-provider-call-id') || `incoming-${Date.now()}-${Math.random()}`;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-voice-signature');

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const contentType = request.headers.get('content-type') || '';
  let payload: Record<string, unknown> = {};

  try {
    if (contentType.includes('application/json')) {
      payload = JSON.parse(rawBody);
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const form = Object.fromEntries(new URLSearchParams(rawBody));
      payload = form;
    } else {
      payload = JSON.parse(rawBody);
    }
  } catch {
    return NextResponse.json({ error: 'Invalid payload format' }, { status: 400 });
  }

  const adminClient = createServiceRoleClient();

  try {
    const { data: agent, error: agentError } = await adminClient
      .from('voice_agents')
      .select('*')
      .eq('slug', 'debbie')
      .eq('active', true)
      .single();

    if (agentError || !agent) {
      return NextResponse.json({ error: 'Agent not found or inactive' }, { status: 404 });
    }

    const callId = getCallIdempotencyKey(request);
    const providerCallId = payload.CallSid || payload.callId || callId;
    const callerPhone = payload.From || payload.callerPhone || payload.from;
    const calledPhone = payload.To || payload.calledPhone || payload.to;

    const { data: existingCall } = await adminClient
      .from('voice_calls')
      .select('id, status')
      .eq('provider_call_id', providerCallId)
      .maybeSingle();

    if (existingCall && existingCall.status !== 'completed' && existingCall.status !== 'failed' && existingCall.status !== 'transferred') {
      return NextResponse.json({ callId: existingCall.id, status: existingCall.status, message: 'Call already active' });
    }

    const { data: newCall, error: callError } = await adminClient
      .from('voice_calls')
      .insert({
        agent_id: agent.id,
        provider: 'mock',
        provider_call_id: providerCallId,
        caller_phone: callerPhone || null,
        called_phone: calledPhone || null,
        direction: 'inbound',
        status: 'answered',
        started_at: new Date().toISOString(),
        answered_at: new Date().toISOString(),
        metadata: { rawPayload: payload },
      })
      .select()
      .single();

    if (callError || !newCall) {
      throw callError || new Error('Failed to create call record');
    }

    await adminClient.from('voice_call_messages').insert({
      call_id: newCall.id,
      role: 'system',
      message: `Call started from ${callerPhone || 'unknown'} to ${calledPhone || 'unknown'}`,
      sequence: 0,
      metadata: { event: 'call.started' },
    });

    return NextResponse.json({
      callId: newCall.id,
      status: newCall.status,
      greeting: agent.greeting,
      agent: {
        id: agent.id,
        name: agent.name,
        role: agent.role,
      },
    });
  } catch (err) {
    console.error('Voice incoming webhook error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const callId = searchParams.get('callId');
  const providerCallId = searchParams.get('providerCallId');

  if (!callId && !providerCallId) {
    return NextResponse.json({ error: 'callId or providerCallId is required' }, { status: 400 });
  }

  const adminClient = createServiceRoleClient();

  try {
    const query = adminClient.from('voice_calls').select('*');

    const { data: call, error } = callId
      ? await query.eq('id', callId).single()
      : await query.eq('provider_call_id', providerCallId).single();

    if (error || !call) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 });
    }

    const { data: messages } = await adminClient
      .from('voice_call_messages')
      .select('*')
      .eq('call_id', call.id)
      .order('sequence', { ascending: true });

    const { data: toolEvents } = await adminClient
      .from('voice_call_tool_events')
      .select('*')
      .eq('call_id', call.id)
      .order('created_at', { ascending: true });

    return NextResponse.json({
      call,
      messages: messages || [],
      toolEvents: toolEvents || [],
    });
  } catch (err) {
    console.error('Voice incoming GET error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}
