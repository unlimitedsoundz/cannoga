import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { createServerClient } from '@/utils/supabase/server';
import { pdf } from '@react-pdf/renderer';
import LetterOfAcceptancePDF from '@/components/portal/pdf/LetterOfAcceptancePDF';

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

    const pdfBlob = await pdf(
      React.createElement(LetterOfAcceptancePDF, { application }) as React.ReactElement
    ).toBlob();

    return new NextResponse(pdfBlob, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="letter-of-acceptance-${application.course?.title || 'program'}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}