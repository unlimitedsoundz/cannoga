import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import {
  lookupStudentOrApplicant,
  VAPI_STUDENT_LOOKUP_TOOL_DEFINITION,
  type StudentLookupParams
} from '@/lib/voice/student-lookup';
import { getToolByName } from '@/lib/voice/tools';

export const runtime = 'nodejs';

/**
 * Handle Vapi Tool Calls and Custom Tool Webhooks
 * Compatible with Vapi Server Tools, Assistant tool-calls, and direct HTTP invocations.
 */
export async function POST(request: NextRequest) {
  const adminClient = createServiceRoleClient();

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // 1. Check if this is a standard Vapi tool-calls webhook
  // Format: { message: { type: 'tool-calls', toolCalls: [...], call: { id, customer, ... } } }
  const message = body?.message;
  const isVapiToolCalls = message && message.type === 'tool-calls' && Array.isArray(message.toolCalls);

  if (isVapiToolCalls) {
    const toolCalls: any[] = message.toolCalls;
    const callMetadata = message.call || {};
    const callerPhone = callMetadata.customer?.number || body.caller_phone;

    const results = await Promise.all(
      toolCalls.map(async (tc: any) => {
        const toolCallId = tc.id;
        const fn = tc.function || {};
        const toolName = fn.name;
        let args = fn.arguments || {};

        if (typeof args === 'string') {
          try {
            args = JSON.parse(args);
          } catch {
            args = { query: args };
          }
        }

        // If caller phone is available and query/phone is missing, inject it as fallback
        if (callerPhone && !args.query && !args.student_id && !args.phone) {
          args.phone = callerPhone;
        }

        if (toolName === 'lookup_student' || toolName === 'lookup_applicant' || toolName === 'lookup_student_or_applicant') {
          const lookupRes = await lookupStudentOrApplicant(args as StudentLookupParams, adminClient);
          return {
            toolCallId,
            result: lookupRes.voice_summary || lookupRes.message
          };
        }

        // Fallback to other registered voice tools if requested by Vapi
        const generalTool = getToolByName(toolName);
        if (generalTool) {
          try {
            const context = {
              callId: callMetadata.id || 'vapi-' + Date.now(),
              sessionId: callMetadata.id || 'vapi-session',
              callerPhone,
              adminClient
            };
            const toolExecRes = await generalTool.execute(args, context as any);
            return {
              toolCallId,
              result: toolExecRes.message || JSON.stringify(toolExecRes.data || toolExecRes)
            };
          } catch (err: any) {
            return {
              toolCallId,
              result: `Error executing ${toolName}: ${err.message}`
            };
          }
        }

        return {
          toolCallId,
          result: `Unknown tool: ${toolName}`
        };
      })
    );

    // Return in standard Vapi response format
    return NextResponse.json({ results });
  }

  // 2. Direct single tool call or direct arguments payload
  // e.g. { tool_name: "lookup_student", arguments: { ... } } or { query: "...", student_id: "..." }
  const toolName = body.tool_name || body.toolName || body.name || 'lookup_student';
  let args = body.arguments || body.args || body;
  if (typeof args === 'string') {
    try {
      args = JSON.parse(args);
    } catch {
      args = { query: args };
    }
  }

  // If payload is wrapped in toolCall: { id: "...", function: { ... } }
  const singleToolCall = body.toolCall || body.tool_call;
  if (singleToolCall) {
    const callId = singleToolCall.id || 'call_default';
    const fnName = singleToolCall.function?.name || 'lookup_student';
    let fnArgs = singleToolCall.function?.arguments || {};
    if (typeof fnArgs === 'string') {
      try {
        fnArgs = JSON.parse(fnArgs);
      } catch {
        fnArgs = { query: fnArgs };
      }
    }

    const lookupRes = await lookupStudentOrApplicant(fnArgs as StudentLookupParams, adminClient);
    return NextResponse.json({
      results: [
        {
          toolCallId: callId,
          result: lookupRes.voice_summary || lookupRes.message
        }
      ],
      ...lookupRes
    });
  }

  // Default execution for student/applicant lookup
  const lookupParams: StudentLookupParams = {
    query: args.query,
    student_id: args.student_id || args.studentId,
    name: args.name,
    email: args.email,
    phone: args.phone || args.caller_phone || args.callerPhone,
    application_number: args.application_number || args.applicationNumber,
    record_type: args.record_type || args.recordType || 'all',
    limit: args.limit ? Number(args.limit) : 5
  };

  const lookupResult = await lookupStudentOrApplicant(lookupParams, adminClient);

  // Return both Vapi results array AND detailed object for REST consumers
  return NextResponse.json({
    results: [
      {
        toolCallId: body.id || 'tool_student_lookup',
        result: lookupResult.voice_summary
      }
    ],
    ...lookupResult
  });
}

/**
 * Return tool definition and configuration guide for Vapi
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || searchParams.get('student_id') || searchParams.get('name') || searchParams.get('q');

  // If query parameters are provided, perform a live search
  if (query) {
    const adminClient = createServiceRoleClient();
    const params: StudentLookupParams = {
      query,
      student_id: searchParams.get('student_id') || undefined,
      name: searchParams.get('name') || undefined,
      email: searchParams.get('email') || undefined,
      phone: searchParams.get('phone') || undefined,
      application_number: searchParams.get('application_number') || undefined,
      record_type: (searchParams.get('record_type') as any) || 'all',
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 5
    };
    const result = await lookupStudentOrApplicant(params, adminClient);
    return NextResponse.json(result);
  }

  // Otherwise, return the Vapi tool specification
  return NextResponse.json({
    tool: VAPI_STUDENT_LOOKUP_TOOL_DEFINITION,
    vapi_configuration: {
      type: 'function',
      server_url: `${request.nextUrl.origin}/api/voice/vapi/tools`,
      instructions: 'In your Vapi dashboard, add a Custom Tool / Server Tool. Set Server URL to this endpoint and copy the "tool" object into the tool definition.'
    }
  });
}
