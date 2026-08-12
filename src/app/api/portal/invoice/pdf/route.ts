import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { PDFRenderer } from '@react-pdf/renderer';
import InvoicePDF from '@/components/portal/pdf/InvoicePDF';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('invoiceId');

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    const supabase = await createServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: invoice, error: invoiceError } = await supabase
      .from('tuition_payments')
      .select(`
        *,
        application:applications(
          *,
          course:Course(*, school:School(*)),
          user:profiles(*)
        )
      `)
      .eq('id', invoiceId)
      .single();

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const { data: payment } = await supabase
      .from('tuition_payments')
      .select('*')
      .eq('invoice_id', invoiceId)
      .eq('status', 'completed')
      .maybeSingle();

    const pdfBuffer = await PDFRenderer.renderToBuffer(
      InvoicePDF({ invoice, payment })
    );

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoice_id || invoiceId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}