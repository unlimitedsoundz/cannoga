import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { createServerClient } from '@/utils/supabase/server';
import { pdf } from '@react-pdf/renderer';
import ConditionalOfferPDF from '@/components/portal/pdf/ConditionalOfferPDF';

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

    const offer = application.offer && Array.isArray(application.offer) ? application.offer[0] : (application.offer || {});

    const { data: { publicUrl: logoUrl } } = supabase.storage
      .from('application-documents')
      .getPublicUrl('logo-cannoga.png');

    const { data: { publicUrl: signatureUrl } } = supabase.storage
      .from('application-documents')
      .getPublicUrl('registrar-signature.png');

    const element = React.createElement(ConditionalOfferPDF, {
      application,
      offer,
      logoUrl,
      signatureUrl,
    }) as React.ReactElement;
    const pdfBuffer = await pdf(element).toBuffer();

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="conditional-offer-${application.course?.title || 'program'}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
