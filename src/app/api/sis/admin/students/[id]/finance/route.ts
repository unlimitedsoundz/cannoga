import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { getStudentFinancialDetails } = await import('@/app/sis/admin/actions');
    const result = await getStudentFinancialDetails(id);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (e: any) {
    console.error('Student finance API error:', e);
    return NextResponse.json({ success: false, error: e.message || 'Failed to fetch financial details' }, { status: 500 });
  }
}
