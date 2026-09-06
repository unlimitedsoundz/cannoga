import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import {
  lookupStudentOrApplicant,
  VAPI_STUDENT_LOOKUP_TOOL_DEFINITION,
  type StudentLookupParams
} from '@/lib/voice/student-lookup';

export const runtime = 'nodejs';

/**
 * Dedicated Student and Applicant Lookup Endpoint
 * Supports direct REST calls and Vapi Voice Agent Custom Tool calls.
 */
export async function POST(request: NextRequest) {
  const adminClient = createServiceRoleClient();

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Check for Vapi tool-calls format
  const message = body?.message;
  if (message && message.type === 'tool-calls' && Array.isArray(message.toolCalls)) {
    const callerPhone = message.call?.customer?.number;
    const results = await Promise.all(
      message.toolCalls.map(async (tc: any) => {
        let args = tc.function?.arguments || {};
        if (typeof args === 'string') {
          try {
            args = JSON.parse(args);
          } catch {
            args = { query: args };
          }
        }
        if (callerPhone && !args.query && !args.student_id && !args.phone) {
          args.phone = callerPhone;
        }
        const lookupRes = await lookupStudentOrApplicant(args as StudentLookupParams, adminClient);
        return {
          toolCallId: tc.id,
          result: lookupRes.voice_summary || lookupRes.message
        };
      })
    );
    return NextResponse.json({ results });
  }

  // Handle direct toolCall wrapper if present
  const toolCall = body.toolCall || body.tool_call;
  if (toolCall) {
    let args = toolCall.function?.arguments || {};
    if (typeof args === 'string') {
      try {
        args = JSON.parse(args);
      } catch {
        args = { query: args };
      }
    }
    const lookupRes = await lookupStudentOrApplicant(args as StudentLookupParams, adminClient);
    return NextResponse.json({
      results: [{ toolCallId: toolCall.id || 'call_0', result: lookupRes.voice_summary }],
      ...lookupRes
    });
  }

  // Direct arguments payload
  const args = body.arguments || body.args || body;
  const params: StudentLookupParams = {
    query: args.query,
    student_id: args.student_id || args.studentId,
    name: args.name,
    email: args.email,
    phone: args.phone || args.caller_phone || args.callerPhone,
    application_number: args.application_number || args.applicationNumber,
    record_type: args.record_type || args.recordType || 'all',
    limit: args.limit ? Number(args.limit) : 5
  };

  const lookupResult = await lookupStudentOrApplicant(params, adminClient);

  return NextResponse.json({
    results: [
      {
        toolCallId: body.id || 'student_lookup',
        result: lookupResult.voice_summary
      }
    ],
    ...lookupResult
  });
}

/**
 * Handle GET requests with query parameters or return tool schema
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || searchParams.get('q');
  const studentId = searchParams.get('student_id') || searchParams.get('studentId');
  const name = searchParams.get('name');
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');
  const appNumber = searchParams.get('application_number') || searchParams.get('applicationNumber');
  const recordType = (searchParams.get('record_type') || searchParams.get('recordType') || 'all') as any;

  if (query || studentId || name || email || phone || appNumber) {
    const adminClient = createServiceRoleClient();
    const result = await lookupStudentOrApplicant({
      query: query || undefined,
      student_id: studentId || undefined,
      name: name || undefined,
      email: email || undefined,
      phone: phone || undefined,
      application_number: appNumber || undefined,
      record_type: recordType,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 5
    }, adminClient);

    return NextResponse.json(result);
  }

  // Schema & documentation for Vapi assistant setup
  return NextResponse.json({
    tool: VAPI_STUDENT_LOOKUP_TOOL_DEFINITION,
    sample_queries: [
      '?student_id=CC6883340',
      '?name=Chikamma',
      '?application_number=SK0782734',
      '?query=Ogunmola&record_type=applicant'
    ]
  });
}
