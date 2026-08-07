import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { generateAndStoreLOA } from '@/utils/loa-pdf-generator';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    const supabase = await createServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: application, error } = await supabase
      .from('applications')
      .select(`
        *,
        course:Course(*, school:School(*)),
        user:profiles(*),
        offer:admission_offers(*)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const result = await generateAndStoreLOA(id, application);

    if (!result.success || !result.pdfBuffer) {
      return NextResponse.json({ error: result.error || 'Failed to generate PDF' }, { status: 500 });
    }

    const fileName = `letter-of-acceptance-${application.course?.slug || application.id}.pdf`;

    return new NextResponse(Buffer.from(result.pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate PDF';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
