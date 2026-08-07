import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { NextRequest, NextResponse } from 'next/server';
import { getTuitionFee, mapSchoolToTuitionField, getProgramYears } from '@/utils/tuition';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('id');

    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: app, error: fetchError } = await supabase
      .from('applications')
      .select('id, status, user_id')
      .eq('id', applicationId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (app.status !== 'ADMITTED') {
      return NextResponse.json({ error: `Cannot accept offer in current status: ${app.status}` }, { status: 400 });
    }

    const adminSupabase = createServiceRoleClient();

    const { error: offerError, count: offerCount } = await adminSupabase
      .from('admission_offers')
      .update({
        status: 'ACCEPTED',
        accepted_at: new Date().toISOString()
      })
      .eq('application_id', applicationId)
      .select('id');

    if (offerError) {
      console.error('Failed to update offer status:', offerError);
    }

    if (!offerCount || offerCount === 0) {
      const { data: appData } = await adminSupabase
        .from('applications')
        .select('course_id, personal_info, Course:course_id(degreeLevel, school:schoolId(slug))')
        .eq('id', applicationId)
        .single();

      const courseData = (appData as any)?.Course;
      const degreeLevel = courseData?.degreeLevel || 'BACHELOR';
      const schoolSlug = courseData?.school?.slug || 'technology';
      const tuitionField = mapSchoolToTuitionField(schoolSlug);
      const personal = (appData as any)?.personal_info || {};
      const studentType = personal.studentType;
      const isDomestic = studentType === 'domestic';
      const annualFee = await getTuitionFee(degreeLevel, tuitionField, isDomestic);

      const duration = (appData as any)?.Course?.duration || '4 years';
      const years = getProgramYears(duration, degreeLevel as any);
      const totalFee = annualFee * years;

      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 30);

      const { error: createOfferError } = await adminSupabase
        .from('admission_offers')
        .insert({
          application_id: applicationId,
          tuition_fee: totalFee,
          payment_deadline: deadline.toISOString(),
          offer_type: 'FULL_TUITION',
          status: 'ACCEPTED',
          accepted_at: new Date().toISOString()
        });

      if (createOfferError) {
        console.error('Failed to create offer:', createOfferError);
        return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
      }
    }

    const { error: appError } = await adminSupabase
      .from('applications')
      .update({
        status: 'OFFER_ACCEPTED',
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId);

    if (appError) {
      console.error('Failed to update application status:', appError);
      return NextResponse.json({ error: 'Failed to update application status' }, { status: 500 });
    }

    try {
      await supabase.functions.invoke('send-notification', {
        body: {
          applicationId: applicationId,
          type: 'OFFER_ACCEPTED'
        }
      });
    } catch (notifyError) {
      console.error('Failed to trigger offer acceptance notification:', notifyError);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Accept offer API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
