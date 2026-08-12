import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { voiceTools, getToolByName } from '@/lib/voice/tools';
import type { ToolResult } from '@/lib/voice/types';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const adminClient = createServiceRoleClient();

  try {
    await adminClient
      .from('profiles')
      .select('role')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single();

    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const toolName: string = (body.tool_name || body.toolName || '') as string;
    const args = body.arguments || body.args || {};

    if (!toolName) {
      return NextResponse.json({ error: 'tool_name is required' }, { status: 400 });
    }

    const tool = getToolByName(toolName);
    if (!tool) {
      return NextResponse.json({ error: `Unknown tool: ${toolName}` }, { status: 400 });
    }

    const callId: string = (body.call_id || body.callId || '') as string;
    const sessionId: string = (body.session_id || body.sessionId || callId) as string;
    const callerPhone: string | undefined = (body.caller_phone || body.callerPhone || undefined) as string | undefined;
    const applicationId: string | undefined = (body.application_id || body.applicationId || undefined) as string | undefined;
    const studentId: string | undefined = (body.student_id || body.studentId || undefined) as string | undefined;

    if (!callId) {
      return NextResponse.json({ error: 'call_id is required' }, { status: 400 });
    }

    const { data: call, error: callError } = await adminClient
      .from('voice_calls')
      .select('id, status')
      .eq('id', callId)
      .maybeSingle();

    if (callError || !call) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 });
    }

    const context = {
      callId,
      sessionId: sessionId || callId,
      callerPhone,
      applicationId,
      studentId,
      adminClient,
    };

    const startTime = Date.now();
    let result: ToolResult = { success: false, error: 'Tool execution failed' };

    try {
      result = await tool.execute(args, context);
    } catch (err) {
      result = { success: false, error: err instanceof Error ? err.message : 'Tool execution threw an error' };
    }

    const durationMs = Date.now() - startTime;

    await adminClient.from('voice_call_tool_events').insert({
      call_id: callId,
      tool_name: toolName,
      arguments: args,
      result: result.data || null,
      success: result.success,
      error: result.error || null,
    });

    return NextResponse.json({
      tool_name: toolName,
      success: result.success,
      data: result.data,
      message: result.message,
      error: result.error,
      nextAction: result.nextAction,
      durationMs,
    });
  } catch (err) {
    console.error('Voice tools API error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    tools: voiceTools.map(t => ({
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    })),
  });
}
